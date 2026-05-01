import { NextResponse } from 'next/server';
import { supabaseRequest, syncFighterRecordsFromFights } from '../../../lib/supabase-admin';

export async function GET() {
  try {
    const response = await supabaseRequest('fights?select=*&order=id.desc');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    await supabaseRequest('fights', {
      method: 'POST',
      headers: { Prefer: 'resolution=merge-duplicates' },
      body: JSON.stringify(payload),
    });
    await syncFighterRecordsFromFights();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = await request.json();
    const id = payload.id;
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    await supabaseRequest(`fights?id=eq.${encodeURIComponent(id)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    await syncFighterRecordsFromFights();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) return NextResponse.json({ error: 'id requerido' }, { status: 400 });

    await supabaseRequest(`fights?id=eq.${encodeURIComponent(id)}`, { method: 'DELETE' });
    await syncFighterRecordsFromFights();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

