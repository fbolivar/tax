
import { Suspense } from 'react';
import { getTransactionsServer, getStatementSummaryServer, getAllStatementsServer } from '@/features/transactions/services/transaction.server';
import { TransactionList } from '@/features/transactions/components/transaction-list';
import { TransactionStats } from '@/features/transactions/components/transaction-stats';
import { IngestPdf } from '@/features/transactions/components/ingest-pdf';
import { ExportButton } from '@/features/reports/components/export-button';
import { TransactionFilters } from '@/features/transactions/components/transaction-filters';
import { DashboardHeader } from '@/shared/components/DashboardHeader';
import { MetricCard } from '@/shared/components/MetricCard';
import { Card } from '@/shared/components/Card';
import { getCurrentProfile } from '@/features/settings/services/user-management.server';
import { ArrowUpCircle, ArrowDownCircle, Wallet, Scale, History, Calendar } from 'lucide-react';
import Link from 'next/link';

export default async function TransactionsPage({
    searchParams
}: {
    searchParams: Promise<{ month?: string, year?: string }>
}) {
    const params = await searchParams;
    const month = params.month ? parseInt(params.month) : new Date().getMonth() + 1;
    const year = params.year ? parseInt(params.year) : new Date().getFullYear();

    const profile = await getCurrentProfile();
    const isAdmin = profile?.role === 'admin';

    const transactions = await getTransactionsServer({ month, year });
    const allYearTransactions = await getTransactionsServer({ year });
    const statementSummary = await getStatementSummaryServer(month, year);
    const allStatements = await getAllStatementsServer();

    const formatCurrency = (val: number) => new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(val);

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12 animate-in fade-in duration-1000">

            <DashboardHeader
                title="Transacciones"
                subtitle={`Revisión Financiera • ${month}/${year}`}
            >
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <TransactionFilters />
                    <ExportButton
                        transactions={allYearTransactions}
                        allStatements={allStatements}
                        year={year}
                    />
                    {isAdmin && <IngestPdf />}
                </div>
            </DashboardHeader>

            {/* Combined Summary Section - Forced Vertical Stack to prevent squashing */}
            <div className="flex flex-col gap-10 w-full">
                {/* Bank Statement Data - Explicit Full Width */}
                {statementSummary && (
                    <section className="w-full space-y-6">
                        <div className="flex items-center gap-4">
                            <h2 className="text-[12px] font-black text-brand-primary uppercase tracking-[0.25em] whitespace-nowrap">Resumen del Extracto Bancario</h2>
                            <div className="h-px w-full bg-gradient-to-r from-brand-primary/30 to-transparent"></div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            <MetricCard
                                title="Saldo Inicial"
                                value={formatCurrency(statementSummary.opening_balance)}
                                icon={Wallet}
                            />
                            <MetricCard
                                title="Total Depósitos"
                                value={formatCurrency(statementSummary.total_deposits)}
                                icon={ArrowUpCircle}
                                variant="success"
                            />
                            <MetricCard
                                title="Total Retiros"
                                value={formatCurrency(statementSummary.total_withdrawals)}
                                icon={ArrowDownCircle}
                                variant="danger"
                            />
                            <MetricCard
                                title="Saldo Final"
                                value={formatCurrency(statementSummary.closing_balance)}
                                icon={Scale}
                                variant="primary"
                            />
                        </div>
                    </section>
                )}

                {/* Period activity Stats - Explicit Full Width */}
                <section className="w-full space-y-6">
                    <div className="flex items-center gap-4">
                        <h2 className="text-[12px] font-black text-brand-primary uppercase tracking-[0.25em] whitespace-nowrap">Inteligencia Transaccional</h2>
                        <div className="h-px w-full bg-gradient-to-r from-brand-primary/30 to-transparent"></div>
                    </div>
                    <TransactionStats transactions={transactions} />
                </section>

                {/* Ledger Table */}
                <section className="space-y-4 lg:col-span-12">
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-3 flex-1">
                            <h2 className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Libro Mayor Detallado</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-brand-primary/20 to-transparent"></div>
                        </div>
                        <span className="ml-4 text-[9px] font-black text-brand-primary uppercase bg-brand-bg px-3 py-1.5 rounded-lg border border-brand-primary/10">
                            {transactions.length} entradas
                        </span>
                    </div>
                    <Suspense fallback={
                        <Card className="h-96 w-full animate-pulse bg-white/50 border border-gray-100 shadow-premium" />
                    }>
                        <TransactionList transactions={transactions} />
                    </Suspense>
                </section>

                {/* Import History Section */}
                {allStatements.length > 0 && (
                    <section className="space-y-4 pt-10">
                        <div className="flex items-baseline gap-3">
                            <History className="w-4 h-4 text-brand-primary" />
                            <h2 className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Historial de Importación</h2>
                            <div className="h-px flex-1 bg-gradient-to-r from-brand-primary/20 to-transparent"></div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            {allStatements.slice(0, 8).map((st: any) => (
                                <Link
                                    key={st.id}
                                    href={`/transactions?month=${st.month}&year=${st.year}`}
                                    className="group"
                                >
                                    <Card className="p-4 hover:border-brand-primary/30 transition-all active:scale-[0.98] cursor-pointer bg-white/50 backdrop-blur-sm">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-lg bg-brand-bg flex items-center justify-center group-hover:bg-brand-primary/10 transition-colors">
                                                <Calendar className="w-4 h-4 text-brand-primary" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-brand-dark uppercase tracking-tight">
                                                    {new Intl.DateTimeFormat('es-ES', { month: 'long' }).format(new Date(2000, st.month - 1))} {st.year}
                                                </span>
                                                <span className="text-[8px] font-bold text-gray-400 uppercase tracking-widest">
                                                    Saldo: {formatCurrency(st.closing_balance)}
                                                </span>
                                            </div>
                                        </div>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    </section>
                )}
            </div>
        </div>
    );
}

