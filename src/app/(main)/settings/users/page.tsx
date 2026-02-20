
import { Users, UserPlus, Shield, Mail, Calendar as CalendarIcon } from 'lucide-react';
import { getUsers } from '@/features/settings/services/user-management.server';

export default async function UsersPage() {
    const users = await getUsers();

    return (
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10 animate-in fade-in zoom-in-95 duration-700">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-10 border-b border-gray-100/50">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 mb-2">
                        <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-brand-primary" />
                        </div>
                        <span className="text-[10px] font-black text-brand-primary uppercase tracking-[0.2em]">Configuración</span>
                    </div>
                    <h1 className="text-4xl font-black text-brand-dark tracking-tighter uppercase">
                        Usuarios <span className="text-brand-primary">del Sistema</span>
                    </h1>
                    <p className="text-gray-400 text-xs font-bold uppercase tracking-widest max-w-md">
                        Gestiona los accesos, roles y permisos de tu equipo de trabajo.
                    </p>
                </div>

                <button className="flex items-center justify-center gap-2 px-6 py-3 bg-brand-dark text-white rounded-xl font-black text-[10px] uppercase tracking-widest hover:bg-brand-primary transition-all active:scale-95 shadow-xl shadow-brand-dark/10">
                    <UserPlus className="w-4 h-4" />
                    Invitar Usuario
                </button>
            </div>

            {/* Content Section */}
            <div className="grid gap-4">
                {users.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                        <Users className="w-12 h-12 text-gray-200 mb-4" />
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No hay usuarios registrados</h3>
                        <p className="text-[10px] text-gray-300 font-bold uppercase mt-1">Crea un perfil para empezar</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {users.map((user) => (
                            <div key={user.id} className="group relative bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500">
                                <div className="absolute top-6 right-6">
                                    <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                        }`}>
                                        {user.role}
                                    </span>
                                </div>
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-xl font-black text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-colors duration-500">
                                        {user.full_name?.[0] || user.email[0].toUpperCase()}
                                    </div>
                                    <div className="space-y-1">
                                        <h3 className="font-black text-brand-dark uppercase text-sm tracking-tight leading-none truncate w-40">
                                            {user.full_name || 'Sin Nombre'}
                                        </h3>
                                        <div className="flex items-center gap-1.5 text-gray-400">
                                            <Mail className="w-3 h-3" />
                                            <span className="text-[10px] font-bold tracking-tight lowercase">{user.email}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                                    <div className="flex items-center gap-2 text-gray-300">
                                        <CalendarIcon className="w-3 h-3" />
                                        <span className="text-[9px] font-black uppercase tracking-tighter">
                                            Desde: {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <button className="p-2 hover:bg-brand-bg rounded-lg text-gray-400 hover:text-brand-primary transition-colors">
                                        <Shield className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
