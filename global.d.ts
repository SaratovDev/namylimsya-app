export {};

declare global {
  interface Window {
    Telegram?: {
      Login: {
        auth: (
          options: { bot_id: string; request_access?: string },
          callback: (user: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            photo_url?: string;
            auth_date: number;
            hash: string;
          }) => void
        ) => void;
      };
    };
    onTelegramAuth: (user: any) => void;
  }
}