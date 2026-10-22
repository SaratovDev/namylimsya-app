'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

export default function NotificationsBell() {
  const [notifications, setNotifications] = useState<any[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  // Используем useRef, чтобы сохранить канал между рендерами
  const channelRef = useRef<any>(null);

  useEffect(() => {
    let isMounted = true; // Флаг, чтобы не обновлять состояние после размонтирования

    const setupNotifications = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user || !isMounted) return;

      // 1. Загружаем историю
      const { data } = await supabase
        .from('notifications')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .limit(20);

      if (data && isMounted) {
        setNotifications(data);
        setUnreadCount(data.filter(n => !n.is_read).length);
      }

      // 2. Подписываемся на Realtime (только один раз)
      if (!channelRef.current) {
        const channelName = `notifications-${user.id}-${Math.random()}`;
        channelRef.current = supabase
          .channel(channelName)
          .on(
            'postgres_changes',
            {
              event: 'INSERT',
              schema: 'public',
              table: 'notifications',
              filter: `user_id=eq.${user.id}`,
            },
            (payload) => {
              if (isMounted) {
                // Проверяем, нет ли уже этого уведомления в списке
                setNotifications((prev) => {
                  if (prev.some(n => n.id === payload.new.id)) return prev;
                  return [payload.new, ...prev];
                });
                setUnreadCount((prev) => prev + 1);
              }
            }
          )
          .subscribe();
      }
    };

    setupNotifications();

    return () => {
      isMounted = false;
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, []);

  // Закрытие по клику вне меню
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const markAsRead = async () => {
    if (unreadCount === 0) return;
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    await supabase
      .from('notifications')
      .update({ is_read: true })
      .eq('user_id', user.id)
      .eq('is_read', false);

    setUnreadCount(0);
    setNotifications((prev) => prev.map((n) => ({ ...n, is_read: true })));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) markAsRead();
        }}
        className="relative w-10 h-10 flex items-center justify-center  rounded-brand hover:bg-brand-bg transition-colors"
      >
        🔔
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-accent text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-brand-surface">
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-72 md:w-80 bg-brand-surface border-2 border-brand-line rounded-brand shadow-lg z-50 max-h-96 overflow-y-auto">
          <div className="p-3 border-b-2 border-brand-line font-extrabold uppercase bg-brand-bg sticky top-0">
            Уведомления
          </div>
          {notifications.length === 0 ? (
            <div className="p-4 text-center text-brand-muted font-bold text-sm">
              Нет уведомлений
            </div>
          ) : (
            <ul className="flex flex-col">
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-3 border-b border-brand-line/30 text-sm font-medium ${
                    !n.is_read ? 'bg-brand-accent/5' : ''
                  }`}
                >
                  {n.link ? (
                    <Link
                      href={n.link}
                      onClick={() => setIsOpen(false)}
                      className="hover:text-brand-accent transition-colors block"
                    >
                      {n.content}
                    </Link>
                  ) : (
                    n.content
                  )}
                  <span className="block text-[10px] text-brand-muted mt-1">
                    {new Date(n.created_at).toLocaleString('ru-RU')}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}