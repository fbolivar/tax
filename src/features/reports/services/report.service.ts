
import { Transaction } from '@/features/transactions/services/transaction.service';

export interface CategorySummary {
    name: string;
    value: number;
    color?: string;
}

export interface MonthlySummary {
    name: string; // "Jan", "Feb"
    income: number;
    expense: number;
    net: number;
}

const CATEGORY_COLORS: Record<string, string> = {
    'Income': '#10b981', // emerald-500
    'Rent & HOA': '#6366f1', // indigo-500
    'Utilities': '#3b82f6', // blue-500
    'Auto & Gas': '#f59e0b', // amber-500
    'Food & Dining': '#ef4444', // red-500
    'Supplies': '#8b5cf6', // violet-500
    'Software': '#ec4899', // pink-500
    'Insurance': '#14b8a6', // teal-500
    'Bank Fees': '#64748b', // slate-500
    'Uncategorized': '#94a3b8' // slate-400
};

const DEFAULT_COLOR = '#a855f7'; // purple-500

export function aggregateByCategory(transactions: Transaction[]): CategorySummary[] {
    const expenses = transactions.filter(t => t.type === 'WITHDRAWAL');
    const map = new Map<string, number>();

    expenses.forEach(t => {
        const current = map.get(t.category) || 0;
        map.set(t.category, current + t.amount);
    });

    return Array.from(map.entries())
        .map(([name, value]) => ({
            name,
            value,
            color: CATEGORY_COLORS[name] || DEFAULT_COLOR
        }))
        .sort((a, b) => b.value - a.value); // Highest expense first
}

export function aggregateByMonth(transactions: Transaction[], year: number): MonthlySummary[] {
    const months = [
        'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
    ];

    const summaries: MonthlySummary[] = months.map(m => ({ name: m, income: 0, expense: 0, net: 0 }));

    transactions.forEach(t => {
        const date = new Date(t.date);
        if (date.getFullYear() !== year) return;

        const monthIndex = date.getMonth();
        if (t.type === 'DEPOSIT') {
            summaries[monthIndex].income += t.amount;
        } else {
            summaries[monthIndex].expense += t.amount;
        }
    });

    // Calculate Net
    summaries.forEach(s => s.net = s.income - s.expense);

    return summaries;
}
