'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import Image from 'next/image';
import type { EventListItemDTO } from '@/lib/event-dto';
import { applyToEvent, cancelApplication } from '@/app/actions';
import type { User } from '@supabase/supabase-js';
import ClientMapWrapper from './ClientMapWrapper';

export default function EventCard({ item }: { item: EventListItemDTO }) {
  const {
    id,
    organizerId,
    unreadCount,
    category,
    dateTime,
    title,
    description,
    organizerName,
    organizerRank,
    maxParticipants,
    approvedParticipantsCount,
    isFull,
    publicLocationLabel,
    locationIsHidden,
    lat,
    lng,
    myApplicationStatus,
    isOrganizer,
    organizerAvatar,
    organizerGender,
  } = item;

  // Локальный статус для мгновенного UI
  const [myStatus, setMyStatus] = useState<
    'pending' | 'approved' | 'rejected' | null
  >(myApplicationStatus);
  const [loading, setLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  


  // Получаем пользователя на клиенте, чтобы кнопка сразу менялась
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

  // Проверка: организатор ли это? Либо из серверного DTO, либо по клиентскому ID
  const isActuallyOrganizer = isOrganizer || (user !== null && user.id === organizerId);

  const hasExactCoords = typeof lat === 'number' && typeof lng === 'number';

  const handleApply = async () => {
    setLoading(true);
    try {
      await applyToEvent(id);
      setMyStatus('pending');
       } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка';
      alert(message);
      } finally {

      setLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!confirm('Вы уверены, что хотите отменить заявку?')) return;
    setIsCanceling(true);
    try {
      await cancelApplication(id);
      setMyStatus(null);
   } catch (error) {
      const message = error instanceof Error ? error.message : 'Произошла ошибка';
      alert(message);
    } finally {
      setIsCanceling(false);
    }
  };

  // Состояние кнопки
  let buttonText = 'Хочу участвовать';
  let buttonDisabled = isFull || loading;
  let buttonClass =
    'bg-brand-accent text-brand-accent-ink hover:bg-brand-text hover:text-brand-bg';

  if (isActuallyOrganizer) {
    buttonText = 'Это ваше событие';
    buttonDisabled = true;
    buttonClass =
      'bg-brand-surface text-brand-muted border-brand-muted cursor-default';
  } else if (myStatus === 'pending') {
    buttonText = 'Заявка отправлена';
    buttonDisabled = true;
    buttonClass =
      'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  } else if (myStatus === 'approved') {
    buttonText = 'Вы записаны ✓';
    buttonDisabled = true;
    buttonClass = 'bg-green-600 text-white border-green-800 cursor-default';
  } else if (isFull) {
    buttonText = 'Мест нет';
    buttonDisabled = true;
    buttonClass =
      'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed';
  }

  const d = new Date(dateTime);
  const dayNumber = d.getDate();
  const monthName = d.toLocaleDateString('ru-RU', { month: 'short' });
  const timeOnly = d.toLocaleTimeString('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <article className="bg-brand-surface border-2 border-brand-line rounded-brand-lg flex flex-col sm:flex-row overflow-hidden hover:opacity-95 transition-opacity w-full">
      {/* ЛЕВАЯ КОЛОНКА */}
      <div className="bg-brand-bg/50 p-4 sm:w-[150px] flex-shrink-0 flex flex-row sm:flex-col items-left border-b-2 sm:border-b-0 sm:border-r-2 border-brand-line gap-4 sm:gap-0 justify-between">
        <div className="flex-shrink-0 w-full flex justify-center sm:justify-start">
          <span className="text-[10px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2 py-1 rounded border border-brand-cat/30 text-center block leading-tight">
            {category}
          </span>
        </div>

        <div className="flex flex-row sm:flex-col items-baseline sm:items-start justify-start w-full gap-2 sm:gap-0 sm:my-auto">
          <div className="flex items-baseline gap-1">
            <span className="text-5xl font-extrabold leading-none text-brand-text">
              {dayNumber}
            </span>
            <span className="text-[16px] font-bold text-brand-muted">
              {monthName}
            </span>
          </div>
          <span className="text-2xl font-extrabold text-brand-text sm:mt-1">
            {timeOnly}
          </span>
        </div>

        <div className="flex items-center justify-center sm:justify-start gap-1 w-full text-[12px] font-extrabold text-brand-muted">
          👤
          <span>
            {approvedParticipantsCount} / {maxParticipants}
          </span>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА */}
      <div className="p-5 md:p-6 flex-grow flex flex-col min-w-0">
        <Link
          href={`/event/${id}`}
          className="block hover:text-brand-accent transition-colors"
        >
          <h2 className="text-xl md:text-2xl font-extrabold leading-tight">
            {title}
          </h2>
        </Link>

        {/* Публичная метка места */}
        <div className="flex items-center gap-1.5 text-[13px] font-bold text-brand-muted mt-2 mb-3">
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
            <circle cx="12" cy="10" r="3"></circle>
          </svg>
          <span className="truncate">{publicLocationLabel}</span>
        </div>

        <p className="text-[14px] text-brand-text/80 mb-4 line-clamp-2 leading-relaxed">
          {description}
        </p>

        <div className="flex items-center gap-2 text-sm mb-5 mt-auto">
          <div
            className={`w-8 h-8 rounded-full border border-brand-line flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 overflow-hidden
              ${
                organizerGender === 'male'
                  ? 'bg-blue-100 text-blue-800'
                  : organizerGender === 'female'
                  ? 'bg-pink-100 text-pink-800'
                  : 'bg-gray-200 text-gray-700'
              }
            `}
          >
            {organizerAvatar ? (
              <Image
                src={organizerAvatar}
                alt={organizerName}
                width={24}
                height={24}
                className="w-5 h-5 object-contain"
              />
            ) : (
              organizerName.charAt(0)
            )}
          </div>

          <div className="flex flex-col min-w-0">
            <Link
              href={`/@${organizerName}`}
              className="text-brand-text hover:text-brand-accent transition-colors font-bold truncate leading-tight"
            >
              {organizerName}
            </Link>
            <span className="text-brand-accent font-extrabold text-[10px] uppercase leading-tight mt-0.5">
              {organizerRank}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
          <button
            onClick={handleApply}
            disabled={buttonDisabled}
            className={`flex-1 font-extrabold text-[13px] uppercase px-4 py-2 border-2 border-brand-line rounded-brand transition-colors ${buttonClass}`}
          >
            {buttonText}
          </button>

          {(myStatus || isActuallyOrganizer) && (
            <Link
              href={`/event/${id}`}
              className="relative bg-brand-surface text-brand-text font-extrabold text-[13px] uppercase px-4 py-2 border-2 border-brand-line rounded-brand hover:bg-brand-cat-soft transition-colors flex items-center justify-center"
            >
              Чат
              {/* Бейдж непрочитанных */}
              {unreadCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-brand-surface">
                  {unreadCount}
                </span>
              )}
            </Link>
          )}

          {myStatus === 'pending' && (
            <button
              onClick={handleCancel}
              disabled={isCanceling}
              className="bg-red-100 text-red-700 font-extrabold text-[13px] uppercase px-3 py-2 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors disabled:opacity-50"
              title="Отменить заявку"
            >
              ✕
            </button>
          )}
        </div>

        {/* Карта */}
        {hasExactCoords && (
          <details className="mt-4 border-t border-dashed border-brand-line/30 pt-3 group">
            <summary className="list-none cursor-pointer text-brand-muted hover:text-brand-accent font-bold text-[12px] uppercase transition-colors flex items-center gap-1">
              <svg
                className="transition-transform duration-300 group-open:rotate-180"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="6 9 12 15 18 9"></polyline>
              </svg>
              Показать на карте
            </summary>
            <div className="details-content">
              <div className="details-inner">
                <div className="mt-3">
                  <ClientMapWrapper
                    lat={lat as number}
                    lng={lng as number}
                    title={title}
                    hideExactLocation={false}
                  />
                </div>
              </div>
            </div>
          </details>
        )}

        {/* Плашка «место скрыто» */}
        {locationIsHidden && !hasExactCoords && (
          <div className="mt-3 p-2 bg-brand-heat/10 border border-brand-heat rounded-brand text-brand-text font-bold text-[11px]">
            Точное место откроется после подтверждения заявки.
          </div>
        )}
      </div>
    </article>
  );
}