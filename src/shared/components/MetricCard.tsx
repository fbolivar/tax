import React from 'react';
import { LucideIcon, ArrowUpRight, ArrowDownRight } from 'lucide-react';
import { Card } from './Card';

interface MetricCardProps {
    title: string;
    value: string;
    icon: React.ElementType;
    trend?: {
        value: string;
        isPositive: boolean;
        label: string;
    };
    variant?: 'default' | 'primary' | 'success' | 'danger';
}

export function MetricCard({
    title,
    value,
    icon: Icon,
    trend,
    variant = 'default'
}: MetricCardProps) {
    const variants = {
        default: 'bg-white border-gray-200 shadow-premium hover:shadow-premium-hover',
        primary: 'bg-brand-dark text-white border-brand-dark shadow-xl',
        success: 'bg-emerald-600 text-white border-emerald-600 shadow-xl',
        danger: 'bg-rose-600 text-white border-rose-600 shadow-xl',
    };

    const iconBg = {
        default: 'bg-brand-primary/10 text-brand-primary',
        primary: 'bg-white/20 text-brand-light',
        success: 'bg-white/20 text-white',
        danger: 'bg-white/20 text-white',
    };

    return (
        <Card className={`group relative transition-all duration-500 border-2 hover:-translate-y-1 active:scale-[0.98] overflow-hidden min-h-[110px] min-w-[220px] ${variants[variant]}`}>
            {/* Glossy industrial background decoration */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent pointer-events-none" />
            <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-current opacity-[0.05] rounded-full blur-3xl pointer-events-none group-hover:scale-150 transition-transform duration-1000" />

            {variant !== 'default' && (
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/20 rounded-full -mr-16 -mt-16 blur-3xl pointer-events-none" />
            )}

            <div className="relative z-10 grid grid-cols-[auto_1fr] items-center gap-5 p-5">
                <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 shadow-sm group-hover:scale-110 group-hover:rotate-3 ${iconBg[variant]}`}>
                    <Icon size={24} strokeWidth={2.5} />
                </div>

                <div className="flex flex-col justify-center min-w-0">
                    <p className={`text-[11px] font-black uppercase tracking-[0.25em] mb-1.5 ${variant === 'default' ? 'text-gray-500' : 'text-white/80'}`}>
                        {title}
                    </p>
                    <div className="flex flex-wrap items-baseline gap-2">
                        <h3 className={`text-2xl font-black tracking-tight leading-none ${variant === 'default' ? 'text-brand-dark' : 'text-white'}`}>
                            {value}
                        </h3>
                        {trend && (
                            <span className={`inline-flex items-center text-[10px] font-black px-2 py-0.5 rounded-lg shadow-sm ${trend.isPositive
                                ? (variant === 'default' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-white/20 text-emerald-100')
                                : (variant === 'default' ? 'bg-rose-50 text-rose-600 border border-rose-100' : 'bg-white/20 text-rose-100')
                                }`}>
                                {trend.isPositive ? <ArrowUpRight size={12} strokeWidth={3} /> : <ArrowDownRight size={12} strokeWidth={3} />}
                                {trend.value}
                            </span>
                        )}
                    </div>
                    {trend?.label && (
                        <p className={`text-[9px] font-bold uppercase mt-1.5 tracking-wider opacity-60 ${variant === 'default' ? 'text-gray-400' : 'text-white'}`}>
                            {trend.label}
                        </p>
                    )}
                </div>
            </div>
        </Card>
    );
}
