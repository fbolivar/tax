
'use server';

import { createClient as createSupabaseClient } from '@supabase/supabase-js';
import { createClient } from '@/shared/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';

// Cliente administrativo para evitar conflictos de cookies durante la invitación
const getAdminClient = () => {
    return createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        { auth: { persistSession: false } }
    );
};

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

    // Usamos el cliente administrativo sin persistencia para no cerrar la sesión del Admin actual
    const adminSupabase = getAdminClient();

    const { data: authData, error: authError } = await adminSupabase.auth.signUp({
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

    if (authData.user) {
        const publicSupabase = await createClient();
        const { error: profileError } = await publicSupabase
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

export async function changePassword(formData: FormData) {
    const password = formData.get('password') as string;
    const supabase = await createClient();
    const { error } = await supabase.auth.updateUser({
        password
    });

    if (error) {
        return { error: error.message };
    }

    return { success: true };
}
