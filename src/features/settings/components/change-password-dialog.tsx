
'use client';

import { useState } from 'react';
import { KeyRound, X, Shield, Loader2, CheckCircle2 } from 'lucide-react';
import { changePassword } from '../actions/user.actions';

export function ChangePasswordDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await changePassword(formData);

        if (result.success) {
            setIsSuccess(true);
            setTimeout(() => {
                setIsOpen(false);
                setIsSuccess(false);
            }, 2000);
        } else {
            setError(result.error || 'Ocurrió un error');
        }
        setIsPending(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 border border-gray-100 bg-white text-gray-400 rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-gray-50 hover:text-brand-dark transition-all active:scale-95 shadow-sm"
            >
                <KeyRound className="w-4 h-4" />
                Mi Contraseña
            </button>
        );
    }

    return (
        <>
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300"
                onClick={() => setIsOpen(false)}
            />

            {/* Dialog Content */}
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl z-[101] animate-in zoom-in-95 fade-in duration-300 border border-gray-100">
                <div className="flex items-start justify-between mb-8">
                    <div className="space-y-1">
                        <div className="w-10 h-10 rounded-xl bg-brand-primary/10 flex items-center justify-center mb-4">
                            <KeyRound className="w-5 h-5 text-brand-primary" />
                        </div>
                        <h2 className="text-xl font-black text-brand-dark uppercase tracking-tight">Cambiar Contraseña</h2>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Actualiza tus credenciales de acceso</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {isSuccess ? (
                    <div className="flex flex-col items-center justify-center py-10 gap-4 animate-in zoom-in-95 duration-500">
                        <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center">
                            <CheckCircle2 className="w-8 h-8 text-green-500" />
                        </div>
                        <h3 className="text-sm font-black text-brand-dark uppercase tracking-widest">¡Actualizado con Éxito!</h3>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-4">
                            <div className="space-y-1.5">
                                <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nueva Contraseña</label>
                                <div className="relative">
                                    <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        placeholder="••••••••"
                                        className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        {error && (
                            <div className="p-4 bg-rose-50 border border-rose-100 rounded-2xl text-[10px] font-black text-rose-500 uppercase tracking-tight">
                                {error}
                            </div>
                        )}

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-brand-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98] shadow-xl shadow-brand-dark/10 flex items-center justify-center gap-2"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <KeyRound className="w-4 h-4" />}
                                Actualizar Contraseña
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </>
    );
}
