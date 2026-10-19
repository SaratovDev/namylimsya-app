'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';

export default function MobileFilters() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="lg:hidden w-full py-3 bg-brand-surface border-2 border-brand-line rounded-brand font-extrabold uppercase flex items-center justify-center gap-2"
      >
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="4" y1="21" x2="4" y2="14"></line><line x1="4" y1="10" x2="4" y2="3"></line><line x1="12" y1="21" x2="12" y2="12"></line><line x1="12" y1="8" x2="12" y2="3"></line><line x1="20" y1="21" x2="20" y2="16"></line><line x1="20" y1="12" x2="20" y2="3"></line><line x1="1" y1="14" x2="7" y2="14"></line><line x1="9" y1="8" x2="15" y2="8"></line><line x1="17" y1="16" x2="23" y2="16"></line></svg>
        Фильтры
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={() => setIsOpen(false)}></div>
          <div className="relative bg-brand-bg border-t-2 border-brand-line rounded-t-[24px] p-6 animate-slide-up pb-10 max-h-[85vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 border-b-2 border-brand-line pb-4">
              <h3 className="text-xl font-extrabold uppercase">Фильтры</h3>
              <button onClick={() => setIsOpen(false)} className="text-2xl font-bold px-2">✕</button>
            </div>
            
            {/* Просто рендерим Sidebar как есть */}
            <Sidebar />
            
            <button 
              onClick={() => setIsOpen(false)}
              className="w-full mt-6 bg-brand-accent text-brand-accent-ink font-extrabold text-sm uppercase px-6 py-3.5 border-2 border-brand-line rounded-brand sticky bottom-0"
            >
              Применить
            </button>
          </div>
        </div>
      )}
    </>
  );
}