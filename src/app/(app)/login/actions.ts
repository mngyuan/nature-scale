'use server';

import {revalidatePath} from 'next/cache';
import {redirect} from 'next/navigation';

import {createClient} from '@/lib/supabase/server';
import {AuthError} from '@supabase/supabase-js';

export async function login(formData: FormData): Promise<{
  error?: AuthError;
}> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };

  const {error} = await supabase.auth.signInWithPassword(data);

  if (error) {
    console.error('Login failed:', error);
    return {error};
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}

export async function signup(formData: FormData): Promise<{
  error?: AuthError;
}> {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
    options: {
      data: {
        first_name: formData.get('firstName') as string,
        last_name: formData.get('lastName') as string,
      },
      emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/complete`,
    },
  };

  const {error} = await supabase.auth.signUp(data);

  if (error) {
    console.error('Signup failed:', error);
    return {error};
  }

  revalidatePath('/dashboard', 'layout');
  redirect('/dashboard');
}
