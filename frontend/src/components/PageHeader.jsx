export default function PageHeader({ title, children }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <h1 className="text-[28px] font-bold text-ink">{title}</h1>
      {children}
    </div>
  );
}
