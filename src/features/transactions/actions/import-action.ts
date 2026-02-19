'use server';

import { createClient } from '@/shared/lib/supabase/server'; // Assuming this exists per standard factory
import { parseUniversalStatement } from '../utils/parser';
import { classifyTransaction } from '../utils/classifier';
import { batchClassifyTransactions } from '../services/ai-classifier.service';
import { revalidatePath } from 'next/cache';

export async function importStatementAction(formData: FormData) {
    const file = formData.get('file') as File;

    if (!file) {
        return { error: 'No file uploaded' };
    }

    try {
        const buffer = Buffer.from(await file.arrayBuffer());
        const { summary, transactions } = await parseUniversalStatement(buffer);

        // --- STRICT AUDIT ENFORCEMENT ---
        // Block ingestion if the PDF transactions don't balance mathematically
        if (!summary.auditPassed) {
            console.warn('[Audit Blocked]', summary.auditStatus);
            return {
                error: `Error de Integridad: Los números del PDF no cuadran matemáticamente. \nDETALLE: ${summary.auditStatus}. \nPor favor contacta a soporte o revisa el PDF.`,
                summary: summary
            };
        }

        // Classify and Prepare for Insertion
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            throw new Error('User not authenticated. Please log in.');
        }

        // --- DUPLICATE DETECTION ---
        const { data: existingStmt } = await supabase
            .from('statements')
            .select('id, month, year')
            .eq('user_id', user.id)
            .eq('month', summary.month)
            .eq('year', summary.year)
            .maybeSingle();

        if (existingStmt) {
            return {
                error: `DUPLICADO: Ya existe un extracto guardado para ${summary.month}/${summary.year}. Si deseas subirlo de nuevo, primero debes contactar a soporte para limpiar el periodo anterior o borrar manualmente las transacciones de ese mes.`,
                isDuplicate: true,
                month: summary.month,
                year: summary.year
            };
        }

        // 1. Create Statement Record
        const { data: statementData, error: stmtError } = await supabase
            .from('statements')
            .insert({
                user_id: user.id,
                month: summary.month,
                year: summary.year,
                opening_balance: summary.openingBalance,
                total_deposits: summary.totalDeposits,
                total_withdrawals: summary.totalWithdrawals,
                closing_balance: summary.closingBalance,
                file_name: file.name
            })
            .select()
            .single();

        if (stmtError) {
            console.error('Statement Insert Error:', stmtError);
            throw new Error(`Failed to create statement summary: ${stmtError.message}`);
        }

        // 2. Prepare Transactions with AI Categorization
        const categories = await batchClassifyTransactions(transactions.map(t => ({
            description: t.description,
            amount: t.amount,
            type: t.type
        })));

        const txsToInsert = transactions.map((tx, index) => ({
            user_id: user.id,
            statement_id: statementData.id,
            date: new Date(tx.date).toISOString(),
            description: tx.description,
            amount: tx.amount,
            type: tx.type,
            category: categories[index] || classifyTransaction(tx.description),
            check_number: tx.check_number,
            balance: tx.balance,
            created_at: new Date().toISOString()
        }));

        if (txsToInsert.length === 0) {
            return { msg: 'No transactions found in PDF' };
        }

        // 3. Insert Transactions
        const { error: txError } = await supabase.from('transactions').insert(txsToInsert);

        if (txError) {
            console.error('Supabase Transaction Error:', txError);
            throw new Error(`Database error: ${txError.message}`);
        }

        revalidatePath('/transactions');
        revalidatePath('/reports');

        console.log(`[Import SUCCESS] ${txsToInsert.length} transactions inserted for ${summary.month}/${summary.year}`);

        return {
            success: true,
            count: txsToInsert.length,
            month: summary.month,
            year: summary.year,
            summary: summary
        };

    } catch (error: any) {
        console.error('Import Error:', error);
        return { error: error.message || 'Failed to process file' };
    }
}
