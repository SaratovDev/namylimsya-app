// lib/event-queries.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApplicationStatus, EventListItemDTO } from './event-dto';
import { type ViewerContext, canSeeExactLocation } from './event-access';
import { getBadgeStatus, ORGANIZER_BADGES } from './achievements';

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
  status: string;
  cancel_reason: string | null;
  location: string;
  lat: number | null;
  lng: number | null;
  hide_location: boolean;
  is_full: boolean;
  city: string | null;
  profiles?: { avatar_url: string | null; gender: string | null } | { avatar_url: string | null; gender: string | null }[] | null;
};

export async function getEventListDTOs(
  supabase: SupabaseClient,
  viewer: ViewerContext,
  limit: number = 10,
  offset: number = 0,
  isArchive: boolean = false,
  
  filters?: { category?: string; dateFrom?: string; dateTo?: string; city?: string }
): Promise<{ items: EventListItemDTO[]; total: number }> {
  
  // 1. Запрос с пагинацией и правильной фильтрацией
  let query = supabase
  
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
      status,
      cancel_reason,
      city,
      profiles ( avatar_url, gender )
    `,
      { count: 'exact' }
    );
  // Применяем фильтр по городу
  if (filters?.city) {
    query = query.eq('city', filters.city);
  }
  // Применяем фильтр по категории (если выбрано несколько, они придут через запятую)
  if (filters?.category && filters.category !== 'Все') {
    const categoriesArray = filters.category.split(',');
    if (categoriesArray.length > 1) {
      query = query.in('category', categoriesArray); // Множественный выбор
    } else {
      query = query.eq('category', categoriesArray[0]); // Одна категория
    }
  }

  // Применяем фильтр по дате "От"
  if (filters?.dateFrom) {
    // Нам нужно, чтобы событие начиналось не раньше начала выбранного дня
    const fromDate = new Date(filters.dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    query = query.gte('date_time', fromDate.toISOString());
  }

  // Применяем фильтр по дате "До"
  if (filters?.dateTo) {
    // Нам нужно, чтобы событие начиналось не позже конца выбранного дня (23:59:59)
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    query = query.lte('date_time', toDate.toISOString());
  }

  if (isArchive) {
    const now = new Date().toISOString();
    query = query.or(`date_time.lt.${now},status.eq.cancelled`);
  } else {
    query = query.gte('date_time', new Date().toISOString()).eq('status', 'active');
  }

  const { data, error, count } = await query
    .order('date_time', { ascending: !isArchive })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  
  const events = (data ?? []) as unknown as EventRow[];
  if (events.length === 0) {
    return { items: [], total: count || 0 };
  }

  const ids = events.map((e) => e.id);

  // 2. Считаем количество прошедших событий для каждого организатора
  const organizerIds = [...new Set(events.map(e => e.organizer_id))];
  const orgPastEventsCount = new Map<string, number>();
  
  if (organizerIds.length > 0) {
    const { data: orgPastEvents } = await supabase
      .from('events')
      .select('organizer_id')
      .in('organizer_id', organizerIds)
      .lt('date_time', new Date().toISOString())
      .eq('status', 'active');
      
    orgPastEvents?.forEach(e => {
      orgPastEventsCount.set(e.organizer_id, (orgPastEventsCount.get(e.organizer_id) || 0) + 1);
    });
  }

  // 3. Агрегат approved
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

  // 4. Мои заявки
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

  // 5. Считаем непрочитанные
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
      let msgQuery = supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .neq('user_id', viewer.userId);

      if (lastRead) {
        msgQuery = msgQuery.gt('created_at', lastRead);
      }
      
      const { count: msgCount } = await msgQuery;
      if (msgCount && msgCount > 0) {
        unreadCounts.set(eventId, msgCount);
      }
    }
  }

  // 6. Сборка DTO
  const items = events.map((e): EventListItemDTO => {
    const myApp = myStatus.get(e.id) ?? null;
    const allowed = canSeeExactLocation(e, viewer, myApp);
    const approved = approvedCount.get(e.id) ?? 0;
    const isFull = Boolean(e.is_full) || approved >= e.max_participants;
    const profile = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles;

    // Вычисляем динамический ранг организатора на лету
    const pastCount = orgPastEventsCount.get(e.organizer_id) || 0;
    const dynamicRank = getBadgeStatus(pastCount, ORGANIZER_BADGES).current?.title || 'Новичок';

    const dto: EventListItemDTO = {
      id: e.id,
      organizerId: e.organizer_id,
      category: e.category,
      dateTime: e.date_time,
      title: e.title,
      description: e.description,
      organizerName: e.organizer_name,
      organizerRank: dynamicRank, // <--- ИСПОЛЬЗУЕМ ВЫЧИСЛЕННЫЙ РАНГ
      maxParticipants: e.max_participants,
      approvedParticipantsCount: approved,
      isFull,
      publicLocationLabel: e.hide_location
        ? 'Место скрыто организатором'
        : e.location,
      locationIsHidden: e.hide_location,
      status: e.status as 'active' | 'cancelled',
      cancelReason: e.cancel_reason,
      city: e.city,
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