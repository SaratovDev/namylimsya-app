export type Badge = {
  level: number;
  title: string;
  threshold: number;
  icon: string; // Путь к твоей картинке
  color: string; // Цвет рамки или свечения
};

// Бейджи за организацию
export const ORGANIZER_BADGES: Badge[] = [
  { level: 1, title: 'Инициатор', threshold: 1, icon: '/badges/org_1.png', color: 'border-gray-400' },
  { level: 2, title: 'Координатор', threshold: 5, icon: '/badges/org_5.png', color: 'border-blue-400' },
  { level: 3, title: 'Душа компании', threshold: 10, icon: '/badges/org_10.png', color: 'border-green-400' },
  { level: 4, title: 'Мастер встреч', threshold: 25, icon: '/badges/org_25.png', color: 'border-purple-400' },
  { level: 5, title: 'Хранитель', threshold: 50, icon: '/badges/org_50.png', color: 'border-yellow-400' },
  { level: 6, title: 'Архитектор', threshold: 100, icon: '/badges/org_100.png', color: 'border-orange-500' },
  { level: 7, title: 'Гуру', threshold: 250, icon: '/badges/org_250.png', color: 'border-red-500' },
  { level: 8, title: 'Великий организатор', threshold: 500, icon: '/badges/org_500.png', color: 'border-indigo-600' },
  { level: 9, title: 'Легенда', threshold: 1000, icon: '/badges/org_1000.png', color: 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' },
];

// Бейджи за участие
export const PARTICIPANT_BADGES: Badge[] = [
  { level: 1, title: 'Первопроходец', threshold: 1, icon: '/badges/part_1.png', color: 'border-gray-400' },
  { level: 2, title: 'Общительный', threshold: 5, icon: '/badges/part_5.png', color: 'border-blue-400' },
  { level: 3, title: 'Ветеран', threshold: 10, icon: '/badges/part_10.png', color: 'border-green-400' },
  { level: 4, title: 'Магнит знакомств', threshold: 25, icon: '/badges/part_25.png', color: 'border-purple-400' },
  { level: 5, title: 'Посол добра', threshold: 50, icon: '/badges/part_50.png', color: 'border-yellow-400' },
  { level: 6, title: 'Хранитель традиций', threshold: 100, icon: '/badges/part_100.png', color: 'border-orange-500' },
  { level: 7, title: 'Великий гость', threshold: 250, icon: '/badges/part_250.png', color: 'border-red-500' },
  { level: 8, title: 'Икона', threshold: 500, icon: '/badges/part_500.png', color: 'border-indigo-600' },
  { level: 9, title: 'Бессмертный', threshold: 1000, icon: '/badges/part_1000.png', color: 'border-yellow-500 shadow-[0_0_10px_rgba(234,179,8,0.5)]' },
];

// Функция для получения текущего бейджа и прогресса до следующего
export function getBadgeStatus(count: number, badges: Badge[]) {
  // Если 0 событий — бейджа нет
  if (count === 0) return { current: null, next: badges[0], progress: 0 };

  // Ищем текущий уровень
  let current = badges[0];
  let next = badges[1] || null;

  for (let i = 0; i < badges.length; i++) {
    if (count >= badges[i].threshold) {
      current = badges[i];
      next = badges[i + 1] || null;
    } else {
      break;
    }
  }

  // Считаем прогресс до следующего
  let progress = 100;
  if (next) {
    const range = next.threshold - current.threshold;
    const achieved = count - current.threshold;
    progress = Math.min(100, Math.max(0, Math.round((achieved / range) * 100)));
  }

  return { current, next, progress };
}