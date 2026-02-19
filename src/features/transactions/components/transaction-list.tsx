'use client';

import React from 'react';
import { Transaction } from '../services/transaction.service';
import { Tag } from 'lucide-react';

interface TransactionListProps {
    transactions: Transaction[];
}

export function TransactionList({ transactions }: TransactionListProps) {
    if (transactions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center p-10 text-gray-500 bg-white rounded-xl shadow-sm border border-gray-100">
                <p className="text-lg font-medium">No se encontraron transacciones</p>
                <p className="text-sm">Cargue un extracto bancario para comenzar.</p>
            </div>
        );
    }

    // Currency Formatter
    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Date Formatter
    const formatDate = (dateStr: string) => {
        const date = new Date(dateStr);
        // Wells Fargo format: M/D (without year context in the main table usually, but we have iso)
        return `${date.getMonth() + 1}/${date.getDate()}`;
    };

    // Totals Calculation
    const totalDeposits = transactions
        .filter(t => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalWithdrawals = transactions
        .filter(t => t.type === 'WITHDRAWAL')
        .reduce((sum, t) => sum + t.amount, 0);

    return (
        <div className="w-full bg-white rounded-3xl shadow-premium border border-gray-100/50 overflow-hidden transition-all duration-500 hover:shadow-premium-hover">
            <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                    <thead>
                        <tr className="bg-brand-bg text-left border-b border-gray-100/50">
                            <th className="py-4 px-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Fecha</th>
                            <th className="py-4 px-3 text-[9px] font-black text-gray-400 uppercase tracking-widest">Cheque</th>
                            <th className="py-4 px-6 text-[9px] font-black text-gray-400 uppercase tracking-widest">Descripción</th>
                            <th className="py-4 px-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Depósitos</th>
                            <th className="py-4 px-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Retiros</th>
                            <th className="py-4 px-5 text-[9px] font-black text-gray-400 uppercase tracking-widest text-right">Saldo Diario</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {transactions.map((tx) => (
                            <tr
                                key={tx.id}
                                className="group hover:bg-brand-bg/50 transition-dashboard cursor-default"
                            >
                                <td className="py-3 px-5 whitespace-nowrap text-[11px] font-bold text-gray-500">
                                    {formatDate(tx.date)}
                                </td>
                                <td className="py-3 px-3 text-[11px] text-gray-400 font-mono italic">
                                    {tx.check_number || '—'}
                                </td>
                                <td className="py-3 px-6">
                                    <div className="flex flex-col gap-1">
                                        <span className="text-brand-dark font-black text-xs leading-tight uppercase tracking-tight group-hover:text-brand-primary transition-dashboard">{tx.description}</span>
                                        <span className="inline-flex items-center gap-1.5 text-[8px] font-black text-indigo-500/80 uppercase tracking-wider bg-indigo-50/50 w-fit px-1.5 py-0.5 rounded-full border border-indigo-100/30">
                                            <Tag size={8} strokeWidth={3} /> {tx.category}
                                        </span>
                                    </div>
                                </td>
                                <td className="py-3 px-5 whitespace-nowrap text-right text-xs font-black text-emerald-600">
                                    {tx.type === 'DEPOSIT' ? tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                                </td>
                                <td className="py-3 px-5 whitespace-nowrap text-right text-xs font-black text-brand-dark/70">
                                    {tx.type === 'WITHDRAWAL' ? tx.amount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                                </td>
                                <td className="py-3 px-5 whitespace-nowrap text-right text-xs font-black text-brand-dark bg-brand-bg/30">
                                    {tx.balance ? tx.balance.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : ''}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                    <tfoot>
                        <tr className="bg-brand-dark border-t-2 border-brand-dark">
                            <td colSpan={3} className="py-4 px-6 text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Resumen del Período</td>
                            <td className="py-4 px-5 text-right text-sm font-black text-emerald-400">
                                {formatCurrency(totalDeposits)}
                            </td>
                            <td className="py-4 px-5 text-right text-sm font-black text-rose-400">
                                {formatCurrency(totalWithdrawals)}
                            </td>
                            <td className="py-4 px-5 bg-brand-primary text-white text-right text-sm font-black">
                                {transactions.length > 0 && transactions[transactions.length - 1].balance ? formatCurrency(transactions[transactions.length - 1].balance!) : ''}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
    );
}
