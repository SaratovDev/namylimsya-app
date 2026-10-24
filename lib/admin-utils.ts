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