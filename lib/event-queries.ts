// lib/event-queries.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApplicationStatus, EventListItemDTO } from './event-dto';
import { type ViewerContext, canSeeExactLocation } from './event-access';

type EventRow = {
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
  profiles?: { avatar_url: string | null; gender: string | null } | { avatar_url: string | null; gender: string | null }[] | null;
};

export async function getEventListDTOs(
  supabase: SupabaseClient,
  viewer: ViewerContext,
  limit: number = 10,
  offset: number = 0
): Promise<{ items: EventListItemDTO[]; total: number }> {
  // 1. Запрос с пагинацией
  const { data, error, count } = await supabase
    .from('events')
    .select(
      `
      id,
      organizer_id,
      category,
      date_time,
      title,
      description,
      organizer_name,
      organizer_rank,
      max_participants,
      location,
      lat,
      lng,
      hide_location,
      is_full,
      profiles!events_organizer_profile_fkey ( avatar_url, gender )
    `,
      { count: 'exact' }
    )
    .order('date_time', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  const events = (data ?? []) as unknown as EventRow[];
  
  if (events.length === 0) {
    return { items: [], total: count || 0 };
  }

  const ids = events.map((e) => e.id);

  // 2. Агрегат approved
  const approvedCount = new Map<string, number>();
  {
    const { data: approvedRows } = await supabase
      .from('applications')
      .select('event_id')
      .in('event_id', ids)
      .eq('status', 'approved');
    for (const r of approvedRows ?? []) {
      approvedCount.set(r.event_id, (approvedCount.get(r.event_id) ?? 0) + 1);
    }
  }

  // 3. Мои заявки
  const myStatus = new Map<string, ApplicationStatus>();
  if (viewer.kind === 'user') {
    const { data: myApps } = await supabase
      .from('applications')
      .select('event_id, status')
      .in('event_id', ids)
      .eq('user_id', viewer.userId);
    for (const a of myApps ?? []) {
      if (a.status === 'pending' || a.status === 'approved' || a.status === 'rejected') {
        myStatus.set(a.event_id, a.status);
      }
    }
  }

  // 4. Считаем непрочитанные (ДО маппинга!)
  const unreadCounts = new Map<string, number>();
  if (viewer.kind === 'user') {
    const { data: reads } = await supabase
      .from('chat_reads')
      .select('event_id, last_read_at')
      .in('event_id', ids)
      .eq('user_id', viewer.userId);

    const readMap = new Map(reads?.map(r => [r.event_id, r.last_read_at]) || []);

    for (const eventId of ids) {
      const lastRead = readMap.get(eventId);
      let query = supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .neq('user_id', viewer.userId);

      if (lastRead) {
        query = query.gt('created_at', lastRead);
      }
      
      const { count: msgCount } = await query;
      if (msgCount && msgCount > 0) {
        unreadCounts.set(eventId, msgCount);
      }
    }
  }

  // 5. Сборка DTO (после того, как всё посчитано)
  const items = events.map((e): EventListItemDTO => {
    const myApp = myStatus.get(e.id) ?? null;
    const allowed = canSeeExactLocation(e, viewer, myApp);
    const approved = approvedCount.get(e.id) ?? 0;
    const isFull = Boolean(e.is_full) || approved >= e.max_participants;
    const profile = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles;

    const dto: EventListItemDTO = {
      id: e.id,
      organizerId: e.organizer_id,
      category: e.category,
      dateTime: e.date_time,
      title: e.title,
      description: e.description,
      organizerName: e.organizer_name,
      organizerRank: e.organizer_rank,
      maxParticipants: e.max_participants,
      approvedParticipantsCount: approved,
      isFull,
      publicLocationLabel: e.hide_location
        ? 'Место скрыто организатором'
        : e.location,
      locationIsHidden: e.hide_location,
      myApplicationStatus: myApp,
      isOrganizer: viewer.kind === 'user' && viewer.userId === e.organizer_id,
      organizerAvatar: profile?.avatar_url ?? null,
      organizerGender: profile?.gender ?? null,
      unreadCount: unreadCounts.get(e.id) ?? 0,
    };

    if (allowed) {
      dto.exactLocation = e.location;
      if (typeof e.lat === 'number') dto.lat = e.lat;
      if (typeof e.lng === 'number') dto.lng = e.lng;
    }

    return dto;
  });

  return { items, total: count || 0 };
}