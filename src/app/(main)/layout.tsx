import { logout } from '@/features/auth/actions/auth.actions';
import { getCurrentProfile } from '@/features/settings/services/user-management.server';
import Link from 'next/link';

export default async function MainLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getCurrentProfile();
  const isAdmin = profile?.role === 'admin';

  return (
    <div className="min-h-screen bg-brand-bg/30">
      <nav className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex gap-10">
              <div className="flex-shrink-0 flex items-center gap-2 group cursor-default">
                <div className="w-8 h-8 bg-brand-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-brand-primary/20 group-hover:rotate-12 transition-transform duration-500">
                  <span className="font-black text-xs">TX</span>
                </div>
                <span className="font-black text-brand-dark text-xl tracking-tighter">BC TaxFlow</span>
              </div>
              <div className="hidden sm:flex sm:space-x-8">
                <Link
                  href="/transactions"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark hover:border-brand-primary transition-all duration-300"
                >
                  Transacciones
                </Link>
                <Link
                  href="/reports"
                  className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark hover:border-brand-primary transition-all duration-300"
                >
                  Reportes
                </Link>
                {isAdmin && (
                  <Link
                    href="/settings/users"
                    className="inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-[11px] font-black uppercase tracking-widest text-gray-400 hover:text-brand-dark hover:border-brand-primary transition-all duration-300"
                  >
                    Configuración
                  </Link>
                )}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="h-8 w-px bg-gray-100" />
              <form action={logout}>
                <button className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all duration-300">
                  Cerrar Sesión
                </button>
              </form>
            </div>
          </div>
        </div>
      </nav>
      <main className="relative min-h-[calc(100vh-64px-81px)]">
        {children}
      </main>
      <footer className="bg-white/50 backdrop-blur-md border-t border-gray-100 py-8">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em]">
            By BUSINESS INVESTMENT GROUP INC @ 2026
          </p>
        </div>
      </footer>
    </div>
  )
}
