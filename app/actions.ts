'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
  // Получаем данные из формы
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const location = formData.get('location') as string;
  const maxParticipants = parseInt(formData.get('max_participants') as string, 10);
  const hideLocation = formData.get('hide_location') === 'on';

  // Объединяем дату и время в один формат для базы
  const dateTime = new Date(`${date}T${time}`).toISOString();

  // Отправляем в Supabase
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
        organizer_name: 'Вадим', // Пока хардкод, позже заменим на авторизацию
        organizer_rank: 'Инициатор',
      },
    ]);

  if (error) {
    console.error('Ошибка создания:', error);
    throw new Error('Не удалось создать событие');
  }

  // Очищаем кэш главной страницы, чтобы новое событие сразу появилось
  revalidatePath('/');
}