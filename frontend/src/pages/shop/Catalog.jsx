import { useState } from "react";
import { Link } from "react-router-dom";
import { Search } from "lucide-react";
import Button from "../../components/Button.jsx";
import Chips from "../../components/Chips.jsx";
import DealerSelect from "../../components/DealerSelect.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import ProductCard from "../../components/ProductCard.jsx";
import { useShop } from "../../context/ShopContext.jsx";
import { categories, products } from "../../data/mock.js";

const ALL = "Barchasi";

export default function Catalog() {
  const { totalQty, addToCart, connectedDealers, selectedDealer, setSelectedDealerId } = useShop();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState(ALL);

  const visible = products.filter(
    (p) =>
      p.dealerId === selectedDealer?.id &&
      (category === ALL || p.category === category) &&
      p.name.toLowerCase().includes(query.trim().toLowerCase())
  );

  return (
    <>
      <PageHeader title="Katalog">
        <Button as={Link} to="/dokon/savat" size="sm">
          Savatda · {totalQty}
        </Button>
      </PageHeader>

      {!selectedDealer ? (
        <div className="flex flex-col items-center gap-4 rounded-[14px] border border-line bg-white py-16">
          <p className="text-sm text-muted">Katalogni ko'rish uchun avval dillerga ulaning</p>
          <Button as={Link} to="/dokon/dillerlar" size="sm">
            Dillerlarga o'tish
          </Button>
        </div>
      ) : (
        <>
          <div className="flex h-[46px] items-center gap-2.5 rounded-xl border border-line bg-white px-3.5 focus-within:border-primary">
            <Search size={20} className="shrink-0 text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Mahsulot qidirish..."
              className="min-w-0 flex-1 bg-transparent text-[15px] outline-none placeholder:text-muted"
            />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3">
            <Chips items={[ALL, ...categories]} value={category} onChange={setCategory} />
            <DealerSelect
              dealers={connectedDealers}
              value={selectedDealer.id}
              onChange={setSelectedDealerId}
            />
          </div>

          <p className="text-[13px] font-semibold text-muted">{selectedDealer.name} mahsulotlari</p>

          {visible.length === 0 ? (
            <p className="py-10 text-center text-sm text-muted">Hech narsa topilmadi</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visible.map((p) => (
                <ProductCard key={p.id} product={p} onAdd={addToCart} />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
