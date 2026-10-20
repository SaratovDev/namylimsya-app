'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Map from './Map';
import Countdown from './Countdown';
import { User } from '@supabase/supabase-js';

interface EventCardProps {
  id: string;
  organizerId: string;
  category: string;
  date: string;
  dateTime: string;
  spots: string;
  title: string;
  description: string;
  organizerName: string;
  organizerRank: string;
  isFull?: boolean;
  location: string;
  lat?: number;
  lng?: number;
  hideLocation?: boolean;
}

export default function EventCard({
  id,
  organizerId,
  category,
  dateTime,
  spots,
  title,
  description,
  organizerName,
  organizerRank,
  isFull = false,
  location,
  lat,
  lng,
  hideLocation = false,
}: EventCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [application, setApplication] = useState<{ id: string; status: string } | null>(null);
  const [activeAppsCount, setActiveAppsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkUserAndApplication = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('applications')
          .select('id, status')
          .eq('event_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        setApplication(data);

        const { count } = await supabase
          .from('applications')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .in('status', ['pending', 'approved']);
        
        setActiveAppsCount(count || 0);
      }
    };
    checkUserAndApplication();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      router.push('/login');
      return;
    }

    if (activeAppsCount >= 3) {
      alert('Вы достигли лимита в 3 активные заявки. Дождитесь подтверждения или отмените старую заявку.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase
      .from('applications')
      .insert([{ event_id: id, user_id: user.id, status: 'pending' }])
      .select('id, status')
      .single();

    if (!error && data) {
      setApplication(data);
      setActiveAppsCount(prev => prev + 1);
      
      await supabase.from('notifications').insert({
        user_id: organizerId,
        content: `На ваше событие «${title}» отправлена новая заявка!`,
        link: `/my-events`
      });
    } else {
      alert('Ошибка при подаче заявки');
      console.error(error);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm('Вы уверены, что хотите отменить заявку?')) return;
    if (!application?.id) return;

    setIsCanceling(true);
    try {
      const { error } = await supabase
        .from('applications')
        .delete()
        .eq('id', application.id);
        
      if (error) throw error;
      
      setApplication(null);
      setActiveAppsCount(prev => prev - 1);
    } catch {
      alert('Не удалось отменить заявку');
    } finally {
      setIsCanceling(false);
    }
  };

  const [isCanceling, setIsCanceling] = useState(false);

  // Логика отображения кнопки
  let buttonText = 'Хочу участвовать';
  let buttonDisabled = isFull || loading;
  let buttonClass = 'bg-brand-accent text-brand-accent-ink hover:bg-brand-text hover:text-brand-bg';

  const isOrganizer = user?.id === organizerId;
  const isLimitReached = activeAppsCount >= 3 && !application;

  if (isOrganizer) {
    buttonText = 'Это ваше событие';
    buttonDisabled = true;
    buttonClass = 'bg-brand-surface text-brand-muted border-brand-muted cursor-default';
  } else if (isLimitReached) {
    buttonText = 'Лимит заявок (3)';
    buttonDisabled = true;
    buttonClass = 'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  } else if (application?.status === 'pending') {
    buttonText = 'Заявка отправлена';
    buttonDisabled = true;
    buttonClass = 'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  } else if (application?.status === 'approved') {
    buttonText = 'Вы записаны ✓';
    buttonDisabled = true;
    buttonClass = 'bg-green-600 text-white border-green-800 cursor-default';
  } else if (isFull) {
    buttonText = 'Мест нет';
    buttonDisabled = true;
    buttonClass = 'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  }

  // Форматируем дату для левой колонки
  const d = new Date(dateTime);
  const dayNumber = d.getDate();
  const monthName = d.toLocaleDateString('ru-RU', { month: 'long' }); // "октября"
  const timeOnly = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  return (
    <article className="bg-brand-surface border-2 border-brand-line rounded-brand-lg flex flex-col sm:flex-row overflow-hidden hover:opacity-95 transition-opacity w-full">
      
      {/* ЛЕВАЯ КОЛОНКА: ДАТА */}
<div className="bg-brand-bg/50 p-4 sm:w-[140px] flex-shrink-0 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-start border-b-2 sm:border-b-0 sm:border-r-2 border-brand-line gap-2 sm:gap-0">
  <div className="flex flex-row sm:flex-col items-baseline sm:items-start gap-2 sm:gap-0">
    <span className="text-4xl font-extrabold leading-none text-brand-text">{dayNumber}</span>
    <span className="text-sm font-bold text-brand-muted sm:mt-1">{monthName}</span>
  </div>

        
        <div className="flex flex-col items-end sm:items-start sm:mt-4">
          <span className="text-sm font-extrabold text-brand-text">{timeOnly}</span>
          <div className="mt-1">
            <Countdown targetDate={dateTime} />
          </div>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА: КОНТЕНТ */}
      <div className="p-5 md:p-6 flex-grow flex flex-col min-w-0">
        
        {/* Верхняя строка: Категория и Места */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-4 sm:mb-4">
          <span className="text-[11px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2 py-0.5 rounded border border-brand-cat/30 w-fit">
            {category}
          </span>
          <span className={`sm:ml-auto text-[12px] font-extrabold px-2 py-0.5 rounded border border-brand-line/30 w-fit ${isFull ? 'text-brand-muted bg-brand-bg line-through' : 'bg-brand-bg'}`}>
            {isFull ? 'Мест нет' : `Мест осталось: ${spots.replace('Осталось: ', '')}`}
          </span>
        </div>

        {/* Организатор */}
        <div className="flex items-center gap-2 text-sm mb-5 mt-auto">
          <span className="w-6 h-6 flex items-center justify-center rounded-full bg-brand-cat-soft text-brand-cat border border-brand-cat font-extrabold text-[10px] uppercase">
            {organizerName.charAt(0)}
          </span>
          <Link href={`/@${organizerName}`} className="text-brand-text hover:text-brand-accent transition-colors font-bold">
            {organizerName}
          </Link> 
          <span className="text-brand-accent font-extrabold text-[11px] uppercase">{organizerRank}</span>
        </div>


        {/* Заголовок */}
        <Link href={`/event/${id}`} className="block hover:text-brand-accent transition-colors mt-2">
          <h2 className="text-xl md:text-2xl font-extrabold leading-tight">
            {title}
          </h2>
        </Link>

        {/* Место */}
        <div className="flex items-center gap-1.5 text-[13px] font-medium text-brand-muted mt-2 mb-3">
            <svg
            width="32"
            height="32"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z" />
            <circle cx="12" cy="9" r="2.5" />
          </svg>
          <span className="truncate">
            {hideLocation && !isOrganizer && application?.status !== 'approved' 
              ? 'Место скрыто организатором' 
              : location}
          </span>
        </div>

        {/* Описание */}
        <p className="text-[16px] text-brand-text/120 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        
        {/* Кнопки */}
        <div className="flex flex-wrap gap-2 mt-auto">
          <button 
            onClick={handleApply}
            disabled={buttonDisabled}
            className={`flex-1 font-extrabold text-[13px] uppercase px-4 py-2 border-2 border-brand-line rounded-brand transition-colors ${buttonClass}`}
          >
            {buttonText}
          </button>
          
          {(application || isOrganizer) && (
            <Link 
              href={`/event/${id}`}
              className="bg-brand-surface text-brand-text font-extrabold text-[13px] uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-cat-soft transition-colors flex items-center justify-center"
            >
              Чат события
            </Link>
          )}
          
          {application?.status === 'pending' && (
            <button 
              onClick={handleCancel}
              disabled={isCanceling}
              className="bg-red-100 text-red-700 font-extrabold text-[13px] uppercase px-4 py-2 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors disabled:opacity-50"
              title="Отменить заявку"
            >
              ✕
            </button>
          )}
        </div>

        {/* Карта (если есть координаты) */}
        {lat && lng && (
          <details className="mt-4 border-t border-dashed border-brand-line/30 pt-3">
            <summary className="list-none cursor-pointer text-brand-muted hover:text-brand-accent font-bold text-[12px] uppercase transition-colors flex items-center gap-1">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"></polygon></svg>
              Показать на карте
            </summary>
            <div className="mt-3">
              <Map 
                lat={lat} 
                lng={lng} 
                title={title} 
                hideExactLocation={hideLocation && !isOrganizer && application?.status !== 'approved'} 
              />
              
              {hideLocation && !isOrganizer && application?.status !== 'approved' && (
                <div className="mt-2 p-2 bg-brand-heat/10 border border-brand-heat rounded-brand text-brand-text font-bold text-[11px]">
                  Точное место откроется после подтверждения заявки.
                </div>
              )}
            </div>
          </details>
        )}
        
      </div>
    </article>
  );
}