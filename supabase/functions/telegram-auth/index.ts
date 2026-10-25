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
        redirect_uri: 'https://namylimsya.vercel.app/login' // <-- ВАЖНО: указываем /login, так как токен шлется сюда
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