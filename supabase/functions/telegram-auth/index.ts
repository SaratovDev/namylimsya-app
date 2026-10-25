import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { crypto } from "https://deno.land/std@0.168.0/crypto/mod.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const BOT_TOKEN = Deno.env.get('TELEGRAM_BOT_TOKEN')!
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { hash, ...data } = await req.json();

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
      return new Response(JSON.stringify({ error: 'Invalid signature' }), { 
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    
    const { data: existingProfile } = await supabaseAdmin
      .from('profiles')
      .select('id')
      .eq('telegram_id', data.id)
      .maybeSingle();

    let userId;

    if (existingProfile) {
      userId = existingProfile.id;
    } else {
      const email = `tg_${data.id}@namylimsya.local`;
      const baseUsername = data.username || data.first_name || `user_${data.id}`;
      const safeUsername = baseUsername.replace(/[^a-zA-Zа-яА-Я0-9_]/g, '');

      const { data: authUser, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        email_confirm: true,
        user_metadata: { username: safeUsername, telegram_id: data.id }
      });

      if (authError) throw authError;
      userId = authUser.user.id;

      await supabaseAdmin.from('profiles').update({ telegram_id: data.id }).eq('id', userId);
    }

    // Генерируем сессию (magic link)
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'magiclink',
      email: `tg_${data.id}@namylimsya.local`,
    });

    if (linkError) throw linkError;

    return new Response(JSON.stringify({ 
      token: linkData.properties.hashed_token,
      user_id: userId
    }), { 
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });

  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), { 
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" } 
    });
  }
})