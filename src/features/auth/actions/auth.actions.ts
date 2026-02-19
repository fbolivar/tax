'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/shared/lib/supabase/server';
import { z } from 'zod';

const authSchema = z.object({
    email: z.string().email('Email inválido'),
    password: z.string().min(6, 'La contraseña debe tener al menos 6 caracteres'),
});

export async function login(formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const result = authSchema.safeParse(rawData);
    if (!result.success) {
        redirect(`/login?error=${encodeURIComponent(result.error.issues[0].message)}`);
    }

    const { error } = await supabase.auth.signInWithPassword(result.data);

    if (error) {
        redirect('/login?error=Credenciales inválidas');
    }

    revalidatePath('/', 'layout');
    redirect('/transactions');
}

export async function signup(formData: FormData) {
    const supabase = await createClient();

    const rawData = {
        email: formData.get('email') as string,
        password: formData.get('password') as string,
    };

    const result = authSchema.safeParse(rawData);
    if (!result.success) {
        redirect(`/login?error=${encodeURIComponent(result.error.issues[0].message)}`);
    }

    const { error } = await supabase.auth.signUp(result.data);

    if (error) {
        redirect('/login?error=No se pudo crear el usuario');
    }

    revalidatePath('/', 'layout');
    redirect('/transactions');
}

export async function logout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    redirect('/login')
}
