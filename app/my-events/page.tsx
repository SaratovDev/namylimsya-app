import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import ApplicationActions from '@/components/ApplicationActions';

export default async function MyEventsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Получаем события
  const { data: events } = await supabase
    .from('events')
    .select('*')
    .eq('organizer_id', user.id)
    .order('date_time', { ascending: true });

  // Получаем заявки
  const { data: applications } = await supabase
    .from('applications')
    .select('*')
    .in('event_id', events?.map(e => e.id) || []);

  // Получаем профили для заявок
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

  // Получаем МОИ заявки
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
            const eventApps = applicationsWithProfiles?.filter(app => app.event_id === event.id) || [];
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
                        {pendingApps.map((app) => (
                          <li key={app.id} className="flex items-center justify-between bg-brand-bg p-2 rounded-brand border border-brand-line">
                            <span className="font-bold text-sm truncate mr-2">@{app.profile?.username || 'Пользователь'}</span>
                            <ApplicationActions applicationId={app.id} />
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div>
                    <h3 className="font-extrabold uppercase mb-3 text-green-600 text-sm">Подтверждены ({approvedApps.length})</h3>
                    {approvedApps.length === 0 ? (
                      <p className="text-sm text-brand-muted font-bold">Пока никого нет.</p>
                    ) : (
                      <ul className="flex flex-col gap-2">
                        {approvedApps.map((app) => (
                          <li key={app.id} className="bg-brand-bg p-2 rounded-brand border border-brand-line text-sm font-bold truncate">
                            @{app.profile?.username || 'Пользователь'}
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

      {/* === БЛОК: Я УЧАСТНИК === */}
      <div className="mt-16">
        <h2 className="text-2xl font-extrabold uppercase mb-6 border-b-2 border-brand-line pb-4">
          События, куда я записался
        </h2>

        {(!myApplications || myApplications.length === 0) ? (
          <div className="text-center py-8 border-2 border-dashed border-brand-line rounded-brand-lg text-brand-muted font-bold">
            Вы пока не подавали заявки на события. Найдите что-нибудь интересное в ленте!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {myApplications.map((app) => {
              const event = app.events; 
              let statusText = 'Ожидает подтверждения';
              let statusColor = 'text-brand-heat border-brand-heat bg-brand-heat/10';
              
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