'use client';

import { Suspense, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createSupabaseBrowserClient } from '../../lib/supabase-browser';

const supabase = createSupabaseBrowserClient();

function AdminLoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function login() {
    setError('');
    setLoading(true);
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });
    setLoading(false);

    if (signInError) {
      setError(signInError.message);
      return;
    }

    const next = searchParams.get('next');
    router.replace(next && next.startsWith('/admin') ? next : '/admin');
    router.refresh();
  }

  return (
    <section className="panel mx-auto max-w-xl rounded-md p-6 sm:p-8">
      <p className="text-xs tracking-[0.16em] text-zinc-500">ADMIN ACCESS</p>
      <h1 className="font-title mt-1 text-5xl tracking-[0.14em] text-gold">Login Admin</h1>
      <p className="mt-3 text-sm text-zinc-400">Accede con tu usuario administrador.</p>
      {error && <p className="mt-3 rounded border border-blood/40 bg-blood/10 px-3 py-2 text-sm text-red-200">{error}</p>}
      <div className="mt-5 grid gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email admin" className="w-full rounded border border-zinc-700 bg-black/40 px-3 py-2 text-sm" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Contrasena" className="w-full rounded border border-zinc-700 bg-black/40 px-3 py-2 text-sm" />
        <button disabled={loading} onClick={login} className="rounded border border-blood bg-blood/20 px-4 py-2 text-sm hover:bg-blood/35 disabled:opacity-60">
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </div>
    </section>
  );
}

function LoginFallback() {
  return (
    <section className="panel mx-auto max-w-xl rounded-md p-6 sm:p-8">
      <p className="text-sm text-zinc-400">Cargando login...</p>
    </section>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense fallback={<LoginFallback />}>
      <AdminLoginForm />
    </Suspense>
  );
}

