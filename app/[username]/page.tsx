import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import EventCard from '@/components/EventCard';
import AvatarPicker from '@/components/AvatarPicker';
import Image from 'next/image';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  let cleanUsername = decodeURIComponent(username);
  if (cleanUsername.startsWith('@')) cleanUsername = cleanUsername.slice(1);
  
  const supabase = await createClient(); 
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Ищем профиль
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .ilike('username', cleanUsername)
    .single();

  if (!profile) notFound();

  const isOwnProfile = user?.id === profile.id;

  // 2. Получаем рейтинг организатора (вызов RPC)
  const { data: ratingData } = await supabase
    .rpc('get_organizer_rating', { org_id: profile.id })
    .single<{ average_rating: number; total_reviews: number }>();

  const rating = ratingData?.average_rating || 0;
  const reviewsCount = ratingData?.total_reviews || 0;

  // 3. Получаем безопасные DTO событий
  const viewer = await getViewer(supabase);
  const { items: allEvents } = await getEventListDTOs(supabase, viewer, 1000, 0);
  const userEvents = allEvents.filter(e => e.organizerId === profile.id);

  // 4. Получаем последние 5 отзывов для отображения
  const { data: recentReviews } = await supabase
    .from('reviews')
    .select(`
      id, rating, comment, created_at,
      events ( title ),
      author:profiles!reviews_author_id_fkey ( username, avatar_url )
    `)
    .eq('organizer_id', profile.id)
    .order('created_at', { ascending: false })
    .limit(5);

  const avatarLetter = profile.username.charAt(0).toUpperCase();
  const genderIcon = profile.gender === 'male' ? '♂' : profile.gender === 'female' ? '♀' : '';

  return (
    <main className="max-w-[1280px] mx-auto px-6 py-10 min-h-screen">
      
      {/* Шапка профиля */}
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 mb-8 flex flex-col md:flex-row items-center gap-6">
        
        {/* Аватарка */}
        <div className="flex flex-col items-center gap-3">
          <div className={`w-24 h-24 rounded-full border-2 border-brand-line flex items-center justify-center text-4xl font-extrabold flex-shrink-0 overflow-hidden
            ${profile.gender === 'male' ? 'bg-blue-100 text-blue-800' : 
              profile.gender === 'female' ? 'bg-pink-100 text-pink-800' : 
              'bg-gray-200 text-gray-700'}
          `}>
            {profile.avatar_url ? (
              <div className="w-full h-full">
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
          <p className="text-brand-muted font-bold mb-2">Организатор событий в «Намылимся»</p>
          
          {/* Плашка рейтинга */}
          {reviewsCount >= 3 ? (
            <div className="inline-flex items-center gap-1.5 bg-brand-bg px-3 py-1 rounded border-2 border-brand-line mb-4">
              <span className="text-yellow-500 text-lg leading-none">★</span>
              <span className="font-extrabold text-lg">{rating}</span>
              <span className="text-brand-muted text-sm font-bold">({reviewsCount} отзывов)</span>
            </div>
          ) : (
            <div className="inline-block bg-brand-bg px-3 py-1 rounded border-2 border-brand-line mb-4 text-sm font-bold text-brand-muted">
              Новый организатор
            </div>
          )}

          {profile.bio && (
            <p className="text-sm font-medium bg-brand-bg p-3 rounded-brand border-2 border-brand-line inline-block">
              {profile.bio}
            </p>
          )}
        </div>
      </div>

      {/* Блок отзывов */}
      {recentReviews && recentReviews.length > 0 && (
        <div className="mb-10">
          <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Последние отзывы</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
           
            {recentReviews.map((review: { id: string; rating: number; comment: string | null; created_at: string; events: any; author: any; }) => {
              const event = Array.isArray(review.events) ? review.events[0] : review.events;
              const author = Array.isArray(review.author) ? review.author[0] : review.author;
              
              return (
                <div key={review.id} className="bg-brand-surface border-2 border-brand-line rounded-brand p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm">@{author?.username || 'Пользователь'}</span>
                    <div className="flex text-yellow-500 text-sm">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <span key={i}>{i < review.rating ? '★' : '☆'}</span>
                      ))}
                    </div>
                  </div>
                  {event && <div className="text-[11px] text-brand-muted font-bold mb-2 uppercase">Событие: {event.title}</div>}
                  {review.comment && <p className="text-sm italic text-brand-text/80">`&quot`{review.comment}`&quot`</p>}
                </div>
              );
            })}
          </div>
        </div>
      )}

      <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Созданные события</h2>
      
      <div className="flex flex-col gap-6">
        {userEvents.length === 0 ? (
          <p className="text-brand-muted font-bold">Этот пользователь пока не создавал событий.</p>
        ) : (
          userEvents.map((item) => (
            <EventCard key={item.id} item={item} />
          ))
        )}
      </div>
    </main>
  );
}