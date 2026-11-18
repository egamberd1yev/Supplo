export default function Field({ label, icon: Icon, right, id, ...inputProps }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <label htmlFor={id} className="text-[13px] font-semibold text-ink">
        {label}
      </label>
      <div className="flex h-[50px] items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 focus-within:border-primary">
        {Icon && <Icon size={20} className="shrink-0 text-muted" />}
        <input
          id={id}
          className="min-w-0 flex-1 bg-transparent text-[15px] text-ink outline-none placeholder:text-muted/70"
          {...inputProps}
        />
        {right}
      </div>
    </div>
  );
}
