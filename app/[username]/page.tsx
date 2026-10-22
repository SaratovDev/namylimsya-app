import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import EventCard from '@/components/EventCard';
import AvatarPicker from '@/components/AvatarPicker';
import Image from 'next/image';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  // 1. Декодируем URL (на случай, если Next.js не сделал этого автоматически)
  // и убираем собачку @, если она есть
  let cleanUsername = decodeURIComponent(username);
  if (cleanUsername.startsWith('@')) {
    cleanUsername = cleanUsername.slice(1);
  }
  
  const supabase = await createClient(); 
  
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Ищем профиль через ilike (регистронезависимый поиск)
  // Это спасет от проблем с регистром (Vasya и vasya) и частично с кодировкой
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', cleanUsername)
    .single();

  if (!profile) {
    console.error(`Профиль с ником "${cleanUsername}" не найден в БД`);
    notFound();
  }

  const isOwnProfile = user?.id === profile.id;

  // 3. Получаем безопасные DTO событий
  const viewer = await getViewer(supabase);
  const { items: allEvents } = await getEventListDTOs(supabase, viewer, 1000, 0);
  
  // Фильтруем события, оставляя только те, что создал этот пользователь
  const userEvents = allEvents.filter(e => e.organizerId === profile.id);

  const avatarLetter = profile.username.charAt(0).toUpperCase();
  const genderIcon = profile.gender === 'male' ? '♂' : profile.gender === 'female' ? '♀' : '';

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-10 min-h-screen">
      
      {/* Шапка профиля */}
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
        
        {/* Аватарка и кнопка смены */}
        <div className="flex flex-col items-center gap-3">
          <div className={`w-24 h-24 rounded-full border-2 border-brand-line flex items-center justify-center text-4xl font-extrabold flex-shrink-0 overflow-hidden
            ${profile.gender === 'male' ? 'bg-blue-100 text-blue-800' : 
              profile.gender === 'female' ? 'bg-pink-100 text-pink-800' : 
              'bg-gray-200 text-gray-700'}
          `}>
            {profile.avatar_url ? (
              <div className="w-1/2 h-1/2 flex items-center justify-center">
                <Image src={profile.avatar_url} alt={profile.username} width={96} height={96} className="w-full h-full object-cover" />
              </div>
            ) : (
              avatarLetter
            )}
          </div>
          
          {isOwnProfile && (
            <AvatarPicker 
              currentAvatar={profile.avatar_url} 
              gender={profile.gender} 
              username={profile.username} 
              userId={profile.id} 
            />
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
        {userEvents.length === 0 ? (
          <p className="text-brand-muted font-bold">Этот пользователь пока не создавал событий.</p>
        ) : (
          userEvents.map((item) => (
            <EventCard 
              key={item.id} 
              item={item} 
            />
          ))
        )}
      </div>
    </main>
  );
}