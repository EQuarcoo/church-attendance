import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';
import { Field, Panel } from '@/components/FormControls';

async function login(formData) {
  'use server';

  const email = formData.get('email');
  const password = formData.get('password');

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`);
  }

  redirect('/dashboard');
}

export default async function LoginPage({ searchParams }) {
  const params = await searchParams;
  const error = params?.error;

  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <h1 className="text-lg font-semibold text-black dark:text-white mb-1">Staff login</h1>
        <p className="text-sm text-black/40 dark:text-white/40 mb-6">Sign in to access the dashboard.</p>

        {error && (
          <p className="text-xs text-red-500 border border-red-500/30 bg-red-500/5 rounded-md px-3 py-2 mb-4">
            {error}
          </p>
        )}

        <Panel className="p-6">
          <form action={login} className="space-y-4">
            <Field label="Email" name="email" type="email" required />
            <Field label="Password" name="password" type="password" required />
            <button
              type="submit"
              className="w-full bg-green-500 text-black font-medium text-sm px-4 py-2 rounded-md hover:bg-green-400 transition-colors"
            >
              Log in
            </button>
          </form>
        </Panel>
      </div>
    </main>
  );
}