# Project bundle

Generated: 2026-10-22 08:52
Root: C:\Users\Lenovo\Downloads\event_mp\namylimsya-app


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
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';

export default async function ProfilePage({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  const cleanUsername = username.startsWith('@') ? username.slice(1) : username;
  
  const supabase = await createClient(); 
  
  // 1. Получаем данные текущего пользователя
  const { data: { user } } = await supabase.auth.getUser();

  // 2. Получаем профиль того, на чью страницу зашли
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('username', cleanUsername)
    .single();

  if (!profile) notFound();

  const isOwnProfile = user?.id === profile.id;

  // 3. Получаем безопасные DTO событий
  // Мы берем ВСЕ события, а затем фильтруем по автору. 
  // (В идеале для производительности стоит добавить фильтр по organizer_id внутри getEventListDTOs, 
  // но для текущего объема данных это работает и защищает от утечки).
   const viewer = await getViewer(supabase);
  // Передаем limit=1000, чтобы на странице профиля показать все события (или можно добавить пагинацию, но пока так)
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

// --- Создание события (оставляем как было, доработаем в P1.4) ---
// app/actions.ts (начало файла — добавь импорт)
import { createEventSchema } from '@/lib/validations';

// ...

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) throw new Error('Необходимо войти в аккаунт');

  // 1. Собираем "сырые" данные из формы (date и time отдельно)
  const dateStr = formData.get('date') as string | null;
  const timeStr = formData.get('time') as string | null;
  
  // Проверяем наличие даты/времени до сборки
  if (!dateStr || !timeStr) {
    throw new Error('Укажите дату и время события');
  }

  // 2. Формируем объект для валидации (включая объединение даты и времени)
  const rawData = {
    title: formData.get('title'),
    description: formData.get('description'),
    category: formData.get('category'),
    location: formData.get('location'),
    max_participants: formData.get('max_participants'),
    lat: formData.get('lat') || null,
    lng: formData.get('lng') || null,
    date_time: `${dateStr}T${timeStr}`, // Получится, например, "2026-10-25T18:30"
    hide_location: formData.get('hide_location') === 'on',
  };

  // 3. Валидируем данные с помощью Zod
  const result = createEventSchema.safeParse(rawData);
  
  if (!result.success) {
    // Достаем первую ошибку, чтобы показать пользователю
  const firstError = result.error.issues[0]?.message || 'Некорректные данные';
    throw new Error(firstError);
  }

  const { title, description, category, location, max_participants, lat, lng, date_time, hide_location } = result.data;

  // 4. Получаем никнейм организатора
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const organizerName = profile?.username || 'Пользователь';

  // 5. Вставляем только проверенные данные
  const { error } = await supabase
    .from('events')
    .insert([{
      title,
      description,
      category,
      date_time,
      location,
      lat,
      lng,
      max_participants,
      hide_location,
      organizer_name: organizerName,
      organizer_id: user.id,
      organizer_rank: 'Инициатор', // Жестко задано на сервере
    }]);

  if (error) {
    console.error('Ошибка создания события:', error);
    throw new Error('Не удалось создать событие');
  }

  revalidatePath('/');
}

// --- НОВОЕ: Подача заявки на сервере ---
export async function applyToEvent(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

    // НОВАЯ ПРОВЕРКА: не организатор ли это?
  const { data: eventCheck } = await supabase
    .from('events')
    .select('organizer_id')
    .eq('id', eventId)
    .single();

  if (eventCheck?.organizer_id === user.id) {
    throw new Error('Вы не можете подать заявку на свое же событие');
  }

  // 1. Проверяем лимит в 3 активные заявки
  const { count, error: countError } = await supabase
    .from('applications')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', user.id)
    .in('status', ['pending', 'approved']);

  if (countError) throw new Error('Ошибка проверки лимита');
  if (count && count >= 3) throw new Error('Вы достигли лимита в 3 активные заявки');

  // 2. Подаем заявку (статус и user_id жестко заданы на сервере)
  const { error } = await supabase.from('applications').insert([{
    event_id: eventId,
    user_id: user.id,
    status: 'pending'
  }]);

  if (error) {
    if (error.code === '23505') throw new Error('Вы уже подали заявку на это событие');
    throw new Error('Ошибка подачи заявки');
  }

  // 3. Уведомление организатору
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
}

// --- НОВОЕ: Отмена заявки ---
export async function cancelApplication(eventId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  const { error } = await supabase
    .from('applications')
    .delete()
    .eq('event_id', eventId)
    .eq('user_id', user.id);

  if (error) throw new Error('Не удалось отменить заявку');
  
  revalidatePath('/');
  revalidatePath('/my-events');
}

// --- ОБНОВЛЕНО: Подтверждение заявки (вызов RPC) ---
export async function approveApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  // Вызываем RPC функцию
  const { error } = await supabase.rpc('approve_application', { app_id: applicationId });
  
  if (error) {
    // Переводим техническую ошибку в понятную
    if (error.message.includes('больше нет свободных мест')) throw new Error('Мест больше нет');
    throw new Error('Не удалось подтвердить заявку');
  }

  revalidatePath('/my-events');
  revalidatePath('/');
}

// --- ОБНОВЛЕНО: Отклонение заявки (вызов RPC) ---
export async function rejectApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Не авторизован');

  // Вызываем RPC функцию
  const { error } = await supabase.rpc('reject_application', { app_id: applicationId });
  
  if (error) {
    if (error.message.includes('уже обработана')) throw new Error('Эта заявка уже обработана');
    throw new Error('Не удалось отклонить заявку');
  }

  revalidatePath('/my-events');
}
````

### `app/event/[id]/page.tsx`

``tsx
import { createClient } from '@/lib/supabase-server';
import { notFound } from 'next/navigation';
import Map from '@/components/MapComponent';
import Link from 'next/link';
import EventChat from '@/components/EventChat';

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
          <Map 
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
````

### `app/layout.tsx`

``tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition"; // <-- ИМПОРТ

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
    <html lang="ru" data-theme="light">
      <body className="min-h-screen flex flex-col"> {/* Добавили flex для прижатия футера */}
        <Header />
        
        {/* Оборачиваем в анимированный компонент */}
        <PageTransition>
          {children}
        </PageTransition>

        <footer className="max-w-[1200px] w-full mx-auto mt-auto px-6 py-5 text-brand-muted text-[13px] border-t-2 border-brand-line">
          <p>«Намылимся.» — площадка для живых встреч. Ответственность за проведение событий лежат на организаторах и участниках.</p>
          <p>16+ · Правила сообщества · Поддержка</p>
        </footer>
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
  const searchParams = useSearchParams();
  const isRegisterMode = searchParams.get('mode') === 'register';
  const [gender, setGender] = useState('none');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLogin, setIsLogin] = useState(!isRegisterMode); 
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const router = useRouter();

  useEffect(() => {
    // Используем небольшую задержку, чтобы избежать синхронного обновления
    const timer = setTimeout(() => {
      setIsLogin(!isRegisterMode);
    }, 0);
    return () => clearTimeout(timer);
  }, [isRegisterMode]);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      if (isLogin) {
        // Вход
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
                // РЕГИСТРАЦИЯ
        // 1. Создаем пользователя в Auth, передавая никнейм и пол в метаданные
        const { error: authError } = await supabase.auth.signUp({ 
          email, 
          password,
          options: {
            data: {
              username: username,
              gender: gender,
            }
          }
        });
        
        if (authError) {
          // Если база вернула ошибку уникальности (никнейм занят)
          if (authError.message.includes('duplicate key') || authError.message.includes('unique constraint')) {
            throw new Error('Этот никнейм уже занят. Придумайте другой.');
          }
          throw authError;
        }

        // 2. Профиль создастся автоматически через триггер в базе!
        // Клиентский update больше не нужен.

        setMessage('Регистрация успешна! Теперь вы можете войти.');
        setIsLogin(true);
      }
    } catch (error) {
      let msg = 'Произошла неизвестная ошибка';
      
      // Приводим тип к Error
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
        <div className="mb-4 p-3 bg-brand-bg border-2 border-brand-line rounded-brand text-sm font-bold text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        
        {/* Поле никнейма только для регистрации */}
        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш никнейм (публичное имя)</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9_]/g, ''))} // Только буквы, цифры и _
              required
              placeholder="например: Вадим_Крутой"
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
            />
            <span className="text-[11px] text-brand-muted font-bold">Разрешены кириллица, латиница, цифры и _. Одинаковые запрещены.</span>
          </div>
        )}

         {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш пол (необязательно)</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setGender('male')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${gender === 'male' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>М</button>
              <button type="button" onClick={() => setGender('female')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${gender === 'female' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>Ж</button>
              <button type="button" onClick={() => setGender('none')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${gender === 'none' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>Другой</button>
            </div>
          </div>
        )}

        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Email</label>
          <input 
            type="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required
            className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Пароль</label>
          <input 
            type="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required
            className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50"
        >
          {loading ? 'Загрузка...' : (isLogin ? 'Войти' : 'Зарегистрироваться')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors"
        >
          {isLogin ? 'Нет аккаунта? Зарегистрироваться' : 'Уже есть аккаунт? Войти'}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/" className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors">
          ← Вернуться на главную
        </Link>
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

export default async function MyEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // 1. Получаем события пользователя (только нужные колонки)
  const { data: events } = await supabase
    .from('events')
    .select('id, title, date_time, organizer_name, max_participants')
    .eq('organizer_id', user.id)
    .order('date_time', { ascending: true });

  const eventIds = events?.map(e => e.id) || [];

  // 2. Получаем заявки вместе с профилями авторов (JOIN)
  // Один запрос вместо трех!
  const { data: applications } = await supabase
    .from('applications')
    .select(`
      id, 
      status, 
      event_id, 
      user_id,
      profiles!applications_user_id_fkey ( username )
    `)
    .in('event_id', eventIds);

  // 3. Получаем МОИ заявки с событиями (JOIN)
  const { data: myApplications } = await supabase
    .from('applications')
    .select(`
      id,
      status,
      created_at,
      events!fk_applications_event ( id, title, date_time, organizer_name )
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  // Группируем заявки по event_id (O(N) вместо O(A × P))
  const appsByEvent = (applications || []).reduce((acc, app) => {
    if (!acc[app.event_id]) acc[app.event_id] = [];
    acc[app.event_id].push(app);
    return acc;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
}, {} as Record<string, any[]>);

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 min-h-screen">
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

            return (
              <div key={event.id} className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5 md:p-6">
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold mb-2">{event.title}</h2>
                    <p className="text-brand-muted font-bold text-sm">
                      {new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })} в {new Date(event.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Link 
                    href={`/event/${event.id}`} 
                    className="bg-brand-bg text-brand-text font-extrabold text-[12px] uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-cat-soft transition-colors w-fit whitespace-nowrap"
                  >
                    Перейти к событию →
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t-2 border-dashed border-brand-line pt-6">
                  <div>
                    <h3 className="font-extrabold uppercase mb-3 text-brand-accent text-sm">Новые заявки ({pendingApps.length})</h3>
                    {pendingApps.length === 0 ? (
                      <p className="text-sm text-brand-muted font-bold">Новых заявок нет.</p>
                    ) : (
                      <ul className="flex flex-col gap-3">
                        {pendingApps.map((app) => {
                          // Supabase возвращает связи как массив (даже для one-to-one)
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
                      <p className="text-sm text-brand-muted font-bold">Пока никого нет.</p>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {approvedApps.map((app) => {
                          const profile = Array.isArray(app.profiles) ? app.profiles[0] : app.profiles;
                          return (
                            <li key={app.id} className="bg-brand-bg p-2 rounded-brand border border-brand-line text-sm font-bold truncate">
                              @{profile?.username || 'Пользователь'}
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
              if (!event) return null; // Защита, если событие было удалено

              let statusText = 'Ожидает подтверждения';
              let statusColor = 'text-brand-accent border-brand-accent bg-brand-accent/10';
              
              if (app.status === 'approved') {
                statusText = 'Вы записаны ✓';
                statusColor = 'text-green-700 border-green-700 bg-green-100';
              } else if (app.status === 'rejected') {
                statusText = 'Отклонено';
                statusColor = 'text-red-600 border-red-600 bg-red-100';
              }

              return (
                <div key={app.id} className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5 flex flex-col gap-4">
                  <div>
                    <span className={`inline-block px-3 py-1 text-xs font-extrabold uppercase rounded border-2 mb-3 ${statusColor}`}>
                      {statusText}
                    </span>
                    <h3 className="text-xl font-extrabold mb-1">{event.title}</h3>
                    <p className="text-brand-muted font-bold text-sm">
                      {new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })} в {new Date(event.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-brand-line flex justify-between items-center">
                    <span className="text-sm text-brand-muted font-bold">Орг: {event.organizer_name}</span>
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
  searchParams: Promise<{ page?: string }>;
}) {
  return (
    <main className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start mt-6 px-4 md:px-6 pb-12 relative">
      
      <div className="flex flex-col gap-6">
        
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
        <Sidebar />
      </div>

    </main>
  );
}
````

### `components/ApplicationActions.tsx`

``tsx
'use client';

import { useState } from 'react';
import { approveApplication, rejectApplication } from '@/app/actions';

export default function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approveApplication(applicationId);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Вы уверены, что хотите отклонить эту заявку?')) return;
    
    setIsLoading(true);
    try {
      await rejectApplication(applicationId);
    } catch (error: any) {
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex gap-1.5 flex-shrink-0 ml-2">
      <button 
        onClick={handleApprove}
        disabled={isLoading}
        className="w-8 h-8 flex items-center justify-center bg-green-100 text-green-700 border-2 border-green-600 rounded-brand hover:bg-green-600 hover:text-white transition-colors disabled:opacity-50"
        title="Принять"
      >
        {isLoading ? '...' : '✓'}
      </button>
      <button 
        onClick={handleReject}
        disabled={isLoading}
        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-700 border-2 border-red-600 rounded-brand hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
        title="Отклонить"
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
  const avatars = Array.from({ length: 30 }, (_, i) => `/avatars/${folder}/${i + 1}.png`);

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
````

### `components/EventCard.tsx`

``tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Map from './Map';
import Image from 'next/image';
import type { EventListItemDTO } from '@/lib/event-dto';
import { applyToEvent, cancelApplication } from '@/app/actions';
import type { User } from '@supabase/supabase-js';

export default function EventCard({ item }: { item: EventListItemDTO }) {
  const {
    id,
    organizerId,
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
  } = item;

  // Локальный статус для мгновенного UI
  const [myStatus, setMyStatus] = useState<
    'pending' | 'approved' | 'rejected' | null
  >(myApplicationStatus);
  const [loading, setLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  


  // Получаем пользователя на клиенте, чтобы кнопка сразу менялась
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Проверка: организатор ли это? Либо из серверного DTO, либо по клиентскому ID
  const isActuallyOrganizer = isOrganizer || (user !== null && user.id === organizerId);

  const hasExactCoords = typeof lat === 'number' && typeof lng === 'number';

  const handleApply = async () => {
    setLoading(true);
    try {
      await applyToEvent(id);
      setMyStatus('pending');
       } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка';
      alert(message);
      } finally {

      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Вы уверены, что хотите отменить заявку?')) return;
    setIsCanceling(true);
    try {
      await cancelApplication(id);
      setMyStatus(null);
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка';
      alert(message);
    } finally {
      setIsCanceling(false);
    }
  };

  // Состояние кнопки
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
    <article className="bg-brand-surface border-2 border-brand-line rounded-brand-lg flex flex-col sm:flex-row overflow-hidden hover:opacity-95 transition-opacity w-full">
      {/* ЛЕВАЯ КОЛОНКА */}
      <div className="bg-brand-bg/50 p-4 sm:w-[150px] flex-shrink-0 flex flex-row sm:flex-col items-left border-b-2 sm:border-b-0 sm:border-r-2 border-brand-line gap-4 sm:gap-0 justify-between">
        <div className="flex-shrink-0 w-full flex justify-center sm:justify-start">
          <span className="text-[10px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2 py-1 rounded border border-brand-cat/30 text-center block leading-tight">
            {category}
          </span>
        </div>

        <div className="flex flex-row sm:flex-col items-baseline sm:items-start justify-start w-full gap-2 sm:gap-0 sm:my-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-extrabold leading-none text-brand-text">
              {dayNumber}
            </span>
            <span className="text-[16px] font-bold text-brand-muted">
              {monthName}
            </span>
          </div>
          <span className="text-2xl font-extrabold text-brand-text sm:mt-1">
            {timeOnly}
          </span>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-1 w-full text-[12px] font-extrabold text-brand-muted">
          👤
          <span>
            {approvedParticipantsCount} / {maxParticipants}
          </span>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА */}
      <div className="p-5 md:p-6 flex-grow flex flex-col min-w-0">
        <Link
          href={`/event/${id}`}
          className="block hover:text-brand-accent transition-colors"
        >
          <h2 className="text-xl md:text-2xl font-extrabold leading-tight">
            {title}
          </h2>
        </Link>

        {/* Публичная метка места */}
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-brand-muted mt-2 mb-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="truncate">{publicLocationLabel}</span>
        </div>

        <p className="text-[14px] text-brand-text/80 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-2 text-sm mb-5 mt-auto">
          <div
            className={`w-8 h-8 rounded-full border border-brand-line flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 overflow-hidden
              ${
                organizerGender === 'male'
                  ? 'bg-blue-100 text-blue-800'
                  : organizerGender === 'female'
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-gray-200 text-gray-700'
              }
            `}
          >
            {organizerAvatar ? (
              <Image
                src={organizerAvatar}
                alt={organizerName}
                width={24}
                height={24}
                className="w-5 h-5 object-contain"
              />
            ) : (
              organizerName.charAt(0)
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <Link
              href={`/@${organizerName}`}
              className="text-brand-text hover:text-brand-accent transition-colors font-bold truncate leading-tight"
            >
              {organizerName}
            </Link>
            <span className="text-brand-accent font-extrabold text-[10px] uppercase leading-tight mt-0.5">
              {organizerRank}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          <button
            onClick={handleApply}
            disabled={buttonDisabled}
            className={`flex-1 font-extrabold text-[13px] uppercase px-4 py-2 border-2 border-brand-line rounded-brand transition-colors ${buttonClass}`}
          >
            {buttonText}
          </button>

          {(myStatus || isActuallyOrganizer) && (
            <Link
              href={`/event/${id}`}
              className="bg-brand-surface text-brand-text font-extrabold text-[13px] uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-cat-soft transition-colors flex items-center justify-center"
            >
              Чат
            </Link>
          )}

          {myStatus === 'pending' && (
            <button
              onClick={handleCancel}
              disabled={isCanceling}
              className="bg-red-100 text-red-700 font-extrabold text-[13px] uppercase px-3 py-2 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors disabled:opacity-50"
              title="Отменить заявку"
            >
              ✕
            </button>
          )}
        </div>

        {/* Карта */}
        {hasExactCoords && (
          <details className="mt-4 border-t border-dashed border-brand-line/30 pt-3 group">
            <summary className="list-none cursor-pointer text-brand-muted hover:text-brand-accent font-bold text-[12px] uppercase transition-colors flex items-center gap-1">
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
                  <Map
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

        {/* Плашка «место скрыто» */}
        {locationIsHidden && !hasExactCoords && (
          <div className="mt-3 p-2 bg-brand-heat/10 border border-brand-heat rounded-brand text-brand-text font-bold text-[11px]">
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

interface EventChatProps {
  eventId: string;
  currentUserId: string;
}

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: { username: string }; // Подтягиваем никнейм
}

export default function EventChat({ eventId, currentUserId }: EventChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

   // 1. Загружаем историю сообщений
  useEffect(() => {
    const fetchMessages = async () => {
      // Грузим только сообщения
      const { data: msgs, error } = await supabase
        .from('messages')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Ошибка загрузки сообщений:", error);
        setLoading(false);
        return;
      }

      if (msgs && msgs.length > 0) {
        // Собираем уникальные ID авторов
        const userIds = [...new Set(msgs.map(m => m.user_id))];
        
        // Грузим их профили
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);

        // Объединяем данные
        const msgsWithProfiles = msgs.map(msg => ({
          ...msg,
          profiles: profiles?.find(p => p.id === msg.user_id)
        }));

        setMessages(msgsWithProfiles);
      } else {
        setMessages([]);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [eventId]);

  // 2. Подписываемся на новые сообщения (Realtime)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `event_id=eq.${eventId}` },
        async (payload) => {
          // Получаем никнейм для нового сообщения
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', payload.new.user_id)
            .single();

          const newMsg = {
            ...payload.new,
            profiles: profile
          } as Message;

          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  // Автоскролл вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage(''); // Очищаем поле сразу

    const { error } = await supabase
      .from('messages')
      .insert([{ event_id: eventId, user_id: currentUserId, content }]);

    if (error) {
      alert('Ошибка отправки сообщения');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center font-bold text-brand-muted">Загрузка чата...</div>;
  }

  return (
    <div className="flex flex-col bg-brand-surface border-2 border-brand-line rounded-[16px] overflow-hidden h-[450px]">
      
      {/* Лента сообщений */}
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
            const avatarLetter = authorName.charAt(0).toUpperCase();

            return (
              <div key={msg.id} className={`flex gap-2 max-w-[85%] ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}>
                
                {/* Аватарка */}
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-line/10 border border-brand-line/20 flex items-center justify-center text-xs font-extrabold text-brand-muted mt-auto mb-1">
                  {avatarLetter}
                </div>

                {/* Блок с сообщением */}
                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  {/* Никнейм (скрываем для своих, чтобы не загромождать) */}
                  {!isMine && (
                    <span className="text-[11px] font-bold text-brand-muted mb-1 ml-1">
                      @{authorName}
                    </span>
                  )}

                  {/* Текст сообщения */}
                  <div 
                    className={`px-4 py-2 text-[14px] font-medium leading-relaxed border rounded-2xl ${
                      isMine 
                        ? 'bg-orange-100 text-brand-text border-orange-200 rounded-br-sm' // Свои: слабый оранжевый
                        : 'bg-blue-50 text-brand-text border-blue-100 rounded-bl-sm'     // Чужие: слабый голубой
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <form onSubmit={handleSendMessage} className="p-3 bg-brand-surface border-t-2 border-brand-line flex gap-2 items-end">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Написать сообщение..."
          className="flex-1 p-3 bg-brand-bg border-2 border-brand-line rounded-full outline-none focus:border-brand-accent transition-colors text-sm"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-brand-text text-brand-bg rounded-full hover:bg-brand-accent transition-colors disabled:opacity-50"
        >
          {/* Иконка самолетика */}
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
import Link from 'next/link';
import { createClient } from '@/lib/supabase-server';
import { getViewer } from '@/lib/event-access';
import { getEventListDTOs } from '@/lib/event-queries';
import EventCard from './EventCard';

export default async function EventList({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number(params.page) || 1;
  const limit = 10; // Сколько грузим за раз
  const offset = (currentPage - 1) * limit;

  const supabase = await createClient();
  const viewer = await getViewer(supabase);

  let result;
  try {
    result = await getEventListDTOs(supabase, viewer, limit, offset);
  } catch (error) {
    console.error('ОШИБКА БАЗЫ:', error);
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        Не удалось загрузить события. Попробуйте обновить страницу.
      </div>
    );
  }

  const { items, total } = result;
  const hasMore = offset + items.length < total;

  if (items.length === 0 && currentPage === 1) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        Пока нет событий. Станьте первым организатором!
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 items-center w-full">
      {items.map((item) => (
        <EventCard key={item.id} item={item} />
      ))}
      
      {/* Кнопка "Показать ещё" */}
      {hasMore && (
        <Link
          href={`/?page=${currentPage + 1}`}
          className="mt-4 px-6 py-3 bg-brand-surface border-2 border-brand-line rounded-brand font-extrabold uppercase hover:bg-brand-bg transition-colors"
        >
          Показать ещё
        </Link>
      )}
    </div>
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
function NavItem({ href, label, pathname }: { href: string, label: string, pathname: string }) {
  const isActive = pathname === href;
  return (
    <Link 
      href={href} 
      className={`font-bold text-sm tracking-wider transition-all duration-200 flex items-center gap-1
        ${isActive ? 'text-brand-accent' : 'text-brand-text hover:text-brand-accent'}
      `}
    >
      <span className={`text-brand-accent transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>[</span>
      <span>{label}</span>
      <span className={`text-brand-accent transition-all duration-200 ${isActive ? 'opacity-100' : 'opacity-0 translate-x-2 group-hover:opacity-100 group-hover:translate-x-0'}`}>]</span>
    </Link>
  );
}


export default function Header() {
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Закрываем меню при смене страницы (с задержкой, чтобы избежать синхронного setState)
    const timer = setTimeout(() => {
      setIsMobileMenuOpen(false);
    }, 0);
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
      const timer = setTimeout(() => setUsername(null), 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
    router.refresh();
    setIsMobileMenuOpen(false);
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
              <NavItem href="/my-events" label="Мои события" pathname={pathname} />
            </div>
            <div className="group flex items-center">
              <NavItem href="/archive" label="Архив" pathname={pathname} />
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 z-50">
            <button className="w-10 h-10 hidden md:flex items-center justify-center border-2 border-brand-line rounded-brand bg-brand-surface">🌙</button>
            
            {/* Кнопки для ПК */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                 <NotificationsBell />
                  <Link href={`/@${username}`} className="text-sm font-bold hover:text-brand-accent transition-colors">
                    @{username}
                  </Link>
                  <button onClick={handleLogout} className="bg-brand-surface text-brand-text font-extrabold text-sm px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-accent hover:text-white transition-colors">
                    Выйти
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="bg-brand-surface text-brand-text font-extrabold text-sm px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors">
                    Войти
                  </Link>
                  <Link href="/login?mode=register" className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors">
                    Регистрация
                  </Link>
                </>
              )}
            </div>

            {/* Колокольчик для мобилок */}
            {user && (
              <div className="md:hidden">
                <NotificationsBell />
              </div>
            )}

            {/* Кнопка Гамбургер для мобилок */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 border-2 border-brand-line rounded-brand bg-brand-surface"
              aria-label="Меню"
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
        className={`fixed inset-0 bg-brand-bg z-40 flex flex-col pt-24 px-6 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* Ключ key нужен, чтобы анимация перезапускалась при каждом открытии */}
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
          {user ? (
            <>
              <Link href={`/@${username}`} className="animate-menu-item delay-4 text-xl font-bold text-center border-2 border-brand-line p-3 rounded-brand">
                Мой профиль (@{username})
              </Link>
              <button onClick={handleLogout} className="animate-menu-item delay-5 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand">
                Выйти
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="animate-menu-item delay-4 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand text-center">
                Войти
              </Link>
              <Link href="/login?mode=register" className="animate-menu-item delay-5 bg-brand-accent text-brand-accent-ink font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand text-center">
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

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
}

function LocationMarker({ onLocationSelect }: MapPickerProps) {
  const [position, setPosition] = useState<L.LatLng | null>(null);

  useMapEvents({
    async click(e) {
      const { lat, lng } = e.latlng;
      setPosition(e.latlng);

      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=ru`);
        const data = await response.json();
        const address = data.display_name || `Широта: ${lat.toFixed(5)}, Долгота: ${lng.toFixed(5)}`;
        
        onLocationSelect(lat, lng, address);
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

export default function MapPickerComponent({ onLocationSelect }: MapPickerProps) {
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

  // Запрашиваем при первой загрузке
  useEffect(() => {
    requestGeolocation();
  }, []);

  return (
    <div className="relative flex flex-col gap-2">
      
      {/* Панель управления над картой */}
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

      {/* Сообщение об ошибке */}
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
          <LocationMarker onLocationSelect={onLocationSelect} />
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
        className="relative w-10 h-10 flex items-center justify-center border-2 border-brand-line rounded-brand bg-brand-surface hover:bg-brand-bg transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-brand-surface">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 md:w-80 bg-brand-surface border-2 border-brand-line rounded-brand shadow-lg z-50 max-h-96 overflow-y-auto">
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

### `components/Sidebar.tsx`

``tsx
import React from 'react';

export default function Sidebar() {
  return (
    <aside className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5">
      <h3 className="text-lg font-extrabold uppercase border-b-2 border-brand-line pb-2.5 mb-4">
        Фильтры
      </h3>
      
      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Категории</span>
        <div className="flex flex-wrap gap-2">
          <button className="bg-brand-cat text-white px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase transition-colors">Все</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Прогулки</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Спорт и игры</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Культура</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Еда и напитки</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Обучение</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Поездки</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Волонтёрство</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Здесь и сейчас</button>
        </div>
      </div>

      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Время</span>
        <div className="flex flex-wrap gap-2">
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Сегодня</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Выходные</button>
        </div>
      </div>
    </aside>
  );
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
  // публичное представление места — всегда безопасно
  publicLocationLabel: string;      // "Парк Горького" или "Место скрыто организатором"
  locationIsHidden: boolean;        // факт скрытия, не сами данные
  // точные данные — только если пользователь имеет право
  exactLocation?: string;           // undefined, если нет доступа
  lat?: number;                     // undefined, если нет доступа
  lng?: number;                     // undefined, если нет доступа
  myApplicationStatus: 'pending' | 'approved' | 'rejected' | null;
  isOrganizer: boolean;
  organizerAvatar?: string | null;
  organizerGender?: string | null;
};
````

### `lib/event-queries.ts`

``ts
// lib/event-queries.ts
import type { SupabaseClient } from '@supabase/supabase-js';
import {
  type EventRowForAccess,
  type ViewerContext,
  canSeeExactLocation,
} from './event-access';
import type { ApplicationStatus, EventListItemDTO } from './event-dto';

type EventRow = EventRowForAccess & {
  id: string;
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
  is_full: boolean;
  profiles?:
    | { avatar_url: string | null; gender: string | null }
    | { avatar_url: string | null; gender: string | null }[]
    | null;
};

/**
 * Возвращает безопасный список событий для конкретного зрителя.
 * Добавлена пагинация (limit/offset) и возврат общего количества (total).
 */
export async function getEventListDTOs(
  supabase: SupabaseClient,
  viewer: ViewerContext,
  limit: number = 10,
  offset: number = 0
): Promise<{ items: EventListItemDTO[]; total: number }> {
  // 1. Запрос с пагинацией и подсчетом общего количества
  const { data, error, count } = await supabase
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
      profiles!events_organizer_profile_fkey ( avatar_url, gender )
    `,
      { count: 'exact' }
    )
    .order('date_time', { ascending: true })
    .range(offset, offset + limit - 1);

  if (error) throw error;
  const events = (data ?? []) as unknown as EventRow[];
  
  // Если событий нет, сразу возвращаем пустой массив
  if (events.length === 0) {
    return { items: [], total: count || 0 };
  }

  const ids = events.map((e) => e.id);

  // 2. Агрегат approved по всем событиям — один запрос.
  const approvedCount = new Map<string, number>();
  {
    const { data: approvedRows, error: approvedErr } = await supabase
      .from('applications')
      .select('event_id')
      .in('event_id', ids)
      .eq('status', 'approved');
    if (approvedErr) throw approvedErr;
    for (const r of approvedRows ?? []) {
      approvedCount.set(r.event_id, (approvedCount.get(r.event_id) ?? 0) + 1);
    }
  }

  // 3. Мои заявки по этим событиям — один запрос, только если авторизован.
  const myStatus = new Map<string, ApplicationStatus>();
  if (viewer.kind === 'user') {
    const { data: myApps, error: myErr } = await supabase
      .from('applications')
      .select('event_id, status')
      .in('event_id', ids)
      .eq('user_id', viewer.userId);
    if (myErr) throw myErr;
    for (const a of myApps ?? []) {
      if (a.status === 'pending' || a.status === 'approved' || a.status === 'rejected') {
        myStatus.set(a.event_id, a.status);
      }
    }
  }

  // 4. Сборка DTO
  const items = events.map((e): EventListItemDTO => {
    const myApp = myStatus.get(e.id) ?? null;
    const allowed = canSeeExactLocation(e, viewer, myApp);
    const approved = approvedCount.get(e.id) ?? 0;
    const isFull = Boolean(e.is_full) || approved >= e.max_participants;

    const profile = Array.isArray(e.profiles) ? e.profiles[0] : e.profiles;

    const dto: EventListItemDTO = {
      id: e.id,
      organizerId: e.organizer_id,
      category: e.category,
      dateTime: e.date_time,
      title: e.title,
      description: e.description,
      organizerName: e.organizer_name,
      organizerRank: e.organizer_rank,
      maxParticipants: e.max_participants,
      approvedParticipantsCount: approved,
      isFull,
      publicLocationLabel: e.hide_location
        ? 'Место скрыто организатором'
        : e.location,
      locationIsHidden: e.hide_location,
      myApplicationStatus: myApp,
      isOrganizer: viewer.kind === 'user' && viewer.userId === e.organizer_id,
      organizerAvatar: profile?.avatar_url ?? null,
      organizerGender: profile?.gender ?? null,
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
  
  description: z
    .string()
    .trim()
    .min(15, 'Описание должно быть не короче 15 символов')
    .max(1200, 'Описание слишком длинное'),
  
  category: z.enum(CATEGORIES, {
    errorMap: () => ({ message: 'Недопустимая категория' }),
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

  await supabase.auth.getUser()

  return supabaseResponse
}

export const config = {
  matcher: [
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

### `security-audit-namylimsya.md`

``md
# Аудит `namylimsya-app`

**Дата анализа:** 21 октября 2026 г.  
**Основание:** `security-bundle.md` (снимок 32 файлов, около 2 700 строк).  
**Тип проверки:** статический анализ представленного кода, без запуска приложения и без доступа к Supabase.

## Итог

В первую очередь нужно исправить передачу скрытого адреса/координат в клиент, проверить политики RLS и перенести критичные бизнес-ограничения из браузера в серверную/базовую логику. Затем — исправить валидацию `createEvent`, контроль перехода статусов заявок и N+1-запросы на главной.

В этом документе разделены **подтверждённые по коду дефекты** и **риски, зависящие от отсутствующих настроек Supabase**. Отсутствие SQL-политик в выгрузке не означает, что RLS выключен; это означает, что его безопасность здесь нельзя подтвердить.

## Приоритет P1 — исправить или проверить до публичного запуска

### 1. Скрытая локация всё равно отправляется в браузер

**Файлы:** `components/EventList.tsx` (примерно строки 1900–1955), `components/EventCard.tsx` (примерно 1585–1685).  
**Статус:** дефект передачи данных подтверждён кодом.

`EventList` всегда передаёт в клиентский компонент `location`, `lat` и `lng`. Условие `hideLocation && !isOrganizer && application?.status !== 'approved'` управляет отображением адреса, а в `Map` передаётся флаг `hideExactLocation`. Но `EventCard` — клиентский компонент, и все его props доступны браузеру. Скрытая информация не должна попадать в props вообще.

**Что сделать:**

- На сервере определить права просмотра точного места: организатор или участник со статусом `approved`.
- Формировать DTO события для конкретного пользователя. Неавторизованному пользователю передавать только публичное описание места, а `location`, `lat`, `lng` исключать или заменять безопасными значениями.
- Не отправлять точные данные в HTML, RSC payload, клиентские props, атрибуты DOM и ответы API до подтверждения доступа.
- Проверить не только карточку ленты, но и страницу события, карту, профиль организатора, архив и любые API/Server Actions, которые возвращают событие.
- Добавить тест: для события со `hide_location = true` неавторизованный пользователь и пользователь с `pending`/`rejected` заявкой не получают точный адрес или координаты в сетевом ответе; `approved` участник и организатор получают их.

### 2. Безопасность прямых запросов к Supabase нельзя подтвердить без RLS

**Файлы:** `components/EventCard.tsx`, `components/EventChat.tsx`, `components/NotificationsBell.tsx`, `components/AvatarPicker.tsx`, `app/login/page.tsx`.  
**Статус:** риск зависит от политик и грантов в БД; SQL в выгрузке отсутствует.

Браузер напрямую обращается к `applications`, `messages`, `notifications` и `profiles`. Публичный Supabase anon/publishable key в браузере сам по себе ожидаем; защищать данные должны права БД и серверная бизнес-логика. В выгрузке нет SQL-схемы, миграций, RLS policies или тестов политик.

**Обязательно проверить в Supabase:**

- RLS включён на всех таблицах в доступной из API схеме, а гранты `anon`/`authenticated` не шире необходимого.
- `profiles`: пользователь может менять только разрешённые поля собственного профиля; нельзя менять чужой `username`, `gender` или `avatar_url`.
- `events`: создатель события неизменяемо связан с `auth.uid()`; пользователь не может менять `organizer_id` и присваивать себе привилегированный `organizer_rank`.
- `applications`: пользователь может подать/отменить только собственную заявку; организатор может менять статус только заявки на своё событие; пользователь не может сам выставить `approved`/`rejected`.
- `messages`: читать и писать могут только организатор и допустимые участники события — по продуктовым правилам, а не только потому, что известен `event_id`. Нужно решить отдельно, должны ли `pending` и `rejected` участники видеть чат.
- `notifications`: читать и помечать прочитанными можно только свои уведомления; нельзя создавать уведомления произвольным получателям или изменять чужие.
- realtime-доступ к `messages` и `notifications` защищён теми же ожидаемыми правилами.

Проверить эти политики тестами, в том числе запросами от пользователя A к данным пользователя B и неавторизованными запросами. Официальная документация Supabase рекомендует включать RLS для таблиц в exposed-схеме и явно задавать grants и политики: https://supabase.com/docs/guides/database/postgres/row-level-security

### 3. Клиентские ограничения заявок можно обойти

**Файл:** `components/EventCard.tsx` (примерно строки 1450–1490); `components/EventList.tsx` (примерно строка 1949).  
**Статус:** клиентские ограничения и ошибочный счётчик подтверждены; возможность злоупотребления зависит от RLS/ограничений БД.

В интерфейсе действует лимит в три активные заявки, но проверка выполняется в `handleApply`, а запись — прямым браузерным запросом. Клиент отправляет собственные `user_id` и `status`. Любое ограничение, которое существует только в состоянии React, можно обойти прямым API-запросом.

Количество участников в каждой карточке явно передаётся как `currentParticipants={0}`. Это делает счётчик мест недостоверным. В серверном действии подтверждения заявки также нет проверки вместимости события и атомарного резервирования места.

**Что сделать:**

- Перенести подачу заявки в Server Action или Postgres RPC. Сервер/БД должны устанавливать `user_id = auth.uid()` и `status = 'pending'`, а не доверять этим полям от клиента.
- Добавить `UNIQUE (event_id, user_id)`, если повторная заявка одного пользователя на то же событие запрещена.
- Добавить ограничение допустимых статусов и политику, запрещающую пользователю повышать себе статус.
- Проверять лимит в три активные заявки на сервере/в транзакции, а не по состоянию компонента.
- При подтверждении блокировать строку события или использовать транзакционную RPC-функцию, чтобы параллельные подтверждения не превысили лимит мест.
- Возвращать фактическое количество одобренных участников из БД и использовать его во всех карточках.
- Предусмотреть ограничения на число создаваемых событий/заявок и скорость запросов, чтобы снизить спам.

### 4. `createEvent()` не валидирует данные на сервере

**Файл:** `app/actions.ts` (примерно строки 117–171).  
**Статус:** подтверждено кодом.

Обработчик делает приведения типов, но не проверяет обязательность, форматы и диапазоны полей. `parseFloat()`/`parseInt()` могут дать `NaN`; `new Date(...).toISOString()` выбросит исключение для невалидной даты; `category` можно изменить вручную; дата в прошлом, чрезмерно длинные строки и абсурдная вместимость не запрещены этим обработчиком.

**Что сделать:**

- Разбирать `FormData` через серверную схему (например, Zod) и возвращать контролируемую ошибку валидации.
- Для каждого поля проверить тип, наличие и длину; для `category` использовать whitelist; для `max_participants` — целое число в бизнес-диапазоне; для `lat`/`lng` — конечные числа и диапазоны `-90…90`/`-180…180`.
- Проверить, что дата и время действительно существуют, удовлетворяют правилам планирования и относятся к явно выбранному часовому поясу.
- Передавать в запрос БД только очищенный объект из проверенных значений.
- Не принимать от клиента `organizer_id`, `organizer_name` и `organizer_rank` как доверенные данные. Имя/ID получать по текущему пользователю на сервере, роль/ранг контролировать серверной логикой/БД.
- Покрыть тестами пустые поля, отсутствующие ключи, `NaN`, невалидную дату, неверные координаты, подменённую категорию и слишком длинный текст.

### 5. Approve/reject не проверяют, что заявка действительно обновлена

**Файл:** `app/actions.ts` (примерно строки 175–285).  
**Статус:** подтверждено, что обработчик не проверяет число обновлённых строк; последствия для чужих данных зависят от RLS.

Обе функции получают список всех событий пользователя, обновляют заявку с фильтром по этим событиям, а затем читают `applications` по одному `applicationId` уже без этого ограничения. Запрос `UPDATE`, затронувший ноль строк, не обязательно вернёт ошибку. При подходящих правах чтения/создания уведомлений обработчик может продолжить работу и уведомить пользователя, хотя статус не изменился. Между изменением заявки и созданием уведомления также нет общей транзакции. Дублируется почти одна и та же логика подтверждения/отклонения.

**Что сделать:**

- Получать заявку вместе с `event_id` и проверять право организатора до изменения статуса.
- Выполнять условное обновление только если текущий статус — `pending`, возвращать изменённую строку через `.select()` и считать отсутствие строки отказом в операции.
- Не отправлять уведомление, пока изменение статуса не подтверждено.
- Предпочтительно выполнять проверку права, изменение статуса и вставку уведомления в одной транзакционной Postgres RPC-функции.
- Обеспечить идемпотентность: повторный вызов не должен создавать повторные уведомления или менять окончательный статус произвольным образом.
- Не читать список всех ID событий организатора ради проверки одной заявки; проверять конкретную связь `application → event → organizer`.

Документация Next.js отдельно указывает, что Server Actions нужно считать публичными endpoint-ами: каждое действие должно самостоятельно проверять авторизацию и валидировать входные данные: https://nextjs.org/docs/app/guides/authentication

## Приоритет P2 — надёжность, производительность и качество

### 6. N+1 запросы и неограниченная лента

**Файлы:** `components/EventList.tsx`, `components/EventCard.tsx`.

`EventList` запрашивает события без пагинации и передаёт каждую запись отдельному клиентскому `EventCard`. Каждый `EventCard` последовательно вызывает `auth.getUser()`, читает заявку текущего пользователя для события и запрашивает общий счётчик его активных заявок. Счётчик активных заявок повторяется для каждого события, хотя для одного пользователя его значение общее. При N событиях это около `1 + 3N` запросов только на список и карточки, помимо запросов шапки, уведомлений и proxy.

**Что сделать:**

- Загружать пользовательскую сессию один раз на сервере и получать статусы заявок/общее число активных заявок пакетно.
- Уменьшить данные выборки до нужных колонок вместо `select('*')`.
- Добавить серверную пагинацию или курсорную загрузку, а также явное правило выдачи прошлых/будущих событий.
- Рассмотреть server-side DTO списка событий с агрегированными `approvedParticipantsCount`, `myApplicationStatus` и признаком доступа к локации.
- Избежать запроса одной и той же информации из каждой карточки; не переносить просто все запросы в большой клиентский `Promise.all`, если они могут быть объединены на уровне БД.

### 7. Список «Мои события» имеет лишние выборки и квадратичное сопоставление профилей

**Файл:** `app/my-events/page.tsx` (примерно строки 702–739).

Запрашиваются все события пользователя, все заявки по этим событиям и все профили авторов заявок. Затем для каждой заявки выполняется `profiles?.find(...)`, то есть список профилей повторно сканируется для каждой заявки. При росте объёма это O(A × P) работы в памяти. Несколько выборок используют `select('*')`.

**Что сделать:** явно выбрать необходимые колонки, строить `Map<userId, profile>` для O(A + P) сопоставления, использовать join/агрегацию там, где это улучшает план запроса, и добавлять пагинацию при росте данных.

### 8. Регистрация зависит от клиентской предварительной проверки ника

**Файл:** `app/login/page.tsx` (примерно строки 513–551, 584).

Ник проверяется отдельным запросом до `signUp`, но это не устраняет гонку: две регистрации могут одновременно пройти проверку. Требование уникальности должно обеспечиваться индексом/ограничением БД, при необходимости — по нормализованному регистронезависимому значению.

После `signUp` клиент обновляет `profiles`. Если подтверждение email включено и сессия ещё не выдана, такой запрос может не пройти RLS. Кроме того, обновление без `.select()` может не подтвердить, что строка профиля реально обновлена, если запрос завершился без явной ошибки, но изменил ноль строк.

**Что сделать:** проверить trigger/механизм создания строки `profiles`, конфигурацию email confirmation и RLS для регистрации; атомарно создавать профиль с допустимым ником через доверенный серверный путь или безопасный DB trigger. Серверно валидировать длину/символы ника и не полагаться на регулярное выражение в браузере.

### 9. Чат получает всю историю без ограничений

**Файл:** `components/EventChat.tsx` (примерно строки 1727–1770, 1798–1815).

История сообщений запрашивается без `limit`/пагинации. Каждое новое событие realtime вызывает отдельный запрос профиля автора. Длина сообщения не ограничена компонентом, отправитель передаётся через `currentUserId`, полученный в props. В коде нет ограничения частоты отправки.

**Что сделать:** ограничить размер сообщения и частоту отправки, загружать историю постранично, пакетно получать профили авторов, подписываться только на сообщения конкретного разрешённого события и получать ID автора из проверенной сессии/`auth.uid()` на уровне политики БД. Проверить правила чтения сообщений отдельно от возможности открыть страницу события.

### 10. Уведомления помечаются прочитанными до подтверждения обновления

**Файл:** `components/NotificationsBell.tsx`.

При открытии списка вызывается `markAsRead()`. Ответ от Supabase не проверяется, однако локальные `unreadCount` и `notifications` в любом случае обновляются так, будто запись прошла успешно. Ошибка или отказ RLS приводят к рассинхронизации интерфейса. Поведение также означает, что уведомления считаются прочитанными сразу при открытии выпадающего списка.

**Что сделать:** явно обрабатывать ошибку и обновлять локальное состояние после успешного ответа. Зафиксировать ожидаемое продуктовое поведение: отмечать уведомления при открытии или только при их фактическом просмотре.

### 11. Сырые ошибки БД отдаются пользователю

**Файл:** `components/EventList.tsx`.

При ошибке загрузки в UI выводятся `error.message` и `error.code`. Такие подробности обычно не нужны пользователю и могут раскрыть имена объектов БД или детали конфигурации.

**Что сделать:** логировать полную ошибку на сервере, а посетителю показывать нейтральное сообщение с возможностью повторить загрузку.

### 12. `proxy.ts` не является защитой маршрутов

**Файл:** `proxy.ts`.

Proxy вызывает `supabase.auth.getUser()`, но не использует возвращённого пользователя для решения о доступе. Это может помогать обновлять Auth-сессию, но само по себе не блокирует доступ к странице. Авторизацию и права следует проверять внутри защищённых страниц, Data Access Layer, Server Actions и политик БД. Кроме того, matcher запускает proxy для большинства запросов, а `getUser()` может создавать лишний сетевой round trip; оптимизировать это следует с учётом актуальных рекомендаций Supabase и измерений.

### 13. Время события может сдвигаться относительно часового пояса пользователя

**Файл:** `app/actions.ts`, выражение `new Date(`${date}T${time}`).toISOString()`.

Строка даты/времени без явного смещения трактуется в часовом поясе окружения, где выполняется код. Если сервер и пользователь работают в разных часовых поясах, сохранённый момент может не совпасть с ожидаемым временем встречи.

**Что сделать:** определить часовой пояс события как часть модели и явно преобразовывать локальные дату/время в UTC с этим поясом. Не полагаться на системный timezone сервера.

### 14. Возможные проблемы с кодировкой текста

В выгрузке многочисленные русские строки представлены в виде `РќР...`, включая UI-текст, сообщения ошибок и метаданные. Это может быть дефект исходных файлов либо ошибка формирования самой выгрузки; по одному bundle нельзя надёжно установить причину.

**Что сделать:** проверить реальные `.ts`/`.tsx`/`.css` в UTF-8 до исправления. Если исходники содержат те же строки, восстановить текст и отдельно проверить регулярное выражение ника в `app/login/page.tsx` — оно также выглядит повреждённым в выгрузке. Не выполнять слепую массовую перекодировку без проверки оригиналов.

### 15. Неизвестно, какие зависимости реально установлены

В бандле есть `package.json`, но нет lockfile, установленного дерева зависимостей или вывода dependency audit. Поэтому по этой выгрузке нельзя достоверно утверждать, есть ли известные CVE в транзитивных зависимостях.

**Что сделать:** включить lockfile в аудит, обновлять зависимости контролируемо и запускать `npm audit`/аналогичный сканер вместе с тестовой сборкой. Зафиксировать результаты, а не только заявленные диапазоны версий из `package.json`.

## Приоритет P3 — упорядочивание проекта

- Создать единый слой авторизации и доступа к данным: `requireUser`, `requireEventOrganizer`, функции получения безопасных DTO событий и валидаторы Server Actions.
- Снизить дублирование между `approveApplication` и `rejectApplication`; общая проверка полномочий и транзакционное изменение статуса должны быть в одном месте.
- Не использовать `select('*')`, если нужны 2–5 колонок: это снижает передачу лишних данных и упрощает типизацию.
- Добавить индексы после проверки планов запросов: вероятные кандидаты — `applications(event_id, status)`, `applications(user_id, status)`, `messages(event_id, created_at)`, `notifications(user_id, created_at)`, `events(date_time)`. Сверить с фактическими фильтрами, ключами и существующими индексами.
- Добавить серверную обработку ограничений частоты для регистрации, создания событий, заявок и сообщений.
- Добавить базовые security headers (например, `X-Content-Type-Options`, `Referrer-Policy`, подходящую `frame-ancestors`/CSP и `Permissions-Policy`), предварительно протестировав их совместимость с картой, шрифтами и используемыми ресурсами.
- Проверить `app/globals.css`: глобальное правило `.border-2 { border-width: 1px !important; }` меняет смысл утилиты Tailwind по всему проекту. Если это намеренный дизайн-токен, лучше определить его централизованно, а не переопределять глобальную утилиту через `!important`.
- Загрузка Google Fonts через CSS `@import` может задерживать применение стилей; рассмотреть `next/font` и проверить результат по измерениям производительности.
- Проверить функциональность интерфейса: в выгрузке кнопка переключения темы и кнопки фильтров выглядят декоративными (нет обработчиков/состояния в показанных компонентах). Это не уязвимости, но недоделанные пользовательские сценарии.

## Что отсутствует в выгрузке

Эти файлы/данные нужны для окончательного заключения:

1. SQL-схема, миграции, grants, RLS policies, индексы, триггеры и функции Supabase.
2. Страница детали события (`/event/[id]`), страница профиля, архив и связанные маршруты.
3. Реализации `Map` и `MapPicker`.
4. Настройки Auth (включая подтверждение email), таблицы/триггеры профиля и настройки realtime.
5. Реальный `.gitignore`: он перечислен в оглавлении, но его содержимое в выгрузке не представлено.
6. Lockfile, тесты и результат production build.

Содержимое `.env.local` в бандле заменено пометкой о неразглашении; секреты по этому файлу не проверялись. `NEXT_PUBLIC_SUPABASE_ANON_KEY` рассчитан на использование в браузере и не должен считаться секретом. При этом `service_role`/secret key нельзя помещать в `NEXT_PUBLIC_*` или клиентский bundle.

## Рекомендуемый порядок исправлений

1. **Скрытая локация:** прекратить передачу `location`, `lat`, `lng` клиенту до разрешения доступа; проверить сетевые ответы.
2. **Supabase RLS:** провести матрицу доступа по пяти таблицам и добавить тесты на пользователя A/B, анонимного посетителя и организатора.
3. **Заявки и вместимость:** реализовать подачу/отмену/подтверждение/отклонение через проверенные server actions или транзакционные RPC; добавить уникальные и CHECK-ограничения.
4. **Валидация создания события:** строгая серверная схема и проверка timezone.
5. **Регистрация и профиль:** подтвердить механизм создания профиля, обеспечить уникальность ника на БД и протестировать email confirmation.
6. **Производительность:** убрать запросы из каждой карточки, агрегировать данные и внедрить пагинацию.
7. **Набор качества:** lockfile, тесты RLS и бизнес-правил, lint, production build, сканер зависимостей и security headers.

## Критерий готовности

Перед публичным запуском должны проходить как минимум сценарии: нельзя получить скрытые координаты до подтверждения; нельзя читать/писать чужой чат; нельзя создать чужую/повторную заявку или самому одобрить её; невозможно превысить лимит участников при параллельных подтверждениях; некорректная форма не создаёт запись и не приводит к необработанному исключению; пользователь A не может читать/изменять профиль или уведомления пользователя B.

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
  "exclude": ["node_modules"]
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

### `Новый текстовый документ.txt`

``

````

