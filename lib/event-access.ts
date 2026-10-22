// lib/event-access.ts
import type { SupabaseClient } from '@supabase/supabase-js';

export type EventRowForAccess = {
  organizer_id: string;
  hide_location: boolean;
};

export type EventRow = {
  id: string;
  organizer_id: string;
  category: string;
  date_time: string;
  title: string;
  description: string;
  organizer_name: string;
  organizer_rank: string;
  max_participants: number;
  location: string;
  lat: number | null;
  lng: number | null;
  hide_location: boolean;
  is_full: boolean;
};

export type ViewerContext =
  | { kind: 'anonymous' }
  | { kind: 'user'; userId: string };

export async function getViewer(
  supabase: SupabaseClient
): Promise<ViewerContext> {
  const { data: { user } } = await supabase.auth.getUser();
  return user ? { kind: 'user', userId: user.id } : { kind: 'anonymous' };
}

// Право видеть точное место у конкретного события
export function canSeeExactLocation(
  event: Pick<EventRow, 'organizer_id' | 'hide_location'>,
  viewer: ViewerContext,
  myApplicationStatus: 'pending' | 'approved' | 'rejected' | null
): boolean {
  if (viewer.kind === 'user' && viewer.userId === event.organizer_id) return true;
  if (!event.hide_location) return true;
  return myApplicationStatus === 'approved';
}