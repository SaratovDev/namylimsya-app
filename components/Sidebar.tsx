'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { CATEGORIES } from '@/lib/validations';
import { useTransition } from 'react'; // <-- Добавили для плавности
import { useState, useEffect } from 'react'; // <-- Добавь useState/useEffect
import { supabase } from '@/lib/supabase'; // <-- Добавь импорт supabase

export default function Sidebar() {
  
    const [cities, setCities] = useState<string[]>([]);

  useEffect(() => {
    supabase.from('cities').select('name').order('name').then(({ data }) => {
      if (data) setCities(data.map(c => c.name));
    });
  }, []);
  
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentCity = searchParams.get('city') || '';
  const [isPending, startTransition] = useTransition(); // <-- Индикатор загрузки

  // Получаем текущие выбранные категории (может быть несколько через запятую)
  const categoriesParam = searchParams.get('category') || '';
  const selectedCategories = categoriesParam ? categoriesParam.split(',') : [];
  
  const currentDateFrom = searchParams.get('date_from') || '';
  const currentDateTo = searchParams.get('date_to') || '';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (value && value !== 'Все') {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    
    params.delete('page'); 
    
    // Используем startTransition для плавного обновления без "зависания"
    startTransition(() => {
      router.push(`/?${params.toString()}`, { scroll: false });
    });
  };

  const toggleCategory = (cat: string) => {
    let newCategories;
    if (selectedCategories.includes(cat)) {
      // Если уже выбрана — убираем
      newCategories = selectedCategories.filter(c => c !== cat);
    } else {
      // Если нет — добавляем
      newCategories = [...selectedCategories, cat];
    }
    
    const value = newCategories.length > 0 ? newCategories.join(',') : 'Все';
    updateFilters('category', value);
  };

  return (
    <aside className={`bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5 sticky top-24 transition-opacity ${isPending ? 'opacity-50' : 'opacity-100'}`}>
      <h3 className="text-lg font-extrabold uppercase border-b-2 border-brand-line pb-2.5 mb-4 flex justify-between items-center">
        Фильтры
        {(selectedCategories.length > 0 || currentDateFrom || currentDateTo) && (
          <button 
            onClick={() => router.push('/')}
            className="text-[10px] text-brand-accent hover:underline normal-case"
          >
            Сбросить
          </button>
        )}
      </h3>
      
      {/* Категории */}
      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Категории (можно несколько)</span>
        <div className="flex flex-wrap gap-2">
          <button 
            onClick={() => updateFilters('category', 'Все')}
            className={`px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase transition-colors ${selectedCategories.length === 0 ? 'bg-brand-cat text-white' : 'bg-brand-bg hover:bg-brand-cat-soft'}`}
          >
            Все
          </button>
          {CATEGORIES.map(cat => {
            const isSelected = selectedCategories.includes(cat);
            return (
              <button 
                key={cat}
                onClick={() => toggleCategory(cat)}
                className={`px-3 py-1.5 rounded-brand border-2 border-brand-line text-[12px] font-bold uppercase transition-colors ${isSelected ? 'bg-brand-cat text-white' : 'bg-brand-bg hover:bg-brand-cat-soft'}`}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </div>
      {/* Город */}
      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Город</span>
        <select
          value={currentCity}
          onChange={(e) => updateFilters('city', e.target.value)}
          className="w-full p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand text-sm outline-none focus:border-brand-accent"
        >
          <option value="">Все города</option>
          {cities.map(city => (
            <option key={city} value={city}>{city}</option>
          ))}
        </select>
      </div>
      {/* Даты */}
      <div className="mb-6">
        <span className="block text-[12px] font-extrabold uppercase text-brand-muted mb-2.5">Период событий</span>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-[10px] font-bold text-brand-muted uppercase block mb-1">От</label>
            <input 
              type="date" 
              value={currentDateFrom}
              onChange={(e) => updateFilters('date_from', e.target.value)}
              className="w-full p-2 bg-brand-bg border-2 border-brand-line rounded-brand text-sm outline-none focus:border-brand-accent"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-brand-muted uppercase block mb-1">До</label>
            <input 
              type="date" 
              value={currentDateTo}
              onChange={(e) => updateFilters('date_to', e.target.value)}
              className="w-full p-2 bg-brand-bg border-2 border-brand-line rounded-brand text-sm outline-none focus:border-brand-accent"
            />
          </div>
        </div>
      </div>

    </aside>
  );
}