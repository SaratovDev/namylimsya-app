
**Метаинформация**

| Поле | Значение |
|---|---|
| Собрано | 2026-10-21 09:41 |
| Файлов | 32 |
| Проект | namylimsya-app |

## Оглавление

1. [.env.local](#envlocal) — 2 строк, 0.3 KB
2. [.gitignore](#gitignore) — 41 строк, 0.5 KB
3. [AGENTS.md](#agentsmd) — 9 строк, 0.7 KB
4. [app/actions.ts](#appactionsts) — 175 строк, 5.8 KB
5. [app/globals.css](#appglobalscss) — 125 строк, 3.5 KB
6. [app/layout.tsx](#applayouttsx) — 33 строк, 1.3 KB
7. [app/loading.tsx](#apploadingtsx) — 7 строк, 0.2 KB
8. [app/login/page.tsx](#apploginpagetsx) — 189 строк, 8.5 KB
9. [app/my-events/loading.tsx](#appmy-eventsloadingtsx) — 20 строк, 0.9 KB
10. [app/my-events/page.tsx](#appmy-eventspagetsx) — 175 строк, 8.3 KB
11. [app/page.tsx](#apppagetsx) — 58 строк, 2.2 KB
12. [components/ApplicationActions.tsx](#componentsapplicationactionstsx) — 55 строк, 1.9 KB
13. [components/AvatarPicker.tsx](#componentsavatarpickertsx) — 94 строк, 3.7 KB
14. [components/CategoryIcon.tsx](#componentscategoryicontsx) — 48 строк, 2 KB
15. [components/Countdown.tsx](#componentscountdowntsx) — 63 строк, 2.1 KB
16. [components/CreateEventForm.tsx](#componentscreateeventformtsx) — 149 строк, 7.1 KB
17. [components/EventCard.tsx](#componentseventcardtsx) — 328 строк, 12.7 KB
18. [components/EventChat.tsx](#componentseventchattsx) — 196 строк, 7.2 KB
19. [components/EventList.tsx](#componentseventlisttsx) — 58 строк, 2 KB
20. [components/Header.tsx](#componentsheadertsx) — 202 строк, 9.3 KB
21. [components/MobileFilters.tsx](#componentsmobilefilterstsx) — 42 строк, 2.1 KB
22. [components/NotificationsBell.tsx](#componentsnotificationsbelltsx) — 158 строк, 5.5 KB
23. [components/PageTransition.tsx](#componentspagetransitiontsx) — 23 строк, 0.7 KB
24. [components/Sidebar.tsx](#componentssidebartsx) — 34 строк, 2.9 KB
25. [eslint.config.mjs](#eslintconfigmjs) — 18 строк, 0.5 KB
26. [lib/supabase.ts](#libsupabasets) — 6 строк, 0.2 KB
27. [lib/supabase-server.ts](#libsupabase-serverts) — 27 строк, 0.7 KB
28. [next.config.ts](#nextconfigts) — 14 строк, 0.2 KB
29. [package.json](#packagejson) — 33 строк, 0.7 KB
30. [proxy.ts](#proxyts) — 39 строк, 1 KB
31. [README.md](#readmemd) — 41 строк, 1.5 KB
32. [tsconfig.json](#tsconfigjson) — 34 строк, 0.7 KB

---

## Структура (только включённые файлы)

```
.env.local
.gitignore
AGENTS.md
app/actions.ts
app/globals.css
app/layout.tsx
app/loading.tsx
app/login/page.tsx
app/my-events/loading.tsx
app/my-events/page.tsx
app/page.tsx
components/ApplicationActions.tsx
components/AvatarPicker.tsx
components/CategoryIcon.tsx
components/Countdown.tsx
components/CreateEventForm.tsx
components/EventCard.tsx
components/EventChat.tsx
components/EventList.tsx
components/Header.tsx
components/MobileFilters.tsx
components/NotificationsBell.tsx
components/PageTransition.tsx
components/Sidebar.tsx
eslint.config.mjs
lib/supabase.ts
lib/supabase-server.ts
next.config.ts
package.json
proxy.ts
README.md
tsconfig.json
```

---

## .env.local

не разгалашаю содержимое


## AGENTS.md

```md
<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes вЂ” APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` вЂ” verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

```

## app/actions.ts

```ts
'use server';

import { createClient } from '@/lib/supabase-server';
import { revalidatePath } from 'next/cache';

export async function createEvent(formData: FormData) {
  const supabase = await createClient();
  const { data: { user }, error: authError } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('РќРµРѕР±С…РѕРґРёРјРѕ РІРѕР№С‚Рё РІ Р°РєРєР°СѓРЅС‚, С‡С‚РѕР±С‹ СЃРѕР·РґР°С‚СЊ СЃРѕР±С‹С‚РёРµ');
  }

  // РџРѕР»СѓС‡Р°РµРј РЅРёРєРЅРµР№Рј РёР· РїСЂРѕС„РёР»СЏ
  const { data: profile } = await supabase
    .from('profiles')
    .select('username')
    .eq('id', user.id)
    .single();

  const organizerName = profile?.username || 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ';

  const lat = formData.get('lat') ? parseFloat(formData.get('lat') as string) : null;
  const lng = formData.get('lng') ? parseFloat(formData.get('lng') as string) : null;
  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const category = formData.get('category') as string;
  const date = formData.get('date') as string;
  const time = formData.get('time') as string;
  const location = formData.get('location') as string;
  const maxParticipants = parseInt(formData.get('max_participants') as string, 10);
  const hideLocation = formData.get('hide_location') === 'on';

  const dateTime = new Date(`${date}T${time}`).toISOString();

    const { error } = await supabase
    .from('events')
    .insert([
      {
        title,
        description,
        category,
        date_time: dateTime,
        location,
        lat,
        lng, 
        max_participants: maxParticipants,
        hide_location: hideLocation,
        organizer_name: organizerName, 
        organizer_id: user.id, 
        organizer_rank: 'РРЅРёС†РёР°С‚РѕСЂ',
      },
    ]);

  if (error) {
    console.error('РћС€РёР±РєР° СЃРѕР·РґР°РЅРёСЏ:', error);
    throw new Error('РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕР·РґР°С‚СЊ СЃРѕР±С‹С‚РёРµ');
  }

  revalidatePath('/');
}


export async function approveApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('РќРµ Р°РІС‚РѕСЂРёР·РѕРІР°РЅ');

  // 1. РџРѕР»СѓС‡Р°РµРј ID СЃРѕР±С‹С‚РёР№ РѕСЂРіР°РЅРёР·Р°С‚РѕСЂР° (РґР»СЏ РїСЂРѕРІРµСЂРєРё Р±РµР·РѕРїР°СЃРЅРѕСЃС‚Рё)
  const { data: userEvents } = await supabase
    .from('events')
    .select('id')
    .eq('organizer_id', user.id);

  if (!userEvents || userEvents.length === 0) throw new Error('РЈ РІР°СЃ РЅРµС‚ СЃРѕР·РґР°РЅРЅС‹С… СЃРѕР±С‹С‚РёР№');
  const eventIds = userEvents.map(e => e.id);

  // 2. РћР±РЅРѕРІР»СЏРµРј СЃС‚Р°С‚СѓСЃ Р·Р°СЏРІРєРё
  const { error } = await supabase
    .from('applications')
    .update({ status: 'approved' })
    .eq('id', applicationId)
    .in('event_id', eventIds);

  if (error) {
    console.error("РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ:", error);
    throw new Error('РќРµ СѓРґР°Р»РѕСЃСЊ РїРѕРґС‚РІРµСЂРґРёС‚СЊ Р·Р°СЏРІРєСѓ');
  }

  // 3. РџРѕР»СѓС‡Р°РµРј ID РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ Рё ID СЃРѕР±С‹С‚РёСЏ РёР· Р·Р°СЏРІРєРё
  const { data: appData } = await supabase
    .from('applications')
    .select('user_id, event_id')
    .eq('id', applicationId)
    .single();

  if (appData) {
    // 4. РћС‚РґРµР»СЊРЅС‹Рј Р·Р°РїСЂРѕСЃРѕРј РїРѕР»СѓС‡Р°РµРј РЅР°Р·РІР°РЅРёРµ СЃРѕР±С‹С‚РёСЏ
    const { data: eventData } = await supabase
      .from('events')
      .select('title')
      .eq('id', appData.event_id)
      .single();

    // 5. РЎРѕР·РґР°РµРј СѓРІРµРґРѕРјР»РµРЅРёРµ
    if (eventData) {
      const { error: notifError } = await supabase.from('notifications').insert({
        user_id: appData.user_id,
        content: `Р’Р°С€Р° Р·Р°СЏРІРєР° РЅР° СЃРѕР±С‹С‚РёРµ В«${eventData.title}В» РѕРґРѕР±СЂРµРЅР°!`,
        link: `/event/${appData.event_id}`
      });
      
      if (notifError) console.error("РћС€РёР±РєР° СЃРѕР·РґР°РЅРёСЏ СѓРІРµРґРѕРјР»РµРЅРёСЏ:", notifError);
    }
  }
  
  revalidatePath('/my-events');
  revalidatePath('/');
}

export async function rejectApplication(applicationId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) throw new Error('РќРµ Р°РІС‚РѕСЂРёР·РѕРІР°РЅ');

  // 1. РџРѕР»СѓС‡Р°РµРј ID СЃРѕР±С‹С‚РёР№ РѕСЂРіР°РЅРёР·Р°С‚РѕСЂР°
  const { data: userEvents } = await supabase
    .from('events')
    .select('id')
    .eq('organizer_id', user.id);

  if (!userEvents || userEvents.length === 0) throw new Error('РЈ РІР°СЃ РЅРµС‚ СЃРѕР·РґР°РЅРЅС‹С… СЃРѕР±С‹С‚РёР№');
  const eventIds = userEvents.map(e => e.id);

  // 2. РћР±РЅРѕРІР»СЏРµРј СЃС‚Р°С‚СѓСЃ Р·Р°СЏРІРєРё
  const { error } = await supabase
    .from('applications')
    .update({ status: 'rejected' })
    .eq('id', applicationId)
    .in('event_id', eventIds);

  if (error) {
    console.error("РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ:", error);
    throw new Error('РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РєР»РѕРЅРёС‚СЊ Р·Р°СЏРІРєСѓ');
  }

  // 3. РџРѕР»СѓС‡Р°РµРј РґР°РЅРЅС‹Рµ РґР»СЏ СѓРІРµРґРѕРјР»РµРЅРёСЏ
  const { data: appData } = await supabase
    .from('applications')
    .select('user_id, event_id')
    .eq('id', applicationId)
    .single();

  if (appData) {
    const { data: eventData } = await supabase
      .from('events')
      .select('title')
      .eq('id', appData.event_id)
      .single();

    if (eventData) {
      const { error: notifError } = await supabase.from('notifications').insert({
        user_id: appData.user_id,
        content: `Р’Р°С€Р° Р·Р°СЏРІРєР° РЅР° СЃРѕР±С‹С‚РёРµ В«${eventData.title}В» РѕС‚РєР»РѕРЅРµРЅР°.`,
        link: `/event/${appData.event_id}`
      });
      
      if (notifError) console.error("РћС€РёР±РєР° СЃРѕР·РґР°РЅРёСЏ СѓРІРµРґРѕРјР»РµРЅРёСЏ:", notifError);
    }
  }
  
  revalidatePath('/my-events');
}
```

## app/globals.css

```css
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
  
  --radius-brand: 0px;
  --radius-brand-lg: 0px;
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

/* Р”РµР»Р°РµРј РІСЃРµ СЂР°РјРєРё РІ РїСЂРѕРµРєС‚Рµ С‚РѕРЅСЊС€Рµ (1px РІРјРµСЃС‚Рѕ 2px) */
.border-2 {
  border-width: 1px !important;
}

/* =========================================
   1. РђРЅРёРјР°С†РёСЏ РІС‹РµР·РґР° РјРѕР±РёР»СЊРЅС‹С… С„РёР»СЊС‚СЂРѕРІ (СЃРЅРёР·Сѓ)
   ========================================= */
@keyframes slideUp {
  from { transform: translateY(100%); }
  to { transform: translateY(0); }
}
.animate-slide-up {
  animation: slideUp 0.3s ease-out forwards;
}

/* =========================================
   2. РђРЅРёРјР°С†РёСЏ РїРѕСЏРІР»РµРЅРёСЏ РїСѓРЅРєС‚РѕРІ РІ РјРѕР±РёР»СЊРЅРѕРј РјРµРЅСЋ
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
   3. РџРѕР»РѕСЃРєР° Р·Р°РіСЂСѓР·РєРё (Progress bar)
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
   4. РџР»Р°РІРЅС‹Рµ Р°РєРєРѕСЂРґРµРѕРЅС‹ (details/summary)
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

/* РЈР±РёСЂР°РµРј СЃС‚Р°РЅРґР°СЂС‚РЅС‹Р№ РјР°СЂРєРµСЂ (С‚СЂРµСѓРіРѕР»СЊРЅРёРє) Сѓ details */
details > summary {
  list-style: none;
}
details > summary::-webkit-details-marker {
  display: none;
}

/* =========================================
   5. РџСЂРѕС‡РёРµ СѓС‚РёР»РёС‚С‹ РґР»СЏ Leaflet (РљР°СЂС‚С‹)
   ========================================= */
.leaflet-container {
  font-family: inherit;
  z-index: 0;
}
```

## app/layout.tsx

```tsx
import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import PageTransition from "@/components/PageTransition"; // <-- РРњРџРћР Рў

export const metadata: Metadata = {
  title: "РќР°РјС‹Р»РёРјСЃСЏ. вЂ” Р›РµРЅС‚Р°",
  description: "РџР»РѕС‰Р°РґРєР° РґР»СЏ Р¶РёРІС‹С… РІСЃС‚СЂРµС‡",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru" data-theme="light">
      <body className="min-h-screen flex flex-col"> {/* Р”РѕР±Р°РІРёР»Рё flex РґР»СЏ РїСЂРёР¶Р°С‚РёСЏ С„СѓС‚РµСЂР° */}
        <Header />
        
        {/* РћР±РѕСЂР°С‡РёРІР°РµРј РІ Р°РЅРёРјРёСЂРѕРІР°РЅРЅС‹Р№ РєРѕРјРїРѕРЅРµРЅС‚ */}
        <PageTransition>
          {children}
        </PageTransition>

        <footer className="max-w-[1200px] w-full mx-auto mt-auto px-6 py-5 text-brand-muted text-[13px] border-t-2 border-brand-line">
          <p>В«РќР°РјС‹Р»РёРјСЃСЏ.В» вЂ” РїР»РѕС‰Р°РґРєР° РґР»СЏ Р¶РёРІС‹С… РІСЃС‚СЂРµС‡. РћС‚РІРµС‚СЃС‚РІРµРЅРЅРѕСЃС‚СЊ Р·Р° РїСЂРѕРІРµРґРµРЅРёРµ СЃРѕР±С‹С‚РёР№ Р»РµР¶Р°С‚ РЅР° РѕСЂРіР°РЅРёР·Р°С‚РѕСЂР°С… Рё СѓС‡Р°СЃС‚РЅРёРєР°С….</p>
          <p>16+ В· РџСЂР°РІРёР»Р° СЃРѕРѕР±С‰РµСЃС‚РІР° В· РџРѕРґРґРµСЂР¶РєР°</p>
        </footer>
      </body>
    </html>
  );
}
```

## app/loading.tsx

```tsx
export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] overflow-hidden bg-brand-bg">
      <div className="w-full h-full bg-brand-accent animate-progress origin-left"></div>
    </div>
  );
}
```

## app/login/page.tsx

```tsx
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
    // РСЃРїРѕР»СЊР·СѓРµРј РЅРµР±РѕР»СЊС€СѓСЋ Р·Р°РґРµСЂР¶РєСѓ, С‡С‚РѕР±С‹ РёР·Р±РµР¶Р°С‚СЊ СЃРёРЅС…СЂРѕРЅРЅРѕРіРѕ РѕР±РЅРѕРІР»РµРЅРёСЏ
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
        // Р’С…РѕРґ
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        router.push('/');
        router.refresh();
      } else {
        // Р Р•Р“РРЎРўР РђР¦РРЇ
        // 1. РџСЂРѕРІРµСЂСЏРµРј, РЅРµ Р·Р°РЅСЏС‚ Р»Рё РЅРёРєРЅРµР№Рј (РїСЂРѕСЃС‚РѕР№ Р·Р°РїСЂРѕСЃ)
        const { data: existingUser } = await supabase
          .from('profiles')
          .select('username')
          .eq('username', username)
          .single();

        if (existingUser) {
          throw new Error('Р­С‚РѕС‚ РЅРёРєРЅРµР№Рј СѓР¶Рµ Р·Р°РЅСЏС‚. РџСЂРёРґСѓРјР°Р№С‚Рµ РґСЂСѓРіРѕР№.');
        }

        // 2. РЎРѕР·РґР°РµРј РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ РІ Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({ 
          email, 
          password 
        });
        
        if (authError) throw authError;

        // 3. Р•СЃР»Рё РїРѕР»СЊР·РѕРІР°С‚РµР»СЊ СЃРѕР·РґР°Р»СЃСЏ, РѕР±РЅРѕРІР»СЏРµРј РµРіРѕ РїСЂРѕС„РёР»СЊ (РґРѕР±Р°РІР»СЏРµРј РІС‹Р±СЂР°РЅРЅС‹Р№ РЅРёРєРЅРµР№Рј)
               if (authData.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .update({ 
              username: username,
              email: email,         // <-- СЃРѕС…СЂР°РЅСЏРµРј email
              gender: gender        // <-- СЃРѕС…СЂР°РЅСЏРµРј РїРѕР»
            })
            .eq('id', authData.user.id);
          if (profileError) {
             console.error("РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ РїСЂРѕС„РёР»СЏ:", profileError);
             // Р•СЃР»Рё РЅРёРєРЅРµР№Рј РЅРµ Р·Р°РїРёСЃР°Р»СЃСЏ (РЅР°РїСЂРёРјРµСЂ, РёР·-Р·Р° СѓРЅРёРєР°Р»СЊРЅРѕСЃС‚Рё), 
             // РјС‹ РґРѕР»Р¶РЅС‹ СѓРґР°Р»РёС‚СЊ СЃРѕР·РґР°РЅРЅРѕРіРѕ РїРѕР»СЊР·РѕРІР°С‚РµР»СЏ, РЅРѕ РІ Supabase СЌС‚Рѕ СЃР»РѕР¶РЅРѕ СЃРґРµР»Р°С‚СЊ СЃ РєР»РёРµРЅС‚Р°.
             // РџРѕСЌС‚РѕРјСѓ РїСЂРѕСЃС‚Рѕ РїСЂРѕСЃРёРј РІРІРµСЃС‚Рё РґСЂСѓРіРѕР№ РЅРёРєРЅРµР№Рј.
             throw new Error('РќРµ СѓРґР°Р»РѕСЃСЊ Р·Р°РєСЂРµРїРёС‚СЊ РЅРёРєРЅРµР№Рј. Р’РѕР·РјРѕР¶РЅРѕ, РѕРЅ С‚РѕР»СЊРєРѕ С‡С‚Рѕ Р±С‹Р» Р·Р°РЅСЏС‚.');
          }
        }

        setMessage('Р РµРіРёСЃС‚СЂР°С†РёСЏ СѓСЃРїРµС€РЅР°! РўРµРїРµСЂСЊ РІС‹ РјРѕР¶РµС‚Рµ РІРѕР№С‚Рё.');
        setIsLogin(true);
      }
   } catch (error) {
      // Р‘РµР·РѕРїР°СЃРЅРѕ РёР·РІР»РµРєР°РµРј СЃРѕРѕР±С‰РµРЅРёРµ РѕР± РѕС€РёР±РєРµ
      const errorMessage = error instanceof Error ? error.message : 'РџСЂРѕРёР·РѕС€Р»Р° РЅРµРёР·РІРµСЃС‚РЅР°СЏ РѕС€РёР±РєР°';
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-8">
      <h1 className="text-2xl font-extrabold uppercase mb-6 text-center">
        {isLogin ? 'Р’С…РѕРґ РІ РќР°РјС‹Р»РёРјСЃСЏ' : 'Р РµРіРёСЃС‚СЂР°С†РёСЏ'}
      </h1>

      {message && (
        <div className="mb-4 p-3 bg-brand-bg border-2 border-brand-line rounded-brand text-sm font-bold text-center">
          {message}
        </div>
      )}

      <form onSubmit={handleAuth} className="flex flex-col gap-4">
        
        {/* РџРѕР»Рµ РЅРёРєРЅРµР№РјР° С‚РѕР»СЊРєРѕ РґР»СЏ СЂРµРіРёСЃС‚СЂР°С†РёРё */}
        {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Р’Р°С€ РЅРёРєРЅРµР№Рј (РїСѓР±Р»РёС‡РЅРѕРµ РёРјСЏ)</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value.replace(/[^a-zA-ZР°-СЏРђ-РЇ0-9_]/g, ''))} // РўРѕР»СЊРєРѕ Р±СѓРєРІС‹, С†РёС„СЂС‹ Рё _
              required
              placeholder="РЅР°РїСЂРёРјРµСЂ: Р’Р°РґРёРј_РљСЂСѓС‚РѕР№"
              className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" 
            />
            <span className="text-[11px] text-brand-muted font-bold">Р Р°Р·СЂРµС€РµРЅС‹ РєРёСЂРёР»Р»РёС†Р°, Р»Р°С‚РёРЅРёС†Р°, С†РёС„СЂС‹ Рё _. РћРґРёРЅР°РєРѕРІС‹Рµ Р·Р°РїСЂРµС‰РµРЅС‹.</span>
          </div>
        )}

         {!isLogin && (
          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">Р’Р°С€ РїРѕР» (РЅРµРѕР±СЏР·Р°С‚РµР»СЊРЅРѕ)</label>
            <div className="flex gap-2">
              <button type="button" onClick={() => setGender('male')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${gender === 'male' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>Рњ</button>
              <button type="button" onClick={() => setGender('female')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${gender === 'female' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>Р–</button>
              <button type="button" onClick={() => setGender('none')} className={`flex-1 py-2 font-bold border-2 border-brand-line rounded-brand ${gender === 'none' ? 'bg-brand-accent text-white' : 'bg-brand-bg'}`}>Р”СЂСѓРіРѕР№</button>
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
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">РџР°СЂРѕР»СЊ</label>
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
          {loading ? 'Р—Р°РіСЂСѓР·РєР°...' : (isLogin ? 'Р’РѕР№С‚Рё' : 'Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ')}
        </button>
      </form>

      <div className="mt-6 text-center">
        <button 
          onClick={() => setIsLogin(!isLogin)} 
          className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors"
        >
          {isLogin ? 'РќРµС‚ Р°РєРєР°СѓРЅС‚Р°? Р—Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ' : 'РЈР¶Рµ РµСЃС‚СЊ Р°РєРєР°СѓРЅС‚? Р’РѕР№С‚Рё'}
        </button>
      </div>
      
      <div className="mt-4 text-center">
        <Link href="/" className="text-sm font-bold text-brand-muted hover:text-brand-accent transition-colors">
          в†ђ Р’РµСЂРЅСѓС‚СЊСЃСЏ РЅР° РіР»Р°РІРЅСѓСЋ
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="max-w-md mx-auto mt-20 px-6">
      <Suspense fallback={<div className="text-center font-bold">Р—Р°РіСЂСѓР·РєР° С„РѕСЂРјС‹...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}
```

## app/my-events/loading.tsx

```tsx
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
```

## app/my-events/page.tsx

```tsx
import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ApplicationActions from '@/components/ApplicationActions';

export default async function MyEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // РџРѕР»СѓС‡Р°РµРј СЃРѕР±С‹С‚РёСЏ
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('date_time', { ascending: true });

  // РџРѕР»СѓС‡Р°РµРј Р·Р°СЏРІРєРё
  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .in('event_id', events?.map(e => e.id) || []);

  // РџРѕР»СѓС‡Р°РµРј РїСЂРѕС„РёР»Рё РґР»СЏ Р·Р°СЏРІРѕРє
  let applicationsWithProfiles = [];
  if (applications && applications.length > 0) {
    const userIds = [...new Set(applications.map(app => app.user_id))];
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, username')
      .in('id', userIds);

    applicationsWithProfiles = applications.map(app => ({
      ...app,
      profile: profiles?.find(p => p.id === app.user_id)
    }));
  }

  // РџРѕР»СѓС‡Р°РµРј РњРћР Р·Р°СЏРІРєРё
  const { data: myApplications } = await supabase
    .from('applications')
    .select(`
      *,
      events!fk_applications_event (*) 
    `)
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  return (
    <main className="max-w-[1200px] mx-auto px-4 md:px-6 py-10 min-h-screen">
      <h1 className="text-3xl font-extrabold uppercase mb-8 border-b-2 border-brand-line pb-4">
        РњРѕРё СЃРѕР±С‹С‚РёСЏ Рё Р·Р°СЏРІРєРё
      </h1>

      {/* === Р‘Р›РћРљ: РЇ РћР Р“РђРќРР—РђРўРћР  === */}
      {(!events || events.length === 0) ? (
        <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold mb-12">
          Р’С‹ РїРѕРєР° РЅРµ СЃРѕР·РґР°Р»Рё РЅРё РѕРґРЅРѕРіРѕ СЃРѕР±С‹С‚РёСЏ.
        </div>
      ) : (
        <div className="flex flex-col gap-8 mb-12">
          {events.map((event) => {
            const eventApps = applicationsWithProfiles?.filter(app => app.event_id === event.id) || [];
            const pendingApps = eventApps.filter(app => app.status === 'pending');
            const approvedApps = eventApps.filter(app => app.status === 'approved');

            return (
              <div key={event.id} className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5 md:p-6">
                
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 mb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold mb-2">{event.title}</h2>
                    <p className="text-brand-muted font-bold text-sm">
                      {new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })} РІ {new Date(event.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <Link 
                    href={`/event/${event.id}`} 
                    className="bg-brand-bg text-brand-text font-extrabold text-[12px] uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-cat-soft transition-colors w-fit whitespace-nowrap"
                  >
                    РџРµСЂРµР№С‚Рё Рє СЃРѕР±С‹С‚РёСЋ в†’
                  </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 border-t-2 border-dashed border-brand-line pt-6">
                  <div>
                    <h3 className="font-extrabold uppercase mb-3 text-brand-accent text-sm">РќРѕРІС‹Рµ Р·Р°СЏРІРєРё ({pendingApps.length})</h3>
                    {pendingApps.length === 0 ? (
                      <p className="text-sm text-brand-muted font-bold">РќРѕРІС‹С… Р·Р°СЏРІРѕРє РЅРµС‚.</p>
                    ) : (
                      <ul className="flex flex-col gap-3">
                        {pendingApps.map((app) => (
                          <li key={app.id} className="flex items-center justify-between bg-brand-bg p-2 rounded-brand border border-brand-line">
                            <span className="font-bold text-sm truncate mr-2">@{app.profile?.username || 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ'}</span>
                            <ApplicationActions applicationId={app.id} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold uppercase mb-3 text-green-600 text-sm">РџРѕРґС‚РІРµСЂР¶РґРµРЅС‹ ({approvedApps.length})</h3>
                    {approvedApps.length === 0 ? (
                      <p className="text-sm text-brand-muted font-bold">РџРѕРєР° РЅРёРєРѕРіРѕ РЅРµС‚.</p>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {approvedApps.map((app) => (
                          <li key={app.id} className="bg-brand-bg p-2 rounded-brand border border-brand-line text-sm font-bold truncate">
                            @{app.profile?.username || 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ'}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === Р‘Р›РћРљ: РЇ РЈР§РђРЎРўРќРРљ === */}
      <div className="mt-16">
        <h2 className="text-2xl font-extrabold uppercase mb-6 border-b-2 border-brand-line pb-4">
          РЎРѕР±С‹С‚РёСЏ, РєСѓРґР° СЏ Р·Р°РїРёСЃР°Р»СЃСЏ
        </h2>

        {(!myApplications || myApplications.length === 0) ? (
          <div className="text-center py-8 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
            Р’С‹ РїРѕРєР° РЅРµ РїРѕРґР°РІР°Р»Рё Р·Р°СЏРІРєРё РЅР° СЃРѕР±С‹С‚РёСЏ. РќР°Р№РґРёС‚Рµ С‡С‚Рѕ-РЅРёР±СѓРґСЊ РёРЅС‚РµСЂРµСЃРЅРѕРµ РІ Р»РµРЅС‚Рµ!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myApplications.map((app) => {
              const event = app.events; 
              let statusText = 'РћР¶РёРґР°РµС‚ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ';
              let statusColor = 'text-brand-heat border-brand-heat bg-brand-heat/10';
              
              if (app.status === 'approved') {
                statusText = 'Р’С‹ Р·Р°РїРёСЃР°РЅС‹ вњ“';
                statusColor = 'text-green-700 border-green-700 bg-green-100';
              } else if (app.status === 'rejected') {
                statusText = 'РћС‚РєР»РѕРЅРµРЅРѕ';
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
                      {new Date(event.date_time).toLocaleDateString('ru-RU', { weekday: 'short', day: 'numeric', month: 'long' })} РІ {new Date(event.date_time).toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  
                  <div className="mt-auto pt-4 border-t-2 border-dashed border-brand-line flex justify-between items-center">
                    <span className="text-sm text-brand-muted font-bold">РћСЂРі: {event.organizer_name}</span>
                    <Link href={`/event/${event.id}`} className="text-brand-accent font-extrabold text-sm uppercase hover:underline">
                      РџРµСЂРµР№С‚Рё в†’
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
```

## app/page.tsx

```tsx
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

export default function Home() {
  return (
   <main className="max-w-[1100px] mx-auto grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_300px] gap-8 items-start mt-6 px-4 md:px-6 pb-12 relative">
      
      <div className="flex flex-col gap-6">
        
        <details className="bg-brand-surface border-2 border-brand-line rounded-brand-lg overflow-hidden group">
          <summary className="list-none cursor-pointer flex items-center gap-3 p-5 font-extrabold text-lg uppercase hover:bg-brand-bg/50 transition-colors">
            <span className="w-7 h-7 flex items-center justify-center border-2 border-brand-line rounded-full bg-brand-accent text-brand-accent-ink text-xl leading-none group-open:rotate-45 transition-transform duration-300">+</span>
            РЎРѕР·РґР°С‚СЊ СЃРѕР±С‹С‚РёРµ
          </summary>
          {/* РћР±РµСЂС‚РєР° РґР»СЏ Р°РЅРёРјР°С†РёРё */}
          <div className="details-content">
            <div className="details-inner">
              <div className="p-6 border-t-2 border-brand-line">
                <CreateEventForm />
              </div>
            </div>
          </div>
        </details>

        {/* РќР°С€ РЅРѕРІС‹Р№ РєР»РёРµРЅС‚СЃРєРёР№ РєРѕРјРїРѕРЅРµРЅС‚ РґР»СЏ РјРѕР±РёР»СЊРЅС‹С… С„РёР»СЊС‚СЂРѕРІ */}
        <MobileFilters />

        <Suspense fallback={<EventSkeleton />}>
          <EventList />
        </Suspense>

      </div>

      <div className="hidden lg:block">
        <Sidebar />
      </div>

    </main>
  );
}
```

## components/ApplicationActions.tsx

```tsx
'use client';

import { useState } from 'react';
import { approveApplication, rejectApplication } from '@/app/actions';

export default function ApplicationActions({ applicationId }: { applicationId: string }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleApprove = async () => {
    setIsLoading(true);
    try {
      await approveApplication(applicationId);
    } catch (error) {
      console.error("РћС€РёР±РєР° РїСЂРё РїРѕРґС‚РІРµСЂР¶РґРµРЅРёРё:", error);
      alert('РћС€РёР±РєР° РїСЂРё РїРѕРґС‚РІРµСЂР¶РґРµРЅРёРё. РџСЂРѕРІРµСЂСЊС‚Рµ РєРѕРЅСЃРѕР»СЊ.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Р’С‹ СѓРІРµСЂРµРЅС‹, С‡С‚Рѕ С…РѕС‚РёС‚Рµ РѕС‚РєР»РѕРЅРёС‚СЊ СЌС‚Сѓ Р·Р°СЏРІРєСѓ?')) return;
    
    setIsLoading(true);
    try {
      await rejectApplication(applicationId);
    } catch (error) {
      console.error("РћС€РёР±РєР° РїСЂРё РѕС‚РєР»РѕРЅРµРЅРёРё:", error);
      alert('РћС€РёР±РєР° РїСЂРё РѕС‚РєР»РѕРЅРµРЅРёРё. РџСЂРѕРІРµСЂСЊС‚Рµ РєРѕРЅСЃРѕР»СЊ.');
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
        title="РџСЂРёРЅСЏС‚СЊ"
      >
        {isLoading ? '...' : 'вњ“'}
      </button>
      <button 
        onClick={handleReject}
        disabled={isLoading}
        className="w-8 h-8 flex items-center justify-center bg-red-100 text-red-700 border-2 border-red-600 rounded-brand hover:bg-red-600 hover:text-white transition-colors disabled:opacity-50"
        title="РћС‚РєР»РѕРЅРёС‚СЊ"
      >
        {isLoading ? '...' : 'вњ•'}
      </button>
    </div>
  );
}
```

## components/AvatarPicker.tsx

```tsx
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

  // РћРїСЂРµРґРµР»СЏРµРј РїР°РїРєСѓ СЃ Р°РІР°С‚Р°СЂРєР°РјРё РІ Р·Р°РІРёСЃРёРјРѕСЃС‚Рё РѕС‚ РїРѕР»Р°
  const folder = gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'none';
  
  // Р“РµРЅРµСЂРёСЂСѓРµРј РјР°СЃСЃРёРІ РїСѓС‚РµР№ Рє РєР°СЂС‚РёРЅРєР°Рј (РѕС‚ 1 РґРѕ 30)
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
      router.refresh(); // РћР±РЅРѕРІР»СЏРµРј СЃС‚СЂР°РЅРёС†Сѓ, С‡С‚РѕР±С‹ Р°РІР°С‚Р°СЂРєР° СЃСЂР°Р·Сѓ РїРѕСЏРІРёР»Р°СЃСЊ
    } catch (error) {
      console.error('РћС€РёР±РєР° РѕР±РЅРѕРІР»РµРЅРёСЏ Р°РІР°С‚Р°СЂРєРё:', error);
      alert('РќРµ СѓРґР°Р»РѕСЃСЊ СЃРѕС…СЂР°РЅРёС‚СЊ Р°РІР°С‚Р°СЂРєСѓ');
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
        РЎРјРµРЅРёС‚СЊ Р°РІР°С‚Р°СЂ
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Р—Р°С‚РµРјРЅРµРЅРЅС‹Р№ С„РѕРЅ */}
          <div className="absolute inset-0 bg-black/60" onClick={() => !isSaving && setIsOpen(false)}></div>
          
          {/* РњРѕРґР°Р»СЊРЅРѕРµ РѕРєРЅРѕ */}
          <div className="relative bg-brand-bg border-2 border-brand-line rounded-brand-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-2 border-brand-line pb-4">
              <h2 className="text-xl font-extrabold uppercase">Р’С‹Р±РµСЂРёС‚Рµ Р°РІР°С‚Р°СЂ</h2>
              <button onClick={() => setIsOpen(false)} className="text-2xl font-bold hover:text-brand-accent">вњ•</button>
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
                    alt={`РђРІР°С‚Р°СЂ ${index + 1}`} 
                    width={100} 
                    height={100} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            {isSaving && <p className="text-center font-bold mt-4 text-brand-accent animate-pulse">РЎРѕС…СЂР°РЅРµРЅРёРµ...</p>}
          </div>
        </div>
      )}
    </>
  );
}
```

## components/CategoryIcon.tsx

```tsx
'use client';

import Image from 'next/image';

interface CategoryIconProps {
  category: string;
}

// РљР°СЂС‚Р° СЃРѕРѕС‚РІРµС‚СЃС‚РІРёСЏ РєР°С‚РµРіРѕСЂРёР№ Рё С„Р°Р№Р»РѕРІ РёРєРѕРЅРѕРє
const categoryMap: Record<string, { icon: string; label: string }> = {
  'РџСЂРѕРіСѓР»РєРё': { icon: '/icons/walk.png', label: 'РџСЂРѕРіСѓР»РєРё' },
  'РЎРїРѕСЂС‚': { icon: '/icons/sport.png', label: 'РЎРїРѕСЂС‚ Рё РёРіСЂС‹' },
  'РљСѓР»СЊС‚СѓСЂР°': { icon: '/icons/culture.png', label: 'РљСѓР»СЊС‚СѓСЂР°' },
  'Р•РґР° / РЅР°РїРёС‚РєРё': { icon: '/icons/food.png', label: 'Р•РґР°' },
  'РћР±СѓС‡РµРЅРёРµ': { icon: '/icons/edu.png', label: 'РћР±СѓС‡РµРЅРёРµ' },
  'РџРѕРµР·РґРєРё': { icon: '/icons/trip.png', label: 'РџРѕРµР·РґРєРё' },
  'Р’РѕР»РѕРЅС‚С‘СЂСЃС‚РІРѕ': { icon: '/icons/help.png', label: 'Р’РѕР»РѕРЅС‚С‘СЂСЃС‚РІРѕ' },
  'Р—РґРµСЃСЊ Рё СЃРµР№С‡Р°СЃ': { icon: '/icons/meet.png', label: 'Р’СЃС‚СЂРµС‚РёС‚СЊСЃСЏ' },
};

export default function CategoryIcon({ category }: CategoryIconProps) {
  // Р•СЃР»Рё РєР°С‚РµРіРѕСЂРёСЏ РЅРµ РЅР°Р№РґРµРЅР° РІ СЃРїРёСЃРєРµ, РїРѕРєР°Р·С‹РІР°РµРј РґРµС„РѕР»С‚РЅСѓСЋ
  const catInfo = categoryMap[category] || { icon: '/icons/default.svg', label: category };

  return (
    <div className="relative group flex items-center justify-center w-8 h-8 cursor-help">
      
      {/* РЎР°РјР° РёРєРѕРЅРєР° */}
      <Image 
        src={catInfo.icon} 
        alt={catInfo.label} 
        width={24} 
        height={24} 
        className="opacity-80"
      />

      {/* РўСѓР»С‚РёРї */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-brand-text text-brand-bg text-[11px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-md">
          {catInfo.label}
        </div>
        {/* РњР°Р»РµРЅСЊРєРёР№ С‚СЂРµСѓРіРѕР»СЊРЅРёРє РІРЅРёР·Сѓ С‚СѓР»С‚РёРїР° */}
        <div className="w-2 h-2 bg-brand-text rotate-45 mx-auto -mt-1"></div>
      </div>
      
    </div>
  );
}
```

## components/Countdown.tsx

```tsx
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
        setTimeLeft('РќР°С‡Р°Р»РѕСЃСЊ');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      // Р•СЃР»Рё РѕСЃС‚Р°Р»РѕСЃСЊ РјРµРЅСЊС€Рµ 4 С‡Р°СЃРѕРІ, РґРµР»Р°РµРј Р°РєС†РµРЅС‚
      if (days === 0 && hours < 4) {
        setIsUrgent(true);
        setTimeLeft(`РћСЃС‚Р°Р»РѕСЃСЊ ${hours} С‡ ${minutes} РјРёРЅ`);
      } else {
        setIsUrgent(false);
        if (days > 0) {
          setTimeLeft(`РћСЃС‚Р°Р»РѕСЃСЊ ${days} Рґ ${hours} С‡`);
        } else {
          setTimeLeft(`РћСЃС‚Р°Р»РѕСЃСЊ ${hours} С‡ ${minutes} РјРёРЅ`);
        }
      }
    };

    calculateTime(); // РЎС‡РёС‚Р°РµРј СЃСЂР°Р·Сѓ
    const timer = setInterval(calculateTime, 60000); // РћР±РЅРѕРІР»СЏРµРј РєР°Р¶РґСѓСЋ РјРёРЅСѓС‚Сѓ

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isPast) {
    return (
      <span className="text-[12px] font-bold text-brand-muted">
        РЎРѕР±С‹С‚РёРµ РЅР°С‡Р°Р»РѕСЃСЊ
      </span>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-[12px] font-regular text-brand-muted leading-tight">
        Р”Рѕ СЃРѕР±С‹С‚РёСЏ:
      </span>
      <span className={`text-[12px] font-regular text-brand-muted leading-tight ${
        isUrgent ? 'text-brand-accent' : 'text-brand-muted'
      }`}>
        {timeLeft.replace('РћСЃС‚Р°Р»РѕСЃСЊ ', '')}
      </span>
    </div>
  ); }
```

## components/CreateEventForm.tsx

```tsx
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
  
  // РЎС‚РµР№С‚С‹ РґР»СЏ РєР°СЂС‚С‹ (Р’РќРЈРўР Р РєРѕРјРїРѕРЅРµРЅС‚Р°!)
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
      setLocation(''); // РЎР±СЂР°СЃС‹РІР°РµРј РїРѕР»Рµ Р°РґСЂРµСЃР° РїРѕСЃР»Рµ РѕС‚РїСЂР°РІРєРё
      setLat(null);
      setLng(null);
      alert('РЎРѕР±С‹С‚РёРµ СѓСЃРїРµС€РЅРѕ СЃРѕР·РґР°РЅРѕ!');
      formRef.current?.closest('details')?.removeAttribute('open');
      router.refresh();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'РћС€РёР±РєР° РїСЂРё СЃРѕР·РґР°РЅРёРё СЃРѕР±С‹С‚РёСЏ';
      alert(message);
    } finally {
      setIsPending(false);
    }
  }

  if (isCheckingAuth) {
    return <div className="p-4 text-center font-bold text-brand-muted">РџСЂРѕРІРµСЂРєР° Р°РІС‚РѕСЂРёР·Р°С†РёРё...</div>;
  }

  if (!user) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <p className="font-bold text-lg">Р§С‚РѕР±С‹ СЃРѕР·РґР°С‚СЊ СЃРѕР±С‹С‚РёРµ, РЅСѓР¶РЅРѕ РІРѕР№С‚Рё РІ Р°РєРєР°СѓРЅС‚.</p>
        <Link href="/login" className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors">
          Р’РѕР№С‚Рё РёР»Рё Р·Р°СЂРµРіРёСЃС‚СЂРёСЂРѕРІР°С‚СЊСЃСЏ
        </Link>
      </div>
    );
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
      
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-extrabold uppercase text-brand-muted">РќР°Р·РІР°РЅРёРµ</label>
        <input required name="title" type="text" placeholder="РќР°РїСЂРёРјРµСЂ: Р’РµС‡РµСЂРЅСЏСЏ РїСЂРѕРіСѓР»РєР°" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">РљР°С‚РµРіРѕСЂРёСЏ</label>
          <select name="category" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors">
            <option>РџСЂРѕРіСѓР»РєРё</option>
            <option>РЎРїРѕСЂС‚</option>
            <option>РљСѓР»СЊС‚СѓСЂР°</option>
            <option>Р•РґР°/РЅР°РїРёС‚РєРё</option>
            <option>РћР±СѓС‡РµРЅРёРµ</option>
            <option>РџРѕРµР·РґРєРё</option>
            <option>Р’РѕР»РѕРЅС‚С‘СЂСЃС‚РІРѕ</option>
            <option>Р—РґРµСЃСЊ Рё СЃРµР№С‡Р°СЃ</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Р›РёРјРёС‚ СѓС‡Р°СЃС‚РЅРёРєРѕРІ</label>
          <input required name="max_participants" type="number" min="1" defaultValue="10" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-extrabold uppercase text-brand-muted">РћРїРёСЃР°РЅРёРµ</label>
        <textarea required name="description" rows={3} placeholder="Р Р°СЃСЃРєР°Р¶РёС‚Рµ, С‡С‚Рѕ Р±СѓРґРµС‚ РїСЂРѕРёСЃС…РѕРґРёС‚СЊ..." className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-y"></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Р”Р°С‚Р°</label>
          <input required name="date" type="date" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Р’СЂРµРјСЏ</label>
          <input required name="time" type="time" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-extrabold uppercase text-brand-muted">РњРµСЃС‚Рѕ (РєР»РёРєРЅРёС‚Рµ РЅР° РєР°СЂС‚Сѓ)</label>
        <input 
          required 
          name="location" 
          type="text" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="РќР°РїСЂРёРјРµСЂ: РџР°СЂРє Р“РѕСЂСЊРєРѕРіРѕ" 
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
        <span className="text-sm font-bold">РЎРєСЂС‹С‚СЊ С‚РѕС‡РЅРѕРµ РјРµСЃС‚Рѕ РґРѕ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ Р·Р°СЏРІРєРё</span>
      </label>

      <button 
        type="submit" 
        disabled={isPending}
        className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'РџСѓР±Р»РёРєСѓРµРј...' : 'РћРїСѓР±Р»РёРєРѕРІР°С‚СЊ СЃРѕР±С‹С‚РёРµ'}
      </button>
    </form>
  );
}
```

## components/EventCard.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Map from './Map';
import Image from 'next/image';
import { User } from '@supabase/supabase-js';


interface EventCardProps {
  id: string;
  organizerId: string;
  category: string;
  dateTime: string;
  maxParticipants?: number;
  currentParticipants?: number;
  title: string;
  description: string;
  organizerName: string;
  organizerRank: string;
  isFull?: boolean;
  location: string;
  lat?: number;
  lng?: number;
  hideLocation?: boolean;
  organizerAvatar?: string | null;
  organizerGender?: string | null;
}

export default function EventCard({
  id,
  organizerId,
  category,
  dateTime,
  maxParticipants = 10,
  currentParticipants = 0,
  title,
  description,
  organizerName,
  organizerRank,
  isFull = false,
  location,
  lat,
  lng,
  hideLocation = false,
  organizerAvatar,
  organizerGender,
}: EventCardProps) {
  const [user, setUser] = useState<User | null>(null);
  const [application, setApplication] = useState<{ id: string; status: string } | null>(null); //   
  const [activeAppsCount, setActiveAppsCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
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
      alert('Р’С‹ РґРѕСЃС‚РёРіР»Рё Р»РёРјРёС‚Р° РІ 3 Р°РєС‚РёРІРЅС‹Рµ Р·Р°СЏРІРєРё. Р”РѕР¶РґРёС‚РµСЃСЊ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ РёР»Рё РѕС‚РјРµРЅРёС‚Рµ СЃС‚Р°СЂСѓСЋ Р·Р°СЏРІРєСѓ.');
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
        content: `РќР° РІР°С€Рµ СЃРѕР±С‹С‚РёРµ В«${title}В» РѕС‚РїСЂР°РІР»РµРЅР° РЅРѕРІР°СЏ Р·Р°СЏРІРєР°!`,
        link: `/my-events`
      });
    } else {
      alert('РћС€РёР±РєР° РїСЂРё РїРѕРґР°С‡Рµ Р·Р°СЏРІРєРё');
      console.error(error);
    }
    setLoading(false);
  };

  const handleCancel = async () => {
    if (!confirm('Р’С‹ СѓРІРµСЂРµРЅС‹, С‡С‚Рѕ С…РѕС‚РёС‚Рµ РѕС‚РјРµРЅРёС‚СЊ Р·Р°СЏРІРєСѓ?')) return;
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
      alert('РќРµ СѓРґР°Р»РѕСЃСЊ РѕС‚РјРµРЅРёС‚СЊ Р·Р°СЏРІРєСѓ');
    } finally {
      setIsCanceling(false);
    }
  };

  let buttonText = 'РҐРѕС‡Сѓ СѓС‡Р°СЃС‚РІРѕРІР°С‚СЊ';
  let buttonDisabled = isFull || loading;
  let buttonClass = 'bg-brand-accent text-brand-accent-ink hover:bg-brand-text hover:text-brand-bg';

  const isOrganizer = user?.id === organizerId;
  const isLimitReached = activeAppsCount >= 3 && !application;

  if (isOrganizer) {
    buttonText = 'Р­С‚Рѕ РІР°С€Рµ СЃРѕР±С‹С‚РёРµ';
    buttonDisabled = true;
    buttonClass = 'bg-brand-surface text-brand-muted border-brand-muted cursor-default';
  } else if (isLimitReached) {
    buttonText = 'Р›РёРјРёС‚ Р·Р°СЏРІРѕРє (3)';
    buttonDisabled = true;
    buttonClass = 'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  } else if (application?.status === 'pending') {
    buttonText = 'Р—Р°СЏРІРєР° РѕС‚РїСЂР°РІР»РµРЅР°';
    buttonDisabled = true;
    buttonClass = 'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  } else if (application?.status === 'approved') {
    buttonText = 'Р’С‹ Р·Р°РїРёСЃР°РЅС‹ вњ“';
    buttonDisabled = true;
    buttonClass = 'bg-green-600 text-white border-green-800 cursor-default';
  } else if (isFull) {
    buttonText = 'РњРµСЃС‚ РЅРµС‚';
    buttonDisabled = true;
    buttonClass = 'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  }

  const d = new Date(dateTime);
  const dayNumber = d.getDate();
  const monthName = d.toLocaleDateString('ru-RU', { month: 'short' });
  const timeOnly = d.toLocaleTimeString('ru-RU', { hour: '2-digit', minute: '2-digit' });

  // Р—Р°РіР»СѓС€РєРё РґР»СЏ РёРєРѕРЅРѕРє (С‚С‹ Р·Р°РјРµРЅРёС€СЊ РїСѓС‚Рё РЅР° СЃРІРѕРё)
  // РќР°РїСЂРёРјРµСЂ: /icons/category-sport.svg
  const categoryIcon = '/icons/default.svg'; 
  const peopleIcon = '/icons/people.svg';

  return (
    <article className="bg-brand-surface border-2 border-brand-line rounded-brand-lg flex flex-col sm:flex-row overflow-hidden hover:opacity-95 transition-opacity w-full">
      
        {/* Р›Р•Р’РђРЇ РљРћР›РћРќРљРђ: Р”Р°С‚Р°, Р’СЂРµРјСЏ, РљР°С‚РµРіРѕСЂРёСЏ, РњРµСЃС‚Р° */}
      <div className="bg-brand-bg/50 p-4 sm:w-[150px] flex-shrink-0 flex flex-row sm:flex-col items-left border-b-2 sm:border-b-0 sm:border-r-2 border-brand-line gap-4 sm:gap-0 justify-between">
        
        {/* РљР°С‚РµРіРѕСЂРёСЏ (СЃРІРµСЂС…Сѓ) */}
        <div className="flex-shrink-0 w-full flex justify-center sm:justify-start">
          <span className="text-[10px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2 py-1 rounded border border-brand-cat/30 text-center block leading-tight">
            {category}
          </span>
        </div>

        {/* Р”Р°С‚Р° Рё РІСЂРµРјСЏ (РїРѕ С†РµРЅС‚СЂСѓ) */}
        <div className="flex flex-row sm:flex-col items-baseline sm:items-start justify-start w-full gap-2 sm:gap-0 sm:my-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-extrabold leading-none text-brand-text">{dayNumber}</span>
            <span className="text-[16px] font-bold text-brand-muted">{monthName}</span>
          </div>
          <span className="text-2xl font-extrabold text-brand-text sm:mt-1">{timeOnly}</span>
        </div>

        {/* РљРѕР»РёС‡РµСЃС‚РІРѕ РјРµСЃС‚ (СЃРЅРёР·Сѓ) */}
        <div className="flex items-center justify-center sm:justify-start gap-1 w-full text-[12px] font-extrabold text-brand-muted">
           рџ‘¤
          <span>{currentParticipants} / {maxParticipants}</span>
        </div>

      </div>

      {/* РџР РђР’РђРЇ РљРћР›РћРќРљРђ: РљРѕРЅС‚РµРЅС‚ */}
      <div className="p-5 md:p-6 flex-grow flex flex-col min-w-0">
        
        {/* Р—Р°РіРѕР»РѕРІРѕРє */}
        <Link href={`/event/${id}`} className="block hover:text-brand-accent transition-colors">
          <h2 className="text-xl md:text-2xl font-extrabold leading-tight">
            {title}
          </h2>
        </Link>

        {/* РњРµСЃС‚Рѕ */}
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-brand-muted mt-2 mb-3">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>
          <span className="truncate">
            {hideLocation && !isOrganizer && application?.status !== 'approved' 
              ? 'РњРµСЃС‚Рѕ СЃРєСЂС‹С‚Рѕ РѕСЂРіР°РЅРёР·Р°С‚РѕСЂРѕРј' 
              : location}
          </span>
        </div>

        {/* РћРїРёСЃР°РЅРёРµ */}
        <p className="text-[14px] text-brand-text/80 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

          {/* РћСЂРіР°РЅРёР·Р°С‚РѕСЂ */}
        <div className="flex items-center gap-2 text-sm mb-5 mt-auto">
          {/* РђРІР°С‚Р°СЂРєР° */}
          <div className={`w-8 h-8 rounded-full border border-brand-line flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 overflow-hidden
            ${organizerGender === 'male' ? 'bg-blue-100 text-blue-800' : 
              organizerGender === 'female' ? 'bg-pink-100 text-pink-800' : 
              'bg-gray-200 text-gray-700'}
          `}>
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
          
          {/* РРјСЏ Рё Р Р°РЅРі РІ РєРѕР»РѕРЅРєСѓ */}
          <div className="flex flex-col min-w-0">
            <Link href={`/@${organizerName}`} className="text-brand-text hover:text-brand-accent transition-colors font-bold truncate leading-tight">
              {organizerName}
            </Link> 
            <span className="text-brand-accent font-extrabold text-[10px] uppercase leading-tight mt-0.5">
              {organizerRank}
            </span>
          </div>
        </div>

        {/* РљРЅРѕРїРєРё */}
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
              Р§Р°С‚
            </Link>
          )}
          
          {application?.status === 'pending' && (
            <button 
              onClick={handleCancel}
              disabled={isCanceling}
              className="bg-red-100 text-red-700 font-extrabold text-[13px] uppercase px-3 py-2 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors disabled:opacity-50"
              title="РћС‚РјРµРЅРёС‚СЊ Р·Р°СЏРІРєСѓ"
            >
              вњ•
            </button>
          )}
        </div>

        {/* РљР°СЂС‚Р° (РµСЃР»Рё РµСЃС‚СЊ РєРѕРѕСЂРґРёРЅР°С‚С‹) */}
        {lat && lng && (
          <details className="mt-4 border-t border-dashed border-brand-line/30 pt-3 group">
            <summary className="list-none cursor-pointer text-brand-muted hover:text-brand-accent font-bold text-[12px] uppercase transition-colors flex items-center gap-1">
              <svg className="transition-transform duration-300 group-open:rotate-180" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              РџРѕРєР°Р·Р°С‚СЊ РЅР° РєР°СЂС‚Рµ
            </summary>
            <div className="details-content">
              <div className="details-inner">
                <div className="mt-3">
                  <Map 
                    lat={lat} 
                    lng={lng} 
                    title={title} 
                    hideExactLocation={hideLocation && !isOrganizer && application?.status !== 'approved'} 
                  />
                  
                  {hideLocation && !isOrganizer && application?.status !== 'approved' && (
                    <div className="mt-2 p-2 bg-brand-heat/10 border border-brand-heat rounded-brand text-brand-text font-bold text-[11px]">
                      РўРѕС‡РЅРѕРµ РјРµСЃС‚Рѕ РѕС‚РєСЂРѕРµС‚СЃСЏ РїРѕСЃР»Рµ РїРѕРґС‚РІРµСЂР¶РґРµРЅРёСЏ Р·Р°СЏРІРєРё.
                    </div>
                  )}
                </div>
              </div>
            </div>
          </details>
        )}
        
      </div>
    </article>
  );
}
```

## components/EventChat.tsx

```tsx
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
  profiles?: { username: string }; // РџРѕРґС‚СЏРіРёРІР°РµРј РЅРёРєРЅРµР№Рј
}

export default function EventChat({ eventId, currentUserId }: EventChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

   // 1. Р—Р°РіСЂСѓР¶Р°РµРј РёСЃС‚РѕСЂРёСЋ СЃРѕРѕР±С‰РµРЅРёР№
  useEffect(() => {
    const fetchMessages = async () => {
      // Р“СЂСѓР·РёРј С‚РѕР»СЊРєРѕ СЃРѕРѕР±С‰РµРЅРёСЏ
      const { data: msgs, error } = await supabase
        .from('messages')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё СЃРѕРѕР±С‰РµРЅРёР№:", error);
        setLoading(false);
        return;
      }

      if (msgs && msgs.length > 0) {
        // РЎРѕР±РёСЂР°РµРј СѓРЅРёРєР°Р»СЊРЅС‹Рµ ID Р°РІС‚РѕСЂРѕРІ
        const userIds = [...new Set(msgs.map(m => m.user_id))];
        
        // Р“СЂСѓР·РёРј РёС… РїСЂРѕС„РёР»Рё
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);

        // РћР±СЉРµРґРёРЅСЏРµРј РґР°РЅРЅС‹Рµ
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

  // 2. РџРѕРґРїРёСЃС‹РІР°РµРјСЃСЏ РЅР° РЅРѕРІС‹Рµ СЃРѕРѕР±С‰РµРЅРёСЏ (Realtime)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `event_id=eq.${eventId}` },
        async (payload) => {
          // РџРѕР»СѓС‡Р°РµРј РЅРёРєРЅРµР№Рј РґР»СЏ РЅРѕРІРѕРіРѕ СЃРѕРѕР±С‰РµРЅРёСЏ
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

  // РђРІС‚РѕСЃРєСЂРѕР»Р» РІРЅРёР· РїСЂРё РЅРѕРІРѕРј СЃРѕРѕР±С‰РµРЅРёРё
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage(''); // РћС‡РёС‰Р°РµРј РїРѕР»Рµ СЃСЂР°Р·Сѓ

    const { error } = await supabase
      .from('messages')
      .insert([{ event_id: eventId, user_id: currentUserId, content }]);

    if (error) {
      alert('РћС€РёР±РєР° РѕС‚РїСЂР°РІРєРё СЃРѕРѕР±С‰РµРЅРёСЏ');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center font-bold text-brand-muted">Р—Р°РіСЂСѓР·РєР° С‡Р°С‚Р°...</div>;
  }

  return (
    <div className="flex flex-col bg-brand-surface border-2 border-brand-line rounded-[16px] overflow-hidden h-[450px]">
      
      {/* Р›РµРЅС‚Р° СЃРѕРѕР±С‰РµРЅРёР№ */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-brand-bg/50">
        {messages.length === 0 ? (
          <div className="my-auto text-center">
            <span className="text-4xl mb-2 block">рџ‘‹</span>
            <p className="text-brand-muted font-bold">Р—РґРµСЃСЊ РїРѕРєР° РЅРµС‚ СЃРѕРѕР±С‰РµРЅРёР№.<br/>РќР°РїРёС€РёС‚Рµ РїРµСЂРІС‹Рј!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.user_id === currentUserId;
            const authorName = msg.profiles?.username || 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ';
            const avatarLetter = authorName.charAt(0).toUpperCase();

            return (
              <div key={msg.id} className={`flex gap-2 max-w-[85%] ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}>
                
                {/* РђРІР°С‚Р°СЂРєР° */}
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-line/10 border border-brand-line/20 flex items-center justify-center text-xs font-extrabold text-brand-muted mt-auto mb-1">
                  {avatarLetter}
                </div>

                {/* Р‘Р»РѕРє СЃ СЃРѕРѕР±С‰РµРЅРёРµРј */}
                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  {/* РќРёРєРЅРµР№Рј (СЃРєСЂС‹РІР°РµРј РґР»СЏ СЃРІРѕРёС…, С‡С‚РѕР±С‹ РЅРµ Р·Р°РіСЂРѕРјРѕР¶РґР°С‚СЊ) */}
                  {!isMine && (
                    <span className="text-[11px] font-bold text-brand-muted mb-1 ml-1">
                      @{authorName}
                    </span>
                  )}

                  {/* РўРµРєСЃС‚ СЃРѕРѕР±С‰РµРЅРёСЏ */}
                  <div 
                    className={`px-4 py-2 text-[14px] font-medium leading-relaxed border rounded-2xl ${
                      isMine 
                        ? 'bg-orange-100 text-brand-text border-orange-200 rounded-br-sm' // РЎРІРѕРё: СЃР»Р°Р±С‹Р№ РѕСЂР°РЅР¶РµРІС‹Р№
                        : 'bg-blue-50 text-brand-text border-blue-100 rounded-bl-sm'     // Р§СѓР¶РёРµ: СЃР»Р°Р±С‹Р№ РіРѕР»СѓР±РѕР№
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

      {/* РџРѕР»Рµ РІРІРѕРґР° */}
      <form onSubmit={handleSendMessage} className="p-3 bg-brand-surface border-t-2 border-brand-line flex gap-2 items-end">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="РќР°РїРёСЃР°С‚СЊ СЃРѕРѕР±С‰РµРЅРёРµ..."
          className="flex-1 p-3 bg-brand-bg border-2 border-brand-line rounded-full outline-none focus:border-brand-accent transition-colors text-sm"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-brand-text text-brand-bg rounded-full hover:bg-brand-accent transition-colors disabled:opacity-50"
        >
          {/* РРєРѕРЅРєР° СЃР°РјРѕР»РµС‚РёРєР° */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>

    </div>
  );
}
```

## components/EventList.tsx

```tsx
import { supabase } from '@/lib/supabase';
import EventCard from './EventCard';



export default async function EventList() {
  const { data: events, error } = await supabase
    .from('events')
    .select(`
      *,
      profiles!events_organizer_profile_fkey (avatar_url, gender)
    `)
    .order('date_time', { ascending: true });

  if (error) {
    console.error("РћРЁРР‘РљРђ Р‘РђР—Р«:", error); // Р’С‹РІРµРґРµРј РІ РєРѕРЅСЃРѕР»СЊ РЅР° РІСЃСЏРєРёР№ СЃР»СѓС‡Р°Р№
    return (
      <div className="text-red-500 font-bold p-4 bg-red-100 border border-red-500 rounded">
        РћС€РёР±РєР° Р·Р°РіСЂСѓР·РєРё: {error.message} (РљРѕРґ: {error.code})
      </div>
    );
  }

  if (!events || events.length === 0) {
    return (
      <div className="text-center py-10 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
        РџРѕРєР° РЅРµС‚ СЃРѕР±С‹С‚РёР№. РЎС‚Р°РЅСЊС‚Рµ РїРµСЂРІС‹Рј РѕСЂРіР°РЅРёР·Р°С‚РѕСЂРѕРј!
      </div>
    );
  }

  return (
     <div className="flex flex-col gap-6 items-center w-full">
        {events.map((event) => (
          <EventCard 
            key={event.id}
            id={event.id}
            organizerId={event.organizer_id}
            category={event.category}
            dateTime={event.date_time}
            title={event.title}
            description={event.description}
            organizerName={event.organizer_name}
            organizerRank={event.organizer_rank}
            isFull={event.is_full}
            location={event.location}
            maxParticipants={event.max_participants}
            currentParticipants={0} // РџРѕРєР° СЃС‚Р°РІРёРј 0 (РёР»Рё РјРѕР¶РЅРѕ РїРѕСЃС‡РёС‚Р°С‚СЊ РЅР° Р±СЌРєРµРЅРґРµ)
            lat={event.lat}
            lng={event.lng}
            hideLocation={event.hide_location}
            organizerAvatar={event.profiles?.avatar_url}
            organizerGender={event.profiles?.gender}
          />
        ))}
    </div>
  );
}
```

## components/Header.tsx

```tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { useRouter, usePathname } from 'next/navigation';
import { User } from '@supabase/supabase-js';
import NotificationsBell from './NotificationsBell';

// Р’СЃРїРѕРјРѕРіР°С‚РµР»СЊРЅС‹Р№ РєРѕРјРїРѕРЅРµРЅС‚ РґР»СЏ РїСѓРЅРєС‚РѕРІ РЅР°РІРёРіР°С†РёРё РџРљ
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
    // Р—Р°РєСЂС‹РІР°РµРј РјРµРЅСЋ РїСЂРё СЃРјРµРЅРµ СЃС‚СЂР°РЅРёС†С‹ (СЃ Р·Р°РґРµСЂР¶РєРѕР№, С‡С‚РѕР±С‹ РёР·Р±РµР¶Р°С‚СЊ СЃРёРЅС…СЂРѕРЅРЅРѕРіРѕ setState)
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
          setUsername(data?.username || user.email?.split('@')[0] || 'РџРѕР»СЊР·РѕРІР°С‚РµР»СЊ');
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
            РќР°РјС‹Р»РёРјСЃСЏ<span className="text-brand-accent">.</span>
          </Link>
          
          {/* РќР°РІРёРіР°С†РёСЏ РґР»СЏ РџРљ */}
          <nav className="hidden md:flex gap-6">
            <div className="group flex items-center">
              <NavItem href="/" label="Р›РµРЅС‚Р°" pathname={pathname} />
            </div>
            <div className="group flex items-center">
              <NavItem href="/my-events" label="РњРѕРё СЃРѕР±С‹С‚РёСЏ" pathname={pathname} />
            </div>
            <div className="group flex items-center">
              <NavItem href="/archive" label="РђСЂС…РёРІ" pathname={pathname} />
            </div>
          </nav>

          <div className="flex items-center gap-2 md:gap-3 z-50">
            <button className="w-10 h-10 hidden md:flex items-center justify-center border-2 border-brand-line rounded-brand bg-brand-surface">рџЊ™</button>
            
            {/* РљРЅРѕРїРєРё РґР»СЏ РџРљ */}
            <div className="hidden md:flex items-center gap-3">
              {user ? (
                <>
                 <NotificationsBell />
                  <Link href={`/@${username}`} className="text-sm font-bold hover:text-brand-accent transition-colors">
                    @{username}
                  </Link>
                  <button onClick={handleLogout} className="bg-brand-surface text-brand-text font-extrabold text-sm px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-accent hover:text-white transition-colors">
                    Р’С‹Р№С‚Рё
                  </button>
                </>
              ) : (
                <>
                  <Link href="/login" className="bg-brand-surface text-brand-text font-extrabold text-sm px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors">
                    Р’РѕР№С‚Рё
                  </Link>
                  <Link href="/login?mode=register" className="bg-brand-accent text-brand-accent-ink font-extrabold text-sm px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors">
                    Р РµРіРёСЃС‚СЂР°С†РёСЏ
                  </Link>
                </>
              )}
            </div>

            {/* РљРѕР»РѕРєРѕР»СЊС‡РёРє РґР»СЏ РјРѕР±РёР»РѕРє */}
            {user && (
              <div className="md:hidden">
                <NotificationsBell />
              </div>
            )}

            {/* РљРЅРѕРїРєР° Р“Р°РјР±СѓСЂРіРµСЂ РґР»СЏ РјРѕР±РёР»РѕРє */}
            <button 
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden w-10 h-10 flex flex-col items-center justify-center gap-1.5 border-2 border-brand-line rounded-brand bg-brand-surface"
              aria-label="РњРµРЅСЋ"
            >
              <span className={`block w-5 h-0.5 bg-brand-text transition-transform ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-brand-text transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
              <span className={`block w-5 h-0.5 bg-brand-text transition-transform ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
            </button>
          </div>
        </div>
      </header>

      {/* РњРѕР±РёР»СЊРЅРѕРµ РјРµРЅСЋ (РЁС‚РѕСЂРєР°) */}
      <div 
        className={`fixed inset-0 bg-brand-bg z-40 flex flex-col pt-24 px-6 transition-transform duration-300 ease-in-out md:hidden ${
          isMobileMenuOpen ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        {/* РљР»СЋС‡ key РЅСѓР¶РµРЅ, С‡С‚РѕР±С‹ Р°РЅРёРјР°С†РёСЏ РїРµСЂРµР·Р°РїСѓСЃРєР°Р»Р°СЃСЊ РїСЂРё РєР°Р¶РґРѕРј РѕС‚РєСЂС‹С‚РёРё */}
        {isMobileMenuOpen && (
          <nav className="flex flex-col gap-2 text-2xl font-extrabold">
            <Link href="/" className={`animate-menu-item delay-1 border-b-2 border-brand-line py-4 flex items-center gap-2 ${pathname === '/' ? 'text-brand-accent' : ''}`}>
              {pathname === '/' && <span className="text-brand-accent">[</span>}
              Р›РµРЅС‚Р°
              {pathname === '/' && <span className="text-brand-accent">]</span>}
            </Link>
            
            <Link href="/my-events" className={`animate-menu-item delay-2 border-b-2 border-brand-line py-4 flex items-center gap-2 ${pathname === '/my-events' ? 'text-brand-accent' : ''}`}>
              {pathname === '/my-events' && <span className="text-brand-accent">[</span>}
              РњРѕРё СЃРѕР±С‹С‚РёСЏ
              {pathname === '/my-events' && <span className="text-brand-accent">]</span>}
            </Link>
            
            <Link href="/archive" className={`animate-menu-item delay-3 border-b-2 border-brand-line py-4 flex items-center gap-2 ${pathname === '/archive' ? 'text-brand-accent' : ''}`}>
              {pathname === '/archive' && <span className="text-brand-accent">[</span>}
              РђСЂС…РёРІ
              {pathname === '/archive' && <span className="text-brand-accent">]</span>}
            </Link>
          </nav>
        )}

        <div className="mt-auto mb-10 flex flex-col gap-4">
          {user ? (
            <>
              <Link href={`/@${username}`} className="animate-menu-item delay-4 text-xl font-bold text-center border-2 border-brand-line p-3 rounded-brand">
                РњРѕР№ РїСЂРѕС„РёР»СЊ (@{username})
              </Link>
              <button onClick={handleLogout} className="animate-menu-item delay-5 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand">
                Р’С‹Р№С‚Рё
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="animate-menu-item delay-4 bg-brand-surface text-brand-text font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand text-center">
                Р’РѕР№С‚Рё
              </Link>
              <Link href="/login?mode=register" className="animate-menu-item delay-5 bg-brand-accent text-brand-accent-ink font-extrabold text-lg p-3 border-2 border-brand-line rounded-brand text-center">
                Р РµРіРёСЃС‚СЂР°С†РёСЏ
              </Link>
            </>
          )}
        </div>
      </div>
    </>
  );
}
```

## components/MobileFilters.tsx

```tsx
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
        Р¤РёР»СЊС‚СЂС‹
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-brand-bg border-t-2 border-brand-line rounded-t-[24px] p-6 animate-slide-up pb-10 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-2 border-brand-line pb-4">
              <h3 className="text-xl font-extrabold uppercase">Р¤РёР»СЊС‚СЂС‹</h3>
              <button onClick={() => setIsOpen(false)} className="text-2xl font-bold px-2">вњ•</button>
            </div>
            
            {/* РџСЂРѕСЃС‚Рѕ СЂРµРЅРґРµСЂРёРј Sidebar РєР°Рє РµСЃС‚СЊ */}
            <Sidebar />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand sticky bottom-0"
            >
              РџСЂРёРјРµРЅРёС‚СЊ
            </button>
          </div>
        </div>
      )}
    </>
  );
}
```

## components/NotificationsBell.tsx

```tsx
'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // РСЃРїРѕР»СЊР·СѓРµРј useRef, С‡С‚РѕР±С‹ СЃРѕС…СЂР°РЅРёС‚СЊ РєР°РЅР°Р» РјРµР¶РґСѓ СЂРµРЅРґРµСЂР°РјРё
  const channelRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true; // Р¤Р»Р°Рі, С‡С‚РѕР±С‹ РЅРµ РѕР±РЅРѕРІР»СЏС‚СЊ СЃРѕСЃС‚РѕСЏРЅРёРµ РїРѕСЃР»Рµ СЂР°Р·РјРѕРЅС‚РёСЂРѕРІР°РЅРёСЏ

    const setupNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      // 1. Р—Р°РіСЂСѓР¶Р°РµРј РёСЃС‚РѕСЂРёСЋ
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

      // 2. РџРѕРґРїРёСЃС‹РІР°РµРјСЃСЏ РЅР° Realtime (С‚РѕР»СЊРєРѕ РѕРґРёРЅ СЂР°Р·)
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
                // РџСЂРѕРІРµСЂСЏРµРј, РЅРµС‚ Р»Рё СѓР¶Рµ СЌС‚РѕРіРѕ СѓРІРµРґРѕРјР»РµРЅРёСЏ РІ СЃРїРёСЃРєРµ
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

  // Р—Р°РєСЂС‹С‚РёРµ РїРѕ РєР»РёРєСѓ РІРЅРµ РјРµРЅСЋ
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
        рџ””
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-brand-surface">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 md:w-80 bg-brand-surface border-2 border-brand-line rounded-brand shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b-2 border-brand-line font-extrabold uppercase bg-brand-bg sticky top-0">
            РЈРІРµРґРѕРјР»РµРЅРёСЏ
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-brand-muted font-bold text-sm">
              РќРµС‚ СѓРІРµРґРѕРјР»РµРЅРёР№
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
```

## components/PageTransition.tsx

```tsx
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
        className="w-full" // <--- Р’РѕС‚ СЌС‚Рѕ РІР°Р¶РЅРѕ, С‡С‚РѕР±С‹ Р±Р»РѕРє Р·Р°РЅРёРјР°Р» РІСЃСЋ С€РёСЂРёРЅСѓ
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
```

## components/Sidebar.tsx

```tsx
import React from 'react';

export default function Sidebar() {
  return (
    <aside className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5">
      <h3 className="text-lg font-extrabold uppercase border-b-2 border-brand-line pb-2.5 mb-4">
        Р¤РёР»СЊС‚СЂС‹
      </h3>
      
      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">РљР°С‚РµРіРѕСЂРёРё</span>
        <div className="flex flex-wrap gap-2">
          <button className="bg-brand-cat text-white px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase transition-colors">Р’СЃРµ</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">РџСЂРѕРіСѓР»РєРё</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">РЎРїРѕСЂС‚ Рё РёРіСЂС‹</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">РљСѓР»СЊС‚СѓСЂР°</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Р•РґР° Рё РЅР°РїРёС‚РєРё</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">РћР±СѓС‡РµРЅРёРµ</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">РџРѕРµР·РґРєРё</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Р’РѕР»РѕРЅС‚С‘СЂСЃС‚РІРѕ</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Р—РґРµСЃСЊ Рё СЃРµР№С‡Р°СЃ</button>
        </div>
      </div>

      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Р’СЂРµРјСЏ</span>
        <div className="flex flex-wrap gap-2">
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">РЎРµРіРѕРґРЅСЏ</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Р’С‹С…РѕРґРЅС‹Рµ</button>
        </div>
      </div>
    </aside>
  );
}
```

## eslint.config.mjs

```js
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

```

## lib/supabase.ts

```ts
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

## lib/supabase-server.ts

```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // <--- РљР»СЋС‡ РґРѕР»Р¶РµРЅ Р±С‹С‚СЊ Р·РґРµСЃСЊ
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
            // РРіРЅРѕСЂРёСЂСѓРµРј РѕС€РёР±РєРё
          }
        },
      },
    }
  )
}
```

## next.config.ts

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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
```

## package.json

```json
{
  "name": "namylimsya-app",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@supabase/ssr": "^0.12.7",
    "@supabase/supabase-js": "^2.118.0",
    "leaflet": "^1.9.4",
    "motion": "^14.3.0",
    "next": "16.4.2",
    "react": "19.3.0",
    "react-dom": "19.3.0",
    "react-leaflet": "^5.0.0"
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
    "typescript": "^5"
  }
}

```

## proxy.ts

```ts
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
```

## README.md

```md
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
```

## tsconfig.json

```json
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

```

