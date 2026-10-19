import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import EventCard from '@/components/EventCard';
import Link from 'next/link';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', cleanUsername)
    .single();

  if (!profile) notFound();

  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', profile.id)
    .order('date_time', { ascending: true });

  // Выбираем цвет для аватарки-заглушки на основе первой буквы ника
  const avatarLetter = profile.username.charAt(0).toUpperCase();
  
  // Иконки пола
  const genderIcon = profile.gender === 'male' ? '♂' : profile.gender === 'female' ? '♀' : '';

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-10 min-h-screen">
      
      {/* Шапка профиля */}
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
        
        {/* Аватарка */}
        <div className="w-24 h-24 rounded-full bg-brand-cat-soft border-2 border-brand-line flex items-center justify-center text-4xl font-extrabold text-brand-cat flex-shrink-0 overflow-hidden">
          {profile.avatar_url ? (
            <img src={profile.avatar_url} alt={profile.username} className="w-full h-full object-cover" />
          ) : (
            avatarLetter
          )}
        </div>

        {/* Инфо */}
        <div className="text-center md:text-left flex-1">
          <h1 className="text-3xl font-extrabold uppercase mb-1 flex items-center justify-center md:justify-start gap-2">
            @{profile.username}
            {genderIcon && <span className="text-brand-accent text-xl">{genderIcon}</span>}
          </h1>
          <p className="text-brand-muted font-bold mb-4">Организатор событий в «Намылимся»</p>
          
          {profile.bio && (
            <p className="text-sm font-medium bg-brand-bg p-3 rounded-brand border-2 border-brand-line inline-block">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Созданные события</h2>
      
      <div className="flex flex-col gap-6">
        {(!events || events.length === 0) ? (
          <p className="text-brand-muted font-bold">Этот пользователь пока не создавал событий.</p>
        ) : (
          events.map((event) => (
             <EventCard 
               key={event.id}
               id={event.id}
               organizerId={event.organizer_id}
               category={event.category}
               date={new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })}
               countdown="Скоро"
               spots={event.is_full ? 'Мест нет' : `Осталось: ${event.max_participants}`}
               title={event.title}
               description={event.description}
               organizerName={event.organizer_name}
               organizerRank={event.organizer_rank}
               isFull={event.is_full}
             />
          ))
        )}
      </div>
    </main>
  );
}