import React from 'react';

export default function Sidebar() {
  return (
    <aside className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5 sticky top-[90px] hidden lg:block">
      <h3 className="text-lg font-extrabold uppercase border-b-2 border-brand-line pb-2.5 mb-4">
        Фильтры
      </h3>
      
      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Категории</span>
        <div className="flex flex-wrap gap-2">
          <button className="bg-brand-cat text-white px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase transition-colors">Все</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Прогулки</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Спорт</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Культура</button>
        </div>
      </div>

      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Время</span>
        <div className="flex flex-wrap gap-2">
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Сегодня</button>
          <button className="bg-brand-bg px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase hover:bg-brand-cat-soft transition-colors">Выходные</button>
        </div>
      </div>
    </aside>
  );
}