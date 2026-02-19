
import { createClient } from '@/shared/lib/supabase/client';

export interface Transaction {
    id: string;
    date: string;
    description: string;
    amount: number;
    type: 'DEPOSIT' | 'WITHDRAWAL';
    category: string;
    user_id: string;
    created_at: string;
    check_number?: string;
    balance?: number;
}

export async function getTransactions(userId?: string): Promise<Transaction[]> {
    const supabase = createClient();

    // Basic query
    let query = supabase
        .from('transactions')
        .select('*')
        .order('date', { ascending: false });

    // If userId is provided, filter (though RLS might handle it)
    if (userId) {
        query = query.eq('user_id', userId);
    }

    const { data, error } = await query;

    if (error) {
        console.error('Error fetching transactions:', error);
        throw new Error(error.message);
    }

    return data as Transaction[];
}
