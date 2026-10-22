'use client';

import Image from 'next/image';

interface CategoryIconProps {
  category: string;
}

// Карта соответствия категорий и файлов иконок
const categoryMap: Record<string, { icon: string; label: string }> = {
  'Прогулки': { icon: '/icons/walk.png', label: 'Прогулки' },
  'Спорт': { icon: '/icons/sport.png', label: 'Спорт и игры' },
  'Культура': { icon: '/icons/culture.png', label: 'Культура' },
  'Еда / напитки': { icon: '/icons/food.png', label: 'Еда' },
  'Обучение': { icon: '/icons/edu.png', label: 'Обучение' },
  'Поездки': { icon: '/icons/trip.png', label: 'Поездки' },
  'Волонтёрство': { icon: '/icons/help.png', label: 'Волонтёрство' },
  'Здесь и сейчас': { icon: '/icons/meet.png', label: 'Встретиться' },
};

export default function CategoryIcon({ category }: CategoryIconProps) {
  // Если категория не найдена в списке, показываем дефолтную
  const catInfo = categoryMap[category] || { icon: '/icons/default.svg', label: category };

  return (
    <div className="relative group flex items-center justify-center w-8 h-8 cursor-help">
      
      {/* Сама иконка */}
      <Image 
        src={catInfo.icon} 
        alt={catInfo.label} 
        width={24} 
        height={24} 
        className="opacity-80"
      />

      {/* Тултип */}
      <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        <div className="bg-brand-text text-brand-bg text-[11px] font-bold px-2 py-1 rounded whitespace-nowrap shadow-md">
          {catInfo.label}
        </div>
        {/* Маленький треугольник внизу тултипа */}
        <div className="w-2 h-2 bg-brand-text rotate-45 mx-auto -mt-1"></div>
      </div>
      
    </div>
  );
}