import { Fragment } from "react";
import { Link } from "react-router-dom";
import { Package, Trash2, Truck } from "lucide-react";
import Button from "../../components/Button.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import { useShop } from "../../context/ShopContext.jsx";
import { getDealer } from "../../data/mock.js";
import { formatPrice } from "../../lib/format.js";

const qtyBtn =
  "flex size-[30px] items-center justify-center rounded-lg border border-line bg-white text-base font-semibold text-ink transition hover:border-primary/50 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line";

export default function Cart() {
  const { cartItems, totalQty, totalPrice, changeQty, removeFromCart } = useShop();

  const placeOrder = () => {
    // TODO: POST /api/orders — backend ulanganda (har bir diller uchun alohida buyurtma)
    console.log("Buyurtma:", cartItems);
  };

  return (
    <>
      <PageHeader title="Savat" />

      {cartItems.length === 0 ? (
        <div className="flex flex-col items-center gap-4 rounded-[14px] border border-line bg-white py-16">
          <p className="text-sm text-muted">Savatingiz bo'sh</p>
          <Button as={Link} to="/dokon/katalog" size="sm">
            Katalogga o'tish
          </Button>
        </div>
      ) : (
        <div className="flex flex-col gap-6 xl:flex-row xl:items-start">
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {cartItems.map((item, i) => (
              <Fragment key={item.id}>
                {/* Har bir diller mahsulotlari tepasida diller nomi */}
                {(i === 0 || cartItems[i - 1].dealerId !== item.dealerId) && (
                  <p className="mt-1 text-[13px] font-semibold text-muted first:mt-0">
                    {getDealer(item.dealerId)?.name}
                  </p>
                )}

                <div className="flex items-center gap-4 rounded-[14px] border border-line bg-white p-4">
                  <span className="flex size-16 shrink-0 items-center justify-center rounded-xl bg-soft-blue">
                    <Package size={28} strokeWidth={1.5} className="text-primary" />
                  </span>

                  <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
                    <p className="truncate text-[15px] font-semibold text-ink">{item.name}</p>
                    <p className="truncate text-[13px] text-muted">
                      Hajmi: {item.size} · {formatPrice(item.price)}
                    </p>
                  </div>

                  <div className="flex shrink-0 items-center gap-2.5">
                    <button
                      type="button"
                      className={qtyBtn}
                      onClick={() => changeQty(item.id, -1)}
                      disabled={item.qty <= 1}
                      aria-label="Kamaytirish"
                    >
                      –
                    </button>
                    <span className="min-w-5 text-center text-[15px] font-semibold text-ink">
                      {item.qty}
                    </span>
                    <button
                      type="button"
                      className={qtyBtn}
                      onClick={() => changeQty(item.id, 1)}
                      aria-label="Ko'paytirish"
                    >
                      +
                    </button>
                  </div>

                  <p className="w-[120px] shrink-0 text-right text-base font-bold text-primary">
                    {formatPrice(item.qty * item.price)}
                  </p>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id)}
                    aria-label={`${item.name} ni savatdan o'chirish`}
                    title="Savatdan o'chirish"
                    className="shrink-0 rounded-lg p-2 text-muted transition hover:bg-danger-soft hover:text-danger"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </Fragment>
            ))}
          </div>

          <div className="flex w-full shrink-0 flex-col gap-3.5 rounded-[14px] border border-line bg-white p-5 xl:w-[380px]">
            <p className="text-base font-bold text-ink">Buyurtma xulosasi</p>

            <div className="flex items-center gap-2.5">
              <Truck size={22} className="shrink-0 text-primary" />
              <div className="leading-tight">
                <p className="text-[13px] font-medium text-muted">Yetkazib berish</p>
                <p className="text-sm font-semibold text-ink">Ertaga, 14:00–18:00</p>
              </div>
            </div>

            <div className="h-px bg-line" />

            <div className="flex items-start justify-between text-[13px]">
              <span className="text-muted">Mahsulotlar ({totalQty} dona)</span>
              <span className="font-medium text-ink">{formatPrice(totalPrice)}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-[15px] font-semibold text-ink">Jami</span>
              <span className="text-xl font-bold text-primary">{formatPrice(totalPrice)}</span>
            </div>

            <Button className="h-12 w-full" onClick={placeOrder}>
              Buyurtma berish
            </Button>
          </div>
        </div>
      )}
    </>
  );
}
