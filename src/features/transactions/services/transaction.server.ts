
import { createClient } from '@/shared/lib/supabase/server';
import { Transaction } from './transaction.service';

export interface StatementSummaryData {
    opening_balance: number;
    total_deposits: number;
    total_withdrawals: number;
    closing_balance: number;
    month: number;
    year: number;
}

export async function getTransactionsServer(filters?: { month?: number, year?: number }): Promise<Transaction[]> {
    const supabase = await createClient();
    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (userError || !user) {
        console.warn('getTransactionsServer: No authenticated user found', userError);
        return [];
    }

    // Default to current year if not provided or NaN
    const filterYear = filters?.year && !isNaN(filters.year) ? filters.year : new Date().getFullYear();
    const filterMonth = filters?.month && !isNaN(filters.month) ? filters.month : undefined;

    console.log(`getTransactionsServer: Fetching for user=${user.id} year=${filterYear} month=${filterMonth}`);

    let query = supabase
        .from('transactions')
        .select('*')
        .eq('user_id', user.id)
        .order('date', { ascending: true })
        .order('created_at', { ascending: true });

    if (filterMonth) {
        // Get last day of the month
        const lastDay = new Date(filterYear, filterMonth, 0).getDate();
        const m = filterMonth.toString().padStart(2, '0');
        const startMonth = `${filterYear}-${m}-01`;
        const endMonth = `${filterYear}-${m}-${lastDay.toString().padStart(2, '0')}`;
        query = query.gte('date', startMonth).lte('date', endMonth);
    } else {
        const startYear = `${filterYear}-01-01`;
        const endYear = `${filterYear}-12-31`;
        query = query.gte('date', startYear).lte('date', endYear);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching transactions (server):', {
            code: error.code,
            message: error.message,
            details: error.details,
            hint: error.hint
        });
        return [];
    }

    return data as Transaction[];
}

export async function getStatementSummaryServer(month: number, year: number): Promise<StatementSummaryData | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data, error } = await supabase
        .from('statements')
        .select('*')
        .eq('user_id', user.id)
        .eq('month', month)
        .eq('year', year)
        .order('created_at', { ascending: false })
        .limit(1)
        .single();

    if (error) {
        return null;
    }

    return data as StatementSummaryData;
}

export async function getAllStatementsServer(): Promise<StatementSummaryData[]> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return [];

    const { data, error } = await supabase
        .from('statements')
        .select('*')
        .eq('user_id', user.id)
        .order('year', { ascending: false })
        .order('month', { ascending: false });

    if (error) {
        console.error('Error fetching all statements:', error);
        return [];
    }

    return data as StatementSummaryData[];
}
