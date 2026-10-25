// Массивы слов (пока по 10, но ты можешь легко расширить их до 2000)
const ADJECTIVES = [
  'Веселый', 'Грустный', 'Быстрый', 'Медленный', 'Умный',
  'Хитрый', 'Добрый', 'Злой', 'Смелый', 'Тихий'
  // ... добавляй сюда свои прилагательные
];

const NOUNS = [
  'Енот', 'Кот', 'Пес', 'Пингвин', 'Лис',
  'Медведь', 'Заяц', 'Волк', 'Тигр', 'Лев'
  // ... добавляй сюда свои существительные
];

export function generateRandomUsername(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  // Добавляем 2 случайные цифры в конец, чтобы избежать совпадений
  const randomNum = Math.floor(10 + Math.random() * 90);
  
  // Формируем никнейм: Веселый_Енот42
  // Заменяем все недопустимые символы (оставляем буквы, цифры и _)
  return `${adj}_${noun}${randomNum}`.replace(/[^a-zA-Zа-яА-Я0-9_]/g, '');
}