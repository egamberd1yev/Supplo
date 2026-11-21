import { useState } from "react";
import { ChevronRight, Link2, Star } from "lucide-react";
import Button from "../../components/Button.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { useShop } from "../../context/ShopContext.jsx";
import { platformDealers } from "../../data/mock.js";
import { getInitials } from "../../lib/format.js";

const statusView = {
  connected: { tone: "success", label: "Ulangan" },
  pending: { tone: "warning", label: "Tasdiq kutilmoqda" },
  rejected: { tone: "danger", label: "Rad etilgan" },
};

export default function Dealers() {
  const { dealers, toggleSavedDealer, requestDealer } = useShop();
  const [code, setCode] = useState("");
  const [found, setFound] = useState(null);
  const [error, setError] = useState("");

  // Saqlanganlar tepada
  const sorted = [...dealers].sort((a, b) => Number(b.saved) - Number(a.saved));

  const search = (e) => {
    e.preventDefault();
    // TODO: GET /api/dealers/by-code/:code — backend ulanganda
    const dealer = platformDealers.find((d) => d.code === code.trim().toUpperCase());
    if (!dealer) {
      setFound(null);
      setError("Bunday kodli diller topilmadi");
    } else if (dealers.some((d) => d.id === dealer.id)) {
      setFound(null);
      setError(`${dealer.name} allaqachon ro'yxatingizda`);
    } else {
      setFound(dealer);
      setError("");
    }
  };

  const reset = () => {
    setFound(null);
    setCode("");
    setError("");
  };

  const sendRequest = () => {
    // TODO: POST /api/dealers/requests — backend ulanganda
    requestDealer(found);
    reset();
  };

  return (
    <>
      <PageHeader title="Dillerlar" />

      <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
        {/* Chap: kod kiritish */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-col gap-3.5 rounded-[14px] border border-line bg-white p-6">
            <h2 className="text-xl font-bold text-ink">Dillerga ulanish</h2>
            <p className="text-sm text-muted">
              Dilleringiz bergan ulanish kodini kiriting. Diller so'rovingizni tasdiqlagach, uning
              katalogi sizga ochiladi.
            </p>

            <form onSubmit={search} className="flex flex-col gap-3.5">
              <label htmlFor="dealer-code" className="text-[13px] font-semibold text-ink">
                Ulanish kodi
              </label>
              <div className="flex items-center gap-2.5">
                <div className="flex h-[52px] min-w-0 flex-1 items-center gap-2.5 rounded-xl border-[1.5px] border-line bg-white px-3.5 focus-within:border-primary">
                  <Link2 size={20} className="shrink-0 text-primary" />
                  <input
                    id="dealer-code"
                    value={code}
                    onChange={(e) => setCode(e.target.value.toUpperCase())}
                    placeholder="SUP-8C03"
                    autoComplete="off"
                    className="min-w-0 flex-1 bg-transparent text-lg font-bold tracking-[1.5px] text-ink outline-none placeholder:font-normal placeholder:text-muted/60"
                  />
                </div>
                <Button type="submit" disabled={!code.trim()}>
                  Topish
                </Button>
              </div>
            </form>

            {error && <p className="text-[13px] font-medium text-danger">{error}</p>}

            {found && (
              <div className="flex flex-col gap-3.5 rounded-[14px] border border-primary bg-soft-blue p-4">
                <div className="flex items-center gap-3">
                  <span className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary text-base font-bold text-white">
                    {getInitials(found.name)}
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="text-[17px] font-bold text-ink">{found.name}</p>
                    <p className="text-[13px] text-muted">
                      {found.city} · {found.about}
                    </p>
                  </div>
                  <StatusBadge tone="success">Topildi</StatusBadge>
                </div>

                <div className="flex gap-7">
                  <div>
                    <p className="text-lg font-bold text-primary">{found.productCount}</p>
                    <p className="text-xs text-muted">mahsulot</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-primary">{found.shopCount}</p>
                    <p className="text-xs text-muted">do'kon ulangan</p>
                  </div>
                </div>

                <Button className="h-12 w-full" onClick={sendRequest}>
                  Ulanish so'rovini yuborish
                </Button>
                <Button variant="outline" className="h-11 w-full" onClick={reset}>
                  Bekor qilish
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* O'ng: mening dillerlarim */}
        <div className="flex w-full shrink-0 flex-col gap-3 xl:w-[420px]">
          <p className="text-[13px] font-semibold text-muted">
            Mening dillerlarim · {dealers.length}
          </p>
          <div className="overflow-hidden rounded-[14px] border border-line bg-white">
            {sorted.map((d, i) => {
              const view = statusView[d.status];
              return (
                <div
                  key={d.id}
                  className={`flex items-center gap-3 px-4 py-3.5 ${i > 0 ? "border-t border-line" : ""}`}
                >
                  <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-soft-blue text-[13px] font-bold text-primary">
                    {getInitials(d.name)}
                  </span>
                  <div className="min-w-0 flex-1 leading-tight">
                    <p className="truncate text-sm font-semibold text-ink">{d.name}</p>
                    <p className="text-xs text-muted">{d.city}</p>
                  </div>
                  <StatusBadge tone={view.tone}>{view.label}</StatusBadge>
                  <button
                    type="button"
                    onClick={() => toggleSavedDealer(d.id)}
                    aria-pressed={d.saved}
                    aria-label={d.saved ? "Saqlanganlardan olib tashlash" : "Saqlab qo'yish"}
                    title={d.saved ? "Saqlanganlardan olib tashlash" : "Saqlab qo'yish"}
                    className="shrink-0 rounded-lg p-1.5 transition hover:bg-page"
                  >
                    <Star
                      size={18}
                      className={d.saved ? "fill-accent text-accent" : "text-muted"}
                    />
                  </button>
                  <ChevronRight size={18} className="shrink-0 text-muted" />
                </div>
              );
            })}
          </div>
          <p className="text-xs text-muted">
            ★ bilan belgilangan dillerlar Katalogdagi diller ro'yxatida tepada chiqadi.
          </p>
        </div>
      </div>
    </>
  );
}
