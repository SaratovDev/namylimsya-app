import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import EventCard from '@/components/EventCard';
import AvatarPicker from '@/components/AvatarPicker';
import Image from 'next/image';
import Link from 'next/link';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';
import { getBadgeStatus, ORGANIZER_BADGES, PARTICIPANT_BADGES } from '@/lib/achievements';

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
  const isFemale = profile.gender === 'female';
  const genderSuffix = isFemale ? 'а' : ''; 

  // 2. Получаем рейтинг
  const { data: ratingData } = await supabase
    .rpc('get_organizer_rating', { org_id: profile.id })
    .single<{ average_rating: number; total_reviews: number }>();

  const rating = ratingData?.average_rating || 0;
  const reviewsCount = ratingData?.total_reviews || 0;

  // 3. Получаем статистику (только ПРОШЕДШИЕ события)
  const now = new Date().toISOString();
  
  const { count: eventsOrganized } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('organizer_id', profile.id)
    .lt('date_time', now)
    .eq('status', 'active');

  const { data: approvedApps } = await supabase
    .from('applications')
    .select('event_id')
    .eq('user_id', profile.id)
    .eq('status', 'approved');

  const approvedEventIds = approvedApps?.map(a => a.event_id) || [];

  let eventsAttended = 0;
  if (approvedEventIds.length > 0) {
    const { count } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .in('id', approvedEventIds)
      .lt('date_time', now)
      .eq('status', 'active');
    eventsAttended = count || 0;
  }

  // 4. Определяем бейджи
  const orgBadgeData = getBadgeStatus(eventsOrganized || 0, ORGANIZER_BADGES);
  const partBadgeData = getBadgeStatus(eventsAttended || 0, PARTICIPANT_BADGES);

  const displayBadges = [];
  if (orgBadgeData.current) {
    displayBadges.push({ ...orgBadgeData.current, current: orgBadgeData.current, type: 'organizer', progress: orgBadgeData.progress, next: orgBadgeData.next });
  }
  if (partBadgeData.current) {
    displayBadges.push({ ...partBadgeData.current, current: partBadgeData.current, type: 'participant', progress: partBadgeData.progress, next: partBadgeData.next });
  }

  // 5. Получаем события
  const viewer = await getViewer(supabase);
  const { items: allEvents } = await getEventListDTOs(supabase, viewer, 1000, 0);
  const userEvents = allEvents.filter(e => e.organizerId === profile.id);

  // 6. Получаем отзывы
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
  const genderText = profile.gender === 'male' ? 'Мужской' : profile.gender === 'female' ? 'Женский' : 'Не указан';

  return (
    <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 min-h-screen">
      
      {/* ЕДИНАЯ СЕТКА */}
      <div className="grid grid-cols-1 md:grid-cols-[1fr_300px] lg:grid-cols-[1fr_350px] gap-6 items-start">
        
        {/* ЛЕВАЯ КОЛОНКА (Инфо + События) */}
        <div className="flex flex-col gap-6">
          
          {/* Карточка с инфо */}
          <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 md:gap-8 items-center md:items-start">
              
              {/* Аватар */}
              <div className="flex flex-col items-center gap-4 shrink-0">
                <div className={`w-32 h-32 rounded-full border-4 flex items-center justify-center text-5xl font-extrabold overflow-hidden
                  ${profile.gender === 'male' ? 'bg-blue-100 text-blue-800 border-blue-400' : 
                    profile.gender === 'female' ? 'bg-pink-100 text-pink-800 border-pink-400' : 
                    'bg-gray-200 text-gray-700 border-brand-line'}
                `}>
                  {profile.avatar_url ? (
                    <Image src={profile.avatar_url} alt={profile.username} width={128} height={128} className="w-[90%] h-[90%] object-cover" />
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

              {/* Текстовая инфа */}
              <div className="flex-1 flex flex-col gap-4 text-center md:text-left">
                <div className="flex flex-col md:flex-row md:items-center gap-3 border-b-2 border-dashed border-brand-line pb-3">
                  <h1 className="text-3xl md:text-4xl font-extrabold uppercase flex items-center justify-center md:justify-start gap-2">
                    @{profile.username}
                    {genderIcon && <span className="text-brand-accent text-2xl">{genderIcon}</span>}
                    {profile.is_verified && (
                      <span title="Проверенный организатор" className="text-blue-500 text-xl">✔</span>
                    )}
                  </h1>
                  
                  {isOwnProfile && (
                    <Link 
                      href="/settings" 
                      className="bg-brand-bg border-2 border-brand-line rounded-brand px-3 py-1 text-xs font-extrabold uppercase hover:bg-brand-surface transition-colors mx-auto md:mx-0 w-fit"
                    >
                      Редактировать
                    </Link>
                  )}
                </div>

                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 text-sm font-bold text-brand-muted">
                  <span>{genderText}</span>
                  {profile.age && <span>• {profile.age} лет</span>}
                  {profile.city && <span>• {profile.city}</span>}
                </div>

                <div className="flex flex-wrap justify-center md:justify-start gap-3">
                  {profile.telegram && (
                    <a href={`https://t.me/${profile.telegram.replace('@', '')}`} target="_blank" className="text-xs font-bold bg-blue-50 text-blue-600 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors">
                      Telegram: @{profile.telegram.replace('@', '')}
                    </a>
                  )}
                  {profile.vk && (
                    <a href={`https://vk.com/${profile.vk}`} target="_blank" className="text-xs font-bold bg-blue-50 text-blue-800 px-2 py-1 rounded border border-blue-200 hover:bg-blue-100 transition-colors">
                      VK
                    </a>
                  )}
                </div>

                <div className="mt-2">
                  <h3 className="text-xs font-extrabold uppercase text-brand-muted mb-1">О себе</h3>
                  {profile.bio ? (
                    <p className="text-sm font-medium whitespace-pre-wrap leading-relaxed">{profile.bio}</p>
                  ) : (
                    <p className="text-sm font-bold text-brand-muted italic">Пользователь пока ничего не рассказал о себе.</p>
                  )}
                </div>

                {profile.interests && profile.interests.length > 0 && (
                  <div className="mt-2">
                    <h3 className="text-xs font-extrabold uppercase text-brand-muted mb-2">Увлечения</h3>
                    <div className="flex flex-wrap justify-center md:justify-start gap-2">
                      {profile.interests.map((interest: string) => (
                        <span key={interest} className="bg-brand-cat-soft text-brand-cat font-bold text-xs px-3 py-1 rounded-full border border-brand-cat/30">
                          {interest}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Созданные события */}
          <div>
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
          </div>

        </div>

        {/* ПРАВАЯ КОЛОНКА (Статистика + Награды + Отзывы) */}
        <div className="flex flex-col gap-6">
          
          {/* Статистика */}
          <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
            <h2 className="text-lg font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Статистика</h2>
            <div className="flex flex-col gap-4">
              <div className="bg-brand-bg p-3 rounded-brand border border-brand-line flex flex-col items-center text-center">
                <span className="text-3xl font-extrabold text-brand-accent">{eventsOrganized || 0}</span>
                <span className="text-xs font-bold text-brand-muted uppercase mt-1">Успешно организовал{genderSuffix}</span>
              </div>
              <div className="bg-brand-bg p-3 rounded-brand border border-brand-line flex flex-col items-center text-center">
                <span className="text-3xl font-extrabold text-green-600">{eventsAttended || 0}</span>
                <span className="text-xs font-bold text-brand-muted uppercase mt-1">Успешно посетил{genderSuffix}</span>
              </div>
            </div>
          </div>

          {/* Награды */}
          <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
            <h2 className="text-lg font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Награды</h2>
            
            <div className="grid grid-cols-2 gap-4 max-w-[200px] mx-auto">
              {displayBadges.find(b => b.type === 'organizer') ? (() => {
                const badge = displayBadges.find(b => b.type === 'organizer')!;
                return (
                  <div className="flex flex-col items-center group relative">
                    <div className={`w-full aspect-[4/7] rounded-[99px] border-2 flex items-center justify-center bg-brand-bg relative overflow-hidden ${badge.color}`}>
                      <Image src={badge.icon} alt={badge.title} width={100} height={125} className="w-full h-full object-cover z-10" />
                    </div>
                    <div className="absolute top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none flex flex-col items-center w-max">
                      <div className="w-2 h-2 bg-brand-text rotate-45 -mb-1"></div>
                      <div className="bg-brand-text text-brand-bg text-[10px] font-bold px-2 py-1 rounded text-center whitespace-nowrap">
                        <div>{badge.title}</div>
                        <div className="text-[9px] font-normal text-brand-bg/80 mt-0.5 border-t border-brand-bg/20 pt-0.5">Организатор</div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="flex flex-col items-center justify-center w-full aspect-[4/7] rounded-[99px] border-2 border-dashed border-brand-line/50 bg-brand-bg/50">
                  <span className="text-2xl opacity-20">🔒</span>
                </div>
              )}

              {displayBadges.find(b => b.type === 'participant') ? (() => {
                const badge = displayBadges.find(b => b.type === 'participant')!;
                 return (
                  <div className="flex flex-col items-center group relative">
                    <div className={`w-full aspect-[4/7] rounded-[99px] border-2 flex items-center justify-center bg-brand-bg relative overflow-hidden ${badge.color}`}>
                      <Image src={badge.icon} alt={badge.title} width={100} height={125} className="w-full h-full object-cover z-10" />
                    </div>
                    <div className="absolute top-full mt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none flex flex-col items-center w-max">
                      <div className="w-2 h-2 bg-brand-text rotate-45 -mb-1"></div>
                      <div className="bg-brand-text text-brand-bg text-[10px] font-bold px-2 py-1 rounded text-center whitespace-nowrap">
                        <div>{badge.title}</div>
                        <div className="text-[9px] font-normal text-brand-bg/80 mt-0.5 border-t border-brand-bg/20 pt-0.5">Участник</div>
                      </div>
                    </div>
                  </div>
                );
              })() : (
                <div className="flex flex-col items-center justify-center w-full aspect-[4/7] rounded-[99px] border-2 border-dashed border-brand-line/50 bg-brand-bg/50">
                  <span className="text-2xl opacity-20">🔒</span>
                </div>
              )}
            </div>

            <div className="mt-4 text-center">
               {reviewsCount >= 3 ? (
                  <div className="inline-flex items-center gap-1.5 text-yellow-600 text-xs font-bold">
                    <span className="text-lg leading-none">★</span>
                    <span>{rating} / 5 ({reviewsCount} отзывов)</span>
                  </div>
                ) : (
                  <div className="text-[10px] font-bold text-brand-muted">
                    (Рейтинга пока нет)
                  </div>
                )}
            </div>
          </div>

          {/* Отзывы */}
          <div>
            <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Отзывы</h2>
            <div className="flex flex-col gap-4">
              {recentReviews && recentReviews.length > 0 ? (
                recentReviews.map((review: any) => {
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
                      {review.comment && <p className="text-sm italic text-brand-text/80">&quot;{review.comment}&quot;</p>}
                    </div>
                  );
                })
              ) : (
                <p className="text-sm font-bold text-brand-muted bg-brand-surface border-2 border-brand-line rounded p-4 text-center">Отзывов пока нет.</p>
              )}
            </div>
          </div>

        </div>

      </div>

    </main>
  );
}