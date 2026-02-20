
'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const userSchema = z.object({
    email: z.string().email(),
    full_name: z.string().optional(),
    role: z.enum(['admin', 'viewer']),
});

export async function updateUserRole(userId: string, role: 'admin' | 'viewer') {
    const supabase = await createClient();

    const { error } = await supabase
        .from('profiles')
        .update({ role })
        .eq('id', userId);

    if (error) {
        console.error('Error updating user role:', error);
        return { error: error.message };
    }

    revalidatePath('/settings/users');
    return { success: true };
}

export async function deleteUser(userId: string) {
    const supabase = await createClient();

    // NOTE: This only deletes the profile. To delete the Auth user
    // we would need service_role permissions which we don't expose here.
    const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

    if (error) {
        console.error('Error deleting profile:', error);
        return { error: error.message };
    }

    revalidatePath('/settings/users');
    return { success: true };
}

export async function inviteUser(formData: FormData) {
    const email = formData.get('email') as string;
    const full_name = formData.get('full_name') as string;
    const role = formData.get('role') as 'admin' | 'viewer';

    const result = userSchema.safeParse({ email, full_name, role });
    if (!result.success) {
        return { error: result.error.errors[0].message };
    }

    const supabase = await createClient();

    // In a real industrial app, we would use supabase.auth.admin here
    // But since we are restricted to public anon key, we'll simulate 
    // by creating the profile. In production, this would trigger an email.
    const { error } = await supabase
        .from('profiles')
        .insert([{
            email: result.data.email,
            full_name: result.data.full_name,
            role: result.data.role,
        }]);

    if (error) {
        // If table doesn't exist, we can't do much without the admin executing the SQL first
        return { error: 'Error de base de datos. ¿Ya ejecutaste el script SQL de perfiles?' };
    }

    revalidatePath('/settings/users');
    return { success: true };
}
