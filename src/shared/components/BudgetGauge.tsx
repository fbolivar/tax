import React from 'react';
import { Card } from './Card';

interface BudgetGaugeProps {
    percentage: number;
    label: string;
    budget: string;
    balance: string;
    size?: number;
}

export function BudgetGauge({
    percentage,
    label,
    budget,
    balance,
    size = 120
}: BudgetGaugeProps) {
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (Math.min(percentage, 100) / 100) * circumference;

    const isOverBudget = parseFloat(balance.replace(/[^0-9.-]+/g, "")) < 0;

    return (
        <Card className="flex flex-col bg-white p-5 border-gray-100 shadow-premium group hover:-translate-y-1 transition-all duration-300">
            <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                    <h4 className="text-[9px] font-black uppercase text-gray-400 tracking-[0.2em]">{label}</h4>
                    <p className="text-[11px] font-bold text-brand-dark mt-0.5">{budget} Asignación</p>
                </div>
                <div className={`px-2 py-0.5 rounded-md text-[9px] font-black uppercase tracking-wider ${isOverBudget ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-500'}`}>
                    {balance}
                </div>
            </div>

            <div className="flex items-center gap-6">
                <div className="relative" style={{ width: size, height: size }}>
                    <svg width={size} height={size} className="transform -rotate-90">
                        <circle
                            className="text-gray-50"
                            strokeWidth={strokeWidth}
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx={size / 2}
                            cy={size / 2}
                        />
                        <circle
                            className={isOverBudget ? 'text-rose-500' : 'text-brand-primary'}
                            strokeWidth={strokeWidth}
                            strokeDasharray={circumference}
                            strokeDashoffset={offset}
                            strokeLinecap="round"
                            stroke="currentColor"
                            fill="transparent"
                            r={radius}
                            cx={size / 2}
                            cy={size / 2}
                            style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)' }}
                        />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-xl font-black text-brand-dark">{percentage}%</span>
                        <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest mt-0.5">USADO</span>
                    </div>
                </div>

                <div className="flex-1 space-y-3">
                    <div className="space-y-1">
                        <div className="flex justify-between text-[8px] font-black text-gray-400 uppercase tracking-widest">
                            <span>Eficiencia</span>
                            <span>{percentage}%</span>
                        </div>
                        <div className="h-1.5 w-full bg-gray-50 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-1000 ${isOverBudget ? 'bg-rose-500' : 'bg-brand-primary'}`}
                                style={{ width: `${Math.min(percentage, 100)}%` }}
                            />
                        </div>
                    </div>
                    <p className="text-[9px] font-bold text-gray-400 leading-relaxed italic">
                        {percentage > 100
                            ? 'Crítico: Límite excedido. Revisar asignaciones inmediatamente.'
                            : percentage > 85
                                ? 'Advertencia: Acercándose al límite de presupuesto.'
                                : 'Óptimo: Los gastos son consistentes con las metas fiscales.'}
                    </p>
                </div>
            </div>
        </Card>
    );
}
