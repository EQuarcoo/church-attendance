import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

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
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-md p-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Staff Login</h1>

        {error && (
          <p className="bg-red-50 text-red-700 text-sm rounded-md px-3 py-2 mb-4">{error}</p>
        )}

        <form action={login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              name="password"
              required
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-medium rounded-md px-4 py-2 hover:bg-blue-700 transition-colors"
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
}