
import { createClient } from '@/shared/lib/supabase/server';
import { UserProfile } from '../types/user.types';

export async function getUsers(): Promise<UserProfile[]> {
    const supabase = await createClient();

    const { data: profiles, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching profiles:', error);
        return [];
    }

    return (profiles as UserProfile[]) || [];
}

export async function getCurrentProfile(): Promise<UserProfile | null> {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) return null;

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    if (!profile) {
        return null;
    }

    return profile as UserProfile;
}
