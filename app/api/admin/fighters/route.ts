import { NextResponse } from 'next/server';
import { supabaseRequest } from '../../../lib/supabase-admin';

export async function GET() {
  try {
    const response = await supabaseRequest('fighters?select=*&order=points.desc');
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json();
    await supabaseRequest('fighters', {
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
  try {
    const payload = await request.json();
    const alias = payload.alias;
    if (!alias) return NextResponse.json({ error: 'alias requerido' }, { status: 400 });

    await supabaseRequest(`fighters?alias=eq.${encodeURIComponent(alias)}`, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const alias = searchParams.get('alias');
    if (!alias) return NextResponse.json({ error: 'alias requerido' }, { status: 400 });

    await supabaseRequest(`fighters?alias=eq.${encodeURIComponent(alias)}`, { method: 'DELETE' });
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
