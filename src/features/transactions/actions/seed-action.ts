'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';

const DESCRIPTIONS = {
    DEPOSIT: [
        'Depósito Realizado en Sucursal',
        'Transferencia en Línea desde Ahorros',
        'Depósito ACH - Nómina',
        'Transferencia Zelle Recibida',
        'Pago de Renta - Inquilino X',
        'Crédito por Dividendos de Inversión'
    ],
    WITHDRAWAL: [
        'Pago Web Hampton II A',
        'Pago Proveedor Ha Ft Lauderdale',
        'Pago ACH Comunidad Cvp',
        'Transferencia en Línea a Tarjeta Signify',
        'Pago de Préstamo Td Auto Finance',
        'Pago Factura Frontier Communi',
        'Merchant Amazon Prime',
        'Starbucks Coffee - Gasto Diarios',
        'Estación de Gasolina Shell',
        'Supermercados Publix',
        'Pago - Tarjeta Business Essential'
    ]
};

const CATEGORIES = [
    'GASTOS', 'RENTA', 'SERVICIOS', 'NOMINA', 'INVERSION', 'PRESTAMO', 'GASOLINA', 'COMIDA'
];

export async function simulateDataAction() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) throw new Error('Not authenticated');

    console.log('--- STARTING SIMULATION ---');

    // Clean existing simulation if needed? No, let's just add.

    let lastClosingBalance = 7440.75; // Starting from the image value

    // Simulation range: Jan 2025 to Feb 2026
    const periods = [];
    for (let m = 1; m <= 12; m++) periods.push({ month: m, year: 2025 });
    for (let m = 1; m <= 2; m++) periods.push({ month: m, year: 2026 });

    for (const period of periods) {
        const { month, year } = period;

        // Skip if already exists (anti-duplicate logic we just added might block)
        const { data: existing } = await supabase
            .from('statements')
            .select('id')
            .eq('user_id', user.id)
            .eq('month', month)
            .eq('year', year)
            .maybeSingle();

        if (existing) {
            console.log(`Skipping ${month}/${year} - Already exists`);
            continue;
        }

        const openingBalance = lastClosingBalance;
        let runningBalance = openingBalance;
        let totalDeposits = 0;
        let totalWithdrawals = 0;

        // Generate 15 transactions
        const txsToCreate = [];
        for (let i = 0; i < 15; i++) {
            const isDeposit = Math.random() > 0.7; // 30% deposits
            const type = isDeposit ? 'DEPOSIT' : 'WITHDRAWAL';
            const desc = DESCRIPTIONS[type][Math.floor(Math.random() * DESCRIPTIONS[type].length)];
            const amount = parseFloat((Math.random() * 2000 + 20).toFixed(2));
            const day = Math.floor(Math.random() * 28) + 1;

            if (isDeposit) {
                totalDeposits += amount;
                runningBalance += amount;
            } else {
                totalWithdrawals += amount;
                runningBalance -= amount;
            }

            txsToCreate.push({
                date: `${year}-${month.toString().padStart(2, '0')}-${day.toString().padStart(2, '0')}`,
                description: desc,
                amount: amount,
                type: type,
                category: CATEGORIES[Math.floor(Math.random() * CATEGORIES.length)],
                check_number: Math.random() > 0.8 ? (Math.floor(Math.random() * 9000) + 1000).toString() : null,
                balance: runningBalance
            });
        }

        const closingBalance = runningBalance;
        lastClosingBalance = closingBalance;

        // 1. Insert Statement
        const { data: stmt, error: sErr } = await supabase
            .from('statements')
            .insert({
                user_id: user.id,
                month,
                year,
                opening_balance: openingBalance,
                total_deposits: totalDeposits,
                total_withdrawals: totalWithdrawals,
                closing_balance: closingBalance,
                file_name: `SIMULATED_${month}_${year}.pdf`
            })
            .select()
            .single();

        if (sErr) throw sErr;

        // 2. Insert Transactions
        const finalTxs = txsToCreate.map(tx => ({
            ...tx,
            user_id: user.id,
            statement_id: stmt.id
        }));

        const { error: tErr } = await supabase.from('transactions').insert(finalTxs);
        if (tErr) throw tErr;

        console.log(`Generated ${txsToCreate.length} txs for ${month}/${year}`);
    }

    revalidatePath('/transactions');
    return { success: true };
}
