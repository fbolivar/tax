
import { login, signup } from '@/features/auth/actions/auth.actions'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {

  const { error } = await searchParams;

  return (
    <div className="min-h-screen bg-white flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="w-12 h-12 bg-brand-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-brand-primary/20 mx-auto mb-6">
          <span className="font-black text-xl">TX</span>
        </div>
        <h2 className="text-[24px] font-black text-brand-dark uppercase tracking-tighter">
          Plataforma Fiscal
        </h2>
        <p className="mt-2 text-[11px] font-bold text-gray-400 uppercase tracking-widest">
          Inteligencia de Datos Financieros
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white/50 backdrop-blur-sm py-8 px-4 border border-gray-100 shadow-premium sm:rounded-2xl sm:px-10">
          <form className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Correo Electrónico
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  placeholder="ejemplo@bcfabric.com"
                  className="appearance-none block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 text-[13px] font-bold text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2">
                Contraseña
              </label>
              <div className="mt-1">
                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  placeholder="••••••••"
                  className="appearance-none block w-full px-4 py-3 border border-gray-100 rounded-xl bg-gray-50/50 text-[13px] font-bold text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                />
              </div>
            </div>

            {error && (
              <div className="text-[10px] font-black uppercase tracking-wider text-rose-500 bg-rose-50 p-3 rounded-lg border border-rose-100">
                {error}
              </div>
            )}

            <div className="flex flex-col gap-3">
              <button
                formAction={login}
                className="w-full h-11 flex items-center justify-center rounded-xl bg-brand-primary text-white text-[11px] font-black uppercase tracking-widest shadow-lg shadow-brand-primary/20 hover:bg-brand-dark transition-all active:scale-[0.98]"
              >
                Iniciar Sesión
              </button>
              <button
                formAction={signup}
                className="w-full h-11 flex items-center justify-center rounded-xl border border-gray-100 bg-white text-gray-400 text-[11px] font-black uppercase tracking-widest hover:bg-gray-50 hover:text-brand-dark transition-all active:scale-[0.98]"
              >
                Crear Cuenta
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
