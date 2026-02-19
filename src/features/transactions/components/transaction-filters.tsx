'use client';

import { useRouter, useSearchParams } from 'next/navigation';

export function TransactionFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const currentMonth = searchParams.get('month') || new Date().getMonth() + 1;
    const currentYear = searchParams.get('year') || new Date().getFullYear();

    const months = [
        { value: '1', label: 'Enero' },
        { value: '2', label: 'Febrero' },
        { value: '3', label: 'Marzo' },
        { value: '4', label: 'Abril' },
        { value: '5', label: 'Mayo' },
        { value: '6', label: 'Junio' },
        { value: '7', label: 'Julio' },
        { value: '8', label: 'Agosto' },
        { value: '9', label: 'Septiembre' },
        { value: '10', label: 'Octubre' },
        { value: '11', label: 'Noviembre' },
        { value: '12', label: 'Diciembre' },
    ];

    const years = ['2023', '2024', '2025', '2026'];

    const handleFilterChange = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    return (
        <div className="flex flex-col sm:flex-row gap-4 items-end bg-white px-5 py-4 rounded-2xl shadow-premium border border-gray-100/50 w-full sm:w-auto">
            <div className="flex flex-col gap-1 w-full sm:w-32">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Mes del Período</label>
                <select
                    value={currentMonth}
                    onChange={(e) => handleFilterChange('month', e.target.value)}
                    className="bg-brand-bg/50 border border-gray-100 text-brand-dark text-xs font-bold rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full py-2 px-3 transition-dashboard"
                >
                    <option value="">Todos los meses</option>
                    {months.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
            </div>

            <div className="flex flex-col gap-1 w-full sm:w-28">
                <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Año Fiscal</label>
                <select
                    value={currentYear}
                    onChange={(e) => handleFilterChange('year', e.target.value)}
                    className="bg-brand-bg/50 border border-gray-100 text-brand-dark text-xs font-bold rounded-lg focus:ring-brand-primary focus:border-brand-primary block w-full py-2 px-3 transition-dashboard"
                >
                    {years.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>

            <button
                onClick={() => router.push('?')}
                className="pb-2 w-full sm:w-auto text-[10px] font-black text-gray-400 hover:text-brand-primary uppercase tracking-wider transition-dashboard text-center"
            >
                Reiniciar
            </button>
        </div>
    );
}
