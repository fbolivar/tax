
import { Users } from 'lucide-react';
import { getUsers } from '@/features/settings/services/user-management.server';
import { UserList } from '@/features/settings/components/user-list';
import { InviteUserDialog } from '@/features/settings/components/invite-user-dialog';

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

                <div className="flex items-center gap-3">
                    <InviteUserDialog />
                </div>
            </div>

            {/* Content Section */}
            <div className="relative">
                <UserList initialUsers={users} />
            </div>

        </div>
    );
}
