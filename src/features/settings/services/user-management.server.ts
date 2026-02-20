
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
        console.error('Error fetching users:', error);
        return [];
    }

    return (profiles as any[]) || [];
}
