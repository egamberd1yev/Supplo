import { In } from "typeorm";
import { AppDataSource } from "../config/data-source.js";
import { getDealerByUserId, getShopByUserId } from "../utils/profile.js";

const STATUSES = ["pending", "confirmed", "rejected", "cancelled", "delivering", "delivered"];

const STATUS_LABELS = {
  pending: "tasdiqlanishini kutmoqda",
  confirmed: "tasdiqlandi",
  rejected: "rad etildi",
  cancelled: "bekor qilindi",
  delivering: "yo'lga chiqdi",
  delivered: "yetkazildi",
};

// Kim, qaysi holatdan, qaysi holatga o'tkaza oladi
const TRANSITIONS = {
  shop: {
    pending: ["cancelled"],
  },
  dealer: {
    pending: ["confirmed", "rejected"],
    confirmed: ["delivering", "cancelled"],
    delivering: ["delivered"],
  },
};

// Diller shu holatlarga o'tkazganda sabab yozishi shart
const DEALER_COMMENT_REQUIRED = ["rejected", "cancelled"];

const FULL_RELATIONS = {
  dealer: { user: true },
  shop: { user: true },
  items: { product: true },
  history: true,
};

const num = (v) => (v === null || v === undefined ? null : Number(v));

function toOrderDto(o) {
  return {
    id: o.id,
    status: o.status,
    note: o.note,
    dealerNote: o.dealerNote,
    deliveryAddress: o.deliveryAddress,
    totalAmount: num(o.totalAmount),
    confirmedAt: o.confirmedAt,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt,
    dealer: o.dealer
      ? {
        id: o.dealer.id,
        companyName: o.dealer.companyName,
        address: o.dealer.address,
        phone: o.dealer.user?.phone ?? null,
      }
      : undefined,
    shop: o.shop
      ? {
        id: o.shop.id,
        name: o.shop.name,
        address: o.shop.address,
        phone: o.shop.phone,
      }
      : undefined,
    items: o.items
      ? [...o.items]
        .sort((a, b) => a.id - b.id)
        .map((i) => ({
          id: i.id,
          productId: i.product?.id ?? null,
          productName: i.productName,
          productSize: i.productSize,
          unitPrice: num(i.unitPrice),
          quantity: i.quantity,
          lineTotal: Math.round(Number(i.unitPrice) * i.quantity * 100) / 100,
        }))
      : undefined,
    history: o.history
      ? [...o.history]
        .sort((a, b) => a.id - b.id)
        .map((h) => ({
          id: h.id,
          status: h.status,
          actorRole: h.actorRole,
          comment: h.comment,
          createdAt: h.createdAt,
        }))
      : undefined,
  };
}

function loadOrder(id) {
  return AppDataSource.manager.findOne("Order", {
    where: { id },
    relations: FULL_RELATIONS,
  });
}

function getActorProfile(req) {
  return req.user.role === "dealer"
    ? getDealerByUserId(req.user.id)
    : getShopByUserId(req.user.id);
}

function ownsOrder(role, profile, order) {
  return role === "dealer"
    ? order.dealer.id === profile.id
    : order.shop.id === profile.id;
}

// POST /api/orders   { dealerId, items: [{ productId, quantity }], note }
export async function createOrder(req, res) {
  try {
    const { dealerId, items, note, deliveryAddress } = req.body || {};

    const dId = Number(dealerId);
    if (!Number.isInteger(dId)) {
      return res.status(400).json({ message: "dealerId noto'g'ri" });
    }
    if (!Array.isArray(items) || items.length === 0 || items.length > 100) {
      return res
        .status(400)
        .json({ message: "items bo'sh bo'lmasligi va 100 tadan oshmasligi kerak" });
    }

    const noteText = String(note ?? "").trim();
    if (noteText.length > 500) {
      return res.status(400).json({ message: "Izoh 500 belgidan oshmasligi kerak" });
    }
    const deliveryAddressInput = String(deliveryAddress ?? "").trim();
    if (deliveryAddressInput.length > 300) {
      return res
        .status(400)
        .json({ message: "Yetkazish manzili 300 belgidan oshmasligi kerak" });
    }

    // Bir xil mahsulot ikki marta kelsa, miqdorlarini qo'shamiz
    const qtyById = new Map();
    for (const it of items) {
      const productId = Number(it?.productId);
      const quantity = Number(it?.quantity);
      if (
        !Number.isInteger(productId) ||
        !Number.isInteger(quantity) ||
        quantity < 1
      ) {
        return res
          .status(400)
          .json({ message: "Har bir item uchun productId va quantity (butun son, kamida 1) kerak" });
      }
      qtyById.set(productId, (qtyById.get(productId) || 0) + quantity);
    }
    for (const q of qtyById.values()) {
      if (q > 100000) {
        return res.status(400).json({ message: "Miqdor juda katta" });
      }
    }

    const shop = await getShopByUserId(req.user.id);
    if (!shop) {
      return res.status(404).json({ message: "Do'kon profili topilmadi" });
    }

    const link = await AppDataSource.manager.findOne("DealerShop", {
      where: { dealer: { id: dId }, shop: { id: shop.id }, status: "active" },
    });
    if (!link) {
      return res.status(403).json({ message: "Siz bu dillerga ulanmagansiz" });
    }

    const dealer = await AppDataSource.manager.findOne("Dealer", {
      where: { id: dId },
      relations: { user: true },
    });
    if (!dealer) {
      return res.status(404).json({ message: "Diller topilmadi" });
    }

    const products = await AppDataSource.manager.find("Product", {
      where: {
        id: In([...qtyById.keys()]),
        dealer: { id: dId },
        isActive: true,
      },
    });
    if (products.length !== qtyById.size) {
      return res
        .status(400)
        .json({ message: "Ba'zi mahsulotlar topilmadi yoki o'chirilgan" });
    }

    const unpriced = products.find((p) => p.price === null || p.price === undefined);
    if (unpriced) {
      return res.status(400).json({
        message: `"${unpriced.name}" mahsulotining narxi belgilanmagan, uni buyurtma qilib bo'lmaydi`,
      });
    }

    const totalAmount =
      Math.round(
        products.reduce((sum, p) => sum + Number(p.price) * qtyById.get(p.id), 0) * 100
      ) / 100;

    const created = await AppDataSource.transaction(async (m) => {
      const order = await m.save(
        "Order",
        m.create("Order", {
          status: "pending",
          note: noteText || null,
          deliveryAddress: deliveryAddressInput || shop.address,
          totalAmount,
          dealer,
          shop,
        })
      );

      await m.save(
        "OrderItem",
        products.map((p) =>
          m.create("OrderItem", {
            order,
            product: p,
            productName: p.name,
            productSize: p.size,
            unitPrice: Number(p.price),
            quantity: qtyById.get(p.id),
          })
        )
      );

      await m.save(
        "OrderStatusHistory",
        m.create("OrderStatusHistory", {
          order,
          status: "pending",
          actorRole: "shop",
          comment: noteText || null,
        })
      );

      await m.save(
        "Notification",
        m.create("Notification", {
          user: dealer.user,
          type: "order_created",
          message: `${shop.name} do'konidan yangi buyurtma #${order.id}`,
          data: {
            orderId: order.id,
            shopId: shop.id,
            shopName: shop.name,
            totalAmount,
          },
        })
      );

      return order;
    });

    const full = await loadOrder(created.id);
    res.status(201).json(toOrderDto(full));
  } catch (err) {
    console.error("createOrder error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// GET /api/orders?status=&page=&limit=
export async function listOrders(req, res) {
  try {
    const role = req.user.role;
    const profile = await getActorProfile(req);
    if (!profile) {
      return res.status(404).json({ message: "Profil topilmadi" });
    }

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(req.query.limit) || 20));

    const where = role === "dealer" ? { dealer: { id: profile.id } } : { shop: { id: profile.id } };
    if (STATUSES.includes(req.query.status)) {
      where.status = req.query.status;
    }

    const [orders, total] = await AppDataSource.manager.findAndCount("Order", {
      where,
      relations: { dealer: { user: true }, shop: true, items: { product: true } },
      order: { createdAt: "DESC" },
      skip: (page - 1) * limit,
      take: limit,
    });

    res.json({
      page,
      limit,
      total,
      orders: orders.map(toOrderDto),
    });
  } catch (err) {
    console.error("listOrders error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// GET /api/orders/:id
export async function getOrder(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id noto'g'ri" });
    }

    const profile = await getActorProfile(req);
    if (!profile) {
      return res.status(404).json({ message: "Profil topilmadi" });
    }

    const order = await loadOrder(id);
    if (!order || !ownsOrder(req.user.role, profile, order)) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }

    res.json(toOrderDto(order));
  } catch (err) {
    console.error("getOrder error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// PATCH /api/orders/:id/status   { status, comment }
export async function changeStatus(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id noto'g'ri" });
    }

    const target = String(req.body?.status || "");
    if (!STATUSES.includes(target)) {
      return res.status(400).json({ message: "status noto'g'ri" });
    }

    const comment = String(req.body?.comment ?? "").trim();
    if (comment.length > 500) {
      return res.status(400).json({ message: "Izoh 500 belgidan oshmasligi kerak" });
    }

    const role = req.user.role;

    const profile = await getActorProfile(req);
    if (!profile) {
      return res.status(404).json({ message: "Profil topilmadi" });
    }

    const order = await loadOrder(id);
    if (!order || !ownsOrder(role, profile, order)) {
      return res.status(404).json({ message: "Buyurtma topilmadi" });
    }

    if (role === "dealer" && DEALER_COMMENT_REQUIRED.includes(target) && !comment) {
      return res
        .status(400)
        .json({ message: "Rad etish yoki bekor qilish uchun sabab (comment) majburiy" });
    }

    const result = await AppDataSource.transaction(async (m) => {
      // Ikki kishi bir vaqtda o'zgartirmasligi uchun qatorni qulflaymiz
      const locked = await m.findOne("Order", {
        where: { id },
        lock: { mode: "pessimistic_write" },
      });

      const allowed = TRANSITIONS[role]?.[locked.status] || [];
      if (!allowed.includes(target)) {
        return {
          error: `Buyurtmani "${locked.status}" holatidan "${target}" holatiga o'tkazib bo'lmaydi`,
        };
      }

      locked.status = target;
      if (target === "confirmed") locked.confirmedAt = new Date();
      if (role === "dealer" && comment) locked.dealerNote = comment;
      await m.save("Order", locked);

      await m.save(
        "OrderStatusHistory",
        m.create("OrderStatusHistory", {
          order: locked,
          status: target,
          actorRole: role,
          comment: comment || null,
        })
      );

      const recipient = role === "dealer" ? order.shop.user : order.dealer.user;
      const actorName = role === "dealer" ? order.dealer.companyName : order.shop.name;

      await m.save(
        "Notification",
        m.create("Notification", {
          user: recipient,
          type: "order_status_changed",
          message: `${actorName}: buyurtma #${id} ${STATUS_LABELS[target]}`,
          data: { orderId: id, status: target, comment: comment || null },
        })
      );

      return { ok: true };
    });

    if (result.error) {
      return res.status(409).json({ message: result.error });
    }

    const full = await loadOrder(id);
    res.json(toOrderDto(full));
  } catch (err) {
    console.error("changeStatus error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}