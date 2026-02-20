
import { createClient } from '@/shared/lib/supabase/server';
import { UserProfile } from '../types/user.types';

export async function getUsers(): Promise<UserProfile[]> {
    const supabase = await createClient();

    // In a real app, this might come from a 'profiles' table 
    // since auth.users isn't directly listable without service_role
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.warn('SUPABASE_INFO [profiles]: La tabla "profiles" no existe aún en este entorno. Usando fallback de sesión local.');

        // Fallback: Si la tabla no existe, al menos devolvemos al usuario actual para no romper la UI
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            return [{
                id: authUser.id,
                email: authUser.email!,
                full_name: authUser.user_metadata?.full_name || 'Usuario Actual',
                role: 'admin',
                created_at: authUser.created_at
            }];
        }
        return [];
    }

    const typedProfiles = (profiles as any[]) || [];

    // Si la tabla existe pero está vacía, devolvemos al usuario actual como admin provisional
    if (typedProfiles.length === 0) {
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser) {
            return [{
                id: authUser.id,
                email: authUser.email!,
                full_name: authUser.user_metadata?.full_name || 'Admin Inicial',
                role: 'admin',
                created_at: authUser.created_at
            }];
        }
    }

    return typedProfiles;
}
