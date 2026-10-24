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