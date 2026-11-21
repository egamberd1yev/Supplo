// Vaqtinchalik (mock) ma'lumotlar. Backend ulanganda /api so'rovlari bilan almashtiriladi.

// Katalog turkumlari ("Barchasi" chipi kodda qo'shiladi)
export const categories = [
  "Sementlar",
  "Bo'yoqlar",
  "Xom ashyolar",
  "G'ishtlar",
  "Armaturalar",
  "Boshqalar",
];

// Platformadagi dillerlar (kod bo'yicha qidiriladi)
export const platformDealers = [
  { id: 1, code: "SUP-7K29", name: "Namuna Zavod", city: "Toshkent", about: "Qurilish materiallari zavodi", productCount: 124, shopCount: 48 },
  { id: 2, code: "SUP-2B40", name: "Sifat Beton", city: "Samarqand", about: "Beton va qorishmalar", productCount: 37, shopCount: 15 },
  { id: 3, code: "SUP-9Q55", name: "Qurilish Zavodi", city: "Buxoro", about: "Qurilish materiallari", productCount: 58, shopCount: 22 },
  { id: 4, code: "SUP-3M81", name: "Metall Invest", city: "Andijon", about: "Armatura va profil ishlab chiqarish", productCount: 62, shopCount: 21 },
  { id: 5, code: "SUP-6P72", name: "Bo'yoq Markaz", city: "Farg'ona", about: "Bo'yoq va emulsiyalar", productCount: 85, shopCount: 33 },
  { id: 6, code: "SUP-8C03", name: "Chirchiq Qum", city: "Chirchiq", about: "Qum, shag'al va xom ashyo", productCount: 14, shopCount: 9 },
];

export const getDealer = (id) => platformDealers.find((d) => d.id === id);

// Do'konning dillerlar bilan aloqalari (Figma'dagi 3 tasi + test uchun 2 ta ulangan)
export const initialConnections = [
  { dealerId: 1, status: "connected", saved: true },
  { dealerId: 2, status: "pending", saved: false },
  { dealerId: 3, status: "rejected", saved: false },
  { dealerId: 4, status: "connected", saved: false },
  { dealerId: 5, status: "connected", saved: false },
];

export const products = [
  // Namuna Zavod
  { id: 1, dealerId: 1, name: "Sement M400", size: "50 kg", price: 68000, category: "Sementlar" },
  { id: 2, dealerId: 1, name: "Gips-karton 12.5", size: "1200×2500 mm", price: 54000, category: "Boshqalar" },
  { id: 3, dealerId: 1, name: "Fasad bo'yog'i", size: "18 litr", price: 420000, category: "Bo'yoqlar" },
  { id: 4, dealerId: 1, name: "Armatura Ø12", size: "11.7 m", price: 112000, category: "Armaturalar" },
  { id: 5, dealerId: 1, name: "G'isht M150", size: "1 dona", price: 1850, category: "G'ishtlar" },
  { id: 6, dealerId: 1, name: "Kafel 30×60", size: "1.44 m²", price: 89000, category: "Boshqalar" },
  { id: 7, dealerId: 1, name: "Profil CD 60", size: "3 m", price: 21000, category: "Boshqalar" },
  { id: 8, dealerId: 1, name: "Emulsiya 10 L", size: "10 litr", price: 245000, category: "Bo'yoqlar" },
  { id: 9, dealerId: 1, name: "Qum (1 tonna)", size: "1 tonna", price: 180000, category: "Xom ashyolar" },
  { id: 10, dealerId: 1, name: "Shag'al (1 tonna)", size: "1 tonna", price: 210000, category: "Xom ashyolar" },
  // Metall Invest
  { id: 11, dealerId: 4, name: "Armatura Ø10", size: "11.7 m", price: 95000, category: "Armaturalar" },
  { id: 12, dealerId: 4, name: "Armatura Ø14", size: "11.7 m", price: 148000, category: "Armaturalar" },
  { id: 13, dealerId: 4, name: "Profil UD 27", size: "3 m", price: 18000, category: "Boshqalar" },
  // Bo'yoq Markaz
  { id: 14, dealerId: 5, name: "Emulsiya 20 L", size: "20 litr", price: 460000, category: "Bo'yoqlar" },
  { id: 15, dealerId: 5, name: "Alkid emal", size: "3 kg", price: 135000, category: "Bo'yoqlar" },
  { id: 16, dealerId: 5, name: "Lak", size: "5 litr", price: 98000, category: "Bo'yoqlar" },
];

export const initialCart = { 1: 4, 2: 10, 3: 1 }; // { mahsulotId: soni }
export const initialSaved = [1, 2, 3, 4];

// items: { productId, qty } — "Qayta buyurtma" shu tarkibni savatga qo'shadi
export const orders = [
  { id: 1042, status: "transit", date: "11-noyabr", delivery: "Ertaga, 14:00–18:00", total: 812000, items: [{ productId: 1, qty: 4 }, { productId: 2, qty: 10 }] },
  { id: 1038, status: "delivered", date: "4-noyabr", delivery: "Yetkazildi 5-noyabr", total: 536000, items: [{ productId: 2, qty: 5 }, { productId: 4, qty: 2 }, { productId: 7, qty: 2 }] },
  { id: 1031, status: "delivered", date: "28-oktabr", delivery: "Yetkazildi 29-oktabr", total: 1240000, items: [{ productId: 1, qty: 3 }, { productId: 4, qty: 7 }, { productId: 7, qty: 12 }] },
  { id: 1027, status: "delivered", date: "21-oktabr", delivery: "Yetkazildi 22-oktabr", total: 284000, items: [{ productId: 2, qty: 4 }, { productId: 1, qty: 1 }] },
  { id: 1019, status: "delivered", date: "14-oktabr", delivery: "Yetkazildi 15-oktabr", total: 690000, items: [{ productId: 1, qty: 5 }, { productId: 7, qty: 5 }, { productId: 8, qty: 1 }] },
  { id: 1012, status: "delivered", date: "9-oktabr", delivery: "Yetkazildi 10-oktabr", total: 1108000, items: [{ productId: 1, qty: 6 }, { productId: 7, qty: 10 }, { productId: 8, qty: 2 }] },
];
