export {};

declare global {
  // Тип пользователя, которого возвращает Telegram
  interface TelegramUser {
    id: number;
    first_name: string;
    last_name?: string;
    username?: string;
    photo_url?: string;
    auth_date: number;
    hash: string;
  }

  interface Window {
    Telegram?: {
      Login: {
        auth: (
          options: { bot_id: string; request_access?: string },
          callback: (user: TelegramUser) => void
        ) => void;
      };
    };
    // Ставим знак "?", чтобы TypeScript разрешил делать delete
    onTelegramAuth?: (user: TelegramUser) => void | Promise<void>;
  }
}