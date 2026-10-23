'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

// --- Создание события (оставляем как было, доработаем в P1.4) ---
// app/actions.ts (начало файла — добавь импорт)
import { createEventSchema } from '@/lib/validations';

// ...

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) return { error: 'Необходимо войти в аккаунт' };

  // ПРОВЕРКА ЛИМИТА
  const { count: activeEvents, error: countError } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('organizer_id', user.id)
    .gte('date_time', new Date().toISOString());

  if (countError) return { error: 'Не удалось проверить лимит событий' };
  if (activeEvents && activeEvents >= 2) {
    return { error: 'У вас уже есть 2 активных события. Дождитесь их завершения, чтобы создать новое.' };
  }

  // 1. Сбор данных
  const dateStr = formData.get('date') as string | null;
  const timeStr = formData.get('time') as string | null;
  
  if (!dateStr || !timeStr) return { error: 'Укажите дату и время события' };

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    location: formData.get('location'),
    max_participants: formData.get('max_participants'),
    lat: formData.get('lat') || null,
    lng: formData.get('lng') || null,
    date_time: `${dateStr}T${timeStr}`,
    hide_location: formData.get('hide_location') === 'on',
    city: formData.get('city'),
  };

  // 2. Валидация
  const result = createEventSchema.safeParse(rawData);
  
  if (!result.success) {
    const firstError = result.error.issues[0]?.message || 'Некорректные данные';
    return { error: firstError };
  }

  const { title, description, city, category, location, max_participants, lat, lng, date_time, hide_location } = result.data;

  // 3. Никнейм организатора
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const organizerName = profile?.username || 'Пользователь';

  // 4. Вставка в БД
  const { error } = await supabase
    .from('events')
    .insert([{
      title, description, category, date_time, location, lat, lng, max_participants, hide_location,
      organizer_name: organizerName,
      organizer_id: user.id,
      organizer_rank: 'Инициатор',
      city,
    }]);

  if (error) {
    console.error('Ошибка создания события:', error);
    return { error: 'Не удалось создать событие' };
  }

  revalidatePath('/');
  return { success: true };
}

// --- НОВОЕ: Подача заявки на сервере ---
export async function applyToEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: eventCheck } = await supabase
    .from('events')
    .select('organizer_id')
    .eq('id', eventId)
    .single();

  if (eventCheck?.organizer_id === user.id) {
    return { error: 'Вы не можете подать заявку на свое же событие' };
  }

  // 1. Проверяем лимит в 3 активные заявки
  const { count, error: countError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['pending', 'approved']);

  if (countError) return { error: 'Ошибка проверки лимита' };
  if (count && count >= 3) return { error: 'Вы достигли лимита в 3 активные заявки' };

  // 2. Подаем заявку (статус и user_id жестко заданы на сервере)
  const { error } = await supabase.from('applications').insert([{
    event_id: eventId,
    user_id: user.id,
    status: 'pending'
  }]);

  if (error) {
    if (error.code === '23505') return { error: 'Вы уже подали заявку на это событие' };
    return { error: 'Ошибка подачи заявки' };
  }

  // 3. Уведомление организатору
  const { data: event } = await supabase.from('events').select('organizer_id, title').eq('id', eventId).single();
  if (event) {
    await supabase.from('notifications').insert({
      user_id: event.organizer_id,
      content: `На ваше событие «${event.title}» отправлена новая заявка!`,
      link: `/my-events`
    });
  }

  revalidatePath('/');
  revalidatePath('/my-events');
  return { success: true }; // Возвращаем успех
}

// --- НОВОЕ: Отмена заявки ---
export async function cancelApplication(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) return { error: 'Не удалось отменить заявку' };
  
  revalidatePath('/');
  revalidatePath('/my-events');
  return { success: true };
}

// --- ОБНОВЛЕНО: Подтверждение заявки (вызов RPC) ---
export async function approveApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { error } = await supabase.rpc('approve_application', { app_id: applicationId });
  
  if (error) {
    if (error.message.includes('больше нет свободных мест')) return { error: 'Мест больше нет' };
    return { error: 'Не удалось подтвердить заявку' };
  }

  revalidatePath('/my-events');
  revalidatePath('/');
  return { success: true };
}

// --- ОБНОВЛЕНО: Отклонение заявки (вызов RPC) ---
export async function rejectApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { error } = await supabase.rpc('reject_application', { app_id: applicationId });
  
  if (error) {
    if (error.message.includes('уже обработана')) return { error: 'Эта заявка уже обработана' };
    return { error: 'Не удалось отклонить заявку' };
  }

  revalidatePath('/my-events');
  return { success: true };
} 
// --- ОБНОВЛЕНО: Оставить отзыв ---
export async function leaveReview(eventId: string, rating: number, comment: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: event } = await supabase.from('events').select('organizer_id').eq('id', eventId).single();
  if (!event) return { error: 'Событие не найдено' };

  const { error } = await supabase.from('reviews').insert([{
    event_id: eventId,
    organizer_id: event.organizer_id,
    author_id: user.id,
    rating: rating,
    comment: comment.trim() || null,
  }]);

  if (error) {
    if (error.code === '23505') return { error: 'Вы уже оставляли отзыв на это событие' };
    if (error.code === '42501') return { error: 'Вы не можете оставить отзыв' };
    return { error: 'Не удалось сохранить отзыв' };
  }

  revalidatePath(`/event/${eventId}`);
  return { success: true };
}

export async function cancelEvent(eventId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: event } = await supabase
    .from('events')
    .select('id, organizer_id, title')
    .eq('id', eventId)
    .single();

  if (!event) return { error: 'Событие не найдено' };
  if (event.organizer_id !== user.id) return { error: 'Вы не являетесь организатором' };

  // Получаем имя орга для уведомления
  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  const orgName = profile?.username || 'Организатор';

  // Меняем статус на cancelled и сохраняем причину
  const { error } = await supabase
    .from('events')
    .update({ status: 'cancelled', cancel_reason: reason })
    .eq('id', eventId);

  if (error) return { error: 'Не удалось отменить событие' };

  // Рассылаем уведомления всем участникам (и pending, и approved)
  const { data: apps } = await supabase.from('applications').select('user_id').eq('event_id', eventId);
  
  if (apps && apps.length > 0) {
    const notifications = apps.map(app => ({
      user_id: app.user_id,
      content: `Организатор @${orgName} отменил событие «${event.title}». Причина: ${reason}`,
      link: `/event/${eventId}`
    }));
    await supabase.from('notifications').insert(notifications);
  }

  revalidatePath('/');
  revalidatePath('/my-events');
  return { success: true };
}

export async function cancelApprovedApplication(eventId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  // Получаем инфу о событии и пользователе
  const { data: event } = await supabase.from('events').select('organizer_id, title').eq('id', eventId).single();
  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  
  if (!event) return { error: 'Событие не найдено' };
  const userName = profile?.username || 'Пользователь';

  // Удаляем заявку (физически), так как человек передумал
  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) return { error: 'Не удалось отменить заявку' };

  // Уведомляем организатора
  await supabase.from('notifications').insert({
    user_id: event.organizer_id,
    content: `Участник @${userName} снял заявку на событие «${event.title}». Причина: ${reason}`,
    link: `/my-events`
  });
  
  revalidatePath('/');
  revalidatePath('/my-events');
  return { success: true };
}


// --- ЧАТ: Отметить как прочитанное ---
export async function markChatAsRead(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  // 1. Пробуем обновить существующую запись
  const { data: updated, error: updateError } = await supabase
    .from('chat_reads')
    .update({ last_read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('event_id', eventId)
    .select();

  if (updateError) {
    console.error('Ошибка обновления прочтения:', updateError);
    return;
  }

  // 2. Если записи не было (0 строк обновлено), создаем новую
  if (!updated || updated.length === 0) {
    const { error: insertError } = await supabase
      .from('chat_reads')
      .insert({ 
        user_id: user.id, 
        event_id: eventId, 
        last_read_at: new Date().toISOString() 
      });
      
    if (insertError) {
      console.error('Ошибка создания записи прочтения:', insertError);
    }
  }
}

// --- ЧАТ: Получить количество непрочитанных для списка событий ---
export async function getUnreadCounts(eventIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || eventIds.length === 0) return {};

  // 1. Получаем время последнего прочтения для каждого чата
  const { data: reads } = await supabase
    .from('chat_reads')
    .select('event_id, last_read_at')
    .in('event_id', eventIds)
    .eq('user_id', user.id);

  const readMap = new Map(reads?.map(r => [r.event_id, r.last_read_at]) || []);

  // 2. Считаем количество сообщений после времени прочтения для каждого чата
  const counts: Record<string, number> = {};
  
  for (const eventId of eventIds) {
    const lastRead = readMap.get(eventId);
    
    let query = supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .neq('user_id', user.id); // Не считаем свои сообщения

    if (lastRead) {
      query = query.gt('created_at', lastRead);
    }

    const { count } = await query;
    if (count && count > 0) {
      counts[eventId] = count;
    }
  }

  return counts;
  } 