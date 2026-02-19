'use client';

import { MonthlySummary } from '../services/report.service';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Props {
    data: MonthlySummary[];
}

export function MonthlyTrend({ data }: Props) {
    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        maximumFractionDigits: 0
    }).format(val);

    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <BarChart
                    data={data}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 900 }}
                        tickFormatter={formatCurrency}
                    />
                    <Tooltip
                        formatter={(value: any) => [formatCurrency(Number(value || 0)), '']}
                        cursor={{ fill: '#f8fafc', opacity: 0.4 }}
                        contentStyle={{
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 20px 25px -5px rgb(0 0 0 / 0.1)',
                            padding: '12px'
                        }}
                        itemStyle={{ fontSize: '10px', fontWeight: 900, textTransform: 'uppercase' }}
                    />
                    <Legend
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{value}</span>}
                    />
                    <Bar dataKey="income" name="Ingresos" fill="#10b981" radius={[6, 6, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="expense" name="Gastos" fill="#f43f5e" radius={[6, 6, 0, 0]} maxBarSize={40} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}
