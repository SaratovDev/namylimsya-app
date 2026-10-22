'use client';

import { useEffect, useState } from 'react';

export default function Countdown({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState<string>('...');
  const [isUrgent, setIsUrgent] = useState(false);
  const [isPast, setIsPast] = useState(false);

  useEffect(() => {
    const calculateTime = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime();

      if (difference <= 0) {
        setIsPast(true);
        setTimeLeft('Началось');
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));

      // Если осталось меньше 4 часов, делаем акцент
      if (days === 0 && hours < 4) {
        setIsUrgent(true);
        setTimeLeft(`Осталось ${hours} ч ${minutes} мин`);
      } else {
        setIsUrgent(false);
        if (days > 0) {
          setTimeLeft(`Осталось ${days} д ${hours} ч`);
        } else {
          setTimeLeft(`Осталось ${hours} ч ${minutes} мин`);
        }
      }
    };

    calculateTime(); // Считаем сразу
    const timer = setInterval(calculateTime, 60000); // Обновляем каждую минуту

    return () => clearInterval(timer);
  }, [targetDate]);

  if (isPast) {
    return (
      <span className="text-[12px] font-bold text-brand-muted">
        Событие началось
      </span>
    );
  }

  return (
    <div className="flex flex-col">
      <span className="text-[12px] font-regular text-brand-muted leading-tight">
        До события:
      </span>
      <span className={`text-[12px] font-regular text-brand-muted leading-tight ${
        isUrgent ? 'text-brand-accent' : 'text-brand-muted'
      }`}>
        {timeLeft.replace('Осталось ', '')}
      </span>
    </div>
  ); }