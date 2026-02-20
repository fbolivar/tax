
'use client';

import { useState } from 'react';
import { Mail, Shield, UserX, Trash2, Calendar as CalendarIcon, MoreVertical } from 'lucide-react';
import { UserProfile } from '../types/user.types';
import { updateUserRole, deleteUser } from '../actions/user.actions';

interface Props {
    initialUsers: UserProfile[];
}

export function UserList({ initialUsers }: Props) {
    const [users, setUsers] = useState(initialUsers);

    const handleToggleRole = async (user: UserProfile) => {
        const newRole = user.role === 'admin' ? 'viewer' : 'admin';

        // Optimistic update
        setUsers(users.map(u => u.id === user.id ? { ...u, role: newRole } : u));

        const result = await updateUserRole(user.id, newRole);
        if (result.error) {
            alert('No se pudo actualizar el rol: ' + result.error);
            setUsers(users); // Revert
        }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {users.map((user) => (
                <div key={user.id} className="group relative bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hover:border-brand-primary/20 hover:shadow-2xl hover:shadow-brand-primary/5 transition-all duration-500">
                    {/* Status Badge */}
                    <div className="absolute top-6 right-6 flex items-center gap-2">
                        <button
                            onClick={() => handleToggleRole(user)}
                            className={`px-3 py-1 rounded-full text-[8px] font-black uppercase tracking-tighter transition-all hover:scale-105 ${user.role === 'admin' ? 'bg-orange-50 text-orange-600 hover:bg-orange-100' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
                                }`}
                        >
                            {user.role}
                        </button>
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
                                onClick={() => handleToggleRole(user)}
                                title="Cambiar Rol"
                                className="p-2 hover:bg-brand-bg rounded-lg text-gray-300 hover:text-brand-primary transition-all"
                            >
                                <Shield className="w-4 h-4" />
                            </button>
                            <button
                                onClick={() => handleDelete(user.id)}
                                title="Eliminar Usuario"
                                className="p-2 hover:bg-rose-50 rounded-lg text-gray-300 hover:text-rose-500 transition-all"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
