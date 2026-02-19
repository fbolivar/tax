import React from 'react';
import { Transaction } from '../services/transaction.service';
import { ArrowUpRight, ArrowDownRight, Activity } from 'lucide-react';
import { MetricCard } from '@/shared/components/MetricCard';

interface TransactionStatsProps {
    transactions: Transaction[];
}

export function TransactionStats({ transactions }: TransactionStatsProps) {
    const totalIncome = transactions
        .filter(t => t.type === 'DEPOSIT')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
        .filter(t => t.type === 'WITHDRAWAL')
        .reduce((sum, t) => sum + t.amount, 0);

    const netFlow = totalIncome - totalExpenses;

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    return (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <MetricCard
                title="Ingresos del Periodo"
                value={formatCurrency(totalIncome)}
                icon={ArrowUpRight}
                variant="success"
                trend={{
                    value: '16.1%',
                    isPositive: true,
                    label: 'vs anterior'
                }}
            />
            <MetricCard
                title="Gastos del Periodo"
                value={formatCurrency(totalExpenses)}
                icon={ArrowDownRight}
                variant="danger"
                trend={{
                    value: '8.4%',
                    isPositive: false,
                    label: 'vs anterior'
                }}
            />
            <MetricCard
                title="Flujo Neto de Caja"
                value={formatCurrency(netFlow)}
                icon={Activity}
                variant={netFlow >= 0 ? 'success' : 'danger'}
            />
        </div>
    );
}
