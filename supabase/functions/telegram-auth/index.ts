import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  // Обработка CORS (чтобы запросы с браузера не блокировались)
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*' } })
  }

  try {
    const { hash, ...data } = await req.json();

    // 1. Проверяем подпись Telegram
    const dataCheckString = Object.keys(data)
      .sort()
      .map(key => `${key}=${data[key]}`)
      .join('\n');

    const secretKey = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(BOT_TOKEN));
    const hmacKey = await crypto.subtle.importKey('raw', secretKey, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const signature = await crypto.subtle.sign('HMAC', hmacKey, new TextEncoder().encode(dataCheckString));
    
    const hexSignature = Array.from(new Uint8Array(signature))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    if (hexSignature !== hash) {
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { status: 401 });
    }

    // 2. Создаем или находим пользователя
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    // Ищем профиль по telegram_id
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id, username')
      .eq('telegram_id', data.id)
      .maybeSingle();

    let userId;
    let username;

    if (existingProfile) {
      userId = existingProfile.id;
      username = existingProfile.username;
    } else {
      // Если нет — создаем нового пользователя в Auth
      const email = `tg_${data.id}@namylimsya.local`;
      
      // Формируем никнейм (используем username из TG или first_name)
      const baseUsername = data.username || data.first_name || `user_${data.id}`;
      // Убираем лишние символы (оставляем буквы, цифры и _)
      const safeUsername = baseUsername.replace(/[^a-zA-Zа-яА-Я0-9_]/g, '');

      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { 
          username: safeUsername,
          telegram_id: data.id
        }
      });

      if (authError) throw authError;
      userId = authUser.user.id;
      username = safeUsername;

      // Обновляем профиль (он создастся триггером, но нам нужно добавить telegram_id)
      await supabaseAdmin.from('profiles').update({ telegram_id: data.id }).eq('id', userId);
    }

    // 3. Отправляем уведомление в Telegram
    try {
      const tgMessage = `
👋 Привет, ${data.first_name}!

Вы успешно авторизовались на платформе *«Намылимся»*.

Теперь вам доступны:
• Создание и поиск событий
• Общение в чатах
• Получение наград

Увидимся на встречах! 🚀
      `;

      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: data.id,
          text: tgMessage,
          parse_mode: 'Markdown',
        }),
      });
    } catch (tgError) {
      console.error('Ошибка отправки сообщения в Telegram:', tgError);
      // Мы не прерываем авторизацию, если сообщение не отправилось
    }

    // 4. Генерируем сессию (magic link)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: `tg_${data.id}@namylimsya.local`,
    });

    if (linkError) throw linkError;

    // Возвращаем токены
    return new Response(JSON.stringify({ 
      token: linkData.properties.hashed_token,
      user_id: userId
    }), { 
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      } 
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { 
      status: 500,
      headers: { 
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      } 
    });
  }
})