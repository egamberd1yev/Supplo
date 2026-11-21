import { useEffect, useRef, useState } from "react";
import { Check, Package } from "lucide-react";
import Button from "./Button.jsx";
import { formatPrice } from "../lib/format.js";

export default function ProductCard({ product, onAdd }) {
  const [added, setAdded] = useState(false);
  const timer = useRef();

  useEffect(() => () => clearTimeout(timer.current), []);

  const handleAdd = () => {
    onAdd(product.id);
    setAdded(true);
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setAdded(false), 1200);
  };

  return (
    <div className="flex flex-col gap-2.5 rounded-[14px] border border-line bg-white p-3.5">
      <div className="flex h-[110px] items-center justify-center rounded-[10px] bg-soft-blue">
        <Package size={40} strokeWidth={1.5} className="text-primary" />
      </div>
      <p className="text-[15px] font-semibold text-ink">{product.name}</p>
      <p className="text-[13px] text-muted">Hajmi: {product.size}</p>
      <p className="text-base font-bold text-primary">{formatPrice(product.price)}</p>
      <Button size="sm" className="h-[38px] w-full gap-1.5" onClick={handleAdd}>
        {added ? (
          <>
            <Check size={16} strokeWidth={3} /> Qo'shildi
          </>
        ) : (
          "Savatga"
        )}
      </Button>
    </div>
  );
}
