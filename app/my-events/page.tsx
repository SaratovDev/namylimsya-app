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