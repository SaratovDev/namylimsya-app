export type ApplicationStatus = 'pending' | 'approved' | 'rejected';
export type EventListItemDTO = {
  id: string;
  organizerId: string;
  category: string;
  dateTime: string;
  title: string;
  description: string;
  organizerName: string;
  organizerRank: string;
  maxParticipants: number;
  approvedParticipantsCount: number;
  isFull: boolean;
  status: 'active' | 'cancelled';
  cancelReason?: string | null;
  // публичное представление места — всегда безопасно
  publicLocationLabel: string;      // "Парк Горького" или "Место скрыто организатором"
  locationIsHidden: boolean;       // факт скрытия, не сами данные
  city?: string | null;
  // точные данные — только если пользователь имеет право
  exactLocation?: string;           // undefined, если нет доступа
  lat?: number;                     // undefined, если нет доступа
  lng?: number;                     // undefined, если нет доступа
  myApplicationStatus: 'pending' | 'approved' | 'rejected' | null;
  isOrganizer: boolean;
  organizerAvatar?: string | null;
  organizerGender?: string | null;
  /** Количество непрочитанных сообщений в чате этого события */
  unreadCount: number;
};