import 'server-only';

import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

function getAdminEmailAllowlist() {
  return (process.env.ADMIN_EMAIL_ALLOWLIST ?? '')
    .split(',')
    .map((v) => v.trim().toLowerCase())
    .filter(Boolean);
}

function getBearerToken(request: Request) {
  const header = request.headers.get('authorization') ?? '';
  if (!header.toLowerCase().startsWith('bearer ')) return null;
  return header.slice(7).trim();
}

async function getSupabaseAdminUserFromToken(token: string) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !serviceKey) throw new Error('Supabase no configurado para validación admin');

  const supabase = createClient(url, serviceKey, { auth: { persistSession: false } });
  const { data, error } = await supabase.auth.getUser(token);
  if (error || !data.user) return null;
  return data.user;
}

export async function requireSupabaseAdmin(request: Request) {
  const token = getBearerToken(request);
  if (!token) return NextResponse.json({ error: 'No autorizado' }, { status: 401 });

  const user = await getSupabaseAdminUserFromToken(token);
  if (!user) return NextResponse.json({ error: 'Token inválido' }, { status: 401 });

  const allowlist = getAdminEmailAllowlist();
  if (allowlist.length > 0) {
    const email = user.email?.toLowerCase() ?? '';
    if (!allowlist.includes(email)) {
      return NextResponse.json({ error: 'Sin permisos de administrador' }, { status: 403 });
    }
  }

  return null;
}

