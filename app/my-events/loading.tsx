export default function MyEventsLoading() {
  return (
    <main className="max-w-[1280px] mx-auto px-6 py-10 min-h-screen">
      <div className="h-10 w-64 bg-brand-line/20 animate-pulse rounded mb-8 border-b-2 border-brand-line pb-4"></div>
      
      <div className="flex flex-col gap-8">
        {[1, 2].map((i) => (
          <div key={i} className="bg-brand-surface border-2 border-brand-line rounded-brand-lg p-6 h-64 animate-pulse">
            <div className="h-8 w-1/2 bg-brand-line/20 mb-4 rounded"></div>
            <div className="h-4 w-1/3 bg-brand-line/20 mb-8 rounded"></div>
            <div className="grid grid-cols-2 gap-6 border-t-2 border-dashed border-brand-line pt-6">
              <div className="h-20 bg-brand-line/20 rounded"></div>
              <div className="h-20 bg-brand-line/20 rounded"></div>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}