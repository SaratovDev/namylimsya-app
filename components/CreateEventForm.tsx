'use client';

import { useRef, useState, useEffect } from 'react';
import { createEvent } from '@/app/actions';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MapPicker from './MapPicker';
import { User } from '@supabase/supabase-js';

export default function CreateEventForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);
 const [user, setUser] = useState<User | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  
  // Стейты для карты (ВНУТРИ компонента!)
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [location, setLocation] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsCheckingAuth(false);
    });
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await createEvent(formData);
      formRef.current?.reset();
      setLocation(''); // Сбрасываем поле адреса после отправки
      setLat(null);
      setLng(null);
      alert('Событие успешно создано!');
      formRef.current?.closest('details')?.removeAttribute('open');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Ошибка при создании события';
      alert(message);
    } finally {
      setIsPending(false);
    }
  }

  if (isCheckingAuth) {
    return <div className="p-4 text-center font-bold text-brand-muted">Проверка авторизации...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="font-bold text-lg">Чтобы создать событие, нужно войти в аккаунт.</p>
        <Link href="/login" className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors">
          Войти или зарегистрироваться
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
      
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-extrabold uppercase text-brand-muted">Название</label>
        <input required name="title" type="text" placeholder="Например: Вечерняя прогулка" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Категория</label>
          <select name="category" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors">
            <option>Прогулки</option>
            <option>Спорт</option>
            <option>Культура</option>
            <option>Еда/напитки</option>
            <option>Обучение</option>
            <option>Поездки</option>
            <option>Волонтёрство</option>
            <option>Здесь и сейчас</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Лимит участников</label>
          <input required name="max_participants" type="number" min="1" defaultValue="10" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-extrabold uppercase text-brand-muted">Описание</label>
        <textarea required name="description" rows={3} placeholder="Расскажите, что будет происходить..." className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-y"></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Дата</label>
          <input required name="date" type="date" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Время</label>
          <input required name="time" type="time" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-extrabold uppercase text-brand-muted">Место (кликните на карту)</label>
        <input 
          required 
          name="location" 
          type="text" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Например: Парк Горького" 
          className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
        />
        
        <input type="hidden" name="lat" value={lat || ''} />
        <input type="hidden" name="lng" value={lng || ''} />

        <div className="mt-2">
        <MapPicker 
          onLocationSelect={(selectedLat: number, selectedLng: number, address: string) => {
            setLat(selectedLat);
            setLng(selectedLng);
            setLocation(address);
          }} 
        />
        </div>
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer mt-2">
        <input type="checkbox" name="hide_location" className="w-5 h-5 accent-brand-accent" />
        <span className="text-sm font-bold">Скрыть точное место до подтверждения заявки</span>
      </label>

      <button 
        type="submit" 
        disabled={isPending}
        className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Публикуем...' : 'Опубликовать событие'}
      </button>
    </form>
  );
}