import React from 'react';

// какие данные принимает карточка
interface EventCardProps {
  category: string;
  date: string;
  countdown: string;
  spots: string;
  title: string;
  description: string;
  organizerName: string;
  organizerRank: string;
  isFull?: boolean;
}

export default function EventCard({
  category,
  date,
  countdown,
  spots,
  title,
  description,
  organizerName,
  organizerRank,
  isFull = false,
}: EventCardProps) {
  return (
    <article className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-5">
      <div className="flex flex-wrap items-center gap-3 mb-3">
        <span className="text-[12px] font-extrabold uppercase text-brand-cat bg-brand-cat-soft px-2.5 py-1 rounded border border-brand-cat">
          {category}
        </span>
        <div className="text-[15px] font-extrabold flex items-center gap-2">
          {date}
          <span className="text-[12px] font-extrabold text-brand-accent-ink bg-brand-accent px-2 py-0.5 rounded">
            {countdown}
          </span>
        </div>
        <span className={`ml-auto text-[13px] font-extrabold px-2.5 py-1 rounded border-2 border-brand-line ${isFull ? 'text-brand-muted bg-brand-bg line-through' : 'bg-brand-bg'}`}>
          {spots}
        </span>
      </div>
      
      <h2 className="text-2xl font-extrabold leading-tight mb-2">
        {title}
      </h2>
      
      <p className="text-[15px] text-brand-text mb-4 line-clamp-3">
        {description}
      </p>

      <div className="flex items-center gap-2.5 text-sm text-brand-muted mb-4">
        <span className="w-8 h-8 flex items-center justify-center rounded-full bg-brand-cat-soft text-brand-cat border-2 border-brand-cat font-extrabold text-sm uppercase">
          {organizerName.charAt(0)}
        </span>
        <span><b className="text-brand-text">{organizerName}</b> · <span className="text-brand-accent font-extrabold">{organizerRank}</span></span>
      </div>

      <div className="flex flex-wrap gap-3 border-t-2 border-dashed border-brand-line pt-4">
        <button 
          disabled={isFull}
          className={`flex-1 font-extrabold text-sm uppercase px-4 py-2.5 border-2 border-brand-line rounded-brand transition-colors ${
            isFull 
            ? 'bg-brand-bg text-brand-muted border-brand-muted cursor-not-allowed' 
            : 'bg-brand-accent text-brand-accent-ink hover:bg-brand-text hover:text-brand-bg'
          }`}
        >
          {isFull ? 'Мест нет' : 'Хочу участвовать'}
        </button>
        
        {!isFull && (
          <button className="bg-brand-surface text-brand-text font-extrabold text-sm uppercase px-4 py-2.5 border-2 border-brand-line rounded-brand hover:bg-brand-bg transition-colors">
            Чат события
          </button>
        )}
      </div>
    </article>
  );
}