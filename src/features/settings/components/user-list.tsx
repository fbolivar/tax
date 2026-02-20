
'use client';

import { useState } from 'react';
import { Mail, Shield, Trash2, Calendar as CalendarIcon, Edit3, X, Loader2, User } from 'lucide-react';
import { UserProfile } from '../types/user.types';
import { deleteUser, updateUserProfile } from '../actions/user.actions';

interface Props {
    initialUsers: UserProfile[];
}

export function UserList({ initialUsers }: Props) {
    const [users, setUsers] = useState(initialUsers);
    const [editingUser, setEditingUser] = useState<UserProfile | null>(null);
    const [isPending, setIsPending] = useState(false);

    const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!editingUser) return;
        setIsPending(true);

        const formData = new FormData(e.currentTarget);
        const data = {
            full_name: formData.get('full_name') as string,
            role: formData.get('role') as 'admin' | 'viewer',
        };

        const result = await updateUserProfile(editingUser.id, data);

        if (result.success) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...u, ...data } : u));
            setEditingUser(null);
        } else {
            alert('Error al actualizar: ' + result.error);
        }
        setIsPending(false);
    };

    const handleDelete = async (userId: string) => {
        if (!confirm('¿Estás seguro de eliminar este usuario? Esta acción solo borra su perfil.')) return;

        const result = await deleteUser(userId);
        if (result.success) {
            setUsers(users.filter(u => u.id !== userId));
        } else {
            alert('Error al eliminar: ' + result.error);
        }
    };

    if (users.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 bg-gray-50/50 rounded-3xl border-2 border-dashed border-gray-100">
                <Shield className="w-12 h-12 text-gray-200 mb-4" />
                <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">No hay usuarios registrados</h3>
                <p className="text-[10px] text-gray-300 font-bold uppercase mt-1">Crea un perfil para empezar</p>
            </div>
        );
    }

    return (
        <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {users.map((user) => (
                    <div key={user.id} className="group relative bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500">
                        {/* Role Badge */}
                        <div className="absolute top-6 right-6 flex items-center gap-2">
                            <span className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter ${user.role === 'admin' ? 'bg-orange-50 text-orange-600' : 'bg-blue-50 text-blue-600'
                                }`}>
                                {user.role}
                            </span>
                        </div>

                        <div className="flex items-start gap-4">
                            <div className="w-12 h-12 rounded-2xl bg-brand-bg flex items-center justify-center text-xl font-black text-brand-primary group-hover:bg-brand-primary group-hover:text-white transition-all duration-500 shadow-sm">
                                {user.full_name?.[0] || user.email[0].toUpperCase()}
                            </div>
                            <div className="space-y-1 overflow-hidden">
                                <h3 className="font-black text-brand-dark uppercase text-xs tracking-tight leading-none truncate w-full">
                                    {user.full_name || 'Sin Nombre'}
                                </h3>
                                <div className="flex items-center gap-1.5 text-gray-400">
                                    <Mail className="w-3 h-3 flex-shrink-0" />
                                    <span className="text-[10px] font-bold tracking-tight lowercase truncate">{user.email}</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-6 border-t border-gray-50 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-gray-300">
                                <CalendarIcon className="w-3 h-3" />
                                <span className="text-[9px] font-black uppercase tracking-tighter">
                                    {new Date(user.created_at).toLocaleDateString('es-ES', { month: 'short', year: 'numeric' })}
                                </span>
                            </div>
                            <div className="flex items-center gap-1">
                                <button
                                    onClick={() => setEditingUser(user)}
                                    className="p-2 hover:bg-brand-bg rounded-lg text-gray-300 hover:text-brand-primary transition-all"
                                    title="Editar Perfil"
                                >
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button
                                    onClick={() => handleDelete(user.id)}
                                    className="p-2 hover:bg-rose-50 rounded-lg text-gray-300 hover:text-rose-500 transition-all"
                                    title="Eliminar Usuario"
                                >
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Edit Modal */}
            {editingUser && (
                <>
                    <div className="fixed inset-0 bg-brand-dark/40 backdrop-blur-sm z-[100]" onClick={() => setEditingUser(null)} />
                    <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-[2rem] p-8 shadow-2xl z-[101] animate-in zoom-in-95 duration-300">
                        <div className="flex items-start justify-between mb-8">
                            <div className="space-y-1">
                                <h2 className="text-xl font-black text-brand-dark uppercase tracking-tight">Editar Perfil</h2>
                                <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Actualiza la información del usuario</p>
                            </div>
                            <button onClick={() => setEditingUser(null)} className="p-2 hover:bg-gray-50 rounded-xl text-gray-400"><X className="w-5 h-5" /></button>
                        </div>

                        <form onSubmit={handleEditSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Nombre Completo</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <input
                                            name="full_name"
                                            defaultValue={editingUser.full_name || ''}
                                            required
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-bold text-brand-dark focus:ring-2 focus:ring-brand-primary/20 transition-all"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-1.5">
                                    <label className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] ml-1">Rol</label>
                                    <div className="relative">
                                        <Shield className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-300" />
                                        <select
                                            name="role"
                                            defaultValue={editingUser.role}
                                            className="w-full pl-12 pr-4 py-3.5 bg-gray-50 border border-gray-100 rounded-2xl text-xs font-black text-brand-dark appearance-none uppercase tracking-tighter"
                                        >
                                            <option value="viewer">Viewer</option>
                                            <option value="admin">Admin</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isPending}
                                className="w-full py-4 bg-brand-dark text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-brand-primary transition-all flex items-center justify-center gap-2 shadow-xl shadow-brand-dark/10"
                            >
                                {isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Guardar Cambios'}
                            </button>
                        </form>
                    </div>
                </>
            )}
        </>
    );
}
