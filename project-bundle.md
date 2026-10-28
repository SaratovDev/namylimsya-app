# Project bundle

Generated: 2026-10-25 22:04
Root: C:\Users\Lenovo\Downloads\event_mp\namylimsya-app

## Tree

```
namylimsya-app/
|-- __tests__/
|   \-- e
|-- app/
|   |-- [username]/
|   |   |-- page.tsx
|   |   \-- page_old.tsx
|   |-- admin/
|   |   |-- events/
|   |   |   \-- p
|   |   |-- support/
|   |   |   \-- p
|   |   |-- users/
|   |   |   \-- p
|   |   |-- layout.tsx
|   |   \-- page.tsx
|   |-- api/
|   |   \-- e
|   |-- archive/
|   |   \-- p
|   |-- auth/
|   |   \-- c
|   |-- banned/
|   |   \-- p
|   |-- event/
|   |   \-- [
|   |-- forgot-password/
|   |   \-- p
|   |-- login/
|   |   \-- p
|   |-- my-events/
|   |   |-- loading.tsx
|   |   \-- page.tsx
|   |-- reset-password/
|   |   \-- p
|   |-- settings/
|   |   \-- p
|   |-- support/
|   |   \-- p
|   |-- actions.ts
|   |-- error.tsx
|   |-- favicon.ico
|   |-- globals.css
|   |-- layout.tsx
|   |-- loading.tsx
|   |-- not-found.tsx
|   \-- page.tsx
|-- components/
|   |-- admin/
|   |   |-- AdminEventActions.tsx
|   |   |-- TicketActions.tsx
|   |   \-- UserActions.tsx
|   |-- AppealForm.tsx
|   |-- ApplicationActions.tsx
|   |-- AvatarPicker.tsx
|   |-- CancelModal.tsx
|   |-- CancelParticipationButton.tsx
|   |-- CategoryIcon.tsx
|   |-- ClientMapWrapper.tsx
|   |-- Countdown.tsx
|   |-- CreateEventForm.tsx
|   |-- EventAdminActions.tsx
|   |-- EventCard.tsx
|   |-- EventChat.tsx
|   |-- EventList.tsx
|   |-- Header.tsx
|   |-- InfiniteEventList.tsx
|   |-- Map.tsx
|   |-- MapComponent.tsx
|   |-- MapPicker.tsx
|   |-- MapPickerComponent.tsx
|   |-- MobileFilters.tsx
|   |-- NotificationsBell.tsx
|   |-- PageTransition.tsx
|   |-- ReviewForm.tsx
|   |-- ScrollToTop.tsx
|   |-- Sidebar.tsx
|   \-- Toast.tsx
|-- lib/
|   |-- achievements.ts
|   |-- admin-utils.ts
|   |-- event-access.ts
|   |-- event-dto.ts
|   |-- event-queries.ts
|   |-- supabase.ts
|   |-- supabase-server.ts
|   |-- username-generator.ts
|   \-- validations.ts
|-- public/
|   |-- file.svg
|   |-- globe.svg
|   |-- next.svg
|   |-- vercel.svg
|   \-- window.svg
|-- supabase/
|   |-- .temp/
|   |   |-- cli-latest
|   |   |-- gotrue-version
|   |   |-- linked-project.json
|   |   |-- pooler-url
|   |   |-- postgres-version
|   |   |-- project-ref
|   |   |-- rest-version
|   |   |-- storage-migration
|   |   \-- storage-version
|   |-- functions/
|   |   \-- t
|   \-- config.toml
|-- tools/
|   |-- bundle-project.ps1
|   |-- bundle-security-md.ps1
|   \-- project-bundle.md
|-- .env.local
|-- .gitignore
|-- AGENTS.md
|-- bundle-project.ps1
|-- eslint.config.mjs
|-- global.d.ts
|-- next.config.ts
|-- package.json
|-- postcss.config.mjs
|-- proxy.ts
|-- README.md
|-- tsconfig.json
\-- vitest.config.ts
```

## Files

### `.env.local`

``bash
NEXT_PUBLIC_SUPABASE_URL=***REDACTED***
NEXT_PUBLIC_SUPABASE_ANON_KEY=***REDACTED***
````

### `.gitignore`

``
# See https://help.github.com/articles/ignoring-files/ for more about ignoring files.

# dependencies
/node_modules
/.pnp
.pnp.*
.yarn/*
!.yarn/patches
!.yarn/plugins
!.yarn/releases
!.yarn/versions

# testing
/coverage

# next.js
/.next/
/out/

# production
/build

# misc
.DS_Store
*.pem

# debug
npm-debug.log*
yarn-debug.log*
yarn-error.log*
.pnpm-debug.log*

# env files (can opt-in for committing if needed)
.env*

# vercel
.vercel

# typescript
*.tsbuildinfo
next-env.d.ts

````

### `__tests__/event-access.test.ts`

``ts
import { describe, test, expect } from 'vitest';
import { canSeeExactLocation } from '@/lib/event-access';

describe('canSeeExactLocation', () => {
  const ev = { organizer_id: 'org-1', hide_location: true };

  test('anonymous cannot see hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'anonymous' }, null)).toBe(false);
  });

  test('pending user cannot see hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'user', userId: 'u-2' }, 'pending')).toBe(false);
  });

  test('rejected user cannot see hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'user', userId: 'u-2' }, 'rejected')).toBe(false);
  });

  test('approved user sees hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'user', userId: 'u-2' }, 'approved')).toBe(true);
  });

  test('organizer sees hidden location', () => {
    expect(canSeeExactLocation(ev, { kind: 'user', userId: 'org-1' }, null)).toBe(true);
  });

  test('open location visible to anonymous', () => {
    expect(
      canSeeExactLocation({ organizer_id: 'org-1', hide_location: false }, { kind: 'anonymous' }, null)
    ).toBe(true);
  });
});
````

### `AGENTS.md`

``md
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

````

### `app/[username]/page.tsx`

``tsx
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
````

### `app/[username]/page_old.tsx`

``tsx
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
````

### `app/actions.ts`

``ts
'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';
import { createEventSchema } from '@/lib/validations';

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) return { error: 'Необходимо войти в аккаунт' };

  // ПРОВЕРКА НА БАН
  const { data: bannedProfile } = await supabase.from('profiles').select('is_banned').eq('id', user.id).single();
  if (bannedProfile?.is_banned) return { error: 'Ваш аккаунт заблокирован. Вы не можете создавать события.' };

  // ПРОВЕРКА ЛИМИТА (не более 2 активных)
  const { count: activeEvents, error: countError } = await supabase
    .from('events')
    .select('*', { count: 'exact', head: true })
    .eq('organizer_id', user.id)
    .gte('date_time', new Date().toISOString());

  if (countError) return { error: 'Не удалось проверить лимит событий' };
  if (activeEvents && activeEvents >= 2) {
    return { error: 'У вас уже есть 2 активных события. Дождитесь их завершения, чтобы создать новое.' };
  }

  // Сбор данных
  const dateStr = formData.get('date') as string | null;
  const timeStr = formData.get('time') as string | null;
  
  if (!dateStr || !timeStr) return { error: 'Укажите дату и время события' };

  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    location: formData.get('location'),
    max_participants: formData.get('max_participants'),
    lat: formData.get('lat') || null,
    lng: formData.get('lng') || null,
    date_time: `${dateStr}T${timeStr}`,
    hide_location: formData.get('hide_location') === 'on',
    city: formData.get('city'),
  };

  // Валидация
  const result = createEventSchema.safeParse(rawData);
  
  if (!result.success) {
    const firstError = result.error.issues[0]?.message || 'Некорректные данные';
    return { error: firstError };
  }

  const { title, description, city, category, location, max_participants, lat, lng, date_time, hide_location } = result.data;

  // Никнейм организатора
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const organizerName = profile?.username || 'Пользователь';

  // Вставка в БД (rankTitle больше не нужен, ставим базовый)
  const { error } = await supabase
    .from('events')
    .insert([{
      title, description, category, date_time, location, lat, lng, max_participants, hide_location,
      organizer_name: organizerName,
      organizer_id: user.id,
      organizer_rank: 'Инициатор', 
      city,
    }]);

  if (error) {
    console.error('Ошибка создания события:', error);
    return { error: 'Не удалось создать событие' };
  }

  revalidatePath('/');
  return { success: true };
}

// --- Подача заявки ---
export async function applyToEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: profile } = await supabase.from('profiles').select('is_banned').eq('id', user.id).single();
  if (profile?.is_banned) return { error: 'Ваш аккаунт заблокирован.' };

  const { data: eventCheck } = await supabase
    .from('events')
    .select('organizer_id')
    .eq('id', eventId)
    .single();

  if (eventCheck?.organizer_id === user.id) {
    return { error: 'Вы не можете подать заявку на свое же событие' };
  }

  const { count, error: countError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['pending', 'approved']);

  if (countError) return { error: 'Ошибка проверки лимита' };
  if (count && count >= 3) return { error: 'Вы достигли лимита в 3 активные заявки' };

  const { error } = await supabase.from('applications').insert([{
    event_id: eventId,
    user_id: user.id,
    status: 'pending'
  }]);

  if (error) {
    if (error.code === '23505') return { error: 'Вы уже подали заявку на это событие' };
    return { error: 'Ошибка подачи заявки' };
  }

  const { data: event } = await supabase.from('events').select('organizer_id, title').eq('id', eventId).single();
  if (event) {
    await supabase.from('notifications').insert({
      user_id: event.organizer_id,
      content: `На ваше событие «${event.title}» отправлена новая заявка!`,
      link: `/my-events`
    });
  }

  revalidatePath('/');
  revalidatePath('/my-events');
  return { success: true };
}

// --- Отмена заявки ---
export async function cancelApplication(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) return { error: 'Не удалось отменить заявку' };
  
  revalidatePath('/');
  revalidatePath('/my-events');
  return { success: true };
}

// --- Подтверждение заявки ---
export async function approveApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { error } = await supabase.rpc('approve_application', { app_id: applicationId });
  
  if (error) {
    if (error.message.includes('больше нет свободных мест')) return { error: 'Мест больше нет' };
    return { error: 'Не удалось подтвердить заявку' };
  }

  revalidatePath('/my-events');
  revalidatePath('/');
  return { success: true };
}

// --- Отклонение заявки ---
export async function rejectApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { error } = await supabase.rpc('reject_application', { app_id: applicationId });
  
  if (error) {
    if (error.message.includes('уже обработана')) return { error: 'Эта заявка уже обработана' };
    return { error: 'Не удалось отклонить заявку' };
  }

  revalidatePath('/my-events');
  return { success: true };
} 

// --- Оставить отзыв ---
export async function leaveReview(eventId: string, rating: number, comment: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: event } = await supabase.from('events').select('organizer_id').eq('id', eventId).single();
  if (!event) return { error: 'Событие не найдено' };

  const { error } = await supabase.from('reviews').insert([{
    event_id: eventId,
    organizer_id: event.organizer_id,
    author_id: user.id,
    rating: rating,
    comment: comment.trim() || null,
  }]);

  if (error) {
    if (error.code === '23505') return { error: 'Вы уже оставляли отзыв на это событие' };
    if (error.code === '42501') return { error: 'Вы не можете оставить отзыв' };
    return { error: 'Не удалось сохранить отзыв' };
  }

  revalidatePath(`/event/${eventId}`);
  return { success: true };
}

// --- Отмена события ---
export async function cancelEvent(eventId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: event } = await supabase
    .from('events')
    .select('id, organizer_id, title')
    .eq('id', eventId)
    .single();

  if (!event) return { error: 'Событие не найдено' };
  if (event.organizer_id !== user.id) return { error: 'Вы не являетесь организатором' };

  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  const orgName = profile?.username || 'Организатор';

  const { error } = await supabase
    .from('events')
    .update({ status: 'cancelled', cancel_reason: reason })
    .eq('id', eventId);

  if (error) return { error: 'Не удалось отменить событие' };

  const { data: apps } = await supabase.from('applications').select('user_id').eq('event_id', eventId);
  
  if (apps && apps.length > 0) {
    const notifications = apps.map(app => ({
      user_id: app.user_id,
      content: `Организатор @${orgName} отменил событие «${event.title}». Причина: ${reason}`,
      link: `/event/${eventId}`
    }));
    await supabase.from('notifications').insert(notifications);
  }

  revalidatePath('/');
  revalidatePath('/my-events');
  revalidatePath(`/event/${eventId}`);
  return { success: true };
}

export async function cancelApprovedApplication(eventId: string, reason: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: event } = await supabase.from('events').select('organizer_id, title').eq('id', eventId).single();
  const { data: profile } = await supabase.from('profiles').select('username').eq('id', user.id).single();
  
  if (!event) return { error: 'Событие не найдено' };
  const userName = profile?.username || 'Пользователь';

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) return { error: 'Не удалось отменить заявку' };

  await supabase.from('notifications').insert({
    user_id: event.organizer_id,
    content: `Участник @${userName} снял заявку на событие «${event.title}». Причина: ${reason}`,
    link: `/my-events`
  });
  
  revalidatePath('/');
  revalidatePath('/my-events');
  return { success: true };
}

// --- ЧАТ: Отметить как прочитанное ---
export async function markChatAsRead(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return;

  const { data: updated, error: updateError } = await supabase
    .from('chat_reads')
    .update({ last_read_at: new Date().toISOString() })
    .eq('user_id', user.id)
    .eq('event_id', eventId)
    .select();

  if (updateError) {
    console.error('Ошибка обновления прочтения:', updateError);
    return;
  }

  if (!updated || updated.length === 0) {
    const { error: insertError } = await supabase
      .from('chat_reads')
      .insert({ user_id: user.id, event_id: eventId, last_read_at: new Date().toISOString() });
    if (insertError) console.error('Ошибка создания записи прочтения:', insertError);
  }
}

export async function getUnreadCounts(eventIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user || eventIds.length === 0) return {};

  const { data: reads } = await supabase
    .from('chat_reads')
    .select('event_id, last_read_at')
    .in('event_id', eventIds)
    .eq('user_id', user.id);

  const readMap = new Map(reads?.map(r => [r.event_id, r.last_read_at]) || []);
  const counts: Record<string, number> = {};
  
  for (const eventId of eventIds) {
    const lastRead = readMap.get(eventId);
    let query = supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('event_id', eventId)
      .neq('user_id', user.id);

    if (lastRead) {
      query = query.gt('created_at', lastRead);
    }

    const { count } = await query;
    if (count && count > 0) {
      counts[eventId] = count;
    }
  }

  return counts;
} 

// --- АДМИНКА ---
export async function updateUserRole(targetUserId: string, newRole: 'user' | 'moderator' | 'admin') {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: myProfile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profileError) return { error: 'Ошибка проверки прав' };
  if (myProfile?.role !== 'admin') return { error: 'Только администратор может менять роли' };
  if (user.id === targetUserId) return { error: 'Вы не можете изменить свою собственную роль' };

  const { error, data } = await supabase.from('profiles').update({ role: newRole }).eq('id', targetUserId).select();
  if (error) return { error: 'Не удалось изменить роль: ' + error.message };
  if (!data || data.length === 0) return { error: 'Пользователь не найден или нет прав' };

  revalidatePath('/admin/users');
  return { success: true };
}

export async function toggleUserBan(targetUserId: string, isBanned: boolean) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: myProfile, error: profileError } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (profileError) return { error: 'Ошибка проверки прав' };
  if (myProfile?.role !== 'admin') return { error: 'Только администратор может банить' };
  if (user.id === targetUserId) return { error: 'Вы не можете забанить себя' };

  const { error, data } = await supabase.from('profiles').update({ is_banned: isBanned }).eq('id', targetUserId).select();
  if (error) return { error: 'Не удалось изменить статус: ' + error.message };
  if (!data || data.length === 0) return { error: 'Пользователь не найден или нет прав' };

  revalidatePath('/admin/users');
  return { success: true };
}

export async function adminDeleteEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: 'Не авторизован' };

  const { data: myProfile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
  if (myProfile?.role !== 'admin' && myProfile?.role !== 'moderator') return { error: 'Недостаточно прав' };

  const { error } = await supabase.from('events').delete().eq('id', eventId);
  if (error) return { error: 'Не удалось удалить событие' };

  revalidatePath('/admin/events');
  revalidatePath('/');
  return { success: true };
}
````

### `app/admin/events/page.tsx`

``tsx
import { createClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin-utils';
import AdminEventActions from '@/components/admin/AdminEventActions';
import Link from 'next/link';

export default async function AdminEventsPage() {
  await requireAdmin(); // Проверка доступа

  const supabase = await createClient();
  
  // Получаем все события с информацией об организаторах
  const { data: events } = await supabase
    .from('events')
    .select(`
      id,
      title,
      date_time,
      status,
      created_at,
      organizer_name,
      profiles!events_organizer_profile_fkey ( username )
    `)
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl">
      <div className="flex items-end justify-between mb-8 border-b-2 border-brand-line pb-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase">События</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">Управление всеми событиями на платформе</p>
        </div>
        <div className="text-sm font-extrabold bg-brand-surface px-4 py-2 border-2 border-brand-line rounded-brand">
          Всего: {events?.length || 0}
        </div>
      </div>

      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-brand-line bg-brand-bg">
              <th className="p-4 text-xs font-extrabold uppercase text-brand-muted">Событие</th>
              <th className="p-4 text-xs font-extrabold uppercase text-brand-muted">Организатор</th>
              <th className="p-4 text-xs font-extrabold uppercase text-brand-muted">Дата</th>
              <th className="p-4 text-xs font-extrabold uppercase text-brand-muted">Статус</th>
              <th className="p-4 text-xs font-extrabold uppercase text-brand-muted text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {events?.map((e) => {
              const org = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles;
              return (
                <tr key={e.id} className="border-b border-brand-line/50 hover:bg-brand-bg/50 transition-colors">
                  <td className="p-4">
                    <Link href={`/event/${e.id}`} target="_blank" className="font-bold text-sm hover:text-brand-accent hover:underline">
                      {e.title}
                    </Link>
                  </td>
                  <td className="p-4 text-sm font-bold text-brand-muted">
                    <Link href={`/@${org?.username || e.organizer_name}`} target="_blank" className="hover:text-brand-accent">
                      @{org?.username || e.organizer_name}
                    </Link>
                  </td>
                  <td className="p-4 text-sm font-bold text-brand-muted">
                    {new Date(e.date_time).toLocaleDateString('ru-RU')}
                  </td>
                  <td className="p-4">
                    <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded border ${
                      e.status === 'cancelled' ? 'bg-red-100 text-red-700 border-red-300' : 
                      new Date(e.date_time) < new Date() ? 'bg-gray-100 text-gray-700 border-gray-300' :
                      'bg-green-100 text-green-700 border-green-300'
                    }`}>
                      {e.status === 'cancelled' ? 'Отменено' : new Date(e.date_time) < new Date() ? 'В архиве' : 'Активно'}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <AdminEventActions eventId={e.id} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
````

### `app/admin/layout.tsx`

``tsx
import { requireAdmin } from '@/lib/admin-utils';
import Link from 'next/link';
import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase-server';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Защита: если мы здесь, значит юзер — админ или модератор
  const { role } = await requireAdmin();

  // Считаем новые тикеты
  const supabase = await createClient();
  const { count: newTickets } = await supabase
    .from('support_tickets')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      
      {/* Боковое меню */}
      <aside className="w-full md:w-64 bg-brand-surface border-b-2 md:border-b-0 md:border-r-2 border-brand-line flex-shrink-0">
        <div className="p-6 border-b-2 border-brand-line">
          <h2 className="text-xl font-extrabold uppercase">
            Админка <span className="text-brand-accent">Намылимся</span>
          </h2>
          <p className="text-xs font-bold text-brand-muted mt-1 uppercase">
            Ваша роль: {role === 'admin' ? 'Администратор' : 'Модератор'}
          </p>
        </div>
        
        <nav className="flex flex-col p-4 gap-2">
          <Link 
            href="/admin" 
            className="font-bold p-3 rounded-brand hover:bg-brand-bg transition-colors"
          >
            📊 Дашборд
          </Link>
          <Link 
            href="/admin/events" 
            className="font-bold p-3 rounded-brand hover:bg-brand-bg transition-colors"
          >
            📅 События
          </Link>
          {role === 'admin' && (
            <Link 
              href="/admin/users" 
              className="font-bold p-3 rounded-brand hover:bg-brand-bg transition-colors"
            >
              👥 Пользователи
            </Link>
          )}

           <Link 
            href="/admin/support" 
            className="font-bold p-3 rounded-brand hover:bg-brand-bg transition-colors flex justify-between items-center"
          >
            <span>✉️ Обращения</span>
            {newTickets && newTickets > 0 ? (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {newTickets}
              </span>
            ) : null}
          </Link>
          
          <div className="mt-auto pt-4 border-t-2 border-dashed border-brand-line">
            <Link 
              href="/" 
              className="font-bold text-brand-muted hover:text-brand-accent p-3 block transition-colors"
            >
              ← Назад на сайт
            </Link>
          </div>
        </nav>
      </aside>

      {/* Контент */}
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">
        {children}
      </main>
    </div>
  );
}
````

### `app/admin/page.tsx`

``tsx
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const supabase = await createClient();
  
  const params = await searchParams;
  const period = params.period || '7d';
  
  let dateLimit = new Date();
  if (period === 'today') dateLimit.setHours(0, 0, 0, 0);
  else if (period === '7d') dateLimit.setDate(dateLimit.getDate() - 7);
  else if (period === '30d') dateLimit.setDate(dateLimit.getDate() - 30);
  else if (period === 'all') dateLimit = new Date(0);

  const limitIso = dateLimit.toISOString();

  // --- 1. Базовые метрики за период ---
  const [
    { count: usersCount },
    { count: eventsCount },
    { count: appsCount },
    { data: topCategories },
    { data: topOrganizers }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', limitIso),
    supabase.from('events').select('*', { count: 'exact', head: true }).gte('created_at', limitIso),
    supabase.from('applications').select('*', { count: 'exact', head: true }).gte('created_at', limitIso),
    supabase.from('events').select('category').gte('created_at', limitIso),
    supabase.from('events').select('organizer_name').gte('created_at', limitIso),
  ]);

  // --- 2. Воронка (Всё время, чтобы видеть реальную конверсию) ---
  const [
    { count: totalApps },
    { count: approvedApps },
    { count: pendingApps },
    { count: rejectedApps },
    { count: cancelledEvents }
  ] = await Promise.all([
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
  ]);

  // --- 3. График активности (за последние 14 дней) ---
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const { data: chartEvents } = await supabase
    .from('events')
    .select('created_at')
    .gte('created_at', fourteenDaysAgo.toISOString());

  // Группируем по дням
  const chartData = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateString = d.toISOString().split('T')[0];
    const count = chartEvents?.filter(e => e.created_at.startsWith(dateString)).length || 0;
    return { dateString, displayDate: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }), count };
  });
  const maxChartCount = Math.max(...chartData.map(d => d.count), 1);

  // Обработка топов
  const catMap: Record<string, number> = {};
  topCategories?.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + 1; });
  const sortedCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const orgMap: Record<string, number> = {};
  topOrganizers?.forEach(e => { if(e.organizer_name) orgMap[e.organizer_name] = (orgMap[e.organizer_name] || 0) + 1; });
  const sortedOrganizers = Object.entries(orgMap).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const approveRate = totalApps ? Math.round((approvedApps! / totalApps) * 100) : 0;

  return (
    <div className="max-w-6xl">
      
      {/* Хедер с фильтрами */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b-2 border-brand-line pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase">Обзор платформы</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">Статистика и аналитика</p>
        </div>
        <div className="flex bg-brand-surface border-2 border-brand-line rounded-brand p-1">
          <Link href="/admin?period=today" className={`px-3 py-1.5 text-xs font-bold rounded ${period === 'today' ? 'bg-brand-accent text-white' : 'hover:bg-brand-bg'}`}>Сегодня</Link>
          <Link href="/admin?period=7d" className={`px-3 py-1.5 text-xs font-bold rounded ${period === '7d' ? 'bg-brand-accent text-white' : 'hover:bg-brand-bg'}`}>7 дней</Link>
          <Link href="/admin?period=30d" className={`px-3 py-1.5 text-xs font-bold rounded ${period === '30d' ? 'bg-brand-accent text-white' : 'hover:bg-brand-bg'}`}>30 дней</Link>
          <Link href="/admin?period=all" className={`px-3 py-1.5 text-xs font-bold rounded ${period === 'all' ? 'bg-brand-accent text-white' : 'hover:bg-brand-bg'}`}>Всё время</Link>
        </div>
      </div>

      {/* Блок: За выбранный период */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 flex flex-col justify-between">
          <div className="text-xs font-extrabold uppercase text-brand-muted mb-4">Регистрации</div>
          <div className="text-4xl font-extrabold">{usersCount || 0}</div>
        </div>
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 flex flex-col justify-between">
          <div className="text-xs font-extrabold uppercase text-brand-muted mb-4">Создано событий</div>
          <div className="text-4xl font-extrabold">{eventsCount || 0}</div>
        </div>
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 flex flex-col justify-between">
          <div className="text-xs font-extrabold uppercase text-brand-muted mb-4">Подано заявок</div>
          <div className="text-4xl font-extrabold">{appsCount || 0}</div>
        </div>
      </div>

      {/* График активности */}
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 mb-6">
        <h2 className="text-xs font-extrabold uppercase text-brand-muted mb-6">Активность (создано событий за 14 дней)</h2>
        <div className="flex items-end justify-between h-32 gap-1 sm:gap-2">
          {chartData.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group relative">
              <div className="absolute -top-6 bg-brand-bg border border-brand-line text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {d.displayDate}: {d.count}
              </div>
              <div 
                className={`w-full rounded-t-sm transition-all ${d.count > 0 ? 'bg-brand-accent hover:bg-brand-accent-ink' : 'bg-brand-bg'}`}
                style={{ height: `${Math.max((d.count / maxChartCount) * 100, 4)}%` }}
              ></div>
              <span className="text-[9px] font-bold text-brand-muted mt-2 rotate-[-45deg] sm:rotate-0">{d.displayDate.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Воронка заявок */}
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 mb-6">
        <h2 className="text-xs font-extrabold uppercase text-brand-muted mb-4">Воронка заявок (За всё время)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-brand-bg p-4 rounded border border-brand-line">
            <div className="text-2xl font-extrabold">{totalApps || 0}</div>
            <div className="text-[10px] font-bold uppercase text-brand-muted mt-1">Всего подано</div>
          </div>
          <div className="bg-brand-bg p-4 rounded border border-brand-line">
            <div className="text-2xl font-extrabold text-green-600">{approvedApps || 0}</div>
            <div className="text-[10px] font-bold uppercase text-brand-muted mt-1">Подтверждено ({approveRate}%)</div>
          </div>
          <div className="bg-brand-bg p-4 rounded border border-brand-line">
            <div className="text-2xl font-extrabold text-brand-accent">{pendingApps || 0}</div>
            <div className="text-[10px] font-bold uppercase text-brand-muted mt-1">В ожидании</div>
          </div>
          <div className="bg-brand-bg p-4 rounded border border-brand-line">
            <div className="text-2xl font-extrabold text-red-600">{rejectedApps || 0}</div>
            <div className="text-[10px] font-bold uppercase text-brand-muted mt-1">Отклонено / Отменено</div>
          </div>
        </div>
      </div>

      {/* Топы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
          <h2 className="text-xs font-extrabold uppercase text-brand-muted mb-4">Популярные категории</h2>
          <div className="flex flex-col gap-4">
            {sortedCategories.length === 0 && <p className="text-sm font-bold text-brand-muted">Нет данных</p>}
            {sortedCategories.map(([cat, count]) => {
              const percent = Math.round((count / sortedCategories[0][1]) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs font-bold mb-1"><span>{cat}</span><span>{count}</span></div>
                  <div className="w-full bg-brand-bg rounded-full h-1.5"><div className="bg-brand-cat h-1.5 rounded-full" style={{ width: `${percent}%` }}></div></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
          <h2 className="text-xs font-extrabold uppercase text-brand-muted mb-4">Активные организаторы</h2>
          <div className="flex flex-col gap-4">
            {sortedOrganizers.length === 0 && <p className="text-sm font-bold text-brand-muted">Нет данных</p>}
            {sortedOrganizers.map(([org, count]) => {
              const percent = Math.round((count / sortedOrganizers[0][1]) * 100);
              return (
                <div key={org}>
                  <div className="flex justify-between text-xs font-bold mb-1"><span>@{org}</span><span>{count} соб.</span></div>
                  <div className="w-full bg-brand-bg rounded-full h-1.5"><div className="bg-brand-accent h-1.5 rounded-full" style={{ width: `${percent}%` }}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}
````

### `app/admin/support/page.tsx`

``tsx
import { createClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin-utils';
import TicketActions from '@/components/admin/TicketActions';

export default async function AdminSupportPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8 border-b-2 border-brand-line pb-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase">Обращения</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">Сообщения от пользователей</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {tickets?.length === 0 && <p className="text-brand-muted font-bold">Обращений пока нет.</p>}
        
        {tickets?.map((t) => (
          <div key={t.id} className={`bg-brand-surface border-2 rounded-brand-lg p-5 flex flex-col gap-3 ${t.status === 'new' ? 'border-brand-accent' : 'border-brand-line opacity-70'}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-extrabold border mb-2 ${t.status === 'new' ? 'bg-brand-accent text-white border-brand-accent' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>
                  {t.status === 'new' ? 'Новое' : 'Решено'}
                </span>
                <h3 className="text-lg font-extrabold">{t.subject}</h3>
                <p className="text-sm font-bold text-brand-muted mt-1">
                  От: <a href={`mailto:${t.email}`} className="hover:text-brand-accent underline">{t.email}</a>
                  <span className="mx-2">•</span>
                  {new Date(t.created_at).toLocaleString('ru-RU')}
                </p>
              </div>
              <TicketActions ticketId={t.id} currentStatus={t.status} userEmail={t.email} />
            </div>
            
            <div className="bg-brand-bg p-4 rounded border border-brand-line text-sm font-medium whitespace-pre-wrap">
              {t.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
````

### `app/admin/users/page.tsx`

``tsx
import { createClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin-utils';
import UserActions from '@/components/admin/UserActions';
import Image from 'next/image';

export default async function AdminUsersPage() {
  // Проверяем, что зашел именно админ (модераторы сюда не попадут)
  const { user, role } = await requireAdmin();
  if (role !== 'admin') {
    return (
      <div className="text-center py-20">
        <h1 className="text-2xl font-extrabold text-brand-muted">Доступ запрещен</h1>
        <p className="text-sm font-bold mt-2">Управление пользователями доступно только администраторам.</p>
      </div>
    );
  }

  const supabase = await createClient();
  
  // Получаем всех пользователей
  const { data: users } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-6xl">
      <div className="flex items-end justify-between mb-8 border-b-2 border-brand-line pb-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase">Пользователи</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">Управление ролями и блокировками</p>
        </div>
        <div className="text-sm font-extrabold bg-brand-surface px-4 py-2 border-2 border-brand-line rounded-brand">
          Всего: {users?.length || 0}
        </div>
      </div>

      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b-2 border-brand-line bg-brand-bg">
              <th className="p-4 text-xs font-extrabold uppercase text-brand-muted">Пользователь</th>
              <th className="p-4 text-xs font-extrabold uppercase text-brand-muted">Дата рег.</th>
              <th className="p-4 text-xs font-extrabold uppercase text-brand-muted">Роль</th>
              <th className="p-4 text-xs font-extrabold uppercase text-brand-muted text-right">Действия</th>
            </tr>
          </thead>
          <tbody>
            {users?.map((u) => (
              <tr key={u.id} className={`border-b border-brand-line/50 hover:bg-brand-bg/50 transition-colors ${u.is_banned ? 'opacity-50 bg-red-50' : ''}`}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-extrabold text-xs overflow-hidden shrink-0 border-2
                      ${u.gender === 'male' ? 'border-blue-400 bg-blue-50' : u.gender === 'female' ? 'border-pink-400 bg-pink-50' : 'border-brand-line bg-brand-bg'}
                    `}>
                      {u.avatar_url ? (
                        <Image src={u.avatar_url} alt={u.username} width={32} height={32} className="w-full h-full object-cover" />
                      ) : (
                        u.username.charAt(0).toUpperCase()
                      )}
                    </div>
                    <div>
                      <div className="font-bold text-sm">@{u.username}</div>
                      <div className="text-xs text-brand-muted">{u.email}</div>
                    </div>
                  </div>
                </td>
                <td className="p-4 text-sm font-bold text-brand-muted">
                  {new Date(u.created_at).toLocaleDateString('ru-RU')}
                </td>
                <td className="p-4">
                  <span className={`text-[10px] font-extrabold uppercase px-2 py-1 rounded border ${
                    u.role === 'admin' ? 'bg-purple-100 text-purple-700 border-purple-300' :
                    u.role === 'moderator' ? 'bg-blue-100 text-blue-700 border-blue-300' :
                    'bg-brand-bg text-brand-muted border-brand-line'
                  }`}>
                    {u.role}
                  </span>
                </td>
                <td className="p-4 text-right">
                  <UserActions 
                    userId={u.id} 
                    currentRole={u.role || 'user'} 
                    isBanned={u.is_banned || false} 
                    currentAdminId={user.id}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
````

### `app/api/events/route.ts`

``ts
import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase-server';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const page = Number(searchParams.get('page')) || 1;
  const category = searchParams.get('category') || undefined;
  const dateFrom = searchParams.get('date_from') || undefined;
  const dateTo = searchParams.get('date_to') || undefined;
  const city = searchParams.get('city') || undefined; // <--- 1. ЧИТАЕМ ГОРОД

  const limit = 10;
  const offset = (page - 1) * limit;

  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  try {
    const result = await getEventListDTOs(supabase, viewer, limit, offset, false, {
      category,
      dateFrom,
      dateTo,
      city // <--- 2. ПЕРЕДАЕМ ГОРОД
    });

    return NextResponse.json(result);
  } catch (error) {
    // ...
  }
}
````

### `app/archive/page.tsx`

``tsx
import { createClient } from '@/lib/supabase-server';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';
import EventCard from '@/components/EventCard';
import Link from 'next/link';

export default async function ArchivePage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  const { items, total } = await getEventListDTOs(supabase, viewer, limit, offset, true); // true = архив
  const hasMore = offset + items.length < total;

   return (
    <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-extrabold uppercase mb-8 border-b-2 border-brand-line pb-4">
        Архив событий
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
          В архиве пока нет завершенных событий.
        </div>
      ) : (
        <div className="flex flex-col gap-8">
          {/* Сетка карточек: 1 колонка на мобилках, 2 на ПК */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {items.map((item) => (
              <div key={item.id} className="h-full">
                <EventCard item={item} />
              </div>
            ))}
          </div>

          {hasMore && (
            <div className="text-center mt-4">
              <Link
                href={`/archive?page=${currentPage + 1}`}
                className="inline-block px-6 py-3 bg-brand-surface border-2 border-brand-line rounded-brand font-extrabold uppercase hover:bg-brand-bg transition-colors"
              >
                Показать ещё
              </Link>
            </div>
          )}
        </div>
      )}
    </main>
  );
}
````

### `app/auth/callback/page.tsx`

``tsx
'use client';

import { useEffect, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

function CallbackHandler() {
  const router = useRouter();

  useEffect(() => {
    // Supabase при OAuth сам перехватывает токен из URL (в hash-части)
    // и сохраняет сессию в куки. Нам нужно просто дождаться этого.
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      if (error) {
        console.error('Ошибка авторизации:', error);
      }
      
      // В любом случае отправляем на главную. 
      // Если сессия есть, router.refresh() обновит интерфейс.
      router.push('/');
      router.refresh();
    });
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center font-bold text-brand-muted">
        Авторизация... Пожалуйста, подождите.
      </div>
    </div>
  );
}

export default function AuthCallback() {
  return (
    <Suspense fallback={<div className="text-center font-bold">Загрузка...</div>}>
      <CallbackHandler />
    </Suspense>
  );
}
````

### `app/banned/page.tsx`

``tsx
import Link from 'next/link';
import AppealForm from '@/components/AppealForm';

export default function BannedPage() {
  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-red-500 rounded-brand-lg p-8 text-center">
        <div className="text-6xl mb-4">🍆</div>
        <h1 className="text-2xl font-extrabold uppercase mb-4 text-red-600">
          Аккаунт заблокирован
        </h1>
        <p className="text-brand-muted font-bold mb-6">
          Ваш доступ к платформе «Намылимся» был приостановлен администрацией за нарушение правил сообщества.
        </p>
        <p className="text-sm font-medium text-brand-text mb-8 bg-brand-bg p-3 rounded border border-brand-line">
          Если вы считаете, что это ошибка, напишите нам. Мы обязательно разберемся.
        </p>
        
        <div className="flex flex-col gap-3">
          <AppealForm />
          <Link
            href="/login"
            className="inline-block bg-brand-bg text-brand-text font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-surface transition-colors"
          >
            Выйти из аккаунта
          </Link>
        </div>
      </div>
    </main>
  );
}


````

### `app/error.tsx`

``tsx
'use client';

import { useEffect } from 'react';
import Link from 'next/link';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Логируем ошибку в консоль (в будущем сюда можно подключить Sentry)
    console.error('Глобальная ошибка приложения:', error);
  }, [error]);

  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 text-center">
        <div className="text-5xl mb-4">💥</div>
        <h1 className="text-2xl font-extrabold uppercase mb-4">
          Что-то пошло не так
        </h1>
        <p className="text-brand-muted font-bold mb-6">
          Произошла непредвиденная ошибка. Мы уже работаем над этим. Попробуйте обновить страницу.
        </p>
        
        <div className="flex flex-col gap-3">
          <button
            onClick={() => reset()}
            className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors"
          >
            Попробовать снова
          </button>
          <Link
            href="/"
            className="bg-brand-bg text-brand-text font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-surface transition-colors"
          >
            Вернуться на главную
          </Link>
        </div>
      </div>
    </main>
  );
}
````

### `app/event/[id]/page.tsx`

``tsx
import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ClientMapWrapper from '@/components/ClientMapWrapper';
import EventChat from '@/components/EventChat';
import ReviewForm from '@/components/ReviewForm';
import { getViewer } from '@/lib/event-access';
import { canSeeExactLocation } from '@/lib/event-access';
import ScrollToTop from '@/components/ScrollToTop';
import EventAdminActions from '@/components/EventAdminActions';
import CancelParticipationButton from '@/components/CancelParticipationButton';


export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
      profiles!events_organizer_profile_fkey ( username, avatar_url, gender )
    `)
    .eq('id', id)
    .single();

  if (!event) notFound();

  let myAppStatus = null;
  if (viewer.kind === 'user') {
    const { data: app } = await supabase
      .from('applications')
      .select('status')
      .eq('event_id', id)
      .eq('user_id', viewer.userId)
      .maybeSingle();
    myAppStatus = app?.status || null;
  }

  const canSeeLocation = canSeeExactLocation(event, viewer, myAppStatus);
  const hasExactCoords = typeof event.lat === 'number' && typeof event.lng === 'number' && canSeeLocation;
  const isOrganizer = viewer.kind === 'user' && viewer.userId === event.organizer_id;

    // Считаем событие прошедшим через 24 часа после начала
  const eventEndTime = new Date(event.date_time).getTime() + 24 * 60 * 60 * 1000;
  const isPast = eventEndTime < new Date().getTime();

  let canReview = false;
  if (viewer.kind === 'user' && isPast && myAppStatus === 'approved') {
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('event_id', id)
      .eq('author_id', viewer.userId)
      .maybeSingle();
      
    if (!existingReview) canReview = true;
  }

  const { data: eventRating } = await supabase
    .rpc('get_event_rating', { ev_id: id })
    .single<{ average_rating: number; total_reviews: number }>();

  const d = new Date(event.date_time);
  const dateStr = d.toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' });
  const timeStr = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });
  const organizer = Array.isArray(event.profiles) ? event.profiles[0] : event.profiles;

  return (
    <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 min-h-screen">
      <ScrollToTop />
      <Link href="/" className="text-brand-muted font-bold text-sm uppercase hover:text-brand-accent transition-colors mb-6 inline-block">
        ← Вернуться в ленту
      </Link>

      {/* Шапка события */}
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 md:p-8 mb-6 relative">
                {event.status === 'cancelled' && (
          <div className="mb-4 bg-red-100 border-2 border-red-300 text-red-800 p-4 rounded-brand font-bold flex items-center gap-3">
            <span className="text-2xl">🚫</span>
            <div>
              <p className="uppercase text-sm">Это событие отменено организатором</p>
              {event.cancel_reason && (
                <p className="text-xs font-medium mt-1">Причина: {event.cancel_reason}</p>
              )}
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row justify-between gap-6">
          
          <div className="flex-1">
            <span className="text-[10px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2 py-1 rounded border border-brand-cat/30 mb-4 inline-block">
              {event.category}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold leading-tight mb-4">{event.title}</h1>
            
            <div className="flex flex-col gap-2 text-sm font-bold text-brand-muted">
              <p className="flex items-center gap-2">
                <span className="text-brand-accent text-lg">🗓</span>
                {dateStr} в {timeStr}
              </p>
              <p className="flex items-center gap-2">
                <span className="text-brand-accent text-lg">📍</span>
                <span>
                  {event.city ? `${event.city}, ` : ''}
                  {canSeeLocation ? event.location : "Место скрыто организатором"}
                </span>
              </p>
              
              {isPast && (
                <div className="mt-2 inline-block bg-brand-bg border-2 border-brand-line px-3 py-1 rounded text-brand-muted font-extrabold text-xs uppercase">
                  Событие уже прошло
                </div>
              )}
            </div>
          </div>

          {/* Организатор и Рейтинг в шапке */}
          <div className="flex flex-col gap-3 min-w-[200px]">
            <div className="bg-brand-bg p-4 rounded-brand border-2 border-brand-line flex items-center gap-3">
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                 {organizer?.avatar_url ? (
                   <Image src={organizer.avatar_url} alt={event.organizer_name} width={40} height={40} className="object-cover w-full h-full" />
                 ) : (
                   <div className="w-full h-full flex items-center justify-center font-extrabold text-gray-500">
                     {event.organizer_name.charAt(0)}
                   </div>
                 )}
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase text-brand-muted">Организатор</p>
                <Link href={`/@${organizer?.username || event.organizer_name}`} className="font-bold hover:text-brand-accent">
                  @{organizer?.username || event.organizer_name}
                </Link>
              </div>
            </div>

            <div className="bg-brand-bg p-3 rounded-brand border-2 border-brand-line text-center">
              <h3 className="text-[10px] font-extrabold uppercase text-brand-muted mb-1">Рейтинг события</h3>
              {eventRating && eventRating.total_reviews > 0 ? (
                <div className="flex items-center justify-center gap-1">
                  <span className="text-xl font-extrabold">{eventRating.average_rating}</span>
                  <span className="text-yellow-500 text-lg">★</span>
                  <span className="text-xs text-brand-muted font-bold ml-1">({eventRating.total_reviews})</span>
                </div>
              ) : (
                <p className="text-xs font-bold text-brand-muted">Пока нет отзывов</p>
              )}
            </div>
          </div>
        </div>
      </div>

{isOrganizer && event.status !== 'cancelled' && (
  <div className="mb-4 mt-4 pt-4 border-t-2 border-dashed border-brand-line">
    <EventAdminActions eventId={event.id} eventTitle={event.title} />
  </div>
)}

          {myAppStatus === 'approved' && (
          <div className="mt-4">
            <CancelParticipationButton eventId={event.id} eventTitle={event.title} />
          </div>
        )}

      {/* Кнопка оставить отзыв */}
      {canReview && (
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 mb-6">
          <h2 className="text-xl font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Поделитесь впечатлениями</h2>
          <ReviewForm eventId={event.id} />
        </div>
      )}

      {/* Сетка: Чат слева, Описание и Локация справа */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-6">
        
        {/* ЛЕВАЯ КОЛОНКА (Чат) */}
        <div>
          {(isOrganizer || myAppStatus === 'approved' || myAppStatus === 'pending') && viewer.kind === 'user' ? (
            <EventChat eventId={event.id} currentUserId={viewer.userId} />
          ) : (
            <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 text-center h-full flex flex-col justify-center items-center">
              <span className="text-4xl mb-4">💬</span>
              <h2 className="text-xl font-extrabold uppercase mb-2">Чат события</h2>
              <p className="text-brand-muted font-bold max-w-xs">Чат доступен только организатору и участникам с поданной заявкой.</p>
            </div>
          )}
        </div>

        {/* ПРАВАЯ КОЛОНКА (Описание + Карта) */}
        <div className="flex flex-col gap-6">
          
          {/* Описание */}
          <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
            <h2 className="text-lg font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Описание</h2>
            <p className="text-brand-text whitespace-pre-wrap leading-relaxed text-sm">{event.description}</p>
          </div>

          {/* Локация */}
          <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
            <h2 className="text-lg font-extrabold uppercase mb-4 border-b-2 border-brand-line pb-2">Локация</h2>
            {hasExactCoords ? (
              <ClientMapWrapper lat={event.lat} lng={event.lng} title={event.title} />
            ) : (
              <div className="h-48 bg-brand-bg border-2 border-dashed border-brand-line rounded flex items-center justify-center text-brand-muted font-bold text-center p-4 text-sm">
                Точное место откроется после подтверждения вашей заявки.
              </div>
            )}
          </div>

        </div>

      </div>
    </main>
  );
}
````

### `app/event/[id]/page_old.tsx`

``tsx
import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import EventChat from '@/components/EventChat';
import ClientMapWrapper from '@/components/ClientMapWrapper';


export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  
  const { data: { user } } = await supabase.auth.getUser();

  // Получаем событие
  const { data: event } = await supabase
    .from('events')
    .select(`
      *,
    profiles!events_organizer_profile_fkey (avatar_url, gender)
    `)
    .eq('id', id)
    .single();

  if (!event) notFound();

  

  // Проверяем, подавал ли текущий пользователь заявку
  let application = null;
  if (user) {
    const { data } = await supabase
      .from('applications')
      .select('status')
      .eq('event_id', id)
      .eq('user_id', user.id)
      .maybeSingle();
    application = data;
  }

  const isOrganizer = user?.id === event.organizer_id;
  const isApproved = application?.status === 'approved';
  const hasPendingApplication = application?.status === 'pending';
  const canAccessChat = isOrganizer || isApproved || hasPendingApplication;
  const canSeeExactLocation = !event.hide_location || isOrganizer || isApproved;

  return (
    <main className="max-w-[800px] mx-auto px-4 md:px-6 py-10 min-h-screen">
      
      {/* Хлебные крошки / Назад */}
      <Link href="/" className="text-brand-muted font-bold hover:text-brand-accent mb-6 inline-block">
        ← Назад к ленте
      </Link>

      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 md:p-8">
        
        {/* Заголовок и категория */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          
          <span className="text-[12px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2.5 py-1 rounded border border-brand-cat">
            {event.category}
          </span>
          <span className="text-[14px] font-extrabold bg-brand-bg px-3 py-1 rounded border-2 border-brand-line">
            {new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'long', day: 'numeric', month: 'long' })} в {new Date(event.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
          </span>

        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold mb-4">{event.title}</h1>

        <div className="flex items-center gap-2.5 text-sm text-brand-muted mb-8 pb-6 border-b-2 border-dashed border-brand-line">
          <span className="w-10 h-10 flex items-center justify-center rounded-full bg-brand-cat-soft text-brand-cat border-2 border-brand-cat font-extrabold text-lg uppercase">
            {event.organizer_name.charAt(0)}
          </span>
          <span>
            Организатор: <Link href={`/@${event.organizer_name}`} className="text-brand-text font-bold hover:text-brand-accent transition-colors">{event.organizer_name}</Link>
          </span>
        </div>

        {/* Описание */}
        <h2 className="text-xl font-extrabold mb-2">Описание</h2>
        <p className="text-brand-text mb-8 whitespace-pre-wrap">{event.description}</p>

        {/* Карта и место */}
        <h2 className="text-xl font-extrabold mb-2">Место встречи</h2>
        <p className="font-bold text-brand-muted mb-4">{event.location}</p>
        
               {event.lat && event.lng ? (
          <ClientMapWrapper
            lat={event.lat} 
            lng={event.lng} 
            title={event.title} 
            hideExactLocation={!canSeeExactLocation} 
          />
        ) : (
          <div className="p-4 bg-brand-bg rounded-brand">
            <p className="font-bold text-brand-muted text-sm">Организатор не указал точку на карте.</p>
          </div>
        )}

        {!canSeeExactLocation && (
          <div className="mt-4 p-4 bg-brand-heat/20 border-2 border-brand-heat rounded-brand text-brand-text font-bold text-sm">
            Точное место откроется после того, как организатор подтвердит вашу заявку.
          </div>
        )}

     

        {/* Действия (если это участник) */}

        {/* Блок чата (доступен только организатору и подтвержденным) */}
              {canAccessChat && user && (
          <div className="mt-10 border-t-2 border-dashed border-brand-line pt-8">
            <h2 className="text-xl font-extrabold mb-4">Обсуждение</h2>
            <EventChat eventId={event.id} currentUserId={user.id} />
          </div>
        )}

      </div>
    </main>
  );
}
````

### `app/favicon.ico`

_binary file, content skipped_

### `app/forgot-password/page.tsx`

``tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      
      if (error) throw error;
      
      showSuccess('Письмо для сброса пароля отправлено на вашу почту!');
      setEmail('');
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
        <h1 className="text-2xl font-extrabold uppercase mb-6 text-center">
          Сброс пароля
        </h1>
        <p className="text-sm text-brand-muted font-bold text-center mb-6">
          Введите email, привязанный к аккаунту. Мы отправим ссылку для создания нового пароля.
        </p>

        <form onSubmit={handleReset} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="your@email.com"
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Отправить ссылку'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/login" className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors">
            ← Вернуться ко входу
          </Link>
        </div>
      </div>
    </main>
  );
}
````

### `app/globals.css`

``css
@import url('https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,400..800&display=swap');
@import "tailwindcss";

@theme {
  --color-brand-bg: #EAE6D7;
  --color-brand-surface: #F4F1E8;
  --color-brand-text: #1A1C1A;
  --color-brand-muted: #5C605C;
  --color-brand-line: #1A1C1A;
  --color-brand-accent: #D85A1E;
  --color-brand-accent-ink: #FFFFFF;
  --color-brand-accent-soft: #F7D3C1;
  --color-brand-cat: #2F6F5E;
  --color-brand-cat-soft: #D5E5DF;
  
  --radius-brand: 4px;
  --radius-brand-lg: 8px;
  --radius-brand-99: 99px;
}

@layer base {
  [data-theme="dark"] {
    --color-brand-bg: #1A1C1A;
    --color-brand-surface: #262A26;
    --color-brand-text: #EAE6D7;
    --color-brand-muted: #9A9F9A;
    --color-brand-line: #EAE6D7;
    --color-brand-accent: #E46F38;
    --color-brand-accent-ink: #1A1C1A;
    --color-brand-accent-soft: #3A2015;
    --color-brand-cat: #63B19C;
    --color-brand-cat-soft: #1E312B;
  }

  body {
    background-color: var(--color-brand-bg);
    color: var(--color-brand-text);
    font-family: "Bricolage Grotesque", -apple-system, sans-serif;
    font-size: 15px;
    line-height: 1.45;
    -webkit-font-smoothing: antialiased;
    transition: background-color .3s, color .3s;
    margin: 0;
  }

  * { box-sizing: border-box; }
  button, input, select, textarea { font: inherit; color: inherit; }

    /* a11y: видимый фокус для клавиатуры, не мешает мыши */
  :focus-visible {
    outline: 2px solid var(--color-brand-accent);
    outline-offset: 2px;
    border-radius: var(--radius-brand);
  }

  /* a11y: убираем дефолтный outline только там, где задан focus-visible */
  :focus:not(:focus-visible) {
    outline: none;
  }

  /* a11y: ссылки и кнопки не должны терять фокус при переходах */
  a, button, [role="button"], input, select, textarea, summary {
    -webkit-tap-highlight-color: transparent;
  }
}

/* Делаем все рамки в проекте тоньше (1px вместо 2px) */
.border-2 {
  border-width: 1px !important;
}

/* =========================================
   1. Анимация выезда мобильных фильтров (снизу)
   ========================================= */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}

/* =========================================
   2. Анимация появления пунктов в мобильном меню
   ========================================= */
@keyframes slideDownFadeIn {
  from { opacity: 0; transform: translateY(-15px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-menu-item {
  opacity: 0;
  animation: slideDownFadeIn 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.delay-1 { animation-delay: 0.1s; }
.delay-2 { animation-delay: 0.2s; }
.delay-3 { animation-delay: 0.3s; }
.delay-4 { animation-delay: 0.4s; }
.delay-5 { animation-delay: 0.5s; }

/* =========================================
   3. Полоска загрузки (Progress bar)
   ========================================= */
@keyframes progress {
  0% { transform: scaleX(0); }
  50% { transform: scaleX(0.7); }
  100% { transform: scaleX(1); opacity: 0; }
}
.animate-progress {
  animation: progress 1.5s ease-in-out infinite;
}

/* =========================================
   4. Плавные аккордеоны (details/summary)
   ========================================= */
details .details-content {
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.3s ease-out;
}

details[open] .details-content {
  grid-template-rows: 1fr;
}

details .details-inner {
  overflow: hidden;
}

/* Убираем стандартный маркер (треугольник) у details */
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}

/* =========================================
   5. Прочие утилиты для Leaflet (Карты)
   ========================================= */
.leaflet-container {
  font-family: inherit;
  z-index: 0;
}

@keyframes fade-in-up {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fade-in-up 0.3s ease-out forwards;
}

/* Фикс для Telegram Login Widget */
iframe[src*="telegram.org"] {
  position: static !important;
  display: block !important;
  margin: 0 auto !important;
}
````

### `app/layout.tsx`

``tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition";
import { ToastProvider } from "@/components/Toast";
import Link from 'next/link';

export const metadata: Metadata = {
  title: "Намылимся. — Лента",
  description: "Площадка для живых встреч",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-theme="light" suppressHydrationWarning>
      <head>
        <script src="https://telegram.org/js/telegram-widget.js?23" async></script>
        {/* Скрипт для мгновенного применения темы до рендера (чтобы не было вспышки) */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('theme');
                if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                  document.documentElement.setAttribute('data-theme', 'light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen flex flex-col">
        <ToastProvider>
        <Header />
        
        <PageTransition>
          {children}
        </PageTransition>

          <footer className="max-w-[1100px] w-full mx-auto mt-20 px-6 py-5 text-brand-muted text-[13px] border-t-2 border-brand-line flex justify-between items-center">
          <div>
            <p>«Намылимся.» — площадка для живых встреч. Ответственность за проведение событий лежат на организаторах и участниках.</p>
            <p>16+ · Правила сообщества · <Link href="/support" className="hover:text-brand-accent transition-colors">Написать в поддержку</Link></p>
          </div>
        </footer>

        </ToastProvider>
      </body>
    </html>
  );
}
````

### `app/loading.tsx`

``tsx
export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] overflow-hidden bg-brand-bg">
      <div className="w-full h-full bg-brand-accent animate-progress origin-left"></div>
    </div>
  );
}
````

### `app/login/page.tsx`

``tsx
'use client';

import { useState, useEffect, Suspense } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const searchParams = useSearchParams();
  const isRegisterMode = searchParams.get('mode') === 'register';
  const [gender, setGender] = useState('none');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [cities, setCities] = useState<string[]>([]);
  const [city, setCity] = useState('');
  const [isLogin, setIsLogin] = useState(!isRegisterMode);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    supabase.from('cities').select('name').order('name').then(({ data }) => {
      if (data) setCities(data.map((c) => c.name));
    });
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setIsLogin(!isRegisterMode), 0);
    return () => clearTimeout(timer);
  }, [isRegisterMode]);

  // === ВХОД ЧЕРЕЗ GOOGLE ===
  const handleGoogleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };
 // === ВХОД ЧЕРЕЗ VK ===
  const handleVkLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'vk' as any, // <-- Добавили as any, чтобы TypeScript не ругался
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setMessage(error.message);
      setLoading(false);
    }
  };

  // === ВХОД ПО EMAIL ===
  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
        const { error: authError } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { username, gender, city } },
        });

        if (authError) {
          if (authError.message.includes('duplicate key') || authError.message.includes('unique constraint')) {
            throw new Error('Этот никнейм уже занят. Придумайте другой.');
          }
          throw authError;
        }
        setMessage('Регистрация успешна! Теперь вы можете войти.');
        setIsLogin(true);
      }
    } catch (error) {
      let msg = 'Произошла неизвестная ошибка';
      if (error instanceof Error) {
        if (error.message.includes('duplicate key') || error.message.includes('unique constraint')) {
          msg = 'Этот никнейм уже занят.';
        } else if (error.message.includes('Password should be at least')) {
          msg = 'Пароль слишком короткий (минимум 6 символов).';
        } else {
          msg = error.message;
        }
      }
      setMessage(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
      <h1 className="text-2xl font-extrabold uppercase mb-6 text-center">
        {isLogin ? 'Вход в Намылимся' : 'Регистрация'}
      </h1>

      {message && (
        <div className="mb-4 p-3 bg-brand-bg rounded-brand text-sm font-bold text-center">
          {message}
        </div>
      )}

      {/* Кнопки OAuth (Google и VK) */}
      <div className="w-full flex flex-col gap-3 mb-6">
        <button
          type="button"
          onClick={handleGoogleLogin}
          disabled={loading}
          className="w-full bg-white text-gray-800 font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-gray-300 rounded-brand hover:bg-gray-100 transition-colors flex items-center justify-center gap-2"
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Войти через Google
        </button>
        
        <button
          type="button"
          onClick={handleVkLogin}
          disabled={loading}
          className="w-full bg-[#0077FF] text-white font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-[#005BCC] rounded-brand hover:bg-[#0066DD] transition-colors flex items-center justify-center gap-2"
        >
          Войти через ВКонтакте
        </button>
      </div>

      <div className="flex items-center gap-2 w-full mb-6">
        <div className="flex-1 h-px bg-brand-line/50"></div>
        <span className="text-xs font-bold text-brand-muted uppercase">или по email</span>
        <div className="flex-1 h-px bg-brand-line/50"></div>
      </div>

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш никнейм</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9_]/g, ''))}
              required
              minLength={3}
              maxLength={32}
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent"
            />
          </div>
        )}

        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш город</label>
            <select
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent"
            >
              <option value="" disabled>Выберите город</option>
              {cities.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Пароль</label>
            {isLogin && <Link href="/forgot-password" className="text-[11px] font-bold text-brand-accent hover:underline">Забыли пароль?</Link>}
          </div>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2.5 pr-10 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text"
            >
              {showPassword ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : isLogin ? 'Войти' : 'Зарегистрироваться'}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button onClick={() => setIsLogin(!isLogin)} className="text-sm font-bold text-brand-muted hover:text-brand-accent">
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <Suspense fallback={<div className="text-center font-bold">Загрузка формы...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
````

### `app/my-events/loading.tsx`

``tsx
export default function MyEventsLoading() {
  return (
    <main className="max-w-[1280px] mx-auto px-6 py-10 min-h-screen">
      <div className="h-10 w-64 bg-brand-line/20 animate-pulse rounded mb-8 border-b-2 border-brand-line pb-4"></div>
      
      <div className="flex flex-col gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 h-64 animate-pulse">
            <div className="h-8 w-1/2 bg-brand-line/20 mb-4 rounded"></div>
            <div className="h-4 w-1/3 bg-brand-line/20 mb-8 rounded"></div>
            <div className="grid grid-cols-2 gap-6 border-t-2 border-dashed border-brand-line pt-6">
              <div className="h-20 bg-brand-line/20 rounded"></div>
              <div className="h-20 bg-brand-line/20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
````

### `app/my-events/page.tsx`

``tsx
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ApplicationActions from '@/components/ApplicationActions';
import { getUnreadCounts } from '@/app/actions';
import Image from 'next/image'; // <--- ДОБАВЛЕН ИМПОРТ

// Явно описываем типы для TypeScript
type EventType = {
  id: string;
  title: string;
  date_time: string;
  organizer_name: string;
  max_participants: number;
  status: string;           // <--- ДОБАВЛЕНО
  cancel_reason?: string;   // <--- ДОБАВЛЕНО
};

type ApplicationType = {
  id: string;
  status: string;
  event_id: string;
  user_id: string;
  profiles?: { username: string } | { username: string }[] | null; // <--- ИСПРАВЛЕНО на profiles
};

export default async function MyEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 1. Получаем события пользователя
  const { data: events } = await supabase
    .from('events')
    .select('id, title, date_time, organizer_name, max_participants, status, cancel_reason') // <--- ДОБАВЛЕНО status и cancel_reason
    .eq('organizer_id', user.id)
    .order('date_time', { ascending: true }) as { data: EventType[] | null };

  const eventIds = events?.map(e => e.id) || [];

  // 2. Получаем заявки (БЕЗ JOIN)
  const { data: applications, error: appsError } = await supabase
    .from('applications')
    .select('id, status, event_id, user_id')
    .in('event_id', eventIds) as { data: ApplicationType[] | null, error: any };

  if (appsError) {
    console.error("КРИТИЧЕСКАЯ ОШИБКА загрузки заявок:", appsError);
  }

  // 3. Получаем профили для этих заявок
  let applicationsWithProfiles: ApplicationType[] = [];
  if (applications && applications.length > 0) {
    const userIds = [...new Set(applications.map(app => app.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds) as { data: { id: string, username: string }[] | null };

    // Сшиваем заявки с профилями (переименовываем в profiles)
    applicationsWithProfiles = applications.map(app => ({
      ...app,
      profiles: profiles?.find(p => p.id === app.user_id) || null
    }));
  }

  // 4. Получаем МОИ заявки (для блока "Я участник")
  const { data: myApplications } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      events!fk_applications_event ( 
        id, 
        title, 
        date_time, 
        organizer_name,
        status,
        cancel_reason,
        profiles!events_organizer_profile_fkey ( username, avatar_url, gender )
      )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false }) as { data: any[] | null };

  // 5. Счетчики непрочитанных
  const myAppEventIds = (myApplications || [])
    .map(app => Array.isArray(app.events) ? app.events[0]?.id : app.events?.id)
    .filter(Boolean) as string[];

  const allEventIds = [...new Set([...eventIds, ...myAppEventIds])];
  const unreadCounts = await getUnreadCounts(allEventIds);

  // Группируем
  const appsByEvent = applicationsWithProfiles.reduce((acc, app) => {
    if (!acc[app.event_id]) acc[app.event_id] = [];
    acc[app.event_id].push(app);
    return acc;
  }, {} as Record<string, ApplicationType[]>);

  return (
    <main className="max-w-[1100px] mx-auto px-4 md:px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-extrabold uppercase mb-8 border-b-2 border-brand-line pb-4">
        Мои события и заявки
      </h1>

      {/* === БЛОК: Я ОРГАНИЗАТОР === */}
      {(!events || events.length === 0) ? (
        <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold mb-12">
          Вы пока не создали ни одного события.
        </div>
      ) : (
        <div className="flex flex-col gap-8 mb-12">
          {events.map((event) => {
            const eventApps = appsByEvent[event.id] || [];
            const pendingApps = eventApps.filter(app => app.status === 'pending');
            const approvedApps = eventApps.filter(app => app.status === 'approved');
            const unread = unreadCounts[event.id] || 0;

            return (
              <div key={event.id} className={`relative bg-brand-surface border-2 rounded-brand-lg p-5 md:p-6 ${event.status === 'cancelled' ? 'border-red-300 opacity-80' : 'border-brand-line'}`}>
                
                {unread > 0 && event.status !== 'cancelled' && (
                  <div className="absolute top-5 right-5 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-md">
                    В чате {unread} новых
                  </div>
                )}

                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    {event.status === 'cancelled' && (
                      <div className="mb-2 inline-block bg-red-100 text-red-700 px-2 py-0.5 rounded text-[10px] uppercase font-extrabold border border-red-300">
                        Отменено
                      </div>
                    )}
                    
           

                    <h2 className={`text-2xl font-extrabold mb-2 pr-24 ${event.status === 'cancelled' ? 'line-through text-brand-muted' : ''}`}>
                      {event.title}
                    </h2>
                    <p className="text-brand-muted font-bold text-sm">
                      {new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })} в {new Date(event.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>

                    <div className="mt-2 text-[11px] font-bold text-brand-cat bg-brand-cat-soft inline-flex items-center gap-1 px-2 py-1 rounded border border-brand-cat/20">
                      <span>👤</span> Лимит: {event.max_participants} чел.
                    </div>


                  </div>
                  
                  <div className="flex flex-col sm:items-end gap-2">
                    <Link 
                      href={`/event/${event.id}`} 
                      className="bg-brand-bg text-brand-text font-extrabold text-[12px] uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-cat-soft transition-colors w-fit whitespace-nowrap"
                    >
                      Перейти к событию →
                    </Link>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t-2 border-dashed border-brand-line pt-6">
                  <div>
                    <h3 className="font-extrabold uppercase mb-3 text-brand-accent text-sm">Новые заявки ({pendingApps.length})</h3>
                    {pendingApps.length === 0 ? (
                      <p className="text-sm text-brand-muted font-bold bg-brand-bg/50 p-3 rounded border border-brand-line/50">Новых заявок нет.</p>
                    ) : (
                      <ul className="flex flex-col gap-3">
                        {pendingApps.map((app) => {
                          const profile = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles;
                          return (
                            <li key={app.id} className="flex items-center justify-between bg-brand-bg p-2 rounded-brand border border-brand-line">
                              <span className="font-bold text-sm truncate mr-2">@{profile?.username || 'Пользователь'}</span>
                              <ApplicationActions applicationId={app.id} />
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold uppercase mb-3 text-green-600 text-sm">Подтверждены ({approvedApps.length})</h3>
                    {approvedApps.length === 0 ? (
                      <p className="text-sm text-brand-muted font-bold bg-brand-bg/50 p-3 rounded border border-brand-line/50">Пока никого нет.</p>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {approvedApps.map((app) => {
                          const profile = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles;
                          return (
                            <li key={app.id} className="bg-brand-bg p-2 rounded-brand border border-brand-line text-sm font-bold truncate flex justify-between">
                              <span>@{profile?.username || 'Пользователь'}</span>
                              <span className="text-green-600">✓</span>
                            </li>
                          );
                        })}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === БЛОК: Я УЧАСТНИК === */}
      <div className="mt-16">
        <h2 className="text-2xl font-extrabold uppercase mb-6 border-b-2 border-brand-line pb-4">
          События, куда я записался
        </h2>

        {(!myApplications || myApplications.length === 0) ? (
          <div className="text-center py-8 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
            Вы пока не подавали заявки на события.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myApplications.map((app) => {
              const event = Array.isArray(app.events) ? app.events[0] : app.events;
              if (!event) return null;

              const unread = unreadCounts[event.id] || 0;
              const isEventCancelled = event.status === 'cancelled';

              const organizer = Array.isArray(event.profiles) ? event.profiles[0] : event.profiles;
              const orgAvatar = organizer?.avatar_url;
              const orgName = organizer?.username || event.organizer_name;
              const orgGender = organizer?.gender;

              let statusText = 'Ожидает подтверждения';
              let statusColor = 'text-brand-accent border-brand-accent bg-brand-accent/10';
              
              if (app.status === 'approved') {
                statusText = 'Вы записаны ✓';
                statusColor = 'text-green-700 border-green-700 bg-green-100';
              } else if (app.status === 'rejected') {
                statusText = 'Отклонено';
                statusColor = 'text-red-600 border-red-600 bg-red-100';
              }

              if (isEventCancelled) {
                statusText = 'Событие отменено';
                statusColor = 'text-red-700 border-red-700 bg-red-100';
              }

              return (
                <div key={app.id} className={`relative bg-brand-surface border-2 rounded-brand-lg p-5 flex flex-col gap-4 ${isEventCancelled ? 'border-red-300 opacity-80' : 'border-brand-line'}`}>
                  
                  {unread > 0 && !isEventCancelled && (
                    <div className="absolute top-4 right-4 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full animate-pulse">
                      В чате {unread}
                    </div>
                  )}

                  

                  <div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      <span className={`inline-block px-3 py-1 text-xs font-extrabold uppercase rounded border-2 ${statusColor}`}>
                        {statusText}
                      </span>
                    </div>


                    
                    <h3 className={`text-xl font-extrabold mb-1 pr-16 ${isEventCancelled ? 'line-through text-brand-muted' : ''}`}>
                      {event.title}
                    </h3>
                    <p className="text-brand-muted font-bold text-sm">
                      {new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })} в {new Date(event.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>


                  </div>
                  
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-brand-line flex justify-between items-center">
                    <Link href={`/@${orgName}`} className="flex items-center gap-2 group">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 overflow-hidden border-2
                        ${orgGender === 'male' ? 'bg-blue-100 text-blue-800 border-blue-400' : 
                          orgGender === 'female' ? 'bg-pink-100 text-pink-800 border-pink-400' : 
                          'bg-gray-200 text-gray-700 border-brand-line'}
                      `}>
                        {orgAvatar ? (
                          <Image src={orgAvatar} alt={orgName} width={32} height={32} className="w-full h-full object-cover" />
                        ) : (
                          orgName.charAt(0).toUpperCase()
                        )}
                      </div>
                      <span className="text-sm font-bold text-brand-text group-hover:text-brand-accent transition-colors">
                        @{orgName}
                      </span>
                    </Link>

                    <Link href={`/event/${event.id}`} className="text-brand-accent font-extrabold text-sm uppercase hover:underline">
                      Перейти →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}
````

### `app/not-found.tsx`

``tsx
import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 text-center">
        <h1 className="text-6xl font-extrabold text-brand-accent mb-2">404</h1>
        <h2 className="text-xl font-extrabold uppercase mb-4">
          Страница не найдена
        </h2>
        <p className="text-brand-muted font-bold mb-6">
          Возможно, событие было удалено или ссылка неверна.
        </p>
        <Link
          href="/"
          className="inline-block bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors"
        >
          Вернуться в ленту
        </Link>
      </div>
    </main>
  );
}
````

### `app/page.tsx`

``tsx
import { Suspense } from 'react';
import EventList from '@/components/EventList';
import Sidebar from '@/components/Sidebar';
import CreateEventForm from '@/components/CreateEventForm';
import MobileFilters from '@/components/MobileFilters';

function EventSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      {[1, 2].map((i) => (
        <div key={i} className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5 h-[250px] animate-pulse">
          <div className="h-6 w-1/3 bg-brand-line/20 mb-4 rounded"></div>
          <div className="h-8 w-3/4 bg-brand-line/20 mb-4 rounded"></div>
          <div className="h-16 w-full bg-brand-line/20 mb-4 rounded"></div>
          <div className="h-10 w-full bg-brand-line/20 rounded"></div>
        </div>
      ))}
    </div>
  );
}

export default function Home({
  searchParams,
}: {
  searchParams: Promise<{ page?: string, category?: string, date_from?: string, date_to?: string }>;
}) {
  return (
    <main className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start mt-6 px-4 md:px-6 pb-12 relative">
      
      <div className="flex flex-col gap-6">
        
        {/* ВОЗВРАЩАЕМ ФОРМУ СОЗДАНИЯ */}
        <details className="bg-brand-surface border-2 border-brand-line rounded-brand-lg overflow-hidden group">
          <summary className="list-none cursor-pointer flex items-center gap-3 p-5 font-extrabold text-lg uppercase hover:bg-brand-bg/50 transition-colors">
            <span className="w-7 h-7 flex items-center justify-center border-2 border-brand-line rounded-full bg-brand-accent text-brand-accent-ink text-xl leading-none group-open:rotate-45 transition-transform duration-300">+</span>
            Создать событие
          </summary>
          <div className="details-content">
            <div className="details-inner">
              <div className="p-6 border-t-2 border-brand-line">
                <CreateEventForm />
              </div>
            </div>
          </div>
        </details>

        <MobileFilters />

        <Suspense fallback={<EventSkeleton />}>
          <EventList searchParams={searchParams} />
        </Suspense>

      </div>

      <div className="hidden lg:block">
        <Suspense fallback={<div className="h-40 bg-brand-surface animate-pulse rounded" />}>
          <Sidebar />
        </Suspense>
      </div>
    </main>
  );
}
````

### `app/reset-password/page.tsx`

``tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';

export default function ResetPasswordPage() {
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { showSuccess, showError } = useToast();

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 6) {
      showError('Пароль должен быть не менее 6 символов');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;

      showSuccess('Пароль успешно изменен! Перенаправляем...');
      setTimeout(() => router.push('/'), 1500); // Ждем 1.5 сек, чтобы человек прочитал, и редиректим
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Ошибка смены пароля');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
        <h1 className="text-2xl font-extrabold uppercase mb-6 text-center">
          Новый пароль
        </h1>

        <form onSubmit={handleUpdate} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Придумайте новый пароль</label>
            <div className="relative">
              <input 
                type={showPassword ? 'text' : 'password'}
                value={password} 
                onChange={(e) => setPassword(e.target.value)} 
                required
                minLength={6}
                placeholder="••••••••"
                className="w-full p-2.5 pr-10 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-brand-muted hover:text-brand-text transition-colors"
                aria-label={showPassword ? "Скрыть пароль" : "Показать пароль"}
              >
                {showPassword ? (
                  // Иконка "глаз перечеркнут"
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                ) : (
                  // Иконка "глаз"
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                )}
              </button>
            </div>
            <span className="text-[11px] text-brand-muted font-bold">Минимум 6 символов</span>
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
          >
            {loading ? 'Сохранение...' : 'Сохранить пароль'}
          </button>
        </form>
      </div>
    </main>
  );
}
````

### `app/settings/page.tsx`

``tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';


const INTERESTS_LIST = [
  'Спорт', 'Кино', 'Музыка', 'Игры', 'Книги', 'Фотография', 'Кулинария', 'Путешествия', 
  'Искусство', 'IT и технологии', 'Животные', 'Психология', 'Бизнес', 'Танцы', 'Театр', 
  'Йога', 'Настолки', 'Автомобили', 'Мода', 'Наука'
];

export default function SettingsPage() {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
const [profile, setProfile] = useState<{ id: string; username: string } | null>(null);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Стейты полей
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('none');
  const [bio, setBio] = useState('');
  const [telegram, setTelegram] = useState('');
  const [vk, setVk] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setProfile(data);
          setUsernameInput(data.username || '');
          setAge(data.age?.toString() || '');
          setGender(data.gender || 'none');
          setBio(data.bio || '');
          setTelegram(data.telegram || '');
          setVk(data.vk || '');
          setInterests(data.interests || []);
        }
        setLoading(false);
      });
    });
  }, [router]);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      if (interests.length >= 5) {
        showError('Можно выбрать не более 5 увлечений');
        return;
      }
      setInterests([...interests, interest]);
    }
  };

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!profile) return;
  
  // Простая валидация ника
  if (usernameInput.length < 3) {
    showError('Никнейм должен быть не короче 3 символов');
    return;
  }

  setSaving(true);
  try {
    const { error } = await supabase.from('profiles').update({
      username: usernameInput, // <--- ДОБАВЬ ЭТО
      age: age ? parseInt(age) : null,
      gender,
      bio: bio.trim() || null,
      telegram: telegram.trim() || null,
      vk: vk.trim() || null,
      interests: interests.length > 0 ? interests : null
    }).eq('id', profile.id);

    if (error) {
      // Если база выдала ошибку уникальности (такой ник уже есть)
      if (error.code === '23505') {
        throw new Error('Этот никнейм уже занят. Выберите другой.');
      }
      throw error;
    }
    
    showSuccess('Профиль успешно обновлен!');
    // Обновляем URL профиля, если ник изменился
    router.push(`/@${usernameInput}`);
    router.refresh();
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Ошибка сохранения профиля');
  } finally {
    setSaving(false);
  }
};

  if (loading) return <div className="text-center py-20 font-bold">Загрузка...</div>;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 md:p-8">
        <h1 className="text-2xl font-extrabold uppercase mb-6 border-b-2 border-brand-line pb-4">
          Настройки профиля
        </h1>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 mb-4">
  <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш никнейм (публичное имя)</label>
  <input 
    type="text" 
    value={usernameInput} 
    onChange={e => setUsernameInput(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9_]/g, ''))} 
    required 
    minLength={3}
    maxLength={32}
    className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent" 
  />
  <span className="text-[11px] text-brand-muted font-bold">Разрешены буквы, цифры и _. Должен быть уникальным.</span>
</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-extrabold uppercase text-brand-muted">Возраст</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} min="14" max="99" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-extrabold uppercase text-brand-muted">Пол</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent">
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="none">Не указывать</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">О себе</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={500} placeholder="Расскажите о себе, чем занимаетесь, что ищете..." className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted flex justify-between">
              <span>Увлечения</span>
              <span className="text-brand-accent">Выбрано: {interests.length}/5</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {INTERESTS_LIST.map(interest => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-colors ${
                    interests.includes(interest) 
                      ? 'bg-brand-accent text-white border-brand-accent' 
                      : 'bg-brand-bg text-brand-text border-brand-line hover:border-brand-accent'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-dashed border-brand-line pt-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-extrabold uppercase text-brand-muted">Telegram (без @)</label>
              <input type="text" value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="username" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent" />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" onClick={() => router.back()} className="flex-1 bg-brand-bg text-brand-text font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-surface transition-colors">
              Отмена
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}
````

### `app/support/page.tsx`

``tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import Link from 'next/link';

export default function SupportPage() {
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Оспорить блокировку');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const { showError } = useToast();

  // Если пользователь авторизован, подтягиваем его email
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user?.email) {
        setEmail(user.email);
      }
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 10) {
      showError('Сообщение должно быть не короче 10 символов');
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from('support_tickets').insert({
        email,
        subject,
        message,
      });

      if (error) throw error;
      
      setSuccess(true);
      setMessage('');
    } catch (error) {
      console.error(error);
      showError('Не удалось отправить обращение. Попробуйте позже.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <main className="max-w-md mx-auto mt-20 px-6">
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8 text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h1 className="text-2xl font-extrabold uppercase mb-4">Обращение отправлено!</h1>
          <p className="text-brand-muted font-bold mb-6">
            Мы получили ваше сообщение и ответим на него по указанному email в ближайшее время.
          </p>
          <Link href="/" className="inline-block bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors">
            Вернуться на главную
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="max-w-md mx-auto mt-20 px-6 mb-20">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
        <h1 className="text-2xl font-extrabold uppercase mb-2 text-center">Поддержка</h1>
        <p className="text-sm text-brand-muted font-bold text-center mb-6">
          Опишите вашу проблему или предложение, и мы свяжемся с вами.
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              required
              placeholder="your@email.com"
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Тема обращения</label>
            <select 
              value={subject} 
              onChange={(e) => setSubject(e.target.value)}
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors"
            >
              <option value="Оспорить блокировку">Оспорить блокировку</option>
              <option value="Пожаловаться на нарушение">Пожаловаться на нарушение</option>
              <option value="Предложение по улучшению">Предложение по улучшению сервиса</option>
              <option value="Другое">Другое</option>
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Сообщение</label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Подробно опишите вашу ситуацию..."
              rows={5}
              required
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
          >
            {loading ? 'Отправка...' : 'Отправить обращение'}
          </button>
        </form>
      </div>
    </main>
  );
}
````

### `bundle-project.ps1`

``powershell
# tools/bundle-project.ps1  (ASCII-only, safe in any encoding)
param(
    [string]$OutputFile = "project-bundle.md",
    [string]$Root = (Get-Location).Path
)

Set-Location $Root
$Root = (Get-Location).Path

$excludeDirs = @(
    'node_modules', '.next', '.git', 'dist', 'build', 'coverage',
    '.turbo', '.vercel', 'out', '.idea', '.vscode', '.cache'
)

$excludeFileGlobs = @(
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'next-env.d.ts',
    'tree.txt', 'tree-security.txt',
    'project-bundle.md', 'security-bundle.md',
    '*.log',
    'public/**/*.png', 'public/**/*.jpg', 'public/**/*.jpeg',
    'public/**/*.svg', 'public/**/*.gif', 'public/**/*.webp',
    'public/**/*.ico',
    '**/*.map'
)

$binaryExt = @('.png','.jpg','.jpeg','.gif','.webp','.ico','.pdf','.zip',
               '.woff','.woff2','.ttf','.otf','.mp4','.mp3','.lock')

# --- custom recursive walk that PRUNES excluded dirs (no descent) ---
$allFiles = New-Object System.Collections.Generic.List[object]

function Walk {
    param([string]$Dir, [string]$RelPrefix)

    Get-ChildItem -LiteralPath $Dir -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $item = $_

        # skip symlinks / junctions to avoid loops
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { return }

        $rel = if ($RelPrefix) { "$RelPrefix/$($item.Name)" } else { $item.Name }

        if ($item.PSIsContainer) {
            if ($excludeDirs -contains $item.Name) { return }   # prune
            Walk -Dir $item.FullName -RelPrefix $rel
        } else {
            foreach ($glob in $excludeFileGlobs) {
                if ($rel -like $glob) { return }
            }
            $allFiles.Add([pscustomobject]@{
                Full = $item.FullName
                Rel  = $rel
                Ext  = $item.Extension.ToLower()
            })
        }
    }
}

Walk -Dir $Root -RelPrefix ''

$allFiles = $allFiles | Sort-Object Rel

# --- build tree (ASCII) ---
$treeLines = New-Object System.Collections.Generic.List[string]
$treeLines.Add((Split-Path $Root -Leaf) + '/')

$tree = @{}
foreach ($f in $allFiles) {
    $parts = $f.Rel -split '/'
    $node = $tree
    for ($i=0; $i -lt $parts.Count; $i++) {
        $p = $parts[$i]
        $isFile = ($i -eq $parts.Count - 1)
        if ($isFile) { $node[$p] = $null }
        else {
            if (-not $node.ContainsKey($p)) { $node[$p] = @{} }
            $node = $node[$p]
        }
    }
}

function Render-Tree {
    param($Node, [string]$Prefix)
    $keys = $Node.Keys | Sort-Object {
        if ($Node[$_] -eq $null) { 1 } else { 0 }
    }, { $_ }
    for ($i=0; $i -lt $keys.Count; $i++) {
        $k = $keys[$i]
        $isLast = ($i -eq $keys.Count - 1)
        $conn = if ($isLast) { '\-- ' } else { '|-- ' }
        $suffix = if ($Node[$k] -eq $null) { '' } else { '/' }
        $script:treeLines.Add("$Prefix$conn$k$suffix")
        if ($Node[$k] -ne $null) {
            $newPrefix = $Prefix + $(if ($isLast) { '    ' } else { '|   ' })
            Render-Tree -Node $Node[$k] -Prefix $newPrefix
        }
    }
}
Render-Tree -Node $tree -Prefix ''

function Get-Lang {
    param([string]$Ext)
    switch ($Ext) {
        '.ts'   { 'ts' }   '.tsx' { 'tsx' }  '.js'  { 'js' }
        '.jsx'  { 'jsx' }  '.mjs' { 'js' }   '.cjs' { 'js' }
        '.json' { 'json' } '.css' { 'css' }  '.scss'{ 'scss' }
        '.html' { 'html' } '.md'  { 'md' }
        '.yml'  { 'yaml' } '.yaml'{ 'yaml' }
        '.ps1'  { 'powershell' }
        '.sql'  { 'sql' }
        '.env'  { 'bash' }
        default { '' }
    }
}

# --- stream output directly to file (no StringBuilder) ---
$outPath = Join-Path $Root $OutputFile
$utf8 = New-Object System.Text.UTF8Encoding($false)  # no BOM
$sw = New-Object System.IO.StreamWriter($outPath, $false, $utf8)

try {
    $sw.WriteLine("# Project bundle")
    $sw.WriteLine()
    $sw.WriteLine("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')")
    $sw.WriteLine("Root: $Root")
    $sw.WriteLine()
    $sw.WriteLine("## Tree")
    $sw.WriteLine()
    $sw.WriteLine('```')
    foreach ($line in $treeLines) { $sw.WriteLine($line) }
    $sw.WriteLine('```')
    $sw.WriteLine()
    $sw.WriteLine("## Files")
    $sw.WriteLine()

    foreach ($f in $allFiles) {
        $rel = $f.Rel
        $isEnv = (Split-Path $rel -Leaf) -like '.env*'

        if ($binaryExt -contains $f.Ext) {
            $sw.WriteLine("### ``$rel``")
            $sw.WriteLine()
            $sw.WriteLine("_binary file, content skipped_")
            $sw.WriteLine()
            continue
        }

        $content = $null
        try {
            $content = Get-Content -LiteralPath $f.Full -Raw -Encoding utf8 -ErrorAction Stop
        } catch {
            $sw.WriteLine("### ``$rel``")
            $sw.WriteLine()
            $sw.WriteLine("_read error: $($_.Exception.Message)_")
            $sw.WriteLine()
            continue
        }
        if ($null -eq $content) { $content = '' }

        $lang = Get-Lang $f.Ext

        if ($isEnv) {
            $content = ($content -split "`r?`n" | ForEach-Object {
                if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$') {
                    "$($Matches[1])=***REDACTED***"
                } else { $_ }
            }) -join "`n"
            $lang = 'bash'
        }

        $sw.WriteLine("### ``$rel``")
        $sw.WriteLine()
        $sw.WriteLine("````$lang")
        $sw.WriteLine($content)
        $sw.WriteLine('````')
        $sw.WriteLine()
    }
}
finally {
    $sw.Flush()
    $sw.Close()
}

$sizeKb = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
Write-Host "OK: $outPath"
Write-Host "   Files: $($allFiles.Count)"
Write-Host "   Size:  $sizeKb KB"
````

### `components/admin/AdminEventActions.tsx`

``tsx
'use client';

import { useState } from 'react';
import { adminDeleteEvent } from '@/app/actions';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';

export default function AdminEventActions({ eventId }: { eventId: string }) {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleDelete = async () => {
    if (!confirm('ВНИМАНИЕ! Вы уверены, что хотите НАВСЕГДА удалить это событие? Все заявки и сообщения в чате также будут удалены.')) return;

    setLoading(true);
    try {
      const res = await adminDeleteEvent(eventId);
      if (res?.error) showError(res.error);
      else {
        showSuccess('Событие удалено');
        router.refresh();
      }
    } catch (error) {
      showError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDelete}
      disabled={loading}
      className="text-xs font-bold px-3 py-1.5 bg-red-100 text-red-700 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors disabled:opacity-50"
    >
      {loading ? 'Удаление...' : 'Удалить'}
    </button>
  );
}
````

### `components/admin/TicketActions.tsx`

``tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import { useToast } from '@/components/Toast';

export default function TicketActions({ ticketId, currentStatus, userEmail }: { ticketId: string, currentStatus: string, userEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [banLoading, setBanLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // 1. Смена статуса тикета
  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = currentStatus === 'new' ? 'resolved' : 'new';
    const { error } = await supabase.from('support_tickets').update({ status: newStatus }).eq('id', ticketId);
    
    if (error) showError('Ошибка обновления');
    else {
      showSuccess(newStatus === 'resolved' ? 'Отмечено как решенное' : 'Возвращено в новые');
      router.refresh();
    }
    setLoading(false);
  };

  // 2. Разбан пользователя по email
  const handleUnban = async () => {
    if (!confirm(`Попытаться разбанить пользователя с email ${userEmail}?`)) return;
    
    setBanLoading(true);
    try {
      // Ищем пользователя по email в профиле
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', userEmail)
        .single();

      if (!profile) {
        showError('Пользователь с таким email не найден');
        return;
      }

      // Снимаем бан
      const { error } = await supabase
        .from('profiles')
        .update({ is_banned: false })
        .eq('id', profile.id);

      if (error) throw error;
      
      showSuccess('Пользователь успешно разбанен!');
      router.refresh();
    } catch {
      showError('Ошибка при разбане');
    } finally {
      setBanLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      <button 
        onClick={toggleStatus} 
        disabled={loading} 
        className={`text-xs font-bold px-3 py-1.5 border-2 rounded-brand transition-colors ${
          currentStatus === 'new' ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' : 'bg-gray-100 text-gray-600 border-gray-300 hover:bg-gray-200'
        }`}
      >
        {loading ? '...' : currentStatus === 'new' ? 'Отметить решенным' : 'Вернуть в новые'}
      </button>
      
      {/* Кнопка разбана (показываем только если статус тикета - 'new') */}
      {currentStatus === 'new' && (
        <button 
          onClick={handleUnban} 
          disabled={banLoading} 
          className="text-xs font-bold px-3 py-1.5 bg-brand-surface text-brand-text border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors"
        >
          {banLoading ? '...' : 'Разбанить'}
        </button>
      )}
    </div>
  );
}
````

### `components/admin/UserActions.tsx`

``tsx
'use client';

import { useState } from 'react';
import { updateUserRole, toggleUserBan } from '@/app/actions';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';

export default function UserActions({ 
  userId, 
  currentRole, 
  isBanned,
  currentAdminId
}: { 
  userId: string; 
  currentRole: string; 
  isBanned: boolean;
  currentAdminId: string;
}) {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Если это сам админ — не даем ему менять себя
  const isSelf = userId === currentAdminId;

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'user' | 'moderator' | 'admin';
    if (newRole === currentRole) return;

    if (!confirm(`Вы уверены, что хотите назначить роль "${newRole}"?`)) {
      e.target.value = currentRole; // Откатываем визуально
      return;
    }

    setLoading(true);
    try {
      const res = await updateUserRole(userId, newRole);
      if (res?.error) {
        showError(res.error);
        e.target.value = currentRole;
      } else {
        showSuccess('Роль успешно изменена');
        router.refresh();
      }
    } catch (error) {
      showError('Ошибка сети');
      e.target.value = currentRole;
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async () => {
    const action = isBanned ? 'разбанить' : 'забанить';
    if (!confirm(`Вы уверены, что хотите ${action} пользователя?`)) return;

    setLoading(true);
    try {
      const res = await toggleUserBan(userId, !isBanned);
      if (res?.error) showError(res.error);
      else {
        showSuccess(`Пользователь ${isBanned ? 'разбанен' : 'забанен'}`);
        router.refresh();
      }
    } catch (error) {
      showError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  if (isSelf) {
    return <span className="text-xs font-bold text-brand-muted">Это вы</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <select 
        value={currentRole} 
        onChange={handleRoleChange}
        disabled={loading}
        className="bg-brand-bg border-2 border-brand-line rounded-brand p-1 text-xs font-bold outline-none focus:border-brand-accent"
      >
        <option value="user">Пользователь</option>
        <option value="moderator">Модератор</option>
        <option value="admin">Админ</option>
      </select>

      <button
        onClick={handleBanToggle}
        disabled={loading}
        className={`text-xs font-bold px-3 py-1.5 border-2 rounded-brand transition-colors ${
          isBanned 
            ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' 
            : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
        }`}
      >
        {isBanned ? 'Разбанить' : 'Забанить'}
      </button>
    </div>
  );
}
````

### `components/AppealForm.tsx`

``tsx
'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from './Toast';

export default function AppealForm() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [alreadySent, setAlreadySent] = useState(false);
  const { showSuccess, showError } = useToast();

  // При открытии модалки проверяем, есть ли уже обращение от этого юзера
  useEffect(() => {
    if (isOpen) {
      supabase.auth.getUser().then(({ data: { user } }) => {
        if (user?.email) setEmail(user.email);
        
        // Проверяем, есть ли уже НЕрешенное обращение по этому email
        supabase
          .from('support_tickets')
          .select('id')
          .eq('email', user?.email || email)
          .eq('status', 'new')
          .maybeSingle()
          .then(({ data }) => {
            if (data) setAlreadySent(true);
          });
      });
    }
  }, [isOpen, email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (message.length < 10) {
      showError('Сообщение должно быть не короче 10 символов');
      return;
    }

    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      // Проверка перед вставкой (на случай, если кто-то вздумает обойти UI)
      const { data: existing } = await supabase
        .from('support_tickets')
        .select('id')
        .eq('email', email)
        .eq('status', 'new')
        .maybeSingle();

      if (existing) {
        throw new Error('Вы уже отправили обращение. Пожалуйста, дождитесь ответа.');
      }

      const { error } = await supabase.from('support_tickets').insert({
        user_id: user?.id || null,
        email: email,
        subject: 'Оспорить блокировку',
        message: message,
      });

      if (error) throw error;
      
      showSuccess('Обращение отправлено! Мы свяжемся с вами.');
      setIsOpen(false);
      setAlreadySent(true);
    } catch (error) {
      showError(error instanceof Error ? error.message : 'Ошибка отправки');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="w-full bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors"
      >
        Оспорить блокировку
      </button>

      {isOpen && (
        <div className="fixed inset-0 `z-100` flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60" onClick={() => !loading && setIsOpen(false)}></div>
          
          <div className="relative bg-brand-bg border-2 border-brand-line rounded-brand-lg p-6 max-w-md w-full text-left">
            <h2 className="text-xl font-extrabold uppercase mb-2">Оспорить блокировку</h2>
            
            {alreadySent ? (
              <div className="bg-green-100 text-green-800 p-4 rounded border-2 border-green-300 font-bold text-sm">
                Вы уже отправили обращение. Пожалуйста, дождитесь ответа администрации.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш Email (для ответа)</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    readOnly={!!email}
                    className="p-2.5 bg-brand-surface border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[12px] font-extrabold uppercase text-brand-muted">Объясните ситуацию</label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Опишите, почему вы считаете блокировку ошибкой..."
                    rows={4}
                    required
                    className="p-2.5 bg-brand-surface border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-none"
                  />
                </div>

                <div className="flex gap-3 mt-2">
                  <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    disabled={loading}
                    className="flex-1 bg-brand-surface text-brand-text font-extrabold text-sm uppercase px-4 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors disabled:opacity-50"
                  >
                    Отмена
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-4 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
                  >
                    {loading ? 'Отправка...' : 'Отправить'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
````

### `components/ApplicationActions.tsx`

``tsx
'use client';

import { useState } from 'react';
import { approveApplication, rejectApplication } from '@/app/actions';
import { useToast } from './Toast';

export default function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [isLoading, setIsLoading] = useState(false);
  const { showSuccess, showError } = useToast();

    const handleApprove = async () => {
    setIsLoading(true);
    try {
      const res = await approveApplication(applicationId);
      if (res?.error) showError(res.error);
      else showSuccess('Заявка подтверждена!');
    } catch {
      showError('Ошибка при подтверждении');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Вы уверены, что хотите отклонить эту заявку?')) return;
    setIsLoading(true);
    try {
      const res = await rejectApplication(applicationId);
      if (res?.error) showError(res.error);
      else showSuccess('Заявка отклонена');
    } catch {
      showError('Ошибка при отклонении');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="flex gap-1.5 flex-shrink-0 ml-2">
      <button 
        onClick={handleApprove}
        disabled={isLoading}
        aria-label="Принять заявку"
        aria-busy={isLoading}
        className="w-11 h-11 flex items-center justify-center bg-green-100 text-green-700 border-2 border-green-600 rounded-brand hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50"
      >
        {isLoading ? '...' : '✓'}
      </button>
      <button 
        onClick={handleReject}
        disabled={isLoading}
        aria-label="Отклонить заявку"
        aria-busy={isLoading}
        className="w-11 h-11 flex items-center justify-center bg-red-100 text-red-700 border-2 border-red-600 rounded-brand hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
      >
        {isLoading ? '...' : '✕'}
      </button>
    </div>
  );
}
````

### `components/AvatarPicker.tsx`

``tsx
'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AvatarPickerProps {
  currentAvatar: string | null;
  gender: string | null;
  username: string;
  userId: string;
}

export default function AvatarPicker({ currentAvatar, gender, username, userId }: AvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Определяем папку с аватарками в зависимости от пола
  const folder = gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'none';
  
  // Генерируем массив путей к картинкам (от 1 до 30)
  const avatars = Array.from({ length: 8 }, (_, i) => `/avatars/${folder}/${i + 1}.png`);

  const handleSelectAvatar = async (avatarUrl: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);

      if (error) throw error;
      
      setIsOpen(false);
      router.refresh(); // Обновляем страницу, чтобы аватарка сразу появилась
    } catch (error) {
      console.error('Ошибка обновления аватарки:', error);
      alert('Не удалось сохранить аватарку');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand-surface border-2 border-brand-line font-extrabold text-xs uppercase px-3 py-1.5 rounded-brand hover:bg-brand-cat-soft transition-colors"
      >
        Сменить аватар
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Затемненный фон */}
          <div className="absolute inset-0 bg-black/60" onClick={() => !isSaving && setIsOpen(false)}></div>
          
          {/* Модальное окно */}
          <div className="relative bg-brand-bg border-2 border-brand-line rounded-brand-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-2 border-brand-line pb-4">
              <h2 className="text-xl font-extrabold uppercase">Выберите аватар</h2>
              <button onClick={() => setIsOpen(false)} className="text-2xl font-bold hover:text-brand-accent">✕</button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {avatars.map((url, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAvatar(url)}
                  disabled={isSaving}
                  className={`aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                    currentAvatar === url ? 'border-brand-accent shadow-[0_0_0_2px_var(--color-brand-accent)]' : 'border-brand-line/30'
                  }`}
                >
                  <Image 
                    src={url} 
                    alt={`Аватар ${index + 1}`} 
                    width={100} 
                    height={100} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            {isSaving && <p className="text-center font-bold mt-4 text-brand-accent animate-pulse">Сохранение...</p>}
          </div>
        </div>
      )}
    </>
  );
}
````

### `components/CancelModal.tsx`

``tsx
'use client';

import { useState } from 'react';
import { useToast } from './Toast';

export type CancelRole = 'organizer' | 'participant';

interface CancelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  role: CancelRole;
  eventTitle: string;
  loading?: boolean;
}

export default function CancelModal({ isOpen, onClose, onConfirm, role, eventTitle, loading = false }: CancelModalProps) {
  const [selectedReason, setSelectedReason] = useState('');
  const [customReason, setCustomReason] = useState('');
  const { showError } = useToast();

  if (!isOpen) return null;

  // Разные причины для орга и участника
  const reasons = role === 'organizer' 
    ? [
        'Плохая погода или форс-мажор',
        'Не набралось достаточно участников',
        'Изменились планы организатора',
        'Другое'
      ]
    : [
        'Изменились планы / не могу прийти',
        'Заболел / плохое самочувствие',
        'Неудобно добираться до места',
        'Другое'
      ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const finalReason = selectedReason === 'Другое' ? customReason.trim() : selectedReason;
    
    if (!finalReason) {
      showError('Пожалуйста, укажите причину отмены');
      return;
    }

    onConfirm(finalReason);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Задний фон */}
      <div className="absolute inset-0 bg-black/60" onClick={() => !loading && onClose()}></div>
      
      {/* Модалка */}
      <div className="relative bg-brand-bg border-2 border-brand-line rounded-brand-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-extrabold uppercase mb-2 text-center text-red-600">
          {role === 'organizer' ? 'Отмена события' : 'Отмена участия'}
        </h2>
        <p className="text-sm text-brand-muted font-bold text-center mb-6">
          {role === 'organizer' 
            ? `Вы уверены, что хотите отменить «${eventTitle}»?`
            : `Вы уверены, что хотите снять свою заявку с «${eventTitle}»?`}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Укажите причину (обязательно)</label>
            
            {reasons.map((reason) => (
              <label key={reason} className="flex items-center gap-2 cursor-pointer p-2 bg-brand-surface border-2 border-transparent hover:border-brand-line rounded-brand transition-colors">
                <input 
                  type="radio" 
                  name="reason" 
                  value={reason}
                  checked={selectedReason === reason}
                  onChange={(e) => setSelectedReason(e.target.value)}
                  className="w-4 h-4 accent-brand-accent"
                />
                <span className="text-sm font-bold">{reason}</span>
              </label>
            ))}
          </div>

          {/* Поле для ввода своей причины */}
          {selectedReason === 'Другое' && (
            <div className="flex flex-col gap-1.5">
              <textarea
                value={customReason}
                onChange={(e) => setCustomReason(e.target.value)}
                placeholder="Напишите вашу причину..."
                rows={3}
                maxLength={300}
                className="p-2.5 bg-brand-surface border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-none"
              />
            </div>
          )}

          <div className="flex gap-3 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-brand-surface text-brand-text font-extrabold text-sm uppercase px-4 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors disabled:opacity-50"
            >
              Назад
            </button>
            <button
              type="submit"
              disabled={loading || !selectedReason}
              className="flex-1 bg-red-600 text-white font-extrabold text-sm uppercase px-4 py-3 border-2 border-red-800 rounded-brand hover:bg-red-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Отправка...' : 'Подтвердить'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
````

### `components/CancelParticipationButton.tsx`

``tsx
'use client';

import { useState } from 'react';
import { cancelApprovedApplication } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';
import CancelModal from './CancelModal';

export default function CancelParticipationButton({ eventId, eventTitle }: { eventId: string, eventTitle: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleConfirmCancel = async (reason: string) => {
    setLoading(true);
    try {
      const res = await cancelApprovedApplication(eventId, reason);
      if (res?.error) showError(res.error);
      else {
        showSuccess('Вы сняли заявку. Организатор уведомлен.');
        setIsModalOpen(false);
        router.refresh();
      }
    } catch {
      showError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="w-full mt-2 bg-brand-surface text-brand-muted font-extrabold text-sm uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors"
      >
        Отменить участие
      </button>

      <CancelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        role="participant"
        eventTitle={eventTitle}
        loading={loading}
      />
    </>
  );
}
````

### `components/CategoryIcon.tsx`

``tsx
'use client';

import Image from 'next/image';

interface CategoryIconProps {
  category: string;
}

// Карта соответствия категорий и файлов иконок
const categoryMap: Record<string, { icon: string; label: string }> = {
  'Прогулки': { icon: '/icons/walk.png', label: 'Прогулки' },
  'Спорт': { icon: '/icons/sport.png', label: 'Спорт и игры' },
  'Культура': { icon: '/icons/culture.png', label: 'Культура' },
  'Еда / напитки': { icon: '/icons/food.png', label: 'Еда' },
  'Обучение': { icon: '/icons/edu.png', label: 'Обучение' },
  'Поездки': { icon: '/icons/trip.png', label: 'Поездки' },
  'Волонтёрство': { icon: '/icons/help.png', label: 'Волонтёрство' },
  'Здесь и сейчас': { icon: '/icons/meet.png', label: 'Встретиться' },
};

export default function CategoryIcon({ category }: CategoryIconProps) {
  // Если категория не найдена в списке, показываем дефолтную
  const catInfo = categoryMap[category] || { icon: '/icons/default.svg', label: category };

  return (
    <div className="relative group flex items-center justify-center w-8 h-8 cursor-help">
      
      {/* Сама иконка */}
      <Image 
        src={catInfo.icon} 
        alt={catInfo.label} 
        width={24} 
        height={24} 
        className="opacity-80"
      />

      {/* Тултип */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-brand-text text-brand-bg text-[11px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-md">
          {catInfo.label}
        </div>
        {/* Маленький треугольник внизу тултипа */}
        <div className="w-2 h-2 bg-brand-text rotate-45 mx-auto -mt-1"></div>
      </div>
      
    </div>
  );
}
````

### `components/ClientMapWrapper.tsx`

``tsx
'use client';

import dynamic from 'next/dynamic';

// Здесь мы говорим Next.js: "не рендери карту на сервере"
const Map = dynamic(() => import('./MapComponent'), { 
  ssr: false,
  loading: () => <div className="h-48 bg-brand-bg animate-pulse rounded border border-brand-line"></div>
});

export default function ClientMapWrapper(props: any) {
  return <Map {...props} />;
}
````

### `components/Countdown.tsx`

``tsx
'use client';

import { useEffect, useState } from 'react';

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('...');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsPast(true);
        setTimeLeft('Началось');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      // Если осталось меньше 4 часов, делаем акцент
      if (days === 0 && hours < 4) {
        setIsUrgent(true);
        setTimeLeft(`Осталось ${hours} ч ${minutes} мин`);
      } else {
        setIsUrgent(false);
        if (days > 0) {
          setTimeLeft(`Осталось ${days} д ${hours} ч`);
        } else {
          setTimeLeft(`Осталось ${hours} ч ${minutes} мин`);
        }
      }
    };

    calculateTime(); // Считаем сразу
    const timer = setInterval(calculateTime, 60000); // Обновляем каждую минуту

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isPast) {
    return (
      <span className="text-[12px] font-bold text-brand-muted">
        Событие началось
      </span>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-[12px] font-regular text-brand-muted leading-tight">
        До события:
      </span>
      <span className={`text-[12px] font-regular text-brand-muted leading-tight ${
        isUrgent ? 'text-brand-accent' : 'text-brand-muted'
      }`}>
        {timeLeft.replace('Осталось ', '')}
      </span>
    </div>
  ); }
````

### `components/CreateEventForm.tsx`

``tsx
'use client';

import { useRef, useState, useEffect } from 'react';
import { createEvent } from '@/app/actions';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import MapPicker from './MapPicker';
import { User } from '@supabase/supabase-js';
import { useToast } from './Toast';

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
  const { showSuccess, showError } = useToast();

  const [city, setCity] = useState('');
  
  useEffect(() => {
    if (user) {
      supabase.from('profiles').select('city').eq('id', user.id).single().then(({ data }) => {
        if (data?.city) setCity(data.city);
      });
    }
  }, [user]);


  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setIsCheckingAuth(false);
    });
  }, []);

  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      const res = await createEvent(formData);
      
      // Если вернулась ошибка, показываем её и НЕ сбрасываем форму
      if (res?.error) {
        showError(res.error);
        return; 
      }

      // Если ошибки нет (успех) — сбрасываем форму
      formRef.current?.reset();
      setLocation('');
      setLat(null);
      setLng(null);
      
      showSuccess('Событие успешно создано!');
      formRef.current?.closest('details')?.removeAttribute('open');
      router.refresh();
    } catch{
      // Если произошло что-то совсем непредвиденное
      showError('Произошла непредвиденная ошибка');
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
      <form 
      ref={formRef} 
      onSubmit={(e) => {
        e.preventDefault(); // Останавливаем стандартную отправку формы
        const formData = new FormData(e.currentTarget);
        handleSubmit(formData); // Вызываем наш экшен вручную
      }} 
      className="flex flex-col gap-5"
    >
      
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
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Город события</label>
          <input 
            name="city" 
            type="text" 
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
            placeholder="Выберите город" 
            className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
          />
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
  onLocationSelect={(selectedLat, selectedLng, address) => {
    setLat(selectedLat);
    setLng(selectedLng);
    setLocation(address);
  }} 
  onCitySelect={(selectedCity) => {
    setCity(selectedCity); // <--- Автоматически обновляем поле города!
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
````

### `components/EventAdminActions.tsx`

``tsx
'use client';

import { useState } from 'react';
import { cancelEvent } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';
import CancelModal from './CancelModal';

export default function EventAdminActions({ eventId, eventTitle }: { eventId: string, eventTitle: string }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  const handleConfirmCancel = async (reason: string) => {
    setLoading(true);
    try {
      const res = await cancelEvent(eventId, reason);
      if (res?.error) showError(res.error);
      else {
        showSuccess('Событие отменено. Участники уведомлены.');
        router.push('/my-events');
      }
    } catch{
      showError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsModalOpen(true)}
        className="bg-red-100 text-red-700 font-extrabold text-sm uppercase px-4 py-2 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors w-full"
      >
        Отменить событие
      </button>

      <CancelModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleConfirmCancel}
        role="organizer"
        eventTitle={eventTitle}
        loading={loading}
      />
    </>
  );
}
````

### `components/EventCard.tsx`

``tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import type { EventListItemDTO } from '@/lib/event-dto';
import { applyToEvent, cancelApplication } from '@/app/actions';
import type { User } from '@supabase/supabase-js';
import ClientMapWrapper from './ClientMapWrapper';
import { useToast } from './Toast';
import { getBadgeStatus, ORGANIZER_BADGES } from '@/lib/achievements';

export default function EventCard({ item }: { item: EventListItemDTO }) {
  const {
    id,
    organizerId,
    unreadCount,
    category,
    dateTime,
    title,
    description,
    organizerName,
    organizerRank,
    maxParticipants,
    approvedParticipantsCount,
    isFull,
    publicLocationLabel,
    locationIsHidden,
    lat,
    lng,
    myApplicationStatus,
    isOrganizer,
    organizerAvatar,
    organizerGender,
    city,
    status,
    cancelReason,
  } = item;

  const { showSuccess, showError } = useToast();
  const [myStatus, setMyStatus] = useState<
    'pending' | 'approved' | 'rejected' | null
  >(myApplicationStatus);
  const [loading, setLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  const isActuallyOrganizer = isOrganizer || (user !== null && user.id === organizerId);
  const hasExactCoords = typeof lat === 'number' && typeof lng === 'number';
  const isPast = new Date(dateTime) < new Date(); 

  const handleApply = async () => {
    setLoading(true);
    try {
      const res = await applyToEvent(id);
      if (res?.error) {
        showError(res.error);
      } else {
        setMyStatus('pending');
        showSuccess('Заявка отправлена! Ждите подтверждения.');
      }
    } catch {
      showError('Произошла ошибка');
    } finally {
      setLoading(false);
    }
  };

    const handleCancel = async () => {
    if (!confirm('Вы уверены, что хотите отменить заявку?')) return;
    setIsCanceling(true);
    try {
      const res = await cancelApplication(id);
      if (res?.error) {
        showError(res.error);
      } else {
        setMyStatus(null);
        showSuccess('Заявка отменена');
      }
    } catch {
      showError('Произошла ошибка');
    } finally {
      setIsCanceling(false);
    }
  };

  let buttonText = 'Хочу участвовать';
  let buttonDisabled = isFull || loading;
  let buttonClass =
    'bg-brand-accent text-brand-accent-ink hover:bg-brand-text hover:text-brand-bg';

  if (isActuallyOrganizer) {
    buttonText = 'Это ваше событие';
    buttonDisabled = true;
    buttonClass =
      'bg-brand-surface text-brand-muted border-brand-muted cursor-default';
  } else if (myStatus === 'pending') {
    buttonText = 'Заявка отправлена';
    buttonDisabled = true;
    buttonClass =
      'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  } else if (myStatus === 'approved') {
    buttonText = 'Вы записаны ✓';
    buttonDisabled = true;
    buttonClass = 'bg-green-600 text-white border-green-800 cursor-default';
  } else if (isFull) {
    buttonText = 'Мест нет';
    buttonDisabled = true;
    buttonClass =
      'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  }

  const d = new Date(dateTime);
  const dayNumber = d.getDate();
  const monthName = d.toLocaleDateString('ru-RU', { month: 'short' });
  const timeOnly = d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="bg-brand-surface border-2 border-brand-line rounded-brand-lg flex flex-col sm:flex-row overflow-hidden hover:opacity-95 transition-opacity w-full relative h-full">
      
      {/* ЛЕВАЯ КОЛОНКА (Дата, Время, Места) */}
      <div className="bg-brand-bg/50 p-3 sm:p-4 sm:w-[140px] flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-start border-b-2 sm:border-b-0 sm:border-r-2 border-brand-line justify-between sm:justify-center">
        
        <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-5xl font-extrabold leading-none text-brand-text">
              {dayNumber}
            </span>
            <span className="text-[14px] sm:text-[16px] font-bold text-brand-muted uppercase">
              {monthName}
            </span>
          </div>
          {/* Время сделано крупным, как дата */}
          <span className="text-3xl sm:text-2xl font-extrabold text-brand-text sm:mt-1">
            {timeOnly}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] sm:text-[12px] font-extrabold text-brand-muted mt-1 sm:mt-4">
          👤
          <span>
            {approvedParticipantsCount} / {maxParticipants}
          </span>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА */}
      <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col min-w-0">
        
        {/* Категория над заголовком */}
  {/* Категория и Статус над заголовком */}
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <span className="text-[10px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2 py-0.5 rounded border border-brand-cat/30 inline-block">
            {category}
          </span>
          
          {status === 'cancelled' && (
            <span className="text-[10px] uppercase font-extrabold bg-red-100 text-red-700 px-2 py-0.5 rounded border border-red-300 inline-block">
              Отменено
            </span>
          )}
        </div>

        {/* Блок причины отмены (если есть) */}
        {status === 'cancelled' && cancelReason && (
          <div className="mb-3 p-2 bg-red-50 text-red-800 border border-red-200 rounded text-xs font-bold">
            Причина отмены: {cancelReason}
          </div>
        )}
        <Link
          href={`/event/${id}`}
          className="block hover:text-brand-accent transition-colors pr-12"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight">
            {title}
          </h2>
        </Link>

        {/* Публичная метка места */}
        <div className="flex flex-col gap-1 text-[12px] sm:text-[13px] font-bold text-brand-muted mt-2 mb-2">
          <div className="flex items-center gap-1.5">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="flex-shrink-0"
            >
              <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
              <circle cx="12" cy="10" r="3"></circle>
            </svg>
            {city && (
              <span className=" text-brand-cat px-1.5 py-0.5 rounded text-[12px] uppercase font-bold">
                {city}
              </span>
            )}
          </div>
          <span className="break-words leading-snug">{publicLocationLabel}</span>
        </div>

        <p className="text-[13px] sm:text-[14px] text-brand-text/80 mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Организатор и кнопки */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-2">
          
          <div className="flex items-center gap-2 text-sm">
                        <div
              className={`w-12 h-12 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 overflow-hidden border-2
                ${
                  organizerGender === 'male'
                    ? 'bg-blue-100 text-blue-800 border-blue-600'
                    : organizerGender === 'female'
                    ? 'bg-pink-100 text-pink-800 border-pink-600'
                    : 'bg-gray-200 text-gray-700 border-brand-line'
                }
              `}
            >
              {organizerAvatar ? (
                <Image
                  src={organizerAvatar}
                  alt={organizerName}
                  width={90}
                  height={90}
                  className="w-full h-full sm:w-8 sm:h-8 object-contain"
                />
              ) : (
                organizerName.charAt(0)
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <Link
                href={`/@${organizerName}`}
                className="text-brand-text hover:text-brand-accent transition-colors font-bold truncate leading-tight text-[12px] sm:text-sm"
              >
                {organizerName}
              </Link>
              <span className="text-brand-accent font-extrabold text-[8px] sm:text-[10px] uppercase leading-tight mt-0.5">
                {organizerRank}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
               {!isPast && (
              <button
                onClick={handleApply}
                disabled={buttonDisabled}
                className={`flex-1 sm:flex-none font-extrabold text-[11px] sm:text-[13px] uppercase px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-brand-line rounded-brand transition-colors flex items-center justify-center gap-2 ${buttonClass}`}
              >
                {/* Если идет загрузка, показываем спиннер */}
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>Отправка...</span>
                  </>
                ) : (
                  buttonText
                )}
              </button>
            )}

            {/* Кнопка Чат с бейджем непрочитанных */}
            {(myStatus || isActuallyOrganizer) && (
              <Link
                href={`/event/${id}`}
                className="relative bg-brand-surface text-brand-text font-extrabold text-[11px] sm:text-[13px] uppercase px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-brand-line rounded-brand hover:bg-brand-cat-soft transition-colors flex items-center justify-center"
              >
                Чат
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-brand-surface px-1">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {myStatus === 'pending' && (
              <button
                onClick={handleCancel}
                disabled={isCanceling}
                className="bg-red-100 text-red-700 font-extrabold text-[11px] sm:text-[13px] uppercase px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors disabled:opacity-50"
                title="Отменить заявку"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Карта */}
        {hasExactCoords && (
          <details className="mt-4 border-t border-dashed border-brand-line/30 pt-3 group">
                       <summary
              className="list-none cursor-pointer text-brand-muted hover:text-brand-accent font-bold text-[11px] sm:text-[12px] uppercase transition-colors flex items-center gap-1 py-2"
            >
              <svg
                className="transition-transform duration-300 group-open:rotate-180"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              Показать на карте
            </summary>
            <div className="details-content">
              <div className="details-inner">
                <div className="mt-3">
                  <ClientMapWrapper
                    lat={lat as number}
                    lng={lng as number}
                    title={title}
                    hideExactLocation={false}
                  />
                </div>
              </div>
            </div>
          </details>
        )}

        {locationIsHidden && !hasExactCoords && (
          <div className="mt-3 p-2 bg-brand-heat/10 border border-brand-heat rounded-brand text-brand-text font-bold text-[10px] sm:text-[11px]">
            Точное место откроется после подтверждения заявки.
          </div>
        )}
      </div>
    </article>
  );
}
````

### `components/EventChat.tsx`

``tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { markChatAsRead } from '@/app/actions';
import Image from 'next/image';
import { useToast } from './Toast';

interface EventChatProps {
  eventId: string;
  currentUserId: string;
}

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  reply_to: string | null;
  profiles?: { username: string; avatar_url: string | null; gender: string | null }; 
  reply_profile?: { username: string };
  reply_content?: string;
}

const MAX_MESSAGE_LENGTH = 1000;

export default function EventChat({ eventId, currentUserId }: EventChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const {showError } = useToast();
  
  
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Кэш профилей (теперь храним и аватарку тоже)
  const profilesCache = useRef<Record<string, { username: string; avatar_url: string | null; gender: string | null }>>({});
  const lastSendTime = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 1. Загрузка истории + отметка о прочтении
  useEffect(() => {
    const fetchMessages = async () => {
      markChatAsRead(eventId);

      const { data: msgs, error } = await supabase
        .from('messages')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error("Ошибка загрузки сообщений:", error);
        setLoading(false);
        return;
      }

      if (msgs && msgs.length > 0) {
        const sortedMsgs = msgs.reverse();
        const userIds = [...new Set(sortedMsgs.map(m => m.user_id))];
        
        const missingUserIds = userIds.filter(id => !profilesCache.current[id]);
        
        if (missingUserIds.length > 0) {
          // Запрашиваем username, avatar_url и gender
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, gender')
            .in('id', missingUserIds);
            
          profiles?.forEach(p => {
            profilesCache.current[p.id] = { 
              username: p.username, 
              avatar_url: p.avatar_url,
              gender: p.gender
            };
          });
        }

        const msgsWithProfiles = sortedMsgs.map(msg => {
          let replyData = {};
          if (msg.reply_to) {
            const original = sortedMsgs.find(m => m.id === msg.reply_to);
            if (original) {
              replyData = {
                reply_content: original.content,
                reply_profile: profilesCache.current[original.user_id]
              };
            }
          }
          return {
            ...msg,
            profiles: profilesCache.current[msg.user_id],
            ...replyData
          };
        });

        setMessages(msgsWithProfiles);
      } else {
        setMessages([]);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [eventId]);

  // 2. Realtime подписка
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${eventId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `event_id=eq.${eventId}` },
        async (payload) => {
          const newUserId = payload.new.user_id;
          
          if (!profilesCache.current[newUserId]) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, avatar_url, gender')
              .eq('id', newUserId)
              .single();
            if (profile) {
              profilesCache.current[newUserId] = { 
                username: profile.username,
                avatar_url: profile.avatar_url,
                gender: profile.gender
              };
            }
          }

          let replyData = {};
          if (payload.new.reply_to) {
            const { data: original } = await supabase
              .from('messages')
              .select('content, user_id')
              .eq('id', payload.new.reply_to)
              .single();
            if (original) {
              if (!profilesCache.current[original.user_id]) {
                 const { data: origProfile } = await supabase.from('profiles').select('username').eq('id', original.user_id).single();
                 if (origProfile) profilesCache.current[original.user_id] = { username: origProfile.username, avatar_url: null, gender: null };
              }
              replyData = {
                reply_content: original.content,
                reply_profile: profilesCache.current[original.user_id]
              };
            }
          }

          const newMsg = {
            ...payload.new,
            profiles: profilesCache.current[newUserId],
            ...replyData
          } as Message;

          setMessages((prev) => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          
          markChatAsRead(eventId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);


  const isFirstLoad = useRef(true);

  useEffect(() => {
    // При первой загрузке ничего не скроллим
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    
    // Находим сам контейнер чата (у которого overflow-y-auto)
    const chatContainer = messagesEndRef.current?.closest('.overflow-y-auto');
    
    // Скроллим только внутренний контейнер чата, НЕ трогая саму страницу
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const now = Date.now();
    if (now - lastSendTime.current < 2000) {
      showError('Не так быстро! Подождите пару секунд.'); // <-- ЗАМЕНА
      return;
    }
    
    if (newMessage.length > MAX_MESSAGE_LENGTH) {
      showError(`Сообщение слишком длинное (максимум ${MAX_MESSAGE_LENGTH} символов).`); // <-- ЗАМЕНА
      return;
    }

    setSending(true);
    const content = newMessage.trim();
    const replyId = replyingTo?.id || null;
    
    setNewMessage('');
    setReplyingTo(null);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ event_id: eventId, user_id: currentUserId, content, reply_to: replyId }]);

      if (error) throw error;
      lastSendTime.current = Date.now();
      // Мы не показываем тост об успехе для каждого сообщения, 
      // чтобы не спамить (сообщение и так появляется в чате).
    } catch (error) {
      console.error(error);
      showError('Не удалось отправить сообщение.'); // <-- ЗАМЕНА
      setNewMessage(content); 
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center font-bold text-brand-muted">Загрузка чата...</div>;
  }

  return (
    <div className="flex flex-col bg-brand-surface border-2 border-brand-line rounded-[16px] overflow-hidden h-[450px]">
      
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-brand-bg/50">
        {messages.length === 0 ? (
          <div className="my-auto text-center">
            <span className="text-4xl mb-2 block">👋</span>
            <p className="text-brand-muted font-bold">Здесь пока нет сообщений.<br/>Напишите первым!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.user_id === currentUserId;
            const authorName = msg.profiles?.username || 'Пользователь';
            const avatarUrl = msg.profiles?.avatar_url;
            const avatarLetter = authorName.charAt(0).toUpperCase();
            
            // Цвет фона для заглушки (как в EventCard)
            const gender = msg.profiles?.gender;
            const bgClass = gender === 'male' ? 'bg-blue-100 text-blue-800' : 
                            gender === 'female' ? 'bg-pink-100 text-pink-800' : 
                            'bg-gray-200 text-gray-700';

            return (
              <div key={msg.id} className={`group flex gap-2 max-w-[85%] ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}>
                
                {/* Аватарка (картинка или буква) */}
                 <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-extrabold overflow-hidden mt-auto mb-1 border-2
                  ${avatarUrl ? 'bg-brand-bg' : ''} 
                  ${gender === 'male' ? 'border-blue-400' : gender === 'female' ? 'border-pink-400' : 'border-brand-line'} 
                  ${!avatarUrl ? bgClass : ''}
                `}>
                  {avatarUrl ? (
                    <Image 
                      src={avatarUrl} 
                      alt={authorName} 
                      width={32} 
                      height={32} 
                      className="w-8 h-8 object-cover"
                    />
                  ) : (
                    avatarLetter
                  )}
                </div>

                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  {!isMine && (
                    <span className="text-[11px] font-bold text-brand-muted mb-1 ml-1">
                      @{authorName}
                    </span>
                  )}

                  <div className="relative flex items-center gap-2">
                    {isMine && (
                      <button 
                        onClick={() => {
                          setReplyingTo(msg);
                          inputRef.current?.focus();
                        }}
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-brand-muted hover:text-brand-accent p-1"
                        title="Ответить"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                      </button>
                    )}

                                       <div 
                      className={`px-4 py-2 text-[14px] font-medium leading-relaxed border rounded-2xl whitespace-pre-wrap break-all ${
                        isMine 
                          ? 'bg-brand-accent-soft text-brand-text border-brand-line rounded-br-sm' 
                          : 'bg-brand-surface text-brand-text border-brand-line rounded-bl-sm'    
                      }`}
                    >
                      {msg.reply_content && (
                        <div className="mb-2 pl-2 border-l-2 border-brand-line/50 opacity-70 text-[12px] italic line-clamp-2">
                          <span className="font-bold">@{msg.reply_profile?.username || 'Юзер'}:</span> {msg.reply_content}
                        </div>
                      )}
                      {msg.content}
                    </div>

                    {!isMine && (
                      <button 
                        onClick={() => {
                        setReplyingTo(msg);
                        inputRef.current?.focus();
                      }}
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-brand-muted hover:text-brand-accent p-1"
                        title="Ответить"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && (
        <div className="bg-brand-bg border-t-2 border-brand-line px-4 py-2 flex items-center justify-between text-sm">
          <div className="truncate text-brand-muted">
            Ответ <span className="font-bold">@{replyingTo.profiles?.username || 'Юзер'}</span>: {replyingTo.content}
          </div>
          <button onClick={() => {
            setReplyingTo(null);
            inputRef.current?.focus();
          }} className="text-brand-accent font-bold ml-2">✕</button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-3 bg-brand-surface border-t-2 border-brand-line flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Написать сообщение..."
          maxLength={MAX_MESSAGE_LENGTH}
          rows={1}
          className="flex-1 p-3 bg-brand-bg border-2 border-brand-line rounded-2xl outline-none focus:border-brand-accent transition-colors text-sm resize-none max-h-32"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim() || sending}
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-brand-text text-brand-bg rounded-full hover:bg-brand-accent transition-colors disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>

    </div>
  );
}
````

### `components/EventList.tsx`

``tsx
// components/EventList.tsx
import { createClient } from '@/lib/supabase-server';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';
import InfiniteEventList from './InfiniteEventList';

export default async function EventList({
  searchParams,
}: {
   searchParams: Promise<{ page?: string, category?: string, date_from?: string, date_to?: string, city?: string }>;
}) {
  const params = await searchParams;
  const category = params.category;
  const dateFrom = params.date_from;
  const dateTo = params.date_to;
  const city = params.city;
  
  // Всегда грузим только первую страницу на сервере
  const limit = 10;
  const offset = 0;

  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  let result;
  try {
    result = await getEventListDTOs(supabase, viewer, limit, offset, false, {
      category,
      dateFrom,
      dateTo,
      city
    });
  } catch (error) {
    console.error('ОШИБКА БАЗЫ:', error);
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        Не удалось загрузить события. Попробуйте обновить страницу.
      </div>
    );
  }

  return (
    <InfiniteEventList 
      initialItems={result.items} 
      initialTotal={result.total} 
      filters={{ category, dateFrom, dateTo, city }} 
    />
  );
}
````

### `components/Header.tsx`

``tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import NotificationsBell from './NotificationsBell';

// Вспомогательный компонент для пунктов навигации ПК
function NavItem({ href, label, pathname, badgeCount }: { href: string, label: string, pathname: string, badgeCount?: number }) {
  const isActive = pathname === href;
  return (
    <Link 
      href={href} 
      className={`relative font-bold text-sm tracking-wider transition-all duration-200 flex items-center gap-1
        ${isActive ? 'text-brand-accent' : 'text-brand-text hover:text-brand-accent'}
      `}
    >
      <span className={`text-brand-accent transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>[</span>
      <span>{label}</span>
      <span className={`text-brand-accent transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>]</span>
      
      {badgeCount !== undefined && badgeCount > 0 && (
        <span className="absolute -top-2 -right-3 bg-red-500 text-white text-[10px] font-bold w-4 h-4 flex items-center justify-center rounded-full border border-brand-bg">
          {badgeCount}
        </span>
      )}
    </Link>
  );
}


// Вспомогательный компонент для иконок с тултипами
function IconTooltip({ children, tooltip, onClick, href }: { children: React.ReactNode, tooltip: string, onClick?: () => void, href?: string }) {
  const inner = (
    <div className="w-10 h-10 flex items-center justify-center border-2 border-brand-line/50 rounded-brand bg-brand-surface hover:bg-brand-bg transition-colors text-lg">
      {children}
    </div>
  );

  // Определяем, во что оборачивать контент
  let contentWrapper;
  if (href) {
    contentWrapper = <Link href={href}>{inner}</Link>;
  } else if (onClick) {
    contentWrapper = <button onClick={onClick} className="outline-none">{inner}</button>;
  } else {
    contentWrapper = <div className="outline-none">{inner}</div>; // <--- ИСПОЛЬЗУЕМ DIV ДЛЯ КОЛОКОЛЬЧИКА
  }

  return (
    <div className="relative group flex items-center">
      {contentWrapper}
      
      {/* Тултип */}
      <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 pointer-events-none flex flex-col items-center">
        <div className="w-2 h-2 bg-brand-text rotate-45 -mb-1 z-10"></div>
        <div className="bg-brand-text text-brand-bg text-[11px] font-bold px-2.5 py-1.5 rounded shadow-md whitespace-nowrap relative z-0">
          {tooltip}
        </div>
      </div>
    </div>
  );
}

export default function Header() {
  const [theme, setTheme] = useState('light');
  
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    const timer = setTimeout(() => {
      setTheme(savedTheme);
      document.documentElement.setAttribute('data-theme', savedTheme);
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadChats, setUnreadChats] = useState(0);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const timer = setTimeout(() => setIsMobileMenuOpen(false), 0);
    return () => clearTimeout(timer);
  }, [pathname]);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = () => {
      if (user) {
        supabase
          .from('profiles')
          .select('username')
          .eq('id', user.id)
          .maybeSingle()
          .then(({ data }) => {
            setUsername(data?.username || user.email?.split('@')[0] || 'Пользователь');
          });
      } else {
        setUsername(null);
      }
    };

    fetchProfile();

    // Слушаем кастомное событие смены профиля
    window.addEventListener('profileUpdated', fetchProfile);

    return () => {
      window.removeEventListener('profileUpdated', fetchProfile);
    };
  }, [user]);

  useEffect(() => {
    if (!user) {
      const timer = setTimeout(() => setUnreadChats(0), 0);
      return () => clearTimeout(timer);
    }

    const fetchUnreadCount = async () => {
      const { data: reads } = await supabase
        .from('chat_reads')
        .select('event_id, last_read_at')
        .eq('user_id', user.id);

      const readMap = new Map(reads?.map(r => [r.event_id, r.last_read_at]) || []);

      const { data: messages } = await supabase
        .from('messages')
        .select('id, event_id, created_at')
        .neq('user_id', user.id)
        .gt('created_at', new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString());

      if (!messages) return;

      let count = 0;
      for (const msg of messages) {
        const lastRead = readMap.get(msg.event_id);
        if (!lastRead || new Date(msg.created_at) > new Date(lastRead)) {
          count++;
        }
      }

      setUnreadChats(count);
    };

    fetchUnreadCount();

    const channel = supabase.channel('header-unread-chats')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages' }, () => fetchUnreadCount())
      .on('postgres_changes', { event: '*', schema: 'public', table: 'chat_reads' }, () => fetchUnreadCount())
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [user, pathname]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
    setIsMobileMenuOpen(false);
  };

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-brand-bg border-b-2 border-brand-line">
        <div className="max-w-[1100px] mx-auto flex items-center justify-between px-4 md:px-6 py-3">
          <Link href="/" className="font-extrabold text-2xl tracking-tighter uppercase z-50">
            Намылимся<span className="text-brand-accent">.</span>
          </Link>
          
          {/* Навигация для ПК */}
          <nav className="hidden md:flex gap-6">
            <div className="group flex items-center">
              <NavItem href="/" label="Лента" pathname={pathname} />
            </div>
            <div className="group flex items-center">
              <NavItem href="/my-events" label="Мои события" pathname={pathname} badgeCount={unreadChats} />
            </div>
            <div className="group flex items-center">
              <NavItem href="/archive" label="Архив" pathname={pathname} />
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 z-50">
            
            {/* Тема */}
            <div className="hidden md:block">
              <IconTooltip tooltip="Переключить тему" onClick={toggleTheme}>
                {theme === 'light' ? '🌙' : '☀️'}
              </IconTooltip>
            </div>
            
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                  {/* Уведомления */}
                  <IconTooltip tooltip="Уведомления">
                    <NotificationsBell />
                  </IconTooltip>

                  {/* Профиль */}
                  <IconTooltip tooltip="Мой профиль" href={`/@${username}`}>
                    🙋
                  </IconTooltip>

                  {/* Настройки */}
                  <IconTooltip tooltip="Настройки" href="/settings">
                    ⚙️
                  </IconTooltip>

                  <button onClick={handleLogout} className="bg-brand-surface text-brand-text font-extrabold text-sm px-4 py-2 border-2 border-brand-line/50 rounded-brand hover:bg-brand-accent hover:text-white transition-colors">
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="bg-brand-surface text-brand-text font-extrabold text-sm px-4 py-2 border-2 border-brand-line/50 rounded-brand hover:bg-brand-bg transition-colors">
                    Войти
                  </Link>
                  <Link href="/login?mode=register" className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm px-4 py-2 border-2 border-brand-line/50 rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors">
                    Регистрация
                  </Link>
                </>
              )}
            </div>

            {user && (
              <div className="md:hidden">
                <NotificationsBell />
              </div>
            )}

            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-11 h-11 flex flex-col items-center justify-center gap-1.5 border-2 border-brand-line/50 rounded-brand bg-brand-surface"
              aria-label={isMobileMenuOpen ? 'Закрыть меню' : 'Открыть меню'}
            >
              <span className={`block w-5 h-0.5 bg-brand-text transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-brand-text transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-brand-text transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* Мобильное меню (Шторка) */}
      <div 
        id="mobile-menu"
        aria-hidden={!isMobileMenuOpen}
        className={`fixed inset-0 bg-brand-bg z-40 flex flex-col pt-24 px-6 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {isMobileMenuOpen && (
          <nav className="flex flex-col gap-2 text-2xl font-extrabold">
            <Link href="/" className={`animate-menu-item delay-1 border-b-2 border-brand-line py-4 flex items-center gap-2 ${pathname === '/' ? 'text-brand-accent' : ''}`}>
              {pathname === '/' && <span className="text-brand-accent">[</span>}
              Лента
              {pathname === '/' && <span className="text-brand-accent">]</span>}
            </Link>
            
            <Link href="/my-events" className={`animate-menu-item delay-2 border-b-2 border-brand-line py-4 flex items-center gap-2 ${pathname === '/my-events' ? 'text-brand-accent' : ''}`}>
              {pathname === '/my-events' && <span className="text-brand-accent">[</span>}
              Мои события
              {unreadChats > 0 && <span className="bg-red-500 text-white text-sm px-2 rounded-full">{unreadChats}</span>}
              {pathname === '/my-events' && <span className="text-brand-accent">]</span>}
            </Link>
            
            <Link href="/archive" className={`animate-menu-item delay-3 border-b-2 border-brand-line py-4 flex items-center gap-2 ${pathname === '/archive' ? 'text-brand-accent' : ''}`}>
              {pathname === '/archive' && <span className="text-brand-accent">[</span>}
              Архив
              {pathname === '/archive' && <span className="text-brand-accent">]</span>}
            </Link>
          </nav>
        )}

        <div className="mt-auto mb-10 flex flex-col gap-4">
          {/* Кнопка смены темы для мобилок */}
          <button 
            onClick={toggleTheme}
            className="animate-menu-item delay-3 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line/50 rounded-brand flex items-center justify-center gap-2"
          >
            {theme === 'light' ? '🌙 Темная тема' : '☀️ Светлая тема'}
          </button>

          {user ? (
            <>
              <Link href={`/@${username}`} className="animate-menu-item delay-4 text-xl font-bold text-center border-2 border-brand-line/50 p-3 rounded-brand">
                Мой профиль (@{username})
              </Link>
              <Link href="/settings" className="animate-menu-item delay-5 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line/50 rounded-brand flex items-center justify-center gap-2">
                ⚙️ Редактировать профиль
              </Link>
              <button onClick={handleLogout} className="animate-menu-item delay-5 bg-brand-bg text-red-600 font-extrabold text-lg p-3 border-2 border-red-300 rounded-brand">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="animate-menu-item delay-4 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line/50 rounded-brand text-center">
                Войти
              </Link>
              <Link href="/login?mode=register" className="animate-menu-item delay-5 bg-brand-accent text-brand-accent-ink font-extrabold text-lg p-3 border-2 border-brand-line/50 rounded-brand text-center">
                Регистрация
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
````

### `components/InfiniteEventList.tsx`

``tsx
'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import EventCard from './EventCard';
import { EventListItemDTO } from '@/lib/event-dto';

interface InfiniteEventListProps {
  initialItems: EventListItemDTO[];
  initialTotal: number;
  filters: { category?: string; dateFrom?: string; dateTo?: string; city?: string };
}

export default function InfiniteEventList({ initialItems, initialTotal, filters }: InfiniteEventListProps) {
  const [items, setItems] = useState<EventListItemDTO[]>(initialItems);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(initialItems.length < initialTotal);
  
  const observerTarget = useRef<HTMLDivElement>(null);

  // Функция подгрузки
  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);

    try {
      const queryParams = new URLSearchParams();
      queryParams.set('page', (page + 1).toString());
      if (filters.category) queryParams.set('category', filters.category);
      if (filters.dateFrom) queryParams.set('date_from', filters.dateFrom);
      if (filters.dateTo) queryParams.set('date_to', filters.dateTo);
    if (filters.city) queryParams.set('city', filters.city);

      const res = await fetch(`/api/events?${queryParams.toString()}`);
      const data = await res.json();

      if (data.items && data.items.length > 0) {
        setItems(prev => [...prev, ...data.items]);
        setPage(prev => prev + 1);
        // Если загрузили меньше лимита, значит больше нет
        if (data.items.length < 10) setHasMore(false);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error('Ошибка загрузки:', error);
    } finally {
      setLoading(false);
    }
  }, [page, loading, hasMore, filters]);

  // Настройка Intersection Observer (следим за нижним блоком)
  useEffect(() => {
    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting) {
          loadMore();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => {
      if (observerTarget.current) {
        observer.unobserve(observerTarget.current);
      }
    };
  }, [loadMore]);

  // Если фильтры поменялись, сбрасываем список
  useEffect(() => {
    setItems(initialItems);
    setPage(1);
    setHasMore(initialItems.length < initialTotal);
  }, [initialItems, initialTotal]);

  if (items.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        По вашим фильтрам ничего не найдено.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {items.map((item) => (
        <EventCard key={item.id} item={item} />
      ))}
      
      {/* Триггер для загрузки (невидимый блок внизу) */}
      {hasMore && (
        <div ref={observerTarget} className="py-8 flex justify-center w-full">
          {loading ? (
            <div className="flex items-center gap-2 text-brand-muted font-bold">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Загрузка...
            </div>
          ) : (
            <span className="text-brand-muted font-bold text-sm opacity-50">Прокрутите вниз...</span>
          )}
        </div>
      )}

      {!hasMore && items.length > 0 && (
        <div className="text-center py-6 text-brand-muted font-bold text-sm border-t-2 border-brand-line w-full mt-4">
          Вы посмотрели все события
        </div>
      )}
    </div>
  );
}
````

### `components/Map.tsx`

``tsx
'use client';

import dynamic from 'next/dynamic';

// Важно: путь должен быть './MapComponent'
const Map = dynamic(() => import('./MapComponent'), {
  ssr: false, 
  loading: () => (
    <div className="h-64 md:h-80 w-full border-2 border-brand-line rounded-brand bg-brand-bg flex items-center justify-center animate-pulse">
      <span className="font-extrabold text-brand-muted">Загрузка карты...</span>
    </div>
  ),
});

export default Map;
````

### `components/MapComponent.tsx`

``tsx
'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';

import { useEffect, useState } from 'react';
import L from 'leaflet';

// Фикс для иконок Leaflet в Next.js (иначе маркеры не отображаются)
const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface MapProps {
  lat?: number;
  lng?: number;
  title: string;
  hideExactLocation?: boolean;
}

export default function Map({ lat = 55.751244, lng = 37.618423, title, hideExactLocation = false }: MapProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return <div className="h-64 bg-brand-bg animate-pulse rounded-brand"></div>;

  return (
    <div className="h-64 md:h-80 w-full border-2 border-brand-line rounded-brand overflow-hidden relative z-0">
      <MapContainer 
        center={[lat, lng]} 
        zoom={hideExactLocation ? 12 : 15} 
        scrollWheelZoom={false} 
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Если место скрыто, показываем просто круг, а не точный маркер */}
        {!hideExactLocation ? (
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>{title}</Popup>
          </Marker>
        ) : (
          <Marker position={[lat, lng]} icon={icon}>
            <Popup>Примерное место встречи. Точное откроется после подтверждения.</Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
}
````

### `components/MapPicker.tsx`

``tsx
'use client';

import dynamic from 'next/dynamic';

const MapPicker = dynamic(() => import('./MapPickerComponent'), {
  ssr: false,
  loading: () => <div className="h-64 w-full border-2 border-brand-line rounded-brand bg-brand-bg animate-pulse flex items-center justify-center text-brand-muted font-bold">Загрузка карты...</div>,
});

export default MapPicker;
````

### `components/MapPickerComponent.tsx`

``tsx
'use client';

import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useState, useEffect } from 'react';
import L from 'leaflet';

const icon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

// Добавляем onCitySelect в пропсы (сделаем его необязательным, чтобы карта не ломалась, если его не передали)
interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  onCitySelect?: (city: string) => void;
}

function LocationMarker({ onLocationSelect, onCitySelect }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`);
        const data = await response.json();
        
        let shortAddress = data.display_name || `Широта: ${lat.toFixed(5)}, Долгота: ${lng.toFixed(5)}`;
        
    // ОБРЕЗАЕМ АДРЕС
        if (data.address) {
          const state = data.address.state || data.address.region || ''; // Область/регион
          const city = data.address.city || data.address.town || data.address.village || '';
          const road = data.address.road || data.address.pedestrian || data.address.footway || '';
          const house = data.address.house_number ? `, ${data.address.house_number}` : '';
          
          // Формируем красивый короткий адрес
          if (road) {
            // Если есть улица, пишем: [Область (если это не город-миллионник), Город, Улица, Дом]
            // Но чтобы не было "Московская область, Москва" (что странно), область добавляем только если город !== область
            const statePrefix = (state && city && state !== city) ? state + ', ' : (state && !city ? state + ', ' : '');
            shortAddress = `${statePrefix}${city ? city + ', ' : ''}${road}${house}`;
          } else if (city) {
            // Если улицы нет (например, кликнули в лес), пишем: [Область, Город/Населенный пункт]
            const statePrefix = (state && state !== city) ? state + ', ' : '';
            shortAddress = `${statePrefix}${city}`;
          } else if (state) {
            // Если вообще ничего нет, кроме области
            shortAddress = state;
          }
          
          // Автоматически подставляем город (или населенный пункт) в форму
          if (city && onCitySelect) {
            onCitySelect(city);
          }
        }
        
        onLocationSelect(lat, lng, shortAddress);
      } catch (error) {
        console.error("Ошибка геокодинга:", error);
        onLocationSelect(lat, lng, `Широта: ${lat.toFixed(5)}, Долгота: ${lng.toFixed(5)}`);
      }
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon}></Marker>
  );
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export default function MapPickerComponent({ onLocationSelect, onCitySelect }: MapPickerProps) {
  const [center, setCenter] = useState<[number, number]>([55.751244, 37.618423]); // Москва по умолчанию
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);

  const requestGeolocation = () => {
    setIsLocating(true);
    setGeoError(null);

    if (!("geolocation" in navigator)) {
      setGeoError("Ваш браузер не поддерживает геолокацию.");
      setIsLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCenter([position.coords.latitude, position.coords.longitude]);
        setIsLocating(false);
      },
      (error) => {
        console.warn("Ошибка геолокации:", error);
        if (error.code === error.PERMISSION_DENIED) {
          setGeoError("Вы заблокировали доступ к геопозиции. Разрешите его в настройках браузера (иконка замка в адресной строке), чтобы карта центрировалась на вас.");
        } else {
          setGeoError("Не удалось определить местоположение. Попробуйте еще раз.");
        }
        setIsLocating(false);
      }
    );
  };

  useEffect(() => {
    // Оборачиваем в setTimeout, чтобы ESLint не ругался на синхронный вызов setState
    const timer = setTimeout(() => {
      requestGeolocation();
    }, 0);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="relative flex flex-col gap-2">
      
      <div className="flex flex-wrap items-center justify-between gap-2">
        <button 
          type="button"
          onClick={requestGeolocation}
          disabled={isLocating}
          className="bg-brand-surface border-2 border-brand-line text-brand-text font-extrabold text-xs uppercase px-3 py-1.5 rounded-brand hover:bg-brand-cat-soft transition-colors flex items-center gap-2 disabled:opacity-50"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"></polygon></svg>
          {isLocating ? 'Определяем...' : 'Моё местоположение'}
        </button>
      </div>

      {geoError && (
        <div className="bg-brand-heat/10 border-2 border-brand-heat p-2 rounded-brand text-[11px] font-bold text-brand-text">
          {geoError}
        </div>
      )}

      <div className="h-64 w-full border-2 border-brand-line rounded-brand overflow-hidden relative z-0">
        <MapContainer 
          center={center} 
          zoom={11} 
          scrollWheelZoom={true} 
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <ChangeView center={center} />
          <LocationMarker onLocationSelect={onLocationSelect} onCitySelect={onCitySelect} />
        </MapContainer>
      </div>
    </div>
  );
}
````

### `components/MobileFilters.tsx`

``tsx
'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

export default function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full py-3 bg-brand-surface border-2 border-brand-line rounded-brand font-extrabold uppercase flex items-center justify-center gap-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
        Фильтры
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-brand-bg border-t-2 border-brand-line rounded-t-[24px] p-6 animate-slide-up pb-10 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-2 border-brand-line pb-4">
              <h3 className="text-xl font-extrabold uppercase">Фильтры</h3>
              <button onClick={() => setIsOpen(false)} className="text-2xl font-bold px-2">✕</button>
            </div>
            
            {/* Просто рендерим Sidebar как есть */}
            <Sidebar />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand sticky bottom-0"
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </>
  );
}
````

### `components/NotificationsBell.tsx`

``tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Используем useRef, чтобы сохранить канал между рендерами
  const channelRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true; // Флаг, чтобы не обновлять состояние после размонтирования

    const setupNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      // 1. Загружаем историю
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data && isMounted) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }

      // 2. Подписываемся на Realtime (только один раз)
      if (!channelRef.current) {
        const channelName = `notifications-${user.id}-${Math.random()}`;
        channelRef.current = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              if (isMounted) {
                // Проверяем, нет ли уже этого уведомления в списке
                setNotifications((prev) => {
                  if (prev.some(n => n.id === payload.new.id)) return prev;
                  return [payload.new, ...prev];
                });
                setUnreadCount((prev) => prev + 1);
              }
            }
          )
          .subscribe();
      }
    };

    setupNotifications();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  // Закрытие по клику вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
       <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAsRead();
        }}
        aria-label={
          unreadCount > 0
            ? `Уведомления, непрочитанных: ${unreadCount}`
            : 'Уведомления'
        }
        aria-expanded={isOpen}
        aria-haspopup="true"
        className="relative w-11 h-11 flex items-center justify-center rounded-brand hover:bg-brand-bg transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-brand-surface">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
         <div
          role="dialog"
          aria-label="Уведомления"
          className="absolute right-0 mt-2 w-72 md:w-80 bg-brand-surface border-2 border-brand-line rounded-brand shadow-lg z-50 max-h-96 overflow-y-auto"
        >
          <div className="p-3 border-b-2 border-brand-line font-extrabold uppercase bg-brand-bg sticky top-0">
            Уведомления
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-brand-muted font-bold text-sm">
              Нет уведомлений
            </div>
          ) : (
            <ul className="flex flex-col">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-3 border-b border-brand-line/30 text-sm font-medium ${
                    !n.is_read ? 'bg-brand-accent/5' : ''
                  }`}
                >
                  {n.link ? (
                    <Link
                      href={n.link}
                      onClick={() => setIsOpen(false)}
                      className="hover:text-brand-accent transition-colors block"
                    >
                      {n.content}
                    </Link>
                  ) : (
                    n.content
                  )}
                  <span className="block text-[10px] text-brand-muted mt-1">
                    {new Date(n.created_at).toLocaleString('ru-RU')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
````

### `components/PageTransition.tsx`

``tsx
'use client';

import { motion, AnimatePresence } from 'motion/react';
import { usePathname } from 'next/navigation';

export default function PageTransition({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={pathname}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.3, ease: 'easeInOut' }}
        className="w-full" // <--- Вот это важно, чтобы блок занимал всю ширину
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
````

### `components/ReviewForm.tsx`

``tsx
'use client';

import { useState } from 'react';
import { leaveReview } from '@/app/actions';
import { useRouter } from 'next/navigation';
import { useToast } from './Toast';

export default function ReviewForm({ eventId }: { eventId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

   const { showSuccess, showError } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await leaveReview(eventId, rating, comment);
      if (res?.error) {
        showError(res.error);
      } else {
        showSuccess('Спасибо за ваш отзыв!');
        setIsOpen(false);
        router.refresh();
      }
    } catch (error) {
      showError('Ошибка отправки');
        console.error(error); // Чтобы ESLint не ругался на неиспользуемый error
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors w-full"
      >
        Оставить отзыв о событии
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Задний фон */}
          <div className="absolute inset-0 bg-black/60" onClick={() => !loading && setIsOpen(false)}></div>
          
          {/* Модалка */}
          <div className="relative bg-brand-bg border-2 border-brand-line rounded-brand-lg p-6 max-w-md w-full">
            <h2 className="text-xl font-extrabold uppercase mb-4 text-center">Ваш отзыв</h2>
            
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              
              {/* Звезды */}
              <div className="flex justify-center gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    onClick={() => setRating(star)}
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none"
                  >
                    <span className={(hoveredRating || rating) >= star ? 'text-yellow-500' : 'text-gray-300'}>★</span>
                  </button>
                ))}
              </div>

              {/* Комментарий */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[12px] font-extrabold uppercase text-brand-muted">Комментарий (необязательно)</label>
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Как все прошло?"
                  rows={4}
                  maxLength={500}
                  className="p-2.5 bg-brand-surface border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
              >
                {loading ? 'Отправка...' : 'Отправить отзыв'}
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
````

### `components/ScrollToTop.tsx`

``tsx
'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // Принудительно скроллим страницу в самый верх при монтировании компонента
    window.scrollTo(0, 0);
  }, []);

  return null; // Компонент ничего не рендерит
}
````

### `components/Sidebar.tsx`

``tsx
'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/validations';
import { useTransition } from 'react'; // <-- Добавили для плавности
import { useState, useEffect } from 'react'; // <-- Добавь useState/useEffect
import { supabase } from '@/lib/supabase'; // <-- Добавь импорт supabase

export default function Sidebar() {
  
    const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    supabase.from('cities').select('name').order('name').then(({ data }) => {
      if (data) setCities(data.map(c => c.name));
    });
  }, []);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCity = searchParams.get('city') || '';
  const [isPending, startTransition] = useTransition(); // <-- Индикатор загрузки

  // Получаем текущие выбранные категории (может быть несколько через запятую)
  const categoriesParam = searchParams.get('category') || '';
  const selectedCategories = categoriesParam ? categoriesParam.split(',') : [];
  
  const currentDateFrom = searchParams.get('date_from') || '';
  const currentDateTo = searchParams.get('date_to') || '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'Все') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.delete('page'); 
    
    // Используем startTransition для плавного обновления без "зависания"
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  const toggleCategory = (cat: string) => {
    let newCategories;
    if (selectedCategories.includes(cat)) {
      // Если уже выбрана — убираем
      newCategories = selectedCategories.filter(c => c !== cat);
    } else {
      // Если нет — добавляем
      newCategories = [...selectedCategories, cat];
    }
    
    const value = newCategories.length > 0 ? newCategories.join(',') : 'Все';
    updateFilters('category', value);
  };

  return (
    <aside className={`bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5 sticky top-24 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <h3 className="text-lg font-extrabold uppercase border-b-2 border-brand-line pb-2.5 mb-4 flex justify-between items-center">
        Фильтры
        {(selectedCategories.length > 0 || currentDateFrom || currentDateTo) && (
          <button 
            onClick={() => router.push('/')}
            className="text-[10px] text-brand-accent hover:underline normal-case"
          >
            Сбросить
          </button>
        )}
      </h3>
      
      {/* Категории */}
      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Категории (можно несколько)</span>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => updateFilters('category', 'Все')}
            className={`px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase transition-colors ${selectedCategories.length === 0 ? 'bg-brand-cat text-white' : 'bg-brand-bg hover:bg-brand-cat-soft'}`}
          >
            Все
          </button>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button 
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase transition-colors ${isSelected ? 'bg-brand-cat text-white' : 'bg-brand-bg hover:bg-brand-cat-soft'}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
      {/* Город */}
      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Город</span>
        <select
          value={currentCity}
          onChange={(e) => updateFilters('city', e.target.value)}
          className="w-full p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand text-sm outline-none focus:border-brand-accent"
        >
          <option value="">Все города</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      {/* Даты */}
      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Период событий</span>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold text-brand-muted uppercase block mb-1">От</label>
            <input 
              type="date" 
              value={currentDateFrom}
              onChange={(e) => updateFilters('date_from', e.target.value)}
              className="w-full p-2 bg-brand-bg border-2 border-brand-line rounded-brand text-sm outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-brand-muted uppercase block mb-1">До</label>
            <input 
              type="date" 
              value={currentDateTo}
              onChange={(e) => updateFilters('date_to', e.target.value)}
              className="w-full p-2 bg-brand-bg border-2 border-brand-line rounded-brand text-sm outline-none focus:border-brand-accent"
            />
          </div>
        </div>
      </div>

    </aside>
  );
}
````

### `components/Toast.tsx`

``tsx
'use client';

import { createContext, useContext, useState, ReactNode, useCallback } from 'react';

type ToastType = 'success' | 'error';
type Toast = { id: number; message: string; type: ToastType };

const ToastContext = createContext<{
  showSuccess: (msg: string) => void;
  showError: (msg: string) => void;
} | null>(null);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = useCallback((message: string, type: ToastType) => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    
    // Удаляем через 4 секунды
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const showSuccess = useCallback((msg: string) => addToast(msg, 'success'), [addToast]);
  const showError = useCallback((msg: string) => addToast(msg, 'error'), [addToast]);

  return (
    <ToastContext.Provider value={{ showSuccess, showError }}>
      {children}
      
      {/* Контейнер для тостов (фиксируется в правом нижнем углу) */}
      <div className="fixed bottom-4 right-4 z-[200] flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div 
            key={t.id}
            className={`pointer-events-auto px-4 py-3 rounded-brand border-2 shadow-lg font-bold text-sm max-w-sm animate-fade-in-up
              ${t.type === 'success' 
                ? 'bg-green-100 text-green-800 border-green-800' 
                : 'bg-red-100 text-red-800 border-red-800'}
            `}
          >
            {t.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error('useToast must be used within ToastProvider');
  return context;
}
````

### `eslint.config.mjs`

``js
import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;

````

### `global.d.ts`

``ts
export {};

declare global {
  // Тип пользователя, которого возвращает Telegram
  interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  }

  interface Window {
    Telegram?: {
      Login: {
        auth: (
          options: { bot_id: string; request_access?: string },
          callback: (user: TelegramUser) => void
        ) => void;
      };
    };
    // Ставим знак "?", чтобы TypeScript разрешил делать delete
    onTelegramAuth?: (user: TelegramUser) => void | Promise<void>;
  }
}
````

### `lib/achievements.ts`

``ts
export type Badge = {
  level: number;
  title: string;
  threshold: number;
  icon: string; // Путь к твоей картинке
  color: string; // Цвет рамки или свечения
};

// Бейджи за организацию
export const ORGANIZER_BADGES: Badge[] = [
  { level: 1, title: 'Инициатор', threshold: 1, icon: '/badges/org_1.png', color: 'border-gray-400' },
  { level: 2, title: 'Координатор', threshold: 5, icon: '/badges/org_5.png', color: 'border-blue-400' },
  { level: 3, title: 'Душа компании', threshold: 10, icon: '/badges/org_10.png', color: 'border-green-400' },
  { level: 4, title: 'Мастер встреч', threshold: 25, icon: '/badges/org_25.png', color: 'border-purple-400' },
  { level: 5, title: 'Хранитель', threshold: 50, icon: '/badges/org_50.png', color: 'border-yellow-400' },
  { level: 6, title: 'Архитектор', threshold: 100, icon: '/badges/org_100.png', color: 'border-orange-500' },
  { level: 7, title: 'Гуру', threshold: 250, icon: '/badges/org_250.png', color: 'border-red-500' },
  { level: 8, title: 'Великий организатор', threshold: 500, icon: '/badges/org_500.png', color: 'border-indigo-600' },
  { level: 9, title: 'Легенда', threshold: 1000, icon: '/badges/org_1000.png', color: 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' },
];

// Бейджи за участие
export const PARTICIPANT_BADGES: Badge[] = [
  { level: 1, title: 'Первопроходец', threshold: 1, icon: '/badges/part_1.png', color: 'border-gray-400' },
  { level: 2, title: 'Общительный', threshold: 5, icon: '/badges/part_5.png', color: 'border-blue-400' },
  { level: 3, title: 'Ветеран', threshold: 10, icon: '/badges/part_10.png', color: 'border-green-400' },
  { level: 4, title: 'Магнит знакомств', threshold: 25, icon: '/badges/part_25.png', color: 'border-purple-400' },
  { level: 5, title: 'Посол добра', threshold: 50, icon: '/badges/part_50.png', color: 'border-yellow-400' },
  { level: 6, title: 'Хранитель традиций', threshold: 100, icon: '/badges/part_100.png', color: 'border-orange-500' },
  { level: 7, title: 'Великий гость', threshold: 250, icon: '/badges/part_250.png', color: 'border-red-500' },
  { level: 8, title: 'Икона', threshold: 500, icon: '/badges/part_500.png', color: 'border-indigo-600' },
  { level: 9, title: 'Бессмертный', threshold: 1000, icon: '/badges/part_1000.png', color: 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' },
];

// Функция для получения текущего бейджа и прогресса до следующего
export function getBadgeStatus(count: number, badges: Badge[]) {
  // Если 0 событий — бейджа нет
  if (count === 0) return { current: null, next: badges[0], progress: 0 };

  // Ищем текущий уровень
  let current = badges[0];
  let next = badges[1] || null;

  for (let i = 0; i < badges.length; i++) {
    if (count >= badges[i].threshold) {
      current = badges[i];
      next = badges[i + 1] || null;
    } else {
      break;
    }
  }

  // Считаем прогресс до следующего
  let progress = 100;
  if (next) {
    const range = next.threshold - current.threshold;
    const achieved = count - current.threshold;
    progress = Math.min(100, Math.max(0, Math.round((achieved / range) * 100)));
  }

  return { current, next, progress };
}
````

### `lib/admin-utils.ts`

``ts
import { createClient } from '@/lib/supabase-server';
import { redirect } from 'next/navigation';

export async function requireAdmin() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Если не авторизован — на страницу входа
  if (!user) {
    redirect('/login');
  }

  // Получаем роль
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  // Если роль не админ и не модератор — на главную
  if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
    redirect('/');
  }

  return { user, role: profile.role };
}
````

### `lib/event-access.ts`

``ts
// lib/event-access.ts
import type { SupabaseClient } from '@supabase/supabase-js';

export type EventRowForAccess = {
  organizer_id: string;
  hide_location: boolean;
};

export type EventRow = {
  id: string;
  organizer_id: string;
  category: string;
  date_time: string;
  title: string;
  description: string;
  organizer_name: string;
  organizer_rank: string;
  max_participants: number;
  location: string;
  lat: number | null;
  lng: number | null;
  hide_location: boolean;
  is_full: boolean;
};

export type ViewerContext =
  | { kind: 'anonymous' }
  | { kind: 'user'; userId: string };

export async function getViewer(
  supabase: SupabaseClient
): Promise<ViewerContext> {
  const { data: { user } } = await supabase.auth.getUser();
  return user ? { kind: 'user', userId: user.id } : { kind: 'anonymous' };
}

// Право видеть точное место у конкретного события
export function canSeeExactLocation(
  event: Pick<EventRow, 'organizer_id' | 'hide_location'>,
  viewer: ViewerContext,
  myApplicationStatus: 'pending' | 'approved' | 'rejected' | null
): boolean {
  if (viewer.kind === 'user' && viewer.userId === event.organizer_id) return true;
  if (!event.hide_location) return true;
  return myApplicationStatus === 'approved';
}
````

### `lib/event-dto.ts`

``ts
export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type EventListItemDTO = {
  id: string;
  organizerId: string;
  category: string;
  dateTime: string;
  title: string;
  description: string;
  organizerName: string;
  organizerRank: string;
  maxParticipants: number;
  approvedParticipantsCount: number;
  isFull: boolean;
  status: 'active' | 'cancelled';
  cancelReason?: string | null;
  // публичное представление места — всегда безопасно
  publicLocationLabel: string;      // "Парк Горького" или "Место скрыто организатором"
  locationIsHidden: boolean;       // факт скрытия, не сами данные
  city?: string | null;
  // точные данные — только если пользователь имеет право
  exactLocation?: string;           // undefined, если нет доступа
  lat?: number;                     // undefined, если нет доступа
  lng?: number;                     // undefined, если нет доступа
  myApplicationStatus: 'pending' | 'approved' | 'rejected' | null;
  isOrganizer: boolean;
  organizerAvatar?: string | null;
  organizerGender?: string | null;
  /** Количество непрочитанных сообщений в чате этого события */
  unreadCount: number;
};
````

### `lib/event-queries.ts`

``ts
// lib/event-queries.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import type { ApplicationStatus, EventListItemDTO } from './event-dto';
import { type ViewerContext, canSeeExactLocation } from './event-access';
import { getBadgeStatus, ORGANIZER_BADGES } from './achievements';

type EventRow = {
  id: string;
  organizer_id: string;
  category: string;
  date_time: string;
  title: string;
  description: string;
  organizer_name: string;
  organizer_rank: string;
  max_participants: number;
  status: string;
  cancel_reason: string | null;
  location: string;
  lat: number | null;
  lng: number | null;
  hide_location: boolean;
  is_full: boolean;
  city: string | null;
  profiles?: { avatar_url: string | null; gender: string | null } | { avatar_url: string | null; gender: string | null }[] | null;
};

export async function getEventListDTOs(
  supabase: SupabaseClient,
  viewer: ViewerContext,
  limit: number = 10,
  offset: number = 0,
  isArchive: boolean = false,
  
  filters?: { category?: string; dateFrom?: string; dateTo?: string; city?: string }
): Promise<{ items: EventListItemDTO[]; total: number }> {
  
  // 1. Запрос с пагинацией и правильной фильтрацией
  let query = supabase
  
    .from('events')
    .select(
      `
      id,
      organizer_id,
      category,
      date_time,
      title,
      description,
      organizer_name,
      organizer_rank,
      max_participants,
      location,
      lat,
      lng,
      hide_location,
      is_full,
      status,
      cancel_reason,
      city,
      profiles ( avatar_url, gender )
    `,
      { count: 'exact' }
    );
  // Применяем фильтр по городу
  if (filters?.city) {
    query = query.eq('city', filters.city);
  }
  // Применяем фильтр по категории (если выбрано несколько, они придут через запятую)
  if (filters?.category && filters.category !== 'Все') {
    const categoriesArray = filters.category.split(',');
    if (categoriesArray.length > 1) {
      query = query.in('category', categoriesArray); // Множественный выбор
    } else {
      query = query.eq('category', categoriesArray[0]); // Одна категория
    }
  }

  // Применяем фильтр по дате "От"
  if (filters?.dateFrom) {
    // Нам нужно, чтобы событие начиналось не раньше начала выбранного дня
    const fromDate = new Date(filters.dateFrom);
    fromDate.setHours(0, 0, 0, 0);
    query = query.gte('date_time', fromDate.toISOString());
  }

  // Применяем фильтр по дате "До"
  if (filters?.dateTo) {
    // Нам нужно, чтобы событие начиналось не позже конца выбранного дня (23:59:59)
    const toDate = new Date(filters.dateTo);
    toDate.setHours(23, 59, 59, 999);
    query = query.lte('date_time', toDate.toISOString());
  }

  if (isArchive) {
    const now = new Date().toISOString();
    query = query.or(`date_time.lt.${now},status.eq.cancelled`);
  } else {
    query = query.gte('date_time', new Date().toISOString()).eq('status', 'active');
  }

  const { data, error, count } = await query
    .order('date_time', { ascending: !isArchive })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  
  const events = (data ?? []) as unknown as EventRow[];
  if (events.length === 0) {
    return { items: [], total: count || 0 };
  }

  const ids = events.map((e) => e.id);

  // 2. Считаем количество прошедших событий для каждого организатора
  const organizerIds = [...new Set(events.map(e => e.organizer_id))];
  const orgPastEventsCount = new Map<string, number>();
  
  if (organizerIds.length > 0) {
    const { data: orgPastEvents } = await supabase
      .from('events')
      .select('organizer_id')
      .in('organizer_id', organizerIds)
      .lt('date_time', new Date().toISOString())
      .eq('status', 'active');
      
    orgPastEvents?.forEach(e => {
      orgPastEventsCount.set(e.organizer_id, (orgPastEventsCount.get(e.organizer_id) || 0) + 1);
    });
  }

  // 3. Агрегат approved
  const approvedCount = new Map<string, number>();
  {
    const { data: approvedRows } = await supabase
      .from('applications')
      .select('event_id')
      .in('event_id', ids)
      .eq('status', 'approved');
    for (const r of approvedRows ?? []) {
      approvedCount.set(r.event_id, (approvedCount.get(r.event_id) ?? 0) + 1);
    }
  }

  // 4. Мои заявки
  const myStatus = new Map<string, ApplicationStatus>();
  if (viewer.kind === 'user') {
    const { data: myApps } = await supabase
      .from('applications')
      .select('event_id, status')
      .in('event_id', ids)
      .eq('user_id', viewer.userId);
    for (const a of myApps ?? []) {
      if (a.status === 'pending' || a.status === 'approved' || a.status === 'rejected') {
        myStatus.set(a.event_id, a.status);
      }
    }
  }

  // 5. Считаем непрочитанные
  const unreadCounts = new Map<string, number>();
  if (viewer.kind === 'user') {
    const { data: reads } = await supabase
      .from('chat_reads')
      .select('event_id, last_read_at')
      .in('event_id', ids)
      .eq('user_id', viewer.userId);

    const readMap = new Map(reads?.map(r => [r.event_id, r.last_read_at]) || []);

    for (const eventId of ids) {
      const lastRead = readMap.get(eventId);
      let msgQuery = supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .eq('event_id', eventId)
        .neq('user_id', viewer.userId);

      if (lastRead) {
        msgQuery = msgQuery.gt('created_at', lastRead);
      }
      
      const { count: msgCount } = await msgQuery;
      if (msgCount && msgCount > 0) {
        unreadCounts.set(eventId, msgCount);
      }
    }
  }

  // 6. Сборка DTO
  const items = events.map((e): EventListItemDTO => {
    const myApp = myStatus.get(e.id) ?? null;
    const allowed = canSeeExactLocation(e, viewer, myApp);
    const approved = approvedCount.get(e.id) ?? 0;
    const isFull = Boolean(e.is_full) || approved >= e.max_participants;
    const profile = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles;

    // Вычисляем динамический ранг организатора на лету
    const pastCount = orgPastEventsCount.get(e.organizer_id) || 0;
    const dynamicRank = getBadgeStatus(pastCount, ORGANIZER_BADGES).current?.title || 'Новичок';

    const dto: EventListItemDTO = {
      id: e.id,
      organizerId: e.organizer_id,
      category: e.category,
      dateTime: e.date_time,
      title: e.title,
      description: e.description,
      organizerName: e.organizer_name,
      organizerRank: dynamicRank, // <--- ИСПОЛЬЗУЕМ ВЫЧИСЛЕННЫЙ РАНГ
      maxParticipants: e.max_participants,
      approvedParticipantsCount: approved,
      isFull,
      publicLocationLabel: e.hide_location
        ? 'Место скрыто организатором'
        : e.location,
      locationIsHidden: e.hide_location,
      status: e.status as 'active' | 'cancelled',
      cancelReason: e.cancel_reason,
      city: e.city,
      myApplicationStatus: myApp,
      isOrganizer: viewer.kind === 'user' && viewer.userId === e.organizer_id,
      organizerAvatar: profile?.avatar_url ?? null,
      organizerGender: profile?.gender ?? null,
      unreadCount: unreadCounts.get(e.id) ?? 0,
    };

    if (allowed) {
      dto.exactLocation = e.location;
      if (typeof e.lat === 'number') dto.lat = e.lat;
      if (typeof e.lng === 'number') dto.lng = e.lng;
    }

    return dto;
  });

  return { items, total: count || 0 };
}
````

### `lib/supabase.ts`

``ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
````

### `lib/supabase-server.ts`

``ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // <--- Ключ должен быть здесь
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Игнорируем ошибки
          }
        },
      },
    }
  )
}
````

### `lib/username-generator.ts`

``ts
// Массивы слов (пока по 10, но ты можешь легко расширить их до 2000)
const ADJECTIVES = [
  'Веселый', 'Грустный', 'Быстрый', 'Медленный', 'Умный',
  'Хитрый', 'Добрый', 'Злой', 'Смелый', 'Тихий'
  // ... добавляй сюда свои прилагательные
];

const NOUNS = [
  'Енот', 'Кот', 'Пес', 'Пингвин', 'Лис',
  'Медведь', 'Заяц', 'Волк', 'Тигр', 'Лев'
  // ... добавляй сюда свои существительные
];

export function generateRandomUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  // Добавляем 2 случайные цифры в конец, чтобы избежать совпадений
  const randomNum = Math.floor(10 + Math.random() * 90);
  
  // Формируем никнейм: Веселый_Енот42
  // Заменяем все недопустимые символы (оставляем буквы, цифры и _)
  return `${adj}_${noun}${randomNum}`.replace(/[^a-zA-Zа-яА-Я0-9_]/g, '');
}
````

### `lib/validations.ts`

``ts
// lib/validations.ts
import { z } from 'zod';

// Допустимые категории (должны совпадать с теми, что в UI)
export const CATEGORIES = [
  'Прогулки',
  'Спорт',
  'Культура',
  'Еда/напитки',
  'Обучение',
  'Поездки',
  'Волонтёрство',
  'Здесь и сейчас',
] as const;

export const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Название должно быть не короче 5 символов')
    .max(100, 'Название слишком длинное'),
  
  city: z.string().min(2, 'Укажите город'),

  description: z
    .string()
    .trim()
    .min(15, 'Описание должно быть не короче 15 символов')
    .max(1200, 'Описание слишком длинное'),
  
  category: z.enum(CATEGORIES, {
    message: 'Недопустимая категория',
  }),
  
  location: z
    .string()
    .trim()
    .min(3, 'Укажите место проведения')
    .max(300, 'Адрес слишком длинный'),
  
  max_participants: z
    .coerce.number()
    .int('Лимит участников должен быть целым числом')
    .min(1, 'Лимит участников должен быть от 1')
    .max(100, 'Лимит участников не может превышать 100'),
  
  lat: z.coerce
    .number()
    .min(-90, 'Некорректная широта')
    .max(90, 'Некорректная широта')
    .nullable(),
  
  lng: z.coerce
    .number()
    .min(-180, 'Некорректная долгота')
    .max(180, 'Некорректная долгота')
    .nullable(),
  
  // Объединяем дату и время в ISO-строку
  date_time: z
    .string()
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) throw new Error('Некорректная дата и время');
      return date.toISOString();
    })
    .refine(
      (isoStr) => new Date(isoStr) > new Date(),
      'Дата события должна быть в будущем'
    ),
  
  hide_location: z.boolean(),
});
````

### `next.config.ts`

``ts
import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  // Указываем Turbopack, где именно лежит корень проекта
  turbopack: {
    root: path.resolve(__dirname),
  },
  async rewrites() {
    return [
      {
        source: '/@:username',
        destination: '/:username',
      },
    ];
  },
};

export default nextConfig;
````

### `package.json`

``json
{
  "name": "namylimsya-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest run"
  },
  "dependencies": {
    "@supabase/ssr": "^0.12.7",
    "@supabase/supabase-js": "^2.118.0",
    "leaflet": "^1.9.4",
    "motion": "^14.3.0",
    "next": "16.4.2",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-leaflet": "^5.0.0",
    "zod": "^4.6.7"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4.3.3",
    "@tailwindcss/turbopack": "^4",
    "@types/leaflet": "^1.9.22",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.4.2",
    "tailwindcss": "^4",
    "typescript": "^5",
    "vitest": "^2.1.9"
  }
}

````

### `postcss.config.mjs`

``js
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
````

### `proxy.ts`

``ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function proxy(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()

  // 1. ЕСЛИ ПОЛЬЗОВАТЕЛЬ АВТОРИЗОВАН - ПРОВЕРЯЕМ БАН
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_banned')
      .eq('id', user.id)
      .single();

    if (profile?.is_banned) {
      // Если он забанен и пытается зайти куда-то, кроме страницы /banned и /login
      if (request.nextUrl.pathname !== '/banned' && request.nextUrl.pathname !== '/login') {
        const url = request.nextUrl.clone()
        url.pathname = '/banned'
        return NextResponse.redirect(url)
      }
    } else {
      // Если он НЕ забанен, но сидит на странице /banned — выкидываем его оттуда
      if (request.nextUrl.pathname === '/banned') {
        const url = request.nextUrl.clone()
        url.pathname = '/'
        return NextResponse.redirect(url)
      }
    }
  }

  // 2. ЕСЛИ НЕ АВТОРИЗОВАН - НЕ ПУСКАЕМ В АДМИНКУ
  if (!user && request.nextUrl.pathname.startsWith('/admin')) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this to fit your needs.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
````

### `public/file.svg`

``
<svg fill="none" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path d="M14.5 13.5V5.41a1 1 0 0 0-.3-.7L9.8.29A1 1 0 0 0 9.08 0H1.5v13.5A2.5 2.5 0 0 0 4 16h8a2.5 2.5 0 0 0 2.5-2.5m-1.5 0v-7H8v-5H3v12a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1M9.5 5V2.12L12.38 5zM5.13 5h-.62v1.25h2.12V5zm-.62 3h7.12v1.25H4.5zm.62 3h-.62v1.25h7.12V11z" clip-rule="evenodd" fill="#666" fill-rule="evenodd"/></svg>
````

### `public/globe.svg`

``
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><g clip-path="url(#a)"><path fill-rule="evenodd" clip-rule="evenodd" d="M10.27 14.1a6.5 6.5 0 0 0 3.67-3.45q-1.24.21-2.7.34-.31 1.83-.97 3.1M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m.48-1.52a7 7 0 0 1-.96 0H7.5a4 4 0 0 1-.84-1.32q-.38-.89-.63-2.08a40 40 0 0 0 3.92 0q-.25 1.2-.63 2.08a4 4 0 0 1-.84 1.31zm2.94-4.76q1.66-.15 2.95-.43a7 7 0 0 0 0-2.58q-1.3-.27-2.95-.43a18 18 0 0 1 0 3.44m-1.27-3.54a17 17 0 0 1 0 3.64 39 39 0 0 1-4.3 0 17 17 0 0 1 0-3.64 39 39 0 0 1 4.3 0m1.1-1.17q1.45.13 2.69.34a6.5 6.5 0 0 0-3.67-3.44q.65 1.26.98 3.1M8.48 1.5l.01.02q.41.37.84 1.31.38.89.63 2.08a40 40 0 0 0-3.92 0q.25-1.2.63-2.08a4 4 0 0 1 .85-1.32 7 7 0 0 1 .96 0m-2.75.4a6.5 6.5 0 0 0-3.67 3.44 29 29 0 0 1 2.7-.34q.31-1.83.97-3.1M4.58 6.28q-1.66.16-2.95.43a7 7 0 0 0 0 2.58q1.3.27 2.95.43a18 18 0 0 1 0-3.44m.17 4.71q-1.45-.12-2.69-.34a6.5 6.5 0 0 0 3.67 3.44q-.65-1.27-.98-3.1" fill="#666"/></g><defs><clipPath id="a"><path fill="#fff" d="M0 0h16v16H0z"/></clipPath></defs></svg>
````

### `public/next.svg`

``
<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 394 80"><path fill="#000" d="M262 0h68.5v12.7h-27.2v66.6h-13.6V12.7H262V0ZM149 0v12.7H94v20.4h44.3v12.6H94v21h55v12.6H80.5V0h68.7zm34.3 0h-17.8l63.8 79.4h17.9l-32-39.7 32-39.6h-17.9l-23 28.6-23-28.6zm18.3 56.7-9-11-27.1 33.7h17.8l18.3-22.7z"/><path fill="#000" d="M81 79.3 17 0H0v79.3h13.6V17l50.2 62.3H81Zm252.6-.4c-1 0-1.8-.4-2.5-1s-1.1-1.6-1.1-2.6.3-1.8 1-2.5 1.6-1 2.6-1 1.8.3 2.5 1a3.4 3.4 0 0 1 .6 4.3 3.7 3.7 0 0 1-3 1.8zm23.2-33.5h6v23.3c0 2.1-.4 4-1.3 5.5a9.1 9.1 0 0 1-3.8 3.5c-1.6.8-3.5 1.3-5.7 1.3-2 0-3.7-.4-5.3-1s-2.8-1.8-3.7-3.2c-.9-1.3-1.4-3-1.4-5h6c.1.8.3 1.6.7 2.2s1 1.2 1.6 1.5c.7.4 1.5.5 2.4.5 1 0 1.8-.2 2.4-.6a4 4 0 0 0 1.6-1.8c.3-.8.5-1.8.5-3V45.5zm30.9 9.1a4.4 4.4 0 0 0-2-3.3 7.5 7.5 0 0 0-4.3-1.1c-1.3 0-2.4.2-3.3.5-.9.4-1.6 1-2 1.6a3.5 3.5 0 0 0-.3 4c.3.5.7.9 1.3 1.2l1.8 1 2 .5 3.2.8c1.3.3 2.5.7 3.7 1.2a13 13 0 0 1 3.2 1.8 8.1 8.1 0 0 1 3 6.5c0 2-.5 3.7-1.5 5.1a10 10 0 0 1-4.4 3.5c-1.8.8-4.1 1.2-6.8 1.2-2.6 0-4.9-.4-6.8-1.2-2-.8-3.4-2-4.5-3.5a10 10 0 0 1-1.7-5.6h6a5 5 0 0 0 3.5 4.6c1 .4 2.2.6 3.4.6 1.3 0 2.5-.2 3.5-.6 1-.4 1.8-1 2.4-1.7a4 4 0 0 0 .8-2.4c0-.9-.2-1.6-.7-2.2a11 11 0 0 0-2.1-1.4l-3.2-1-3.8-1c-2.8-.7-5-1.7-6.6-3.2a7.2 7.2 0 0 1-2.4-5.7 8 8 0 0 1 1.7-5 10 10 0 0 1 4.3-3.5c2-.8 4-1.2 6.4-1.2 2.3 0 4.4.4 6.2 1.2 1.8.8 3.2 2 4.3 3.4 1 1.4 1.5 3 1.5 5h-5.8z"/></svg>
````

### `public/vercel.svg`

``
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1155 1000"><path d="m577.3 0 577.4 1000H0z" fill="#fff"/></svg>
````

### `public/window.svg`

``
<svg fill="none" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"><path fill-rule="evenodd" clip-rule="evenodd" d="M1.5 2.5h13v10a1 1 0 0 1-1 1h-11a1 1 0 0 1-1-1zM0 1h16v11.5a2.5 2.5 0 0 1-2.5 2.5h-11A2.5 2.5 0 0 1 0 12.5zm3.75 4.5a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5M7 4.75a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0m1.75.75a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5" fill="#666"/></svg>
````

### `README.md`

``md
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
#   n a m y l i m s y a - a p p  
 #   n a m y l i m s y a - a p p  
 
````

### `supabase/.temp/cli-latest`

``

````

### `supabase/.temp/gotrue-version`

``
v2.197.0
````

### `supabase/.temp/linked-project.json`

``json
{"ref":"mekdxymeyzdfuhfpcuqs","name":"namylimsya","organization_id":"pfeqdqnyyenbnimanmnj","organization_slug":"pfeqdqnyyenbnimanmnj"}
````

### `supabase/.temp/pooler-url`

``
postgresql://postgres.mekdxymeyzdfuhfpcuqs@aws-0-eu-west-1.pooler.supabase.com:5432/postgres
````

### `supabase/.temp/postgres-version`

``
17.11.0.003
````

### `supabase/.temp/project-ref`

``
mekdxymeyzdfuhfpcuqs
````

### `supabase/.temp/rest-version`

``
v14.18
````

### `supabase/.temp/storage-migration`

``
revoke-grants-to-unused-operations
````

### `supabase/.temp/storage-version`

``
v1.80.2
````

### `supabase/config.toml`

``

[functions.telegram-auth]
enabled = true
verify_jwt = false
import_map = "./functions/telegram-auth/deno.json"
# Uncomment to specify a custom file path to the entrypoint.
# Supported file extensions are: .ts, .js, .mjs, .jsx, .tsx
entrypoint = "./functions/telegram-auth/index.ts"
# Specifies static files to be bundled with the function. Supports glob patterns.
# For example, if you want to serve static HTML pages in your function:
# static_files = [ "./functions/telegram-auth/*.html" ]

````

### `supabase/functions/telegram-auth/.npmrc`

``
# Configuration for private npm package dependencies
# For more information on using private registries with Edge Functions, see:
# https://supabase.com/docs/guides/functions/import-maps#importing-from-private-registries

````

### `supabase/functions/telegram-auth/deno.json`

``json
{
  "imports": {
    "@supabase/functions-js": "jsr:@supabase/functions-js@^2",
    "@supabase/server": "npm:@supabase/server@^1"
  }
}

````

### `supabase/functions/telegram-auth/index.ts`

``ts
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const CLIENT_SECRET = 'lqu2srO08Sdn_qzHB4ZsK5xL66Qd1GYTE0rN1fYD7I-Bh9201Mt_KA' // <-- ВАЖНО!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { code: qtoken } = await req.json();

    if (!qtoken) throw new Error('No qtoken provided');

    // Меняем qtoken на access_token
    const tokenRes = await fetch('https://oauth.telegram.org/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code: qtoken,
        client_id: '8934385689',
        client_secret: CLIENT_SECRET,
        redirect_uri: 'https://namylimsya.vercel.app/auth/callback' // <-- ВАЖНО: указываем /login, так как токен шлется сюда
      })
    });

    const tokenData = await tokenRes.json();
    if (tokenData.error) throw new Error(tokenData.error_description || 'Token error');

    // Получаем данные пользователя
    const userRes = await fetch('https://oauth.telegram.org/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` }
    });
    const tgUser = await userRes.json();

    // Ищем или создаем пользователя
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('telegram_id', tgUser.id)
      .maybeSingle();

    let userId;
    const email = `tg_${tgUser.id}@namylimsya.local`;

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      const safeUsername = (tgUser.preferred_username || tgUser.name || `user_${tgUser.id}`).replace(/[^a-zA-Z0-9_]/g, '');
      
      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { username: safeUsername, telegram_id: tgUser.id }
      });

      if (authError) throw authError;
      userId = authUser.user.id;
      await supabaseAdmin.from('profiles').update({ telegram_id: tgUser.id }).eq('id', userId);
    }

    // Выдаем токен Supabase
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: email,
    });

    if (linkError) throw linkError;

    return new Response(JSON.stringify({ 
      token: linkData.properties.hashed_token,
      user_id: userId
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
})
````

### `supabase/functions/telegram-auth/tsconfig.json`

``json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "noEmit": true,
    "types": ["deno.window", "deno.ns"],
    "strict": true
  }
}
````

### `tools/bundle-project.ps1`

``powershell
# tools/bundle-project.ps1  (ASCII-only, safe in any encoding)
param(
    [string]$OutputFile = "project-bundle.md",
    [string]$Root = (Get-Location).Path
)

Set-Location $Root
$Root = (Get-Location).Path

$excludeDirs = @(
    'node_modules', '.next', '.git', 'dist', 'build', 'coverage',
    '.turbo', '.vercel', 'out', '.idea', '.vscode', '.cache'
)

$excludeFileGlobs = @(
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'next-env.d.ts',
    'tree.txt', 'tree-security.txt',
    'project-bundle.md', 'security-bundle.md',
    '*.log',
    'public/**/*.png', 'public/**/*.jpg', 'public/**/*.jpeg',
    'public/**/*.svg', 'public/**/*.gif', 'public/**/*.webp',
    'public/**/*.ico',
    '**/*.map'
)

$binaryExt = @('.png','.jpg','.jpeg','.gif','.webp','.ico','.pdf','.zip',
               '.woff','.woff2','.ttf','.otf','.mp4','.mp3','.lock')

# --- custom recursive walk that PRUNES excluded dirs (no descent) ---
$allFiles = New-Object System.Collections.Generic.List[object]

function Walk {
    param([string]$Dir, [string]$RelPrefix)

    Get-ChildItem -LiteralPath $Dir -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $item = $_

        # skip symlinks / junctions to avoid loops
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { return }

        $rel = if ($RelPrefix) { "$RelPrefix/$($item.Name)" } else { $item.Name }

        if ($item.PSIsContainer) {
            if ($excludeDirs -contains $item.Name) { return }   # prune
            Walk -Dir $item.FullName -RelPrefix $rel
        } else {
            foreach ($glob in $excludeFileGlobs) {
                if ($rel -like $glob) { return }
            }
            $allFiles.Add([pscustomobject]@{
                Full = $item.FullName
                Rel  = $rel
                Ext  = $item.Extension.ToLower()
            })
        }
    }
}

Walk -Dir $Root -RelPrefix ''

$allFiles = $allFiles | Sort-Object Rel

# --- build tree (ASCII) ---
$treeLines = New-Object System.Collections.Generic.List[string]
$treeLines.Add((Split-Path $Root -Leaf) + '/')

$tree = @{}
foreach ($f in $allFiles) {
    $parts = $f.Rel -split '/'
    $node = $tree
    for ($i=0; $i -lt $parts.Count; $i++) {
        $p = $parts[$i]
        $isFile = ($i -eq $parts.Count - 1)
        if ($isFile) { $node[$p] = $null }
        else {
            if (-not $node.ContainsKey($p)) { $node[$p] = @{} }
            $node = $node[$p]
        }
    }
}

function Render-Tree {
    param($Node, [string]$Prefix)
    $keys = $Node.Keys | Sort-Object {
        if ($Node[$_] -eq $null) { 1 } else { 0 }
    }, { $_ }
    for ($i=0; $i -lt $keys.Count; $i++) {
        $k = $keys[$i]
        $isLast = ($i -eq $keys.Count - 1)
        $conn = if ($isLast) { '\-- ' } else { '|-- ' }
        $suffix = if ($Node[$k] -eq $null) { '' } else { '/' }
        $script:treeLines.Add("$Prefix$conn$k$suffix")
        if ($Node[$k] -ne $null) {
            $newPrefix = $Prefix + $(if ($isLast) { '    ' } else { '|   ' })
            Render-Tree -Node $Node[$k] -Prefix $newPrefix
        }
    }
}
Render-Tree -Node $tree -Prefix ''

function Get-Lang {
    param([string]$Ext)
    switch ($Ext) {
        '.ts'   { 'ts' }   '.tsx' { 'tsx' }  '.js'  { 'js' }
        '.jsx'  { 'jsx' }  '.mjs' { 'js' }   '.cjs' { 'js' }
        '.json' { 'json' } '.css' { 'css' }  '.scss'{ 'scss' }
        '.html' { 'html' } '.md'  { 'md' }
        '.yml'  { 'yaml' } '.yaml'{ 'yaml' }
        '.ps1'  { 'powershell' }
        '.sql'  { 'sql' }
        '.env'  { 'bash' }
        default { '' }
    }
}

# --- stream output directly to file (no StringBuilder) ---
$outPath = Join-Path $Root $OutputFile
$utf8 = New-Object System.Text.UTF8Encoding($false)  # no BOM
$sw = New-Object System.IO.StreamWriter($outPath, $false, $utf8)

try {
    $sw.WriteLine("# Project bundle")
    $sw.WriteLine()
    $sw.WriteLine("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')")
    $sw.WriteLine("Root: $Root")
    $sw.WriteLine()
    $sw.WriteLine("## Tree")
    $sw.WriteLine()
    $sw.WriteLine('```')
    foreach ($line in $treeLines) { $sw.WriteLine($line) }
    $sw.WriteLine('```')
    $sw.WriteLine()
    $sw.WriteLine("## Files")
    $sw.WriteLine()

    foreach ($f in $allFiles) {
        $rel = $f.Rel
        $isEnv = (Split-Path $rel -Leaf) -like '.env*'

        if ($binaryExt -contains $f.Ext) {
            $sw.WriteLine("### ``$rel``")
            $sw.WriteLine()
            $sw.WriteLine("_binary file, content skipped_")
            $sw.WriteLine()
            continue
        }

        $content = $null
        try {
            $content = Get-Content -LiteralPath $f.Full -Raw -Encoding utf8 -ErrorAction Stop
        } catch {
            $sw.WriteLine("### ``$rel``")
            $sw.WriteLine()
            $sw.WriteLine("_read error: $($_.Exception.Message)_")
            $sw.WriteLine()
            continue
        }
        if ($null -eq $content) { $content = '' }

        $lang = Get-Lang $f.Ext

        if ($isEnv) {
            $content = ($content -split "`r?`n" | ForEach-Object {
                if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$') {
                    "$($Matches[1])=***REDACTED***"
                } else { $_ }
            }) -join "`n"
            $lang = 'bash'
        }

        $sw.WriteLine("### ``$rel``")
        $sw.WriteLine()
        $sw.WriteLine("````$lang")
        $sw.WriteLine($content)
        $sw.WriteLine('````')
        $sw.WriteLine()
    }
}
finally {
    $sw.Flush()
    $sw.Close()
}

$sizeKb = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
Write-Host "OK: $outPath"
Write-Host "   Files: $($allFiles.Count)"
Write-Host "   Size:  $sizeKb KB"
````

### `tools/bundle-security-md.ps1`

``powershell
<#
.SYNOPSIS
  Собирает один Markdown-файл из выбранных файлов проекта для аудита агентом.
.DESCRIPTION
  - Оглавление с размерами и количеством строк
  - Дерево проекта
  - Содержимое каждого файла в code-блоке с указанием языка
  - .env.local маскируется (значения -> <REDACTED>, кроме NEXT_PUBLIC_*)
#>
param(
    [string]$Output = "security-bundle.md"
)

# ==== СПИСОК НУЖНЫХ ФАЙЛОВ ====
$include = @(
    # Root
    "next.config.ts",
    "package.json",
    "tsconfig.json",
    "proxy.ts",
    "eslint.config.mjs",
    ".gitignore",
    ".env.local",
    "AGENTS.md",
    "README.md",
    # App
    "app/layout.tsx",
    "app/page.tsx",
    "app/loading.tsx",
    "app/globals.css",
    "app/actions.ts",
    "app/event/[id]/page.tsx",
    "app/login/page.tsx",
    "app/my-events/page.tsx",
    "app/my-events/loading.tsx",
    "app/[username]/page.tsx",
    # Lib
    "lib/supabase.ts",
    "lib/supabase-server.ts",
    # Components
    "components/ApplicationActions.tsx",
    "components/AvatarPicker.tsx",
    "components/CategoryIcon.tsx",
    "components/Countdown.tsx",
    "components/CreateEventForm.tsx",
    "components/EventCard.tsx",
    "components/EventChat.tsx",
    "components/EventList.tsx",
    "components/Header.tsx",
    "components/MobileFilters.tsx",
    "components/NotificationsBell.tsx",
    "components/PageTransition.tsx",
    "components/Sidebar.tsx"
)

# ==== СБОР ФАЙЛОВ ====
$root = (Get-Location).Path
$files = $include | ForEach-Object {
    if (Test-Path $_) { Get-Item $_ }
} | Where-Object { -not $_.PSIsContainer } | Sort-Object FullName -Unique

if (-not $files) {
    Write-Host "Не найдено ни одного файла. Запустите из корня проекта." -ForegroundColor Red
    exit 1
}

# ==== МАСКИРОВАНИЕ .env ====
function Mask-EnvContent {
    param([string]$Path)
    $lines = Get-Content -LiteralPath $Path
    $result = foreach ($line in $lines) {
        # Комментарии и пустые строки — оставить как есть
        if ($line -match '^\s*#' -or $line.Trim() -eq '') { $line; continue }
        # KEY=VALUE
        if ($line -match '^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
            $key = $Matches[2]
            $val = $Matches[3]
            if ($key -like 'NEXT_PUBLIC_*') {
                # Публичные ключи — показываем, но помечаем
                "$key=$val   # ⚠️ PUBLIC: виден в браузере"
            } else {
                "$key=<REDACTED>"
            }
        } else {
            $line
        }
    }
    return ($result -join "`n")
}

# ==== ЯЗЫК ДЛЯ ПОДСВЕТКИ ====
$extToLang = @{
    '.tsx' = 'tsx'; '.ts' = 'ts'; '.jsx' = 'jsx'; '.js' = 'js'
    '.json' = 'json'; '.css' = 'css'; '.scss' = 'scss'; '.md' = 'md'
    '.html' = 'html'; '.ps1' = 'powershell'; '.mjs' = 'js'
    '.yml' = 'yaml'; '.yaml' = 'yaml'
}

# ==== СБОРКА MARKDOWN ====
$sb = [System.Text.StringBuilder]::new()

# Заголовок
[void]$sb.AppendLine("# Security & Improvements Audit Bundle")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("> **Для ИИ-агента.** Проанализируй проект на безопасность (OWASP Top 10, " +
    "Next.js App Router + Supabase, server actions, RLS, IDOR, XSS через user input, " +
    "утечки через Realtime) и предложи улучшения (архитектура, производительность, " +
    "читаемость, дублирование).")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("**Метаинформация**")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("| Поле | Значение |")
[void]$sb.AppendLine("|---|---|")
[void]$sb.AppendLine("| Собрано | $(Get-Date -Format 'yyyy-MM-dd HH:mm') |")
[void]$sb.AppendLine("| Файлов | $($files.Count) |")
[void]$sb.AppendLine("| Проект | $((Split-Path $root -Leaf)) |")
[void]$sb.AppendLine("")

# Оглавление
[void]$sb.AppendLine("## Оглавление")
[void]$sb.AppendLine("")
$i = 1
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1) -replace '\\','/'
    $lines = (Get-Content -LiteralPath $file.FullName).Count
    $sizeKb = [math]::Round($file.Length / 1KB, 1)
    $anchor = ($rel -replace '[^\w\- ]','').ToLower() -replace ' ','-'
    [void]$sb.AppendLine("$i. [$rel](#$anchor) — $lines строк, $sizeKb KB")
    $i++
}
[void]$sb.AppendLine("")
[void]$sb.AppendLine("---")
[void]$sb.AppendLine("")

# Дерево (плоский список, т.к. иерархия уже есть в оглавлении)
[void]$sb.AppendLine("## Структура (только включённые файлы)")
[void]$sb.AppendLine("")
[void]$sb.AppendLine('```')
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1) -replace '\\','/'
    [void]$sb.AppendLine($rel)
}
[void]$sb.AppendLine('```')
[void]$sb.AppendLine("")
[void]$sb.AppendLine("---")
[void]$sb.AppendLine("")

# Содержимое
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1) -replace '\\','/'
    $ext = $file.Extension.ToLower()
    $lang = if ($extToLang.ContainsKey($ext)) { $extToLang[$ext] } else { '' }

    [void]$sb.AppendLine("## $rel")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine('```' + $lang)

    if ($file.Name -eq '.env.local' -or $file.Name -like '.env*') {
        [void]$sb.AppendLine((Mask-EnvContent -Path $file.FullName))
    } else {
        [void]$sb.AppendLine((Get-Content -LiteralPath $file.FullName -Raw))
    }

    [void]$sb.AppendLine('```')
    [void]$sb.AppendLine("")
}

# Запись в UTF-8 без BOM
[System.IO.File]::WriteAllText(
    (Join-Path $root $Output),
    $sb.ToString(),
    [System.Text.UTF8Encoding]::new($false)
)

$sizeKb = [math]::Round((Get-Item $Output).Length / 1KB, 1)
Write-Host "Готово: $Output ($($files.Count) файлов, $sizeKb KB)" -ForegroundColor Green
````

### `tools/project-bundle.md`

``md
# Project bundle

Generated: 2026-10-22 16:22
Root: C:\Users\Lenovo\Downloads\event_mp\namylimsya-app\tools

## Tree

```
tools/
|-- bundle-project.ps1
\-- bundle-security-md.ps1
```

## Files

### `bundle-project.ps1`

``powershell
# tools/bundle-project.ps1  (ASCII-only, safe in any encoding)
param(
    [string]$OutputFile = "project-bundle.md",
    [string]$Root = (Get-Location).Path
)

Set-Location $Root
$Root = (Get-Location).Path

$excludeDirs = @(
    'node_modules', '.next', '.git', 'dist', 'build', 'coverage',
    '.turbo', '.vercel', 'out', '.idea', '.vscode', '.cache'
)

$excludeFileGlobs = @(
    'package-lock.json', 'yarn.lock', 'pnpm-lock.yaml',
    'next-env.d.ts',
    'tree.txt', 'tree-security.txt',
    'project-bundle.md', 'security-bundle.md',
    '*.log',
    'public/**/*.png', 'public/**/*.jpg', 'public/**/*.jpeg',
    'public/**/*.svg', 'public/**/*.gif', 'public/**/*.webp',
    'public/**/*.ico',
    '**/*.map'
)

$binaryExt = @('.png','.jpg','.jpeg','.gif','.webp','.ico','.pdf','.zip',
               '.woff','.woff2','.ttf','.otf','.mp4','.mp3','.lock')

# --- custom recursive walk that PRUNES excluded dirs (no descent) ---
$allFiles = New-Object System.Collections.Generic.List[object]

function Walk {
    param([string]$Dir, [string]$RelPrefix)

    Get-ChildItem -LiteralPath $Dir -Force -ErrorAction SilentlyContinue | ForEach-Object {
        $item = $_

        # skip symlinks / junctions to avoid loops
        if ($item.Attributes -band [IO.FileAttributes]::ReparsePoint) { return }

        $rel = if ($RelPrefix) { "$RelPrefix/$($item.Name)" } else { $item.Name }

        if ($item.PSIsContainer) {
            if ($excludeDirs -contains $item.Name) { return }   # prune
            Walk -Dir $item.FullName -RelPrefix $rel
        } else {
            foreach ($glob in $excludeFileGlobs) {
                if ($rel -like $glob) { return }
            }
            $allFiles.Add([pscustomobject]@{
                Full = $item.FullName
                Rel  = $rel
                Ext  = $item.Extension.ToLower()
            })
        }
    }
}

Walk -Dir $Root -RelPrefix ''

$allFiles = $allFiles | Sort-Object Rel

# --- build tree (ASCII) ---
$treeLines = New-Object System.Collections.Generic.List[string]
$treeLines.Add((Split-Path $Root -Leaf) + '/')

$tree = @{}
foreach ($f in $allFiles) {
    $parts = $f.Rel -split '/'
    $node = $tree
    for ($i=0; $i -lt $parts.Count; $i++) {
        $p = $parts[$i]
        $isFile = ($i -eq $parts.Count - 1)
        if ($isFile) { $node[$p] = $null }
        else {
            if (-not $node.ContainsKey($p)) { $node[$p] = @{} }
            $node = $node[$p]
        }
    }
}

function Render-Tree {
    param($Node, [string]$Prefix)
    $keys = $Node.Keys | Sort-Object {
        if ($Node[$_] -eq $null) { 1 } else { 0 }
    }, { $_ }
    for ($i=0; $i -lt $keys.Count; $i++) {
        $k = $keys[$i]
        $isLast = ($i -eq $keys.Count - 1)
        $conn = if ($isLast) { '\-- ' } else { '|-- ' }
        $suffix = if ($Node[$k] -eq $null) { '' } else { '/' }
        $script:treeLines.Add("$Prefix$conn$k$suffix")
        if ($Node[$k] -ne $null) {
            $newPrefix = $Prefix + $(if ($isLast) { '    ' } else { '|   ' })
            Render-Tree -Node $Node[$k] -Prefix $newPrefix
        }
    }
}
Render-Tree -Node $tree -Prefix ''

function Get-Lang {
    param([string]$Ext)
    switch ($Ext) {
        '.ts'   { 'ts' }   '.tsx' { 'tsx' }  '.js'  { 'js' }
        '.jsx'  { 'jsx' }  '.mjs' { 'js' }   '.cjs' { 'js' }
        '.json' { 'json' } '.css' { 'css' }  '.scss'{ 'scss' }
        '.html' { 'html' } '.md'  { 'md' }
        '.yml'  { 'yaml' } '.yaml'{ 'yaml' }
        '.ps1'  { 'powershell' }
        '.sql'  { 'sql' }
        '.env'  { 'bash' }
        default { '' }
    }
}

# --- stream output directly to file (no StringBuilder) ---
$outPath = Join-Path $Root $OutputFile
$utf8 = New-Object System.Text.UTF8Encoding($false)  # no BOM
$sw = New-Object System.IO.StreamWriter($outPath, $false, $utf8)

try {
    $sw.WriteLine("# Project bundle")
    $sw.WriteLine()
    $sw.WriteLine("Generated: $(Get-Date -Format 'yyyy-MM-dd HH:mm')")
    $sw.WriteLine("Root: $Root")
    $sw.WriteLine()
    $sw.WriteLine("## Tree")
    $sw.WriteLine()
    $sw.WriteLine('```')
    foreach ($line in $treeLines) { $sw.WriteLine($line) }
    $sw.WriteLine('```')
    $sw.WriteLine()
    $sw.WriteLine("## Files")
    $sw.WriteLine()

    foreach ($f in $allFiles) {
        $rel = $f.Rel
        $isEnv = (Split-Path $rel -Leaf) -like '.env*'

        if ($binaryExt -contains $f.Ext) {
            $sw.WriteLine("### ``$rel``")
            $sw.WriteLine()
            $sw.WriteLine("_binary file, content skipped_")
            $sw.WriteLine()
            continue
        }

        $content = $null
        try {
            $content = Get-Content -LiteralPath $f.Full -Raw -Encoding utf8 -ErrorAction Stop
        } catch {
            $sw.WriteLine("### ``$rel``")
            $sw.WriteLine()
            $sw.WriteLine("_read error: $($_.Exception.Message)_")
            $sw.WriteLine()
            continue
        }
        if ($null -eq $content) { $content = '' }

        $lang = Get-Lang $f.Ext

        if ($isEnv) {
            $content = ($content -split "`r?`n" | ForEach-Object {
                if ($_ -match '^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.+)$') {
                    "$($Matches[1])=***REDACTED***"
                } else { $_ }
            }) -join "`n"
            $lang = 'bash'
        }

        $sw.WriteLine("### ``$rel``")
        $sw.WriteLine()
        $sw.WriteLine("````$lang")
        $sw.WriteLine($content)
        $sw.WriteLine('````')
        $sw.WriteLine()
    }
}
finally {
    $sw.Flush()
    $sw.Close()
}

$sizeKb = [math]::Round((Get-Item $outPath).Length / 1KB, 1)
Write-Host "OK: $outPath"
Write-Host "   Files: $($allFiles.Count)"
Write-Host "   Size:  $sizeKb KB"
````

### `bundle-security-md.ps1`

``powershell
<#
.SYNOPSIS
  Собирает один Markdown-файл из выбранных файлов проекта для аудита агентом.
.DESCRIPTION
  - Оглавление с размерами и количеством строк
  - Дерево проекта
  - Содержимое каждого файла в code-блоке с указанием языка
  - .env.local маскируется (значения -> <REDACTED>, кроме NEXT_PUBLIC_*)
#>
param(
    [string]$Output = "security-bundle.md"
)

# ==== СПИСОК НУЖНЫХ ФАЙЛОВ ====
$include = @(
    # Root
    "next.config.ts",
    "package.json",
    "tsconfig.json",
    "proxy.ts",
    "eslint.config.mjs",
    ".gitignore",
    ".env.local",
    "AGENTS.md",
    "README.md",
    # App
    "app/layout.tsx",
    "app/page.tsx",
    "app/loading.tsx",
    "app/globals.css",
    "app/actions.ts",
    "app/event/[id]/page.tsx",
    "app/login/page.tsx",
    "app/my-events/page.tsx",
    "app/my-events/loading.tsx",
    "app/[username]/page.tsx",
    # Lib
    "lib/supabase.ts",
    "lib/supabase-server.ts",
    # Components
    "components/ApplicationActions.tsx",
    "components/AvatarPicker.tsx",
    "components/CategoryIcon.tsx",
    "components/Countdown.tsx",
    "components/CreateEventForm.tsx",
    "components/EventCard.tsx",
    "components/EventChat.tsx",
    "components/EventList.tsx",
    "components/Header.tsx",
    "components/MobileFilters.tsx",
    "components/NotificationsBell.tsx",
    "components/PageTransition.tsx",
    "components/Sidebar.tsx"
)

# ==== СБОР ФАЙЛОВ ====
$root = (Get-Location).Path
$files = $include | ForEach-Object {
    if (Test-Path $_) { Get-Item $_ }
} | Where-Object { -not $_.PSIsContainer } | Sort-Object FullName -Unique

if (-not $files) {
    Write-Host "Не найдено ни одного файла. Запустите из корня проекта." -ForegroundColor Red
    exit 1
}

# ==== МАСКИРОВАНИЕ .env ====
function Mask-EnvContent {
    param([string]$Path)
    $lines = Get-Content -LiteralPath $Path
    $result = foreach ($line in $lines) {
        # Комментарии и пустые строки — оставить как есть
        if ($line -match '^\s*#' -or $line.Trim() -eq '') { $line; continue }
        # KEY=VALUE
        if ($line -match '^(\s*)([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$') {
            $key = $Matches[2]
            $val = $Matches[3]
            if ($key -like 'NEXT_PUBLIC_*') {
                # Публичные ключи — показываем, но помечаем
                "$key=$val   # ⚠️ PUBLIC: виден в браузере"
            } else {
                "$key=<REDACTED>"
            }
        } else {
            $line
        }
    }
    return ($result -join "`n")
}

# ==== ЯЗЫК ДЛЯ ПОДСВЕТКИ ====
$extToLang = @{
    '.tsx' = 'tsx'; '.ts' = 'ts'; '.jsx' = 'jsx'; '.js' = 'js'
    '.json' = 'json'; '.css' = 'css'; '.scss' = 'scss'; '.md' = 'md'
    '.html' = 'html'; '.ps1' = 'powershell'; '.mjs' = 'js'
    '.yml' = 'yaml'; '.yaml' = 'yaml'
}

# ==== СБОРКА MARKDOWN ====
$sb = [System.Text.StringBuilder]::new()

# Заголовок
[void]$sb.AppendLine("# Security & Improvements Audit Bundle")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("> **Для ИИ-агента.** Проанализируй проект на безопасность (OWASP Top 10, " +
    "Next.js App Router + Supabase, server actions, RLS, IDOR, XSS через user input, " +
    "утечки через Realtime) и предложи улучшения (архитектура, производительность, " +
    "читаемость, дублирование).")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("**Метаинформация**")
[void]$sb.AppendLine("")
[void]$sb.AppendLine("| Поле | Значение |")
[void]$sb.AppendLine("|---|---|")
[void]$sb.AppendLine("| Собрано | $(Get-Date -Format 'yyyy-MM-dd HH:mm') |")
[void]$sb.AppendLine("| Файлов | $($files.Count) |")
[void]$sb.AppendLine("| Проект | $((Split-Path $root -Leaf)) |")
[void]$sb.AppendLine("")

# Оглавление
[void]$sb.AppendLine("## Оглавление")
[void]$sb.AppendLine("")
$i = 1
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1) -replace '\\','/'
    $lines = (Get-Content -LiteralPath $file.FullName).Count
    $sizeKb = [math]::Round($file.Length / 1KB, 1)
    $anchor = ($rel -replace '[^\w\- ]','').ToLower() -replace ' ','-'
    [void]$sb.AppendLine("$i. [$rel](#$anchor) — $lines строк, $sizeKb KB")
    $i++
}
[void]$sb.AppendLine("")
[void]$sb.AppendLine("---")
[void]$sb.AppendLine("")

# Дерево (плоский список, т.к. иерархия уже есть в оглавлении)
[void]$sb.AppendLine("## Структура (только включённые файлы)")
[void]$sb.AppendLine("")
[void]$sb.AppendLine('```')
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1) -replace '\\','/'
    [void]$sb.AppendLine($rel)
}
[void]$sb.AppendLine('```')
[void]$sb.AppendLine("")
[void]$sb.AppendLine("---")
[void]$sb.AppendLine("")

# Содержимое
foreach ($file in $files) {
    $rel = $file.FullName.Substring($root.Length + 1) -replace '\\','/'
    $ext = $file.Extension.ToLower()
    $lang = if ($extToLang.ContainsKey($ext)) { $extToLang[$ext] } else { '' }

    [void]$sb.AppendLine("## $rel")
    [void]$sb.AppendLine("")
    [void]$sb.AppendLine('```' + $lang)

    if ($file.Name -eq '.env.local' -or $file.Name -like '.env*') {
        [void]$sb.AppendLine((Mask-EnvContent -Path $file.FullName))
    } else {
        [void]$sb.AppendLine((Get-Content -LiteralPath $file.FullName -Raw))
    }

    [void]$sb.AppendLine('```')
    [void]$sb.AppendLine("")
}

# Запись в UTF-8 без BOM
[System.IO.File]::WriteAllText(
    (Join-Path $root $Output),
    $sb.ToString(),
    [System.Text.UTF8Encoding]::new($false)
)

$sizeKb = [math]::Round((Get-Item $Output).Length / 1KB, 1)
Write-Host "Готово: $Output ($($files.Count) файлов, $sizeKb KB)" -ForegroundColor Green
````


````

### `tsconfig.json`

``json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "types": ["vitest/globals", "node"],
    "plugins": [
      {
        "name": "next"
      }
    ],
    "paths": {
      "@/*": ["./*"]
    }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts",
    "**/*.mts"
  ],
  "exclude": ["node_modules", "supabase"]
}
````

### `vitest.config.ts`

``ts
import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node', // для серверных утилит не нужен jsdom
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
    },
  },
})
````

