'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

interface EventChatProps {
  eventId: string;
  currentUserId: string;
}

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  profiles?: { username: string }; // Подтягиваем никнейм
}

export default function EventChat({ eventId, currentUserId }: EventChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

   // 1. Загружаем историю сообщений
  useEffect(() => {
    const fetchMessages = async () => {
      // Грузим только сообщения
      const { data: msgs, error } = await supabase
        .from('messages')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: true });

      if (error) {
        console.error("Ошибка загрузки сообщений:", error);
        setLoading(false);
        return;
      }

      if (msgs && msgs.length > 0) {
        // Собираем уникальные ID авторов
        const userIds = [...new Set(msgs.map(m => m.user_id))];
        
        // Грузим их профили
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, username')
          .in('id', userIds);

        // Объединяем данные
        const msgsWithProfiles = msgs.map(msg => ({
          ...msg,
          profiles: profiles?.find(p => p.id === msg.user_id)
        }));

        setMessages(msgsWithProfiles);
      } else {
        setMessages([]);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [eventId]);

  // 2. Подписываемся на новые сообщения (Realtime)
  useEffect(() => {
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `event_id=eq.${eventId}` },
        async (payload) => {
          // Получаем никнейм для нового сообщения
          const { data: profile } = await supabase
            .from('profiles')
            .select('username')
            .eq('id', payload.new.user_id)
            .single();

          const newMsg = {
            ...payload.new,
            profiles: profile
          } as Message;

          setMessages((prev) => [...prev, newMsg]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);

  // Автоскролл вниз при новом сообщении
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    const content = newMessage;
    setNewMessage(''); // Очищаем поле сразу

    const { error } = await supabase
      .from('messages')
      .insert([{ event_id: eventId, user_id: currentUserId, content }]);

    if (error) {
      alert('Ошибка отправки сообщения');
      console.error(error);
    }
  };

  if (loading) {
    return <div className="p-4 text-center font-bold text-brand-muted">Загрузка чата...</div>;
  }

  return (
    <div className="flex flex-col bg-brand-surface border-2 border-brand-line rounded-[16px] overflow-hidden h-[450px]">
      
      {/* Лента сообщений */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-brand-bg/50">
        {messages.length === 0 ? (
          <div className="my-auto text-center">
            <span className="text-4xl mb-2 block">👋</span>
            <p className="text-brand-muted font-bold">Здесь пока нет сообщений.<br/>Напишите первым!</p>
          </div>
        ) : (
          messages.map((msg) => {
            const isMine = msg.user_id === currentUserId;
            const authorName = msg.profiles?.username || 'Пользователь';
            const avatarLetter = authorName.charAt(0).toUpperCase();

            return (
              <div key={msg.id} className={`flex gap-2 max-w-[85%] ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}>
                
                {/* Аватарка */}
                <div className="w-8 h-8 flex-shrink-0 rounded-full bg-brand-line/10 border border-brand-line/20 flex items-center justify-center text-xs font-extrabold text-brand-muted mt-auto mb-1">
                  {avatarLetter}
                </div>

                {/* Блок с сообщением */}
                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  {/* Никнейм (скрываем для своих, чтобы не загромождать) */}
                  {!isMine && (
                    <span className="text-[11px] font-bold text-brand-muted mb-1 ml-1">
                      @{authorName}
                    </span>
                  )}

                  {/* Текст сообщения */}
                  <div 
                    className={`px-4 py-2 text-[14px] font-medium leading-relaxed border rounded-2xl ${
                      isMine 
                        ? 'bg-orange-100 text-brand-text border-orange-200 rounded-br-sm' // Свои: слабый оранжевый
                        : 'bg-blue-50 text-brand-text border-blue-100 rounded-bl-sm'     // Чужие: слабый голубой
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>

              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Поле ввода */}
      <form onSubmit={handleSendMessage} className="p-3 bg-brand-surface border-t-2 border-brand-line flex gap-2 items-end">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Написать сообщение..."
          className="flex-1 p-3 bg-brand-bg border-2 border-brand-line rounded-full outline-none focus:border-brand-accent transition-colors text-sm"
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim()}
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-brand-text text-brand-bg rounded-full hover:bg-brand-accent transition-colors disabled:opacity-50"
        >
          {/* Иконка самолетика */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>

    </div>
  );
}