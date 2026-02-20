import { getTransactionsServer, getStatementSummaryServer } from '@/features/transactions/services/transaction.server';
import { TransactionFilters } from '@/features/transactions/components/transaction-filters';
import { DashboardHeader } from '@/shared/components/DashboardHeader';
import { MetricCard } from '@/shared/components/MetricCard';
import { BudgetGauge } from '@/shared/components/BudgetGauge';
import { Card } from '@/shared/components/Card';
import { aggregateByMonth } from '@/features/reports/services/report.service';
import {
    Coins,
    CreditCard,
    TrendingUp,
    TrendingDown,
    Target,
    BarChart3,
    ArrowRightLeft,
    Scale
} from 'lucide-react';

export default async function ReportsPage({
    searchParams
}: {
    searchParams: Promise<{ month?: string, year?: string }>
}) {
    const params = await searchParams;
    const year = params.year ? parseInt(params.year) : new Date().getFullYear();
    const month = params.month ? parseInt(params.month) : undefined;


    const transactions = await getTransactionsServer({ month, year });
    const allTransactionsOfYear = await getTransactionsServer({ year });
    const statement = month ? await getStatementSummaryServer(month, year) : null;

    const income = transactions.filter(t => t.type === 'DEPOSIT').reduce((sum, t) => sum + t.amount, 0);
    const expenses = transactions.filter(t => t.type === 'WITHDRAWAL').reduce((sum, t) => sum + t.amount, 0);
    const profit = income - expenses;
    const margin = income > 0 ? (profit / income) * 100 : 0;

    // Aggregate monthly data for chart
    const monthlyStats = aggregateByMonth(allTransactionsOfYear, year);
    const maxVal = Math.max(...monthlyStats.map(s => Math.max(s.income, s.expense)), 1000);

    const formatCurrency = (amount: number) => {
        return new Intl.NumberFormat('es-CO', {
            style: 'currency',
            currency: 'COP',
            maximumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in zoom-in-95 duration-1000">

            <DashboardHeader
                title="Centro de Control"
                subtitle={`Inteligencia de Rendimiento • ${month || 'Todo'}/${year}`}
            >
                <TransactionFilters />
            </DashboardHeader>

            {/* Top KPI Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard
                    title="Ingresos Totales"
                    value={formatCurrency(income)}
                    icon={TrendingUp}
                />
                <MetricCard
                    title="Costos Operativos"
                    value={formatCurrency(expenses)}
                    icon={TrendingDown}
                />
                <MetricCard
                    title="Cuentas por Cobrar"
                    value={formatCurrency(0)}
                    icon={Coins}
                />
                <MetricCard
                    title="Cuentas por Pagar"
                    value={formatCurrency(0)}
                    icon={CreditCard}
                />
            </div>

            {/* Main Content Area */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

                {/* Left: Advanced Chart Column */}
                <div className="lg:col-span-8 flex flex-col">
                    <Card className="p-8 h-full flex flex-col group overflow-hidden border-gray-100 shadow-premium relative">
                        {/* Background subtle decoration */}
                        <div className="absolute top-0 right-0 w-96 h-96 bg-brand-bg/40 rounded-full -mr-48 -mt-48 blur-3xl pointer-events-none opacity-50" />

                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <div>
                                <h3 className="text-xl font-black text-brand-dark tracking-tight">Analítica de Ingresos</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase mt-1 tracking-widest">Flujo de Rendimiento Anual • {year}</p>
                            </div>
                            <div className="flex gap-6">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-dark shadow-sm" />
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Ingresos</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full bg-brand-primary shadow-sm" />
                                    <span className="text-[9px] font-black text-gray-400 uppercase tracking-widest">Gastos</span>
                                </div>
                            </div>
                        </div>

                        {/* Financial Visualization Dynamic */}
                        <div className="flex-1 flex items-end justify-between gap-3 pt-10 px-2 group-hover:scale-[1.01] transition-dashboard relative z-10 h-[300px]">
                            {monthlyStats.map((s, i) => (
                                <div key={i} className="flex-1 flex flex-col gap-1 items-center relative group/bar h-full justify-end">
                                    <div
                                        className="w-full rounded-t-lg bg-brand-dark/95 shadow-sm transition-all duration-700 delay-[i*30ms] group-hover/bar:bg-brand-dark"
                                        style={{ height: `${(s.income / maxVal) * 100}%` }}
                                    />
                                    <div
                                        className="w-full rounded-b-lg bg-brand-primary/40 transition-all duration-700 delay-[i*50ms] group-hover/bar:bg-brand-primary/60"
                                        style={{ height: `${(s.expense / maxVal) * 100}%` }}
                                    />
                                    {/* Tooltip on hover */}
                                    <div className="absolute top-0 opacity-0 group-hover/bar:opacity-100 transition-opacity bg-brand-dark text-white text-[8px] font-black px-2 py-1 rounded shadow-xl pointer-events-none z-20 whitespace-nowrap">
                                        Ing: {formatCurrency(s.income)}<br />Gas: {formatCurrency(s.expense)}
                                    </div>
                                    <span className="text-[8px] font-black text-gray-400 uppercase mt-5 tracking-[0.1em]">
                                        {new Intl.DateTimeFormat('es-ES', { month: 'short' }).format(new Date(2000, i))}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </Card>
                </div>

                {/* Right: Specialized Metrics Column */}
                <div className="lg:col-span-4 space-y-6">
                    {/* Specialized Profit Card */}
                    <Card className="p-6 bg-brand-dark text-white relative overflow-hidden group shadow-xl shadow-brand-dark/20 border-none min-h-[350px]">
                        <div className="absolute top-0 right-0 w-48 h-48 bg-white/5 rounded-full -mr-24 -mt-24 blur-3xl pointer-events-none" />
                        <Target className="text-white/5 absolute -bottom-4 -right-4 w-32 h-32 rotate-12 group-hover:rotate-45 transition-transform duration-1000" />

                        <div className="relative z-10 flex flex-col items-center py-2 h-full justify-center">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50 mb-10">Margen de Utilidad Neta</h4>

                            <div className="relative flex items-center justify-center w-40 h-40">
                                <svg viewBox="0 0 128 128" className="w-full h-full -rotate-90">
                                    <circle
                                        cx="64" cy="64" r="56"
                                        fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="12"
                                    />
                                    <circle
                                        cx="64" cy="64" r="56"
                                        fill="none" stroke="currentColor" strokeWidth="12"
                                        className="text-brand-primary"
                                        strokeDasharray="351.86"
                                        strokeDashoffset={351.86 * (1 - Math.min(Math.max(margin, 0), 100) / 100)}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 2s cubic-bezier(0.4, 0, 0.2, 1)' }}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center text-center">
                                    <span className="text-4xl font-black tracking-tighter">{margin.toFixed(1)}<span className="text-lg opacity-50">%</span></span>
                                    <span className="text-[8px] font-bold text-white/40 uppercase tracking-widest mt-1">RENTABILIDAD</span>
                                </div>
                            </div>

                            <div className="mt-12 flex items-center gap-4 w-full px-4">
                                <div className="flex-1 h-1.5 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-brand-primary transition-all duration-1000 shadow-[0_0_10px_rgba(var(--brand-primary-rgb),0.5)]"
                                        style={{ width: `${Math.min(margin, 100)}%` }}
                                    />
                                </div>
                            </div>
                        </div>
                    </Card>

                    <Card className="p-6 border-gray-100 shadow-premium">
                        <div className="flex items-center gap-3 mb-4">
                            <BarChart3 className="w-5 h-5 text-brand-primary" />
                            <h4 className="text-[11px] font-black text-brand-dark uppercase tracking-widest">Resumen Operativo</h4>
                        </div>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Beneficio Neto</span>
                                <span className="text-sm font-black text-brand-dark">{formatCurrency(profit)}</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-gray-50">
                                <span className="text-[10px] font-bold text-gray-400 uppercase">Eficiencia</span>
                                <span className="text-sm font-black text-emerald-500">{(margin > 0 ? (margin * 1.2).toFixed(1) : 0)}%</span>
                            </div>
                        </div>
                    </Card>
                </div>
            </div>

            {/* Bottom Insight Row */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-10">
                <Card className="p-5 flex items-center gap-5 group border-gray-100 shadow-premium hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-dashboard shadow-sm">
                        <Scale size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Consistencia Financiera</h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xl font-black text-brand-dark">{margin > 20 ? 'Alta' : margin > 0 ? 'Media' : 'Inicial'}</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-5 flex items-center gap-5 group border-gray-100 shadow-premium hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:-rotate-3 transition-dashboard shadow-sm">
                        <ArrowRightLeft size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Flujo de Caja</h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xl font-black text-brand-dark">{income > expenses ? 'Positivo' : 'Neutro'}</span>
                        </div>
                    </div>
                </Card>

                <Card className="p-5 flex items-center gap-5 group border-gray-100 shadow-premium hover:-translate-y-1 transition-all duration-300">
                    <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center group-hover:scale-110 group-hover:rotate-3 transition-dashboard shadow-sm">
                        <TrendingUp size={20} strokeWidth={2.5} />
                    </div>
                    <div>
                        <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Estado Fiscal</h4>
                        <div className="flex items-baseline gap-2 mt-0.5">
                            <span className="text-xl font-black text-emerald-500">Al día</span>
                        </div>
                    </div>
                </Card>
            </div>
        </div>
    );
}
