import React from 'react';

interface DashboardHeaderProps {
    title: string;
    subtitle?: string;
    children?: React.ReactNode;
}

export function DashboardHeader({ title, subtitle, children }: DashboardHeaderProps) {
    return (
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
            <div className="animate-in slide-in-from-left duration-700">
                <h1 className="text-2xl font-black text-brand-dark tracking-tight uppercase">{title}</h1>
                {subtitle && <p className="text-gray-400 font-bold text-[9px] uppercase tracking-[0.15em] mt-1 ml-0.5">{subtitle}</p>}
            </div>
            <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto animate-in slide-in-from-right duration-700">
                {children}
            </div>
        </div>
    );
}
