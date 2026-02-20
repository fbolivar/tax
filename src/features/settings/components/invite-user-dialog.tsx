
'use client';

import { useState } from 'react';
import { UserPlus, X, Mail, User, Shield, Loader2 } from 'lucide-react';
import { inviteUser } from '../actions/user.actions';

export function InviteUserDialog() {
    const [isOpen, setIsOpen] = useState(false);
    const [isPending, setIsPending] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsPending(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const result = await inviteUser(formData);

        if (result.success) {
            setIsOpen(false);
            // Re-render handled by revalidatePath in action
        } else {
            setError(result.error || 'Ocurrió un error');
        }
        setIsPending(false);
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all active:scale-95 shadow-xl shadow-brand-dark/10"
            >
                <UserPlus className="w-4 h-4" />
                Invitar Usuario
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
                            <UserPlus className="w-5 h-5 text-brand-primary" />
                        </div>
                        <h2 className="text-xl font-black text-brand-dark uppercase tracking-tight">Invitar Miembro</h2>
                        <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Añade un nuevo colaborador al equipo</p>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="p-2 hover:bg-gray-50 rounded-xl text-gray-400 transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Correo Electrónico</label>
                            <div className="relative">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    name="email"
                                    type="email"
                                    required
                                    placeholder="correo@ejemplo.com"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
                            <div className="relative">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <input
                                    name="full_name"
                                    type="text"
                                    placeholder="Ej. Juan Pérez"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-brand-dark placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all"
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Contraseña Inicial</label>
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

                        <div className="space-y-1.5">
                            <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Rol del Sistema</label>
                            <div className="relative">
                                <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                <select
                                    name="role"
                                    className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black text-brand-dark appearance-none focus:outline-none focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary transition-all uppercase tracking-tighter"
                                >
                                    <option value="viewer">Observador (Viewer)</option>
                                    <option value="admin">Administrador (Admin)</option>
                                </select>
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
                            {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : <UserPlus className="w-4 h-4" />}
                            Confirmar Invitación
                        </button>
                    </div>
                </form>
            </div>
        </>
    );
}
