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