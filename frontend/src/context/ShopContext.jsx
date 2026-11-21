import { createContext, useContext, useState } from "react";
import { getDealer, initialCart, initialConnections, initialSaved, products } from "../data/mock.js";

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [cart, setCart] = useState(initialCart); // { [productId]: qty }
  const [saved] = useState(initialSaved);

  // Dillerlar: aloqa holati + "saqlangan" (kontaktdek) belgisi
  const [dealers, setDealers] = useState(() =>
    initialConnections.map((c) => ({ ...getDealer(c.dealerId), status: c.status, saved: c.saved }))
  );
  const [selectedDealerId, setSelectedDealerId] = useState(() => {
    const connected = initialConnections.filter((c) => c.status === "connected");
    return (connected.find((c) => c.saved) ?? connected[0])?.dealerId ?? null;
  });

  const connectedDealers = dealers.filter((d) => d.status === "connected");
  const selectedDealer =
    connectedDealers.find((d) => d.id === selectedDealerId) ?? connectedDealers[0] ?? null;

  // ---- Savat ----
  const addToCart = (id, qty = 1) =>
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + qty }));

  const addItems = (items) =>
    setCart((c) => {
      const copy = { ...c };
      items.forEach(({ productId, qty }) => (copy[productId] = (copy[productId] || 0) + qty));
      return copy;
    });

  // Son 1 dan kamaymaydi; o'chirish uchun removeFromCart ishlatiladi
  const changeQty = (id, delta) =>
    setCart((c) => {
      const next = (c[id] || 0) + delta;
      return next < 1 ? c : { ...c, [id]: next };
    });

  const removeFromCart = (id) =>
    setCart((c) => {
      const copy = { ...c };
      delete copy[id];
      return copy;
    });

  const addAllSaved = () => addItems(saved.map((productId) => ({ productId, qty: 1 })));

  // ---- Dillerlar ----
  const toggleSavedDealer = (id) =>
    setDealers((list) => list.map((d) => (d.id === id ? { ...d, saved: !d.saved } : d)));

  const requestDealer = (dealer) =>
    setDealers((list) =>
      list.some((d) => d.id === dealer.id) ? list : [{ ...dealer, status: "pending", saved: false }, ...list]
    );

  const cartItems = products
    .filter((p) => cart[p.id])
    .map((p) => ({ ...p, qty: cart[p.id] }))
    .sort((a, b) => a.dealerId - b.dealerId);

  const value = {
    cartItems,
    totalQty: cartItems.reduce((s, i) => s + i.qty, 0),
    totalPrice: cartItems.reduce((s, i) => s + i.qty * i.price, 0),
    savedProducts: products.filter((p) => saved.includes(p.id)),
    addToCart,
    addItems,
    changeQty,
    removeFromCart,
    addAllSaved,
    dealers,
    connectedDealers,
    selectedDealer,
    setSelectedDealerId,
    toggleSavedDealer,
    requestDealer,
  };

  return <ShopContext.Provider value={value}>{children}</ShopContext.Provider>;
}

export const useShop = () => useContext(ShopContext);
