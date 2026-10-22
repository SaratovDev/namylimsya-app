'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface AvatarPickerProps {
  currentAvatar: string | null;
  gender: string | null;
  username: string;
  userId: string;
}

export default function AvatarPicker({ currentAvatar, gender, username, userId }: AvatarPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const router = useRouter();

  // Определяем папку с аватарками в зависимости от пола
  const folder = gender === 'male' ? 'male' : gender === 'female' ? 'female' : 'none';
  
  // Генерируем массив путей к картинкам (от 1 до 30)
  const avatars = Array.from({ length: 30 }, (_, i) => `/avatars/${folder}/${i + 1}.png`);

  const handleSelectAvatar = async (avatarUrl: string) => {
    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ avatar_url: avatarUrl })
        .eq('id', userId);

      if (error) throw error;
      
      setIsOpen(false);
      router.refresh(); // Обновляем страницу, чтобы аватарка сразу появилась
    } catch (error) {
      console.error('Ошибка обновления аватарки:', error);
      alert('Не удалось сохранить аватарку');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-brand-surface border-2 border-brand-line font-extrabold text-xs uppercase px-3 py-1.5 rounded-brand hover:bg-brand-cat-soft transition-colors"
      >
        Сменить аватар
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          {/* Затемненный фон */}
          <div className="absolute inset-0 bg-black/60" onClick={() => !isSaving && setIsOpen(false)}></div>
          
          {/* Модальное окно */}
          <div className="relative bg-brand-bg border-2 border-brand-line rounded-brand-lg p-6 max-w-lg w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-2 border-brand-line pb-4">
              <h2 className="text-xl font-extrabold uppercase">Выберите аватар</h2>
              <button onClick={() => setIsOpen(false)} className="text-2xl font-bold hover:text-brand-accent">✕</button>
            </div>

            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
              {avatars.map((url, index) => (
                <button
                  key={index}
                  onClick={() => handleSelectAvatar(url)}
                  disabled={isSaving}
                  className={`aspect-square rounded-full overflow-hidden border-2 transition-all hover:scale-105 ${
                    currentAvatar === url ? 'border-brand-accent shadow-[0_0_0_2px_var(--color-brand-accent)]' : 'border-brand-line/30'
                  }`}
                >
                  <Image 
                    src={url} 
                    alt={`Аватар ${index + 1}`} 
                    width={100} 
                    height={100} 
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
            
            {isSaving && <p className="text-center font-bold mt-4 text-brand-accent animate-pulse">Сохранение...</p>}
          </div>
        </div>
      )}
    </>
  );
}