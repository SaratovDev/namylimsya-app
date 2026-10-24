import { createClient } from '@/lib/supabase-server';
import { requireAdmin } from '@/lib/admin-utils';
import TicketActions from '@/components/admin/TicketActions';

export default async function AdminSupportPage() {
  await requireAdmin();
  const supabase = await createClient();

  const { data: tickets } = await supabase
    .from('support_tickets')
    .select('*')
    .order('created_at', { ascending: false });

  return (
    <div className="max-w-5xl">
      <div className="flex items-end justify-between mb-8 border-b-2 border-brand-line pb-4">
        <div>
          <h1 className="text-3xl font-extrabold uppercase">Обращения</h1>
          <p className="text-sm font-bold text-brand-muted mt-1">Сообщения от пользователей</p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {tickets?.length === 0 && <p className="text-brand-muted font-bold">Обращений пока нет.</p>}
        
        {tickets?.map((t) => (
          <div key={t.id} className={`bg-brand-surface border-2 rounded-brand-lg p-5 flex flex-col gap-3 ${t.status === 'new' ? 'border-brand-accent' : 'border-brand-line opacity-70'}`}>
            <div className="flex justify-between items-start">
              <div>
                <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-extrabold border mb-2 ${t.status === 'new' ? 'bg-brand-accent text-white border-brand-accent' : 'bg-gray-200 text-gray-600 border-gray-300'}`}>
                  {t.status === 'new' ? 'Новое' : 'Решено'}
                </span>
                <h3 className="text-lg font-extrabold">{t.subject}</h3>
                <p className="text-sm font-bold text-brand-muted mt-1">
                  От: <a href={`mailto:${t.email}`} className="hover:text-brand-accent underline">{t.email}</a>
                  <span className="mx-2">•</span>
                  {new Date(t.created_at).toLocaleString('ru-RU')}
                </p>
              </div>
              <TicketActions ticketId={t.id} currentStatus={t.status} userEmail={t.email} />
            </div>
            
            <div className="bg-brand-bg p-4 rounded border border-brand-line text-sm font-medium whitespace-pre-wrap">
              {t.message}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}