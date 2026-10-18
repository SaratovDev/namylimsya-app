'use client';

import { useRef, useState } from 'react';
import { createEvent } from '@/app/actions';

export default function CreateEventForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isPending, setIsPending] = useState(false);

  // Обработчик отправки формы
  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    try {
      await createEvent(formData);
      formRef.current?.reset(); // Очищаем форму после успеха
      alert('Событие успешно создано!');
      // Закрываем аккордеон (находим родительский тег details и убираем атрибут open)
      formRef.current?.closest('details')?.removeAttribute('open');
    } catch (error) {
      alert('Ошибка при создании события');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <form ref={formRef} action={handleSubmit} className="flex flex-col gap-5">
      
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-extrabold uppercase text-brand-muted">Название</label>
        <input required name="title" type="text" placeholder="Например: Вечерняя прогулка" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Категория</label>
          <select name="category" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors">
            <option>Прогулки и активный отдых</option>
            <option>Спорт и игры</option>
            <option>Культура</option>
            <option>Еда и напитки</option>
            <option>Просто встретиться</option>
          </select>
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Лимит участников</label>
          <input required name="max_participants" type="number" min="1" defaultValue="10" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-extrabold uppercase text-brand-muted">Описание</label>
        <textarea required name="description" rows={3} placeholder="Расскажите, что будет происходить..." className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors resize-y"></textarea>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Дата</label>
          <input required name="date" type="date" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
        </div>
        <div className="flex flex-col gap-1.5">
          <label className="text-[12px] font-extrabold uppercase text-brand-muted">Время</label>
          <input required name="time" type="time" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-extrabold uppercase text-brand-muted">Место</label>
        <input required name="location" type="text" placeholder="Например: Парк Горького" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent transition-colors" />
      </div>

      <label className="flex items-center gap-2.5 cursor-pointer mt-2">
        <input type="checkbox" name="hide_location" className="w-5 h-5 accent-brand-accent" />
        <span className="text-sm font-bold">Скрыть точное место до подтверждения заявки</span>
      </label>

      <button 
        type="submit" 
        disabled={isPending}
        className="mt-2 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? 'Публикуем...' : 'Опубликовать событие'}
      </button>
    </form>
  );
}