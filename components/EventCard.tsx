'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Map from './Map';

interface EventCardProps {
  id: string;
  organizerId: string;
  category: string;
  date: string;
  countdown: string;
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
  countdown,
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
        // 1. Проверяем заявку на ЭТО событие
        const { data } = await supabase
          .from('applications')
          .select('status')
          .eq('event_id', id)
          .eq('user_id', user.id)
          .maybeSingle();
        setApplication(data);

        // 2. Считаем ВСЕ активные заявки пользователя
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
      
      // Уведомление организатору
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

  return (
    <article className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="text-[12px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2.5 py-1 rounded border border-brand-cat">
          {category}
        </span>
        <div className="text-[15px] font-extrabold flex items-center gap-2">
          {date}
          <span className="text-[12px] font-extrabold text-brand-accent-ink bg-brand-accent px-2 py-0.5 rounded">
            {countdown}
          </span>
        </div>
        <span className={`ml-auto text-[13px] font-extrabold px-2.5 py-1 rounded border-2 border-brand-line ${isFull ? 'text-brand-muted bg-brand-bg line-through' : 'bg-brand-bg'}`}>
          {spots}
        </span>
      </div>

      {/* НОВЫЙ БЛОК С МЕСТОМ */}
      <div className="mb-3 flex items-center gap-2 text-[14px] font-bold text-brand-muted">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
        {hideLocation && !isOrganizer && application?.status !== 'approved' 
          ? 'Место скрыто организатором' 
          : location}
      </div>
      
      <Link href={`/event/${id}`} className="block hover:text-brand-accent transition-colors">
        <h2 className="text-2xl font-extrabold leading-tight mb-2">
          {title}
        </h2>
      </Link>
      
      <p className="text-[15px] text-brand-text mb-4 line-clamp-3">
        {description}
      </p>

      <div className="flex items-center gap-2.5 text-sm text-brand-muted mb-4">
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-cat-soft text-brand-cat border-2 border-brand-cat font-extrabold text-sm uppercase">
          {organizerName.charAt(0)}
        </span>
        <span>
          <Link href={`/@${organizerName}`} className="text-brand-text hover:text-brand-accent transition-colors font-bold">
            {organizerName}
          </Link> 
          · <span className="text-brand-accent font-extrabold">{organizerRank}</span>
        </span>
      </div>

      {/* ЕДИНСТВЕННЫЙ БЛОК С КНОПКАМИ */}
      <div className="flex flex-wrap gap-3 border-t-2 border-dashed border-brand-line pt-4">
        <button 
          onClick={handleApply}
          disabled={buttonDisabled}
          className={`flex-1 font-extrabold text-sm uppercase px-4 py-2.5 border-2 border-brand-line rounded-brand transition-colors ${buttonClass}`}
        >
          {buttonText}
        </button>
        
        {(application || isOrganizer) && (
          <Link 
            href={`/event/${id}`}
            className="bg-brand-surface text-brand-text font-extrabold text-sm uppercase px-4 py-2.5 border-2 border-brand-line rounded-brand hover:bg-brand-cat-soft transition-colors flex items-center justify-center"
          >
            Чат события
          </Link>
        )}
      </div>

      {/* Блок с картой (аккордеон) */}
      {lat && lng && (
        <details className="mt-4 border-t-2 border-dashed border-brand-line pt-4">
          <summary className="list-none cursor-pointer text-brand-accent font-extrabold text-sm uppercase hover:underline">
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
              <div className="mt-2 p-3 bg-brand-heat/20 border-2 border-brand-heat rounded-brand text-brand-text font-bold text-xs">
                Точное место откроется после подтверждения заявки.
              </div>
            )}
          </div>
        </details>
      )}
      
    </article>
  );
}