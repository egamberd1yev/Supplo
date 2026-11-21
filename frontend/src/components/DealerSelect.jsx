import { ChevronDown } from "lucide-react";

// Saqlangan (kontaktdek belgilangan) dillerlar ro'yxatning tepasida alohida guruhda chiqadi
export default function DealerSelect({ dealers, value, onChange }) {
  const saved = dealers.filter((d) => d.saved);
  const others = dealers.filter((d) => !d.saved);
  const label = (d) => `${d.name} · ${d.city}`;

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="dealer-select" className="text-[13px] font-medium text-muted">
        Diller:
      </label>
      <div className="relative">
        <select
          id="dealer-select"
          value={value ?? ""}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-10 min-w-[230px] appearance-none rounded-xl border border-line bg-white pl-3.5 pr-9 text-[13px] font-semibold text-ink outline-none focus:border-primary"
        >
          {saved.length > 0 && (
            <optgroup label="★ Saqlangan dillerlar">
              {saved.map((d) => (
                <option key={d.id} value={d.id}>
                  {label(d)}
                </option>
              ))}
            </optgroup>
          )}
          {others.length > 0 && (
            <optgroup label="Boshqa dillerlar">
              {others.map((d) => (
                <option key={d.id} value={d.id}>
                  {label(d)}
                </option>
              ))}
            </optgroup>
          )}
        </select>
        <ChevronDown
          size={16}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted"
        />
      </div>
    </div>
  );
}
