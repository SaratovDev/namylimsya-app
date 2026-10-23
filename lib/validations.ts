// lib/validations.ts
import { z } from 'zod';

// Допустимые категории (должны совпадать с теми, что в UI)
export const CATEGORIES = [
  'Прогулки',
  'Спорт',
  'Культура',
  'Еда/напитки',
  'Обучение',
  'Поездки',
  'Волонтёрство',
  'Здесь и сейчас',
] as const;

export const createEventSchema = z.object({
  title: z
    .string()
    .trim()
    .min(5, 'Название должно быть не короче 5 символов')
    .max(100, 'Название слишком длинное'),
  
  city: z.string().min(2, 'Укажите город'),

  description: z
    .string()
    .trim()
    .min(15, 'Описание должно быть не короче 15 символов')
    .max(1200, 'Описание слишком длинное'),
  
  category: z.enum(CATEGORIES, {
    message: 'Недопустимая категория',
  }),
  
  location: z
    .string()
    .trim()
    .min(3, 'Укажите место проведения')
    .max(300, 'Адрес слишком длинный'),
  
  max_participants: z
    .coerce.number()
    .int('Лимит участников должен быть целым числом')
    .min(1, 'Лимит участников должен быть от 1')
    .max(100, 'Лимит участников не может превышать 100'),
  
  lat: z.coerce
    .number()
    .min(-90, 'Некорректная широта')
    .max(90, 'Некорректная широта')
    .nullable(),
  
  lng: z.coerce
    .number()
    .min(-180, 'Некорректная долгота')
    .max(180, 'Некорректная долгота')
    .nullable(),
  
  // Объединяем дату и время в ISO-строку
  date_time: z
    .string()
    .transform((val) => {
      const date = new Date(val);
      if (isNaN(date.getTime())) throw new Error('Некорректная дата и время');
      return date.toISOString();
    })
    .refine(
      (isoStr) => new Date(isoStr) > new Date(),
      'Дата события должна быть в будущем'
    ),
  
  hide_location: z.boolean(),
});