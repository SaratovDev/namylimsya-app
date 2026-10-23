'use client';

import { useEffect } from 'react';

export default function ScrollToTop() {
  useEffect(() => {
    // Принудительно скроллим страницу в самый верх при монтировании компонента
    window.scrollTo(0, 0);
  }, []);

  return null; // Компонент ничего не рендерит
}