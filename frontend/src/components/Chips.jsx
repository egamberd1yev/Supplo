export default function Chips({ items, value, onChange }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item) => (
        <button
          key={item}
          type="button"
          onClick={() => onChange(item)}
          className={`rounded-full px-3.5 py-2 text-[13px] transition ${
            value === item
              ? "bg-primary font-semibold text-white"
              : "border border-line bg-white font-medium text-ink hover:border-primary/50"
          }`}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
