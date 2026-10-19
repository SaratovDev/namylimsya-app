'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Map from './Map';
import Countdown from './Countdown';

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
  date,
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
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
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
          .select('status')
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
    const { error } = await supabase
      .from('applications')
      .insert([{ event_id: id, user_id: user.id, status: 'pending' }]);

    if (!error) {
      setApplication({ status: 'pending' });
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

  // Разбиваем строку даты для левой колонки
  // Ожидаем формат: "сб, 17 октября · 12:32"
  const dateParts = date.split(' · ');
  const dateOnly = dateParts[0] || date;
  const timeOnly = dateParts[1] || '';
  
  // Извлекаем число и месяц
  const dateMatch = dateOnly.match(/(\d+)\s+([а-яА-Я]+)/);
  const dayNumber = dateMatch ? dateMatch[1] : '—';
  const monthName = dateMatch ? dateMatch[2].slice(0, 3) : '—';

  return (
   <article className="bg-brand-surface border-2 border-brand-line rounded-brand-lg flex flex-col sm:flex-row overflow-hidden hover:opacity-95 transition-opacity w-full max-w-[780px] mx-auto lg:mx-0">
      
      {/* ЛЕВАЯ КОЛОНКА: ДАТА */}
      <div className="bg-brand-bg/50 p-5 sm:w-[140px] flex-shrink-0 flex flex-row sm:flex-col justify-between sm:justify-center items-center sm:items-start border-b-2 sm:border-b-0 sm:border-r-2 border-brand-line gap-2">
        <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
          <span className="text-4xl font-extrabold leading-none text-brand-text">{dayNumber}</span>
          <span className="text-sm font-bold text-brand-muted uppercase sm:mt-1">{monthName}</span>
        </div>
        
        <div className="flex flex-col items-end sm:items-start sm:mt-3">
          {timeOnly && <span className="text-sm font-extrabold text-brand-text">{timeOnly}</span>}
          <Countdown targetDate={dateTime} />
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА: КОНТЕНТ */}
      <div className="p-5 flex-grow flex flex-col min-w-0">
        
        {/* Верхняя строка: Категория и Места */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="text-[11px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2 py-0.5 rounded border border-brand-cat/30">
            {category}
          </span>
          <span className={`ml-auto text-[12px] font-extrabold px-2 py-0.5 rounded border border-brand-line/30 ${isFull ? 'text-brand-muted bg-brand-bg line-through' : 'bg-brand-bg'}`}>
            {spots}
          </span>
        </div>

        {/* Заголовок */}
        <Link href={`/event/${id}`} className="block hover:text-brand-accent transition-colors mb-1">
          <h2 className="text-xl md:text-2xl font-extrabold leading-tight">
            {title}
          </h2>
        </Link>

        {/* Место */}
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-brand-muted mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span className="truncate">
            {hideLocation && !isOrganizer && application?.status !== 'approved' 
              ? 'Место скрыто организатором' 
              : location}
          </span>
        </div>

        {/* Описание */}
        <p className="text-[14px] text-brand-text/80 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

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