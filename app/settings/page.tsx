'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';


const INTERESTS_LIST = [
  'Спорт', 'Кино', 'Музыка', 'Игры', 'Книги', 'Фотография', 'Кулинария', 'Путешествия', 
  'Искусство', 'IT и технологии', 'Животные', 'Психология', 'Бизнес', 'Танцы', 'Театр', 
  'Йога', 'Настолки', 'Автомобили', 'Мода', 'Наука'
];

export default function SettingsPage() {
  const [usernameInput, setUsernameInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
const [profile, setProfile] = useState<{ id: string; username: string } | null>(null);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Стейты полей
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('none');
  const [bio, setBio] = useState('');
  const [telegram, setTelegram] = useState('');
  const [vk, setVk] = useState('');
  const [interests, setInterests] = useState<string[]>([]);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) {
        router.push('/login');
        return;
      }
      supabase.from('profiles').select('*').eq('id', user.id).single().then(({ data }) => {
        if (data) {
          setProfile(data);
          setUsernameInput(data.username || '');
          setAge(data.age?.toString() || '');
          setGender(data.gender || 'none');
          setBio(data.bio || '');
          setTelegram(data.telegram || '');
          setVk(data.vk || '');
          setInterests(data.interests || []);
        }
        setLoading(false);
      });
    });
  }, [router]);

  const toggleInterest = (interest: string) => {
    if (interests.includes(interest)) {
      setInterests(interests.filter(i => i !== interest));
    } else {
      if (interests.length >= 5) {
        showError('Можно выбрать не более 5 увлечений');
        return;
      }
      setInterests([...interests, interest]);
    }
  };

const handleSave = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!profile) return;
  
  // Простая валидация ника
  if (usernameInput.length < 3) {
    showError('Никнейм должен быть не короче 3 символов');
    return;
  }

  setSaving(true);
  try {
    const { error } = await supabase.from('profiles').update({
      username: usernameInput, // <--- ДОБАВЬ ЭТО
      age: age ? parseInt(age) : null,
      gender,
      bio: bio.trim() || null,
      telegram: telegram.trim() || null,
      vk: vk.trim() || null,
      interests: interests.length > 0 ? interests : null
    }).eq('id', profile.id);

    if (error) {
      // Если база выдала ошибку уникальности (такой ник уже есть)
      if (error.code === '23505') {
        throw new Error('Этот никнейм уже занят. Выберите другой.');
      }
      throw error;
    }
    
    showSuccess('Профиль успешно обновлен!');
    // Обновляем URL профиля, если ник изменился
    router.push(`/@${usernameInput}`);
    router.refresh();
  } catch (error) {
    showError(error instanceof Error ? error.message : 'Ошибка сохранения профиля');
  } finally {
    setSaving(false);
  }
};

  if (loading) return <div className="text-center py-20 font-bold">Загрузка...</div>;

  return (
    <main className="max-w-2xl mx-auto px-4 py-10">
      <div className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 md:p-8">
        <h1 className="text-2xl font-extrabold uppercase mb-6 border-b-2 border-brand-line pb-4">
          Настройки профиля
        </h1>

        <form onSubmit={handleSave} className="flex flex-col gap-6">
          <div className="flex flex-col gap-1.5 mb-4">
  <label className="text-[12px] font-extrabold uppercase text-brand-muted">Ваш никнейм (публичное имя)</label>
  <input 
    type="text" 
    value={usernameInput} 
    onChange={e => setUsernameInput(e.target.value.replace(/[^a-zA-Zа-яА-Я0-9_]/g, ''))} 
    required 
    minLength={3}
    maxLength={32}
    className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent" 
  />
  <span className="text-[11px] text-brand-muted font-bold">Разрешены буквы, цифры и _. Должен быть уникальным.</span>
</div>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-extrabold uppercase text-brand-muted">Возраст</label>
              <input type="number" value={age} onChange={e => setAge(e.target.value)} min="14" max="99" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent" />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-extrabold uppercase text-brand-muted">Пол</label>
              <select value={gender} onChange={e => setGender(e.target.value)} className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent">
                <option value="male">Мужской</option>
                <option value="female">Женский</option>
                <option value="none">Не указывать</option>
              </select>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted">О себе</label>
            <textarea value={bio} onChange={e => setBio(e.target.value)} rows={4} maxLength={500} placeholder="Расскажите о себе, чем занимаетесь, что ищете..." className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent resize-none" />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-[12px] font-extrabold uppercase text-brand-muted flex justify-between">
              <span>Увлечения</span>
              <span className="text-brand-accent">Выбрано: {interests.length}/5</span>
            </label>
            <div className="flex flex-wrap gap-2 mt-1">
              {INTERESTS_LIST.map(interest => (
                <button
                  type="button"
                  key={interest}
                  onClick={() => toggleInterest(interest)}
                  className={`text-xs font-bold px-3 py-1.5 rounded-full border-2 transition-colors ${
                    interests.includes(interest) 
                      ? 'bg-brand-accent text-white border-brand-accent' 
                      : 'bg-brand-bg text-brand-text border-brand-line hover:border-brand-accent'
                  }`}
                >
                  {interest}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t-2 border-dashed border-brand-line pt-6">
            <div className="flex flex-col gap-1.5">
              <label className="text-[12px] font-extrabold uppercase text-brand-muted">Telegram (без @)</label>
              <input type="text" value={telegram} onChange={e => setTelegram(e.target.value)} placeholder="username" className="p-2.5 bg-brand-bg border-2 border-brand-line rounded-brand outline-none focus:border-brand-accent" />
            </div>
          </div>

          <div className="flex gap-4 mt-4">
            <button type="button" onClick={() => router.back()} className="flex-1 bg-brand-bg text-brand-text font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-surface transition-colors">
              Отмена
            </button>
            <button type="submit" disabled={saving} className="flex-1 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand hover:bg-brand-text hover:text-brand-bg transition-colors disabled:opacity-50">
              {saving ? 'Сохранение...' : 'Сохранить'}
            </button>
          </div>
        </form>

      </div>
    </main>
  );
}