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

  const [myStatus, setMyStatus] = useState<
    'pending' | 'approved' | 'rejected' | null
  >(myApplicationStatus);
  const [loading, setLoading] = useState(false);
  const [isCanceling, setIsCanceling] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
    });
  }, []);

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
    <article className="bg-brand-surface border-2 border-brand-line rounded-brand-lg flex flex-col sm:flex-row overflow-hidden hover:opacity-95 transition-opacity w-full relative">
      
      {/* ЛЕВАЯ КОЛОНКА (Дата, Время, Места) */}
      <div className="bg-brand-bg/50 p-3 sm:p-4 sm:w-[140px] flex-shrink-0 flex flex-row sm:flex-col items-center sm:items-start border-b-2 sm:border-b-0 sm:border-r-2 border-brand-line justify-between sm:justify-center">
        
        <div className="flex flex-row sm:flex-col items-center sm:items-start gap-2 sm:gap-0">
          <div className="flex items-baseline gap-1">
            <span className="text-3xl sm:text-5xl font-extrabold leading-none text-brand-text">
              {dayNumber}
            </span>
            <span className="text-[14px] sm:text-[16px] font-bold text-brand-muted uppercase">
              {monthName}
            </span>
          </div>
          {/* Время сделано крупным, как дата */}
          <span className="text-3xl sm:text-2xl font-extrabold text-brand-text sm:mt-1">
            {timeOnly}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[11px] sm:text-[12px] font-extrabold text-brand-muted mt-1 sm:mt-4">
          👤
          <span>
            {approvedParticipantsCount} / {maxParticipants}
          </span>
        </div>
      </div>

      {/* ПРАВАЯ КОЛОНКА */}
      <div className="p-4 sm:p-5 md:p-6 flex-grow flex flex-col min-w-0">
        
        {/* Категория над заголовком */}
        <div className="mb-2">
          <span className="text-[9px] sm:text-[10px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2 py-0.5 rounded border border-brand-cat/30 inline-block">
            {category}
          </span>
        </div>

        {/* Заголовок */}
        <Link
          href={`/event/${id}`}
          className="block hover:text-brand-accent transition-colors pr-12"
        >
          <h2 className="text-lg sm:text-xl md:text-2xl font-extrabold leading-tight">
            {title}
          </h2>
        </Link>

        {/* Публичная метка места */}
        <div className="flex items-center gap-1.5 text-[12px] sm:text-[13px] font-bold text-brand-muted mt-2 mb-2">
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

        <p className="text-[13px] sm:text-[14px] text-brand-text/80 mb-3 line-clamp-2 leading-relaxed">
          {description}
        </p>

        {/* Организатор и кнопки */}
        <div className="flex flex-wrap items-center justify-between gap-3 mt-auto pt-2">
          
          <div className="flex items-center gap-2 text-sm">
            <div
              className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-brand-line flex items-center justify-center text-[10px] font-extrabold flex-shrink-0 overflow-hidden
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
                  className="w-4 h-4 sm:w-5 sm:h-5 object-contain"
                />
              ) : (
                organizerName.charAt(0)
              )}
            </div>

            <div className="flex flex-col min-w-0">
              <Link
                href={`/@${organizerName}`}
                className="text-brand-text hover:text-brand-accent transition-colors font-bold truncate leading-tight text-[12px] sm:text-sm"
              >
                {organizerName}
              </Link>
              <span className="text-brand-accent font-extrabold text-[8px] sm:text-[10px] uppercase leading-tight mt-0.5">
                {organizerRank}
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <button
              onClick={handleApply}
              disabled={buttonDisabled}
              className={`flex-1 sm:flex-none font-extrabold text-[11px] sm:text-[13px] uppercase px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-brand-line rounded-brand transition-colors ${buttonClass}`}
            >
              {buttonText}
            </button>

            {/* Кнопка Чат с бейджем непрочитанных */}
            {(myStatus || isActuallyOrganizer) && (
              <Link
                href={`/event/${id}`}
                className="relative bg-brand-surface text-brand-text font-extrabold text-[11px] sm:text-[13px] uppercase px-3 sm:px-4 py-1.5 sm:py-2 border-2 border-brand-line rounded-brand hover:bg-brand-cat-soft transition-colors flex items-center justify-center"
              >
                Чат
                {unreadCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[9px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full border-2 border-brand-surface px-1">
                    {unreadCount}
                  </span>
                )}
              </Link>
            )}

            {myStatus === 'pending' && (
              <button
                onClick={handleCancel}
                disabled={isCanceling}
                className="bg-red-100 text-red-700 font-extrabold text-[11px] sm:text-[13px] uppercase px-2 sm:px-3 py-1.5 sm:py-2 border-2 border-red-300 rounded-brand hover:bg-red-200 transition-colors disabled:opacity-50"
                title="Отменить заявку"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Карта */}
        {hasExactCoords && (
          <details className="mt-4 border-t border-dashed border-brand-line/30 pt-3 group">
            <summary className="list-none cursor-pointer text-brand-muted hover:text-brand-accent font-bold text-[11px] sm:text-[12px] uppercase transition-colors flex items-center gap-1">
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

        {locationIsHidden && !hasExactCoords && (
          <div className="mt-3 p-2 bg-brand-heat/10 border border-brand-heat rounded-brand text-brand-text font-bold text-[10px] sm:text-[11px]">
            Точное место откроется после подтверждения заявки.
          </div>
        )}
      </div>
    </article>
  );
}