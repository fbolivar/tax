
'use server';

import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

const userSchema = z.object({
    email: z.string().email('Email inválido'),
    full_name: z.string().min(2, 'Nombre muy corto'),
    role: z.enum(['admin', 'viewer']),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

const profileSchema = z.object({
    full_name: z.string().min(2, 'Nombre muy corto'),
    role: z.enum(['admin', 'viewer']),
});

export async function updateUserProfile(userId: string, data: { full_name: string, role: 'admin' | 'viewer' }) {
    const result = profileSchema.safeParse(data);
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from('profiles')
        .update({
            full_name: result.data.full_name,
            role: result.data.role
        })
        .eq('id', userId);

    if (error) {
        console.error('Error updating profile:', error);
        return { error: error.message };
    }

    revalidatePath('/settings/users');
    return { success: true };
}

export async function deleteUser(userId: string) {
    const supabase = await createClient();

    // NOTE: This only deletes the profile. To delete the Auth user
    // we would need service_role permissions.
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
    const password = formData.get('password') as string;

    const result = userSchema.safeParse({ email, full_name, role, password });
    if (!result.success) {
        return { error: result.error.issues[0].message };
    }

    const supabase = await createClient();

    // 1. Create the Auth User
    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: result.data.email,
        password: result.data.password,
        options: {
            data: {
                full_name: result.data.full_name,
                role: result.data.role,
            }
        }
    });

    if (authError) {
        return { error: authError.message };
    }

    // 2. Profile creation is handled by the SQL trigger we created earlier
    // If the trigger failed or isn't there, we can manually insert as fallback
    if (authData.user) {
        const { error: profileError } = await supabase
            .from('profiles')
            .upsert({
                id: authData.user.id,
                email: result.data.email,
                full_name: result.data.full_name,
                role: result.data.role,
            });

        if (profileError) {
            console.warn('Profile upsert warning:', profileError);
        }
    }

    revalidatePath('/settings/users');
    return { success: true };
}
