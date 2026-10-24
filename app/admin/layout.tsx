import { requireAdmin } from '@/lib/admin-utils';
import Link from 'next/link';
import { ReactNode } from 'react';
import { createClient } from '@/lib/supabase-server';

export default async function AdminLayout({ children }: { children: ReactNode }) {
  // Защита: если мы здесь, значит юзер — админ или модератор
  const { role } = await requireAdmin();

  // Считаем новые тикеты
  const supabase = await createClient();
  const { count: newTickets } = await supabase
    .from('support_tickets')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'new');

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col md:flex-row">
      
      {/* Боковое меню */}
      <aside className="w-full md:w-64 bg-brand-surface border-b-2 md:border-b-0 md:border-r-2 border-brand-line flex-shrink-0">
        <div className="p-6 border-b-2 border-brand-line">
          <h2 className="text-xl font-extrabold uppercase">
            Админка <span className="text-brand-accent">Намылимся</span>
          </h2>
          <p className="text-xs font-bold text-brand-muted mt-1 uppercase">
            Ваша роль: {role === 'admin' ? 'Администратор' : 'Модератор'}
          </p>
        </div>
        
        <nav className="flex flex-col p-4 gap-2">
          <Link 
            href="/admin" 
            className="font-bold p-3 rounded-brand hover:bg-brand-bg transition-colors"
          >
            📊 Дашборд
          </Link>
          <Link 
            href="/admin/events" 
            className="font-bold p-3 rounded-brand hover:bg-brand-bg transition-colors"
          >
            📅 События
          </Link>
          {role === 'admin' && (
            <Link 
              href="/admin/users" 
              className="font-bold p-3 rounded-brand hover:bg-brand-bg transition-colors"
            >
              👥 Пользователи
            </Link>
          )}

           <Link 
            href="/admin/support" 
            className="font-bold p-3 rounded-brand hover:bg-brand-bg transition-colors flex justify-between items-center"
          >
            <span>✉️ Обращения</span>
            {newTickets && newTickets > 0 ? (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {newTickets}
              </span>
            ) : null}
          </Link>
          
          <div className="mt-auto pt-4 border-t-2 border-dashed border-brand-line">
            <Link 
              href="/" 
              className="font-bold text-brand-muted hover:text-brand-accent p-3 block transition-colors"
            >
              ← Назад на сайт
            </Link>
          </div>
        </nav>
      </aside>

      {/* Контент */}
      <main className="flex-1 p-6 md:p-10 overflow-x-auto">
        {children}
      </main>
    </div>
  );
}