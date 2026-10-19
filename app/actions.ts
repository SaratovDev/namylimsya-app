'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Необходимо войти в аккаунт, чтобы создать событие');
  }

  // Получаем никнейм из профиля
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const organizerName = profile?.username || 'Пользователь';

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const location = formData.get('location') as string;
  const maxParticipants = parseInt(formData.get('max_participants') as string, 10);
  const hideLocation = formData.get('hide_location') === 'on';

  const dateTime = new Date(`${date}T${time}`).toISOString();

  const { error } = await supabase
    .from('events')
    .insert([
      {
        title,
        description,
        category,
        date_time: dateTime,
        location,
        max_participants: maxParticipants,
        hide_location: hideLocation,
        organizer_name: organizerName, 
          organizer_id: user.id, 
        organizer_rank: 'Инициатор',
      },
    ]);

  if (error) {
    console.error('Ошибка создания:', error);
    throw new Error('Не удалось создать событие');
  }

  revalidatePath('/');
}

export async function approveApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Не авторизован');

  // 1. Получаем список ID событий, которые принадлежат этому организатору
  const { data: userEvents } = await supabase
    .from('events')
    .select('id')
    .eq('organizer_id', user.id);

  if (!userEvents || userEvents.length === 0) {
    throw new Error('У вас нет созданных событий');
  }

  const eventIds = userEvents.map(e => e.id);

  // 2. Обновляем заявку, проверяя, что она относится к одному из этих событий
  const { error } = await supabase
    .from('applications')
    .update({ status: 'approved' })
    .eq('id', applicationId)
    .in('event_id', eventIds); // <--- Вот тут передаем массив ID

  if (error) {
    console.error("Ошибка обновления:", error);
    throw new Error('Не удалось подтвердить заявку');
  }
  
  revalidatePath('/my-events');
  revalidatePath('/');
}

export async function rejectApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('Не авторизован');

  // 1. Получаем ID событий пользователя
  const { data: userEvents } = await supabase
    .from('events')
    .select('id')
    .eq('organizer_id', user.id);

  if (!userEvents || userEvents.length === 0) {
    throw new Error('У вас нет созданных событий');
  }

  const eventIds = userEvents.map(e => e.id);

  // 2. Обновляем статус
  const { error } = await supabase
    .from('applications')
    .update({ status: 'rejected' })
    .eq('id', applicationId)
    .in('event_id', eventIds);

  if (error) {
    console.error("Ошибка обновления:", error);
    throw new Error('Не удалось отклонить заявку');
  }
  
  revalidatePath('/my-events');
}