export default function Loading() {
  return (
    <div className="fixed top-0 left-0 w-full h-1 z-[100] overflow-hidden bg-brand-bg">
      <div className="w-full h-full bg-brand-accent animate-progress origin-left"></div>
    </div>
  );
}