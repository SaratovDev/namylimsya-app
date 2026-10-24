import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || undefined;
  const dateFrom = searchParams.get('date_from') || undefined;
  const dateTo = searchParams.get('date_to') || undefined;
  const city = searchParams.get('city') || undefined; // <--- 1. ЧИТАЕМ ГОРОД

  const limit = 10;
  const offset = (page - 1) * limit;

  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  try {
    const result = await getEventListDTOs(supabase, viewer, limit, offset, false, {
      category,
      dateFrom,
      dateTo,
      city // <--- 2. ПЕРЕДАЕМ ГОРОД
    });

    return NextResponse.json(result);
  } catch (error) {
    // ...
  }
}