'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { markChatAsRead } from '@/app/actions';
import Image from 'next/image';
import { useToast } from './Toast';

interface EventChatProps {
  eventId: string;
  currentUserId: string;
}

interface Message {
  id: string;
  content: string;
  user_id: string;
  created_at: string;
  reply_to: string | null;
  profiles?: { username: string; avatar_url: string | null; gender: string | null }; 
  reply_profile?: { username: string };
  reply_content?: string;
}

const MAX_MESSAGE_LENGTH = 1000;

export default function EventChat({ eventId, currentUserId }: EventChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [replyingTo, setReplyingTo] = useState<Message | null>(null);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const {showError } = useToast();
  
  
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  // Кэш профилей (теперь храним и аватарку тоже)
  const profilesCache = useRef<Record<string, { username: string; avatar_url: string | null; gender: string | null }>>({});
  const lastSendTime = useRef<number>(0);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // 1. Загрузка истории + отметка о прочтении
  useEffect(() => {
    const fetchMessages = async () => {
      markChatAsRead(eventId);

      const { data: msgs, error } = await supabase
        .from('messages')
        .select('*')
        .eq('event_id', eventId)
        .order('created_at', { ascending: false })
        .limit(50);

      if (error) {
        console.error("Ошибка загрузки сообщений:", error);
        setLoading(false);
        return;
      }

      if (msgs && msgs.length > 0) {
        const sortedMsgs = msgs.reverse();
        const userIds = [...new Set(sortedMsgs.map(m => m.user_id))];
        
        const missingUserIds = userIds.filter(id => !profilesCache.current[id]);
        
        if (missingUserIds.length > 0) {
          // Запрашиваем username, avatar_url и gender
          const { data: profiles } = await supabase
            .from('profiles')
            .select('id, username, avatar_url, gender')
            .in('id', missingUserIds);
            
          profiles?.forEach(p => {
            profilesCache.current[p.id] = { 
              username: p.username, 
              avatar_url: p.avatar_url,
              gender: p.gender
            };
          });
        }

        const msgsWithProfiles = sortedMsgs.map(msg => {
          let replyData = {};
          if (msg.reply_to) {
            const original = sortedMsgs.find(m => m.id === msg.reply_to);
            if (original) {
              replyData = {
                reply_content: original.content,
                reply_profile: profilesCache.current[original.user_id]
              };
            }
          }
          return {
            ...msg,
            profiles: profilesCache.current[msg.user_id],
            ...replyData
          };
        });

        setMessages(msgsWithProfiles);
      } else {
        setMessages([]);
      }
      setLoading(false);
    };

    fetchMessages();
  }, [eventId]);

  // 2. Realtime подписка
  useEffect(() => {
    const channel = supabase
      .channel(`chat-${eventId}`)
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'messages', filter: `event_id=eq.${eventId}` },
        async (payload) => {
          const newUserId = payload.new.user_id;
          
          if (!profilesCache.current[newUserId]) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username, avatar_url, gender')
              .eq('id', newUserId)
              .single();
            if (profile) {
              profilesCache.current[newUserId] = { 
                username: profile.username,
                avatar_url: profile.avatar_url,
                gender: profile.gender
              };
            }
          }

          let replyData = {};
          if (payload.new.reply_to) {
            const { data: original } = await supabase
              .from('messages')
              .select('content, user_id')
              .eq('id', payload.new.reply_to)
              .single();
            if (original) {
              if (!profilesCache.current[original.user_id]) {
                 const { data: origProfile } = await supabase.from('profiles').select('username').eq('id', original.user_id).single();
                 if (origProfile) profilesCache.current[original.user_id] = { username: origProfile.username, avatar_url: null, gender: null };
              }
              replyData = {
                reply_content: original.content,
                reply_profile: profilesCache.current[original.user_id]
              };
            }
          }

          const newMsg = {
            ...payload.new,
            profiles: profilesCache.current[newUserId],
            ...replyData
          } as Message;

          setMessages((prev) => {
            if (prev.some(m => m.id === newMsg.id)) return prev;
            return [...prev, newMsg];
          });
          
          markChatAsRead(eventId);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [eventId]);


  const isFirstLoad = useRef(true);

  useEffect(() => {
    // При первой загрузке ничего не скроллим
    if (isFirstLoad.current) {
      isFirstLoad.current = false;
      return;
    }
    
    // Находим сам контейнер чата (у которого overflow-y-auto)
    const chatContainer = messagesEndRef.current?.closest('.overflow-y-auto');
    
    // Скроллим только внутренний контейнер чата, НЕ трогая саму страницу
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  }, [messages]);


  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || sending) return;

    const now = Date.now();
    if (now - lastSendTime.current < 2000) {
      showError('Не так быстро! Подождите пару секунд.'); // <-- ЗАМЕНА
      return;
    }
    
    if (newMessage.length > MAX_MESSAGE_LENGTH) {
      showError(`Сообщение слишком длинное (максимум ${MAX_MESSAGE_LENGTH} символов).`); // <-- ЗАМЕНА
      return;
    }

    setSending(true);
    const content = newMessage.trim();
    const replyId = replyingTo?.id || null;
    
    setNewMessage('');
    setReplyingTo(null);

    try {
      const { error } = await supabase
        .from('messages')
        .insert([{ event_id: eventId, user_id: currentUserId, content, reply_to: replyId }]);

      if (error) throw error;
      lastSendTime.current = Date.now();
      // Мы не показываем тост об успехе для каждого сообщения, 
      // чтобы не спамить (сообщение и так появляется в чате).
    } catch (error) {
      console.error(error);
      showError('Не удалось отправить сообщение.'); // <-- ЗАМЕНА
      setNewMessage(content); 
    } finally {
      setSending(false);
    }
  };

  if (loading) {
    return <div className="p-4 text-center font-bold text-brand-muted">Загрузка чата...</div>;
  }

  return (
    <div className="flex flex-col bg-brand-surface border-2 border-brand-line rounded-[16px] overflow-hidden h-[450px]">
      
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
            const avatarUrl = msg.profiles?.avatar_url;
            const avatarLetter = authorName.charAt(0).toUpperCase();
            
            // Цвет фона для заглушки (как в EventCard)
            const gender = msg.profiles?.gender;
            const bgClass = gender === 'male' ? 'bg-blue-100 text-blue-800' : 
                            gender === 'female' ? 'bg-pink-100 text-pink-800' : 
                            'bg-gray-200 text-gray-700';

            return (
              <div key={msg.id} className={`group flex gap-2 max-w-[85%] ${isMine ? 'self-end flex-row-reverse' : 'self-start'}`}>
                
                {/* Аватарка (картинка или буква) */}
                 <div className={`w-12 h-12 flex-shrink-0 rounded-full flex items-center justify-center text-xs font-extrabold overflow-hidden mt-auto mb-1 border-2
                  ${avatarUrl ? 'bg-brand-bg' : ''} 
                  ${gender === 'male' ? 'border-blue-400' : gender === 'female' ? 'border-pink-400' : 'border-brand-line'} 
                  ${!avatarUrl ? bgClass : ''}
                `}>
                  {avatarUrl ? (
                    <Image 
                      src={avatarUrl} 
                      alt={authorName} 
                      width={32} 
                      height={32} 
                      className="w-8 h-8 object-cover"
                    />
                  ) : (
                    avatarLetter
                  )}
                </div>

                <div className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}>
                  {!isMine && (
                    <span className="text-[11px] font-bold text-brand-muted mb-1 ml-1">
                      @{authorName}
                    </span>
                  )}

                  <div className="relative flex items-center gap-2">
                    {isMine && (
                      <button 
                        onClick={() => {
                          setReplyingTo(msg);
                          inputRef.current?.focus();
                        }}
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-brand-muted hover:text-brand-accent p-1"
                        title="Ответить"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                      </button>
                    )}

                                       <div 
                      className={`px-4 py-2 text-[14px] font-medium leading-relaxed border rounded-2xl whitespace-pre-wrap break-all ${
                        isMine 
                          ? 'bg-brand-accent-soft text-brand-text border-brand-line rounded-br-sm' 
                          : 'bg-brand-surface text-brand-text border-brand-line rounded-bl-sm'    
                      }`}
                    >
                      {msg.reply_content && (
                        <div className="mb-2 pl-2 border-l-2 border-brand-line/50 opacity-70 text-[12px] italic line-clamp-2">
                          <span className="font-bold">@{msg.reply_profile?.username || 'Юзер'}:</span> {msg.reply_content}
                        </div>
                      )}
                      {msg.content}
                    </div>

                    {!isMine && (
                      <button 
                        onClick={() => {
                        setReplyingTo(msg);
                        inputRef.current?.focus();
                      }}
                        className="opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity text-brand-muted hover:text-brand-accent p-1"
                        title="Ответить"
                      >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 17 4 12 9 7"></polyline><path d="M20 18v-2a4 4 0 0 0-4-4H4"></path></svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {replyingTo && (
        <div className="bg-brand-bg border-t-2 border-brand-line px-4 py-2 flex items-center justify-between text-sm">
          <div className="truncate text-brand-muted">
            Ответ <span className="font-bold">@{replyingTo.profiles?.username || 'Юзер'}</span>: {replyingTo.content}
          </div>
          <button onClick={() => {
            setReplyingTo(null);
            inputRef.current?.focus();
          }} className="text-brand-accent font-bold ml-2">✕</button>
        </div>
      )}

      <form onSubmit={handleSendMessage} className="p-3 bg-brand-surface border-t-2 border-brand-line flex gap-2 items-end">
        <textarea
          ref={inputRef}
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Написать сообщение..."
          maxLength={MAX_MESSAGE_LENGTH}
          rows={1}
          className="flex-1 p-3 bg-brand-bg border-2 border-brand-line rounded-2xl outline-none focus:border-brand-accent transition-colors text-sm resize-none max-h-32"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage(e);
            }
          }}
        />
        <button 
          type="submit" 
          disabled={!newMessage.trim() || sending}
          className="w-11 h-11 flex-shrink-0 flex items-center justify-center bg-brand-text text-brand-bg rounded-full hover:bg-brand-accent transition-colors disabled:opacity-50"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="22" y1="2" x2="11" y2="13"></line><polygon points="22 2 15 22 11 13 2 9 22 2"></polygon></svg>
        </button>
      </form>

    </div>
  );
}