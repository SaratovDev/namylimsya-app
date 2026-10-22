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

  if (authError || !user) throw new Error('Необходимо войти в аккаунт');

  // 1. Собираем "сырые" данные из формы (date и time отдельно)
  const dateStr = formData.get('date') as string | null;
  const timeStr = formData.get('time') as string | null;
  
  // Проверяем наличие даты/времени до сборки
  if (!dateStr || !timeStr) {
    throw new Error('Укажите дату и время события');
  }

  // 2. Формируем объект для валидации (включая объединение даты и времени)
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    location: formData.get('location'),
    max_participants: formData.get('max_participants'),
    lat: formData.get('lat') || null,
    lng: formData.get('lng') || null,
    date_time: `${dateStr}T${timeStr}`, // Получится, например, "2026-10-25T18:30"
    hide_location: formData.get('hide_location') === 'on',
  };

  // 3. Валидируем данные с помощью Zod
  const result = createEventSchema.safeParse(rawData);
  
  if (!result.success) {
    // Достаем первую ошибку, чтобы показать пользователю
  const firstError = result.error.issues[0]?.message || 'Некорректные данные';
    throw new Error(firstError);
  }

  const { title, description, category, location, max_participants, lat, lng, date_time, hide_location } = result.data;

  // 4. Получаем никнейм организатора
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const organizerName = profile?.username || 'Пользователь';

  // 5. Вставляем только проверенные данные
  const { error } = await supabase
    .from('events')
    .insert([{
      title,
      description,
      category,
      date_time,
      location,
      lat,
      lng,
      max_participants,
      hide_location,
      organizer_name: organizerName,
      organizer_id: user.id,
      organizer_rank: 'Инициатор', // Жестко задано на сервере
    }]);

  if (error) {
    console.error('Ошибка создания события:', error);
    throw new Error('Не удалось создать событие');
  }

  revalidatePath('/');
}

// --- НОВОЕ: Подача заявки на сервере ---
export async function applyToEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

    // НОВАЯ ПРОВЕРКА: не организатор ли это?
  const { data: eventCheck } = await supabase
    .from('events')
    .select('organizer_id')
    .eq('id', eventId)
    .single();

  if (eventCheck?.organizer_id === user.id) {
    throw new Error('Вы не можете подать заявку на свое же событие');
  }

  // 1. Проверяем лимит в 3 активные заявки
  const { count, error: countError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['pending', 'approved']);

  if (countError) throw new Error('Ошибка проверки лимита');
  if (count && count >= 3) throw new Error('Вы достигли лимита в 3 активные заявки');

  // 2. Подаем заявку (статус и user_id жестко заданы на сервере)
  const { error } = await supabase.from('applications').insert([{
    event_id: eventId,
    user_id: user.id,
    status: 'pending'
  }]);

  if (error) {
    if (error.code === '23505') throw new Error('Вы уже подали заявку на это событие');
    throw new Error('Ошибка подачи заявки');
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
}

// --- НОВОЕ: Отмена заявки ---
export async function cancelApplication(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) throw new Error('Не удалось отменить заявку');
  
  revalidatePath('/');
  revalidatePath('/my-events');
}

// --- ОБНОВЛЕНО: Подтверждение заявки (вызов RPC) ---
export async function approveApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  // Вызываем RPC функцию
  const { error } = await supabase.rpc('approve_application', { app_id: applicationId });
  
  if (error) {
    // Переводим техническую ошибку в понятную
    if (error.message.includes('больше нет свободных мест')) throw new Error('Мест больше нет');
    throw new Error('Не удалось подтвердить заявку');
  }

  revalidatePath('/my-events');
  revalidatePath('/');
}

// --- ОБНОВЛЕНО: Отклонение заявки (вызов RPC) ---
export async function rejectApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  // Вызываем RPC функцию
  const { error } = await supabase.rpc('reject_application', { app_id: applicationId });
  
  if (error) {
    if (error.message.includes('уже обработана')) throw new Error('Эта заявка уже обработана');
    throw new Error('Не удалось отклонить заявку');
  }

  revalidatePath('/my-events');
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