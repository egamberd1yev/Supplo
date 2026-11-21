// 68000 -> "68 000 so'm" (bo'linmaydigan probel bilan)
export const formatPrice = (n) =>
  `${String(n).replace(/\B(?=(\d{3})+(?!\d))/g, "\u00A0")}\u00A0so'm`;

export const getInitials = (name) =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
