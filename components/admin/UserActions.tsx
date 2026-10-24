'use client';

import { useState } from 'react';
import { updateUserRole, toggleUserBan } from '@/app/actions';
import { useToast } from '@/components/Toast';
import { useRouter } from 'next/navigation';

export default function UserActions({ 
  userId, 
  currentRole, 
  isBanned,
  currentAdminId
}: { 
  userId: string; 
  currentRole: string; 
  isBanned: boolean;
  currentAdminId: string;
}) {
  const [loading, setLoading] = useState(false);
  const { showSuccess, showError } = useToast();
  const router = useRouter();

  // Если это сам админ — не даем ему менять себя
  const isSelf = userId === currentAdminId;

  const handleRoleChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newRole = e.target.value as 'user' | 'moderator' | 'admin';
    if (newRole === currentRole) return;

    if (!confirm(`Вы уверены, что хотите назначить роль "${newRole}"?`)) {
      e.target.value = currentRole; // Откатываем визуально
      return;
    }

    setLoading(true);
    try {
      const res = await updateUserRole(userId, newRole);
      if (res?.error) {
        showError(res.error);
        e.target.value = currentRole;
      } else {
        showSuccess('Роль успешно изменена');
        router.refresh();
      }
    } catch (error) {
      showError('Ошибка сети');
      e.target.value = currentRole;
    } finally {
      setLoading(false);
    }
  };

  const handleBanToggle = async () => {
    const action = isBanned ? 'разбанить' : 'забанить';
    if (!confirm(`Вы уверены, что хотите ${action} пользователя?`)) return;

    setLoading(true);
    try {
      const res = await toggleUserBan(userId, !isBanned);
      if (res?.error) showError(res.error);
      else {
        showSuccess(`Пользователь ${isBanned ? 'разбанен' : 'забанен'}`);
        router.refresh();
      }
    } catch (error) {
      showError('Ошибка сети');
    } finally {
      setLoading(false);
    }
  };

  if (isSelf) {
    return <span className="text-xs font-bold text-brand-muted">Это вы</span>;
  }

  return (
    <div className="flex items-center gap-2">
      <select 
        value={currentRole} 
        onChange={handleRoleChange}
        disabled={loading}
        className="bg-brand-bg border-2 border-brand-line rounded-brand p-1 text-xs font-bold outline-none focus:border-brand-accent"
      >
        <option value="user">Пользователь</option>
        <option value="moderator">Модератор</option>
        <option value="admin">Админ</option>
      </select>

      <button
        onClick={handleBanToggle}
        disabled={loading}
        className={`text-xs font-bold px-3 py-1.5 border-2 rounded-brand transition-colors ${
          isBanned 
            ? 'bg-green-100 text-green-700 border-green-300 hover:bg-green-200' 
            : 'bg-red-100 text-red-700 border-red-300 hover:bg-red-200'
        }`}
      >
        {isBanned ? 'Разбанить' : 'Забанить'}
      </button>
    </div>
  );
}