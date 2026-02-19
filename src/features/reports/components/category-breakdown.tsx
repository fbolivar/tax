'use client';

import { CategorySummary } from '../services/report.service';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

interface Props {
    data: CategorySummary[];
}

export function CategoryBreakdown({ data }: Props) {
    if (data.length === 0) {
        return <div className="flex items-center justify-center h-64 text-gray-400 text-[10px] font-black uppercase tracking-widest">No hay datos de gastos</div>;
    }

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(val);

    return (
        <div className="h-[350px] w-full">
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                    >
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                        ))}
                    </Pie>
                    <Tooltip
                        formatter={(value: any) => [formatCurrency(Number(value || 0)), '']}
                        contentStyle={{
                            borderRadius: '16px',
                            border: 'none',
                            backgroundColor: 'rgba(255, 255, 255, 0.9)',
                            backdropFilter: 'blur(8px)',
                            boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)',
                            padding: '12px'
                        }}
                        itemStyle={{ color: '#0f172a', fontWeight: 900, textTransform: 'uppercase', fontSize: '10px' }}
                    />
                    <Legend
                        verticalAlign="bottom"
                        height={36}
                        iconType="circle"
                        formatter={(value) => <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-2">{value}</span>}
                    />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
}
