'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
}: EventCardProps) {
  const [user, setUser] = useState<any>(null);
  const [application, setApplication] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    // Проверяем авторизацию и наличие заявки
    const checkUserAndApplication = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from('applications')
          .select('status')
          .eq('event_id', id)
          .eq('user_id', user.id)
          .single();
        setApplication(data);
      }
    };
    checkUserAndApplication();
  }, [id]);

  const handleApply = async () => {
    if (!user) {
      // Если не залогинен, отправляем на страницу входа
      router.push('/login');
      return;
    }

    setLoading(true);
    const { error } = await supabase
      .from('applications')
      .insert([{ event_id: id, user_id: user.id, status: 'pending' }]);

    if (!error) {
      setApplication({ status: 'pending' });
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

  const isOrganizer = user?.id === organizerId; // <--- Проверка на организатора

  if (isOrganizer) {
    buttonText = 'Это ваше событие';
    buttonDisabled = true;
    buttonClass = 'bg-brand-surface text-brand-muted border-brand-muted cursor-default';
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
      
      <h2 className="text-2xl font-extrabold leading-tight mb-2">
        {title}
      </h2>
      
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

      <div className="flex flex-wrap gap-3 border-t-2 border-dashed border-brand-line pt-4">
        <button 
          onClick={handleApply}
          disabled={buttonDisabled}
          className={`flex-1 font-extrabold text-sm uppercase px-4 py-2.5 border-2 border-brand-line rounded-brand transition-colors ${buttonClass}`}
        >
          {buttonText}
        </button>
        
        {application?.status === 'approved' && (
          <button className="bg-brand-surface text-brand-text font-extrabold text-sm uppercase px-4 py-2.5 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors">
            Чат события
          </button>
        )}
      </div>
    </article>
  );
}