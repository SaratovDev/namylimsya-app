import { createClient } from '@/lib/supabase-server';
import Link from 'next/link';

export default async function AdminDashboard({
  searchParams,
}: {
  searchParams: Promise<{ period?: string }>;
}) {
  const supabase = await createClient();
  
  const params = await searchParams;
  const period = params.period || '7d';
  
  let dateLimit = new Date();
  if (period === 'today') dateLimit.setHours(0, 0, 0, 0);
  else if (period === '7d') dateLimit.setDate(dateLimit.getDate() - 7);
  else if (period === '30d') dateLimit.setDate(dateLimit.getDate() - 30);
  else if (period === 'all') dateLimit = new Date(0);

  const limitIso = dateLimit.toISOString();

  // --- 1. Базовые метрики за период ---
  const [
    { count: usersCount },
    { count: eventsCount },
    { count: appsCount },
    { data: topCategories },
    { data: topOrganizers }
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', limitIso),
    supabase.from('events').select('*', { count: 'exact', head: true }).gte('created_at', limitIso),
    supabase.from('applications').select('*', { count: 'exact', head: true }).gte('created_at', limitIso),
    supabase.from('events').select('category').gte('created_at', limitIso),
    supabase.from('events').select('organizer_name').gte('created_at', limitIso),
  ]);

  // --- 2. Воронка (Всё время, чтобы видеть реальную конверсию) ---
  const [
    { count: totalApps },
    { count: approvedApps },
    { count: pendingApps },
    { count: rejectedApps },
    { count: cancelledEvents }
  ] = await Promise.all([
    supabase.from('applications').select('*', { count: 'exact', head: true }),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'approved'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('applications').select('*', { count: 'exact', head: true }).eq('status', 'rejected'),
    supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
  ]);

  // --- 3. График активности (за последние 14 дней) ---
  const fourteenDaysAgo = new Date();
  fourteenDaysAgo.setDate(fourteenDaysAgo.getDate() - 14);
  fourteenDaysAgo.setHours(0, 0, 0, 0);

  const { data: chartEvents } = await supabase
    .from('events')
    .select('created_at')
    .gte('created_at', fourteenDaysAgo.toISOString());

  // Группируем по дням
  const chartData = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (13 - i));
    const dateString = d.toISOString().split('T')[0];
    const count = chartEvents?.filter(e => e.created_at.startsWith(dateString)).length || 0;
    return { dateString, displayDate: d.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }), count };
  });
  const maxChartCount = Math.max(...chartData.map(d => d.count), 1);

  // Обработка топов
  const catMap: Record<string, number> = {};
  topCategories?.forEach(e => { catMap[e.category] = (catMap[e.category] || 0) + 1; });
  const sortedCategories = Object.entries(catMap).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const orgMap: Record<string, number> = {};
  topOrganizers?.forEach(e => { if(e.organizer_name) orgMap[e.organizer_name] = (orgMap[e.organizer_name] || 0) + 1; });
  const sortedOrganizers = Object.entries(orgMap).sort((a, b) => b[1] - a[1]).slice(0, 4);

  const approveRate = totalApps ? Math.round((approvedApps! / totalApps) * 100) : 0;

  return (
    <div className="max-w-6xl">
      
      {/* Хедер с фильтрами */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 border-b-2 border-brand-line pb-4 gap-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase">Обзор платформы</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">Статистика и аналитика</p>
        </div>
        <div className="flex bg-brand-surface border-2 border-brand-line rounded-brand p-1">
          <Link href="/admin?period=today" className={`px-3 py-1.5 text-xs font-bold rounded ${period === 'today' ? 'bg-brand-accent text-white' : 'hover:bg-brand-bg'}`}>Сегодня</Link>
          <Link href="/admin?period=7d" className={`px-3 py-1.5 text-xs font-bold rounded ${period === '7d' ? 'bg-brand-accent text-white' : 'hover:bg-brand-bg'}`}>7 дней</Link>
          <Link href="/admin?period=30d" className={`px-3 py-1.5 text-xs font-bold rounded ${period === '30d' ? 'bg-brand-accent text-white' : 'hover:bg-brand-bg'}`}>30 дней</Link>
          <Link href="/admin?period=all" className={`px-3 py-1.5 text-xs font-bold rounded ${period === 'all' ? 'bg-brand-accent text-white' : 'hover:bg-brand-bg'}`}>Всё время</Link>
        </div>
      </div>

      {/* Блок: За выбранный период */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 flex flex-col justify-between">
          <div className="text-xs font-extrabold uppercase text-brand-muted mb-4">Регистрации</div>
          <div className="text-4xl font-extrabold">{usersCount || 0}</div>
        </div>
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 flex flex-col justify-between">
          <div className="text-xs font-extrabold uppercase text-brand-muted mb-4">Создано событий</div>
          <div className="text-4xl font-extrabold">{eventsCount || 0}</div>
        </div>
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 flex flex-col justify-between">
          <div className="text-xs font-extrabold uppercase text-brand-muted mb-4">Подано заявок</div>
          <div className="text-4xl font-extrabold">{appsCount || 0}</div>
        </div>
      </div>

      {/* График активности */}
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 mb-6">
        <h2 className="text-xs font-extrabold uppercase text-brand-muted mb-6">Активность (создано событий за 14 дней)</h2>
        <div className="flex items-end justify-between h-32 gap-1 sm:gap-2">
          {chartData.map((d, i) => (
            <div key={i} className="flex flex-col items-center flex-1 group relative">
              <div className="absolute -top-6 bg-brand-bg border border-brand-line text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {d.displayDate}: {d.count}
              </div>
              <div 
                className={`w-full rounded-t-sm transition-all ${d.count > 0 ? 'bg-brand-accent hover:bg-brand-accent-ink' : 'bg-brand-bg'}`}
                style={{ height: `${Math.max((d.count / maxChartCount) * 100, 4)}%` }}
              ></div>
              <span className="text-[9px] font-bold text-brand-muted mt-2 rotate-[-45deg] sm:rotate-0">{d.displayDate.split(' ')[0]}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Воронка заявок */}
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 mb-6">
        <h2 className="text-xs font-extrabold uppercase text-brand-muted mb-4">Воронка заявок (За всё время)</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="bg-brand-bg p-4 rounded border border-brand-line">
            <div className="text-2xl font-extrabold">{totalApps || 0}</div>
            <div className="text-[10px] font-bold uppercase text-brand-muted mt-1">Всего подано</div>
          </div>
          <div className="bg-brand-bg p-4 rounded border border-brand-line">
            <div className="text-2xl font-extrabold text-green-600">{approvedApps || 0}</div>
            <div className="text-[10px] font-bold uppercase text-brand-muted mt-1">Подтверждено ({approveRate}%)</div>
          </div>
          <div className="bg-brand-bg p-4 rounded border border-brand-line">
            <div className="text-2xl font-extrabold text-brand-accent">{pendingApps || 0}</div>
            <div className="text-[10px] font-bold uppercase text-brand-muted mt-1">В ожидании</div>
          </div>
          <div className="bg-brand-bg p-4 rounded border border-brand-line">
            <div className="text-2xl font-extrabold text-red-600">{rejectedApps || 0}</div>
            <div className="text-[10px] font-bold uppercase text-brand-muted mt-1">Отклонено / Отменено</div>
          </div>
        </div>
      </div>

      {/* Топы */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
          <h2 className="text-xs font-extrabold uppercase text-brand-muted mb-4">Популярные категории</h2>
          <div className="flex flex-col gap-4">
            {sortedCategories.length === 0 && <p className="text-sm font-bold text-brand-muted">Нет данных</p>}
            {sortedCategories.map(([cat, count]) => {
              const percent = Math.round((count / sortedCategories[0][1]) * 100);
              return (
                <div key={cat}>
                  <div className="flex justify-between text-xs font-bold mb-1"><span>{cat}</span><span>{count}</span></div>
                  <div className="w-full bg-brand-bg rounded-full h-1.5"><div className="bg-brand-cat h-1.5 rounded-full" style={{ width: `${percent}%` }}></div></div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6">
          <h2 className="text-xs font-extrabold uppercase text-brand-muted mb-4">Активные организаторы</h2>
          <div className="flex flex-col gap-4">
            {sortedOrganizers.length === 0 && <p className="text-sm font-bold text-brand-muted">Нет данных</p>}
            {sortedOrganizers.map(([org, count]) => {
              const percent = Math.round((count / sortedOrganizers[0][1]) * 100);
              return (
                <div key={org}>
                  <div className="flex justify-between text-xs font-bold mb-1"><span>@{org}</span><span>{count} соб.</span></div>
                  <div className="w-full bg-brand-bg rounded-full h-1.5"><div className="bg-brand-accent h-1.5 rounded-full" style={{ width: `${percent}%` }}></div></div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

    </div>
  );
}