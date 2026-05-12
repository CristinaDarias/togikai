import { NextResponse } from 'next/server';
import { requireSupabaseAdmin } from '../../../lib/admin-supabase-auth';
import { supabaseRequest } from '../../../lib/supabase-admin';

export async function GET(request: Request) {
  const auth = await requireSupabaseAdmin(request);
  if (auth) return auth;

  try {
    const response = await supabaseRequest('calendar_events?select=*&order=event_date.asc,event_time.asc');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  const auth = await requireSupabaseAdmin(request);
  if (auth) return auth;

  try {
    const payload = await request.json();
    await supabaseRequest('calendar_events', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(payload),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  const auth = await requireSupabaseAdmin(request);
  if (auth) return auth;

  try {
    const payload = await request.json();
    const { id, ...updates } = payload as Record<string, unknown>;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ error: 'Falta id del evento' }, { status: 400 });
    }

    await supabaseRequest(`calendar_events?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const auth = await requireSupabaseAdmin(request);
  if (auth) return auth;

  try {
    const url = new URL(request.url);
    const id = url.searchParams.get('id');

    if (!id) return NextResponse.json({ error: 'Falta id del evento' }, { status: 400 });

    await supabaseRequest(`calendar_events?id=eq.${encodeURIComponent(id)}`, {
      method: 'DELETE',
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
