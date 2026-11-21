import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Truck } from "lucide-react";
import Button from "../../components/Button.jsx";
import Chips from "../../components/Chips.jsx";
import ConfirmDialog from "../../components/ConfirmDialog.jsx";
import PageHeader from "../../components/PageHeader.jsx";
import StatusBadge from "../../components/StatusBadge.jsx";
import { useShop } from "../../context/ShopContext.jsx";
import { orders } from "../../data/mock.js";
import { formatPrice } from "../../lib/format.js";

const filters = { Hammasi: null, "Yo'lda": "transit", Yetkazildi: "delivered" };
const statusView = {
  transit: { tone: "info", label: "Yo'lda" },
  delivered: { tone: "success", label: "Yetkazildi" },
};

export default function Orders() {
  const navigate = useNavigate();
  const { addItems } = useShop();
  const [filter, setFilter] = useState("Hammasi");
  const [pendingOrder, setPendingOrder] = useState(null);

  const status = filters[filter];
  const visible = status ? orders.filter((o) => o.status === status) : orders;

  const confirmReorder = () => {
    // TODO: backend ulanganda buyurtma tarkibi serverdan olinadi
    addItems(pendingOrder.items);
    setPendingOrder(null);
    navigate("/dokon/savat");
  };

  return (
    <>
      <PageHeader title="Buyurtmalar" />
      <Chips items={Object.keys(filters)} value={filter} onChange={setFilter} />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {visible.map((order) => {
          const view = statusView[order.status];
          const count = order.items.reduce((s, i) => s + i.qty, 0);
          return (
            <div
              key={order.id}
              className="flex flex-col gap-2.5 rounded-[14px] border border-line bg-white p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-base font-bold text-ink">#{order.id}</p>
                <StatusBadge tone={view.tone}>{view.label}</StatusBadge>
              </div>
              <p className="text-[13px] text-muted">
                {order.date} · {count} ta mahsulot
              </p>
              <div className="flex items-center gap-2">
                <Truck size={18} className="shrink-0 text-primary" />
                <p className="text-[13px] font-medium text-ink">{order.delivery}</p>
              </div>
              <div className="h-px bg-line" />
              <div className="flex items-center justify-between gap-2">
                <p className="text-base font-bold text-ink">{formatPrice(order.total)}</p>
                <Button variant="outline" size="compact" onClick={() => setPendingOrder(order)}>
                  Qayta buyurtma
                </Button>
              </div>
            </div>
          );
        })}
      </div>

      <ConfirmDialog
        open={Boolean(pendingOrder)}
        title="Rostdan ham qayta buyurtma qilmoqchimisiz?"
        text={pendingOrder && `#${pendingOrder.id} buyurtmadagi mahsulotlar savatga qo'shiladi.`}
        confirmText="Ha, qayta buyurtma"
        onConfirm={confirmReorder}
        onCancel={() => setPendingOrder(null)}
      />
    </>
  );
}
