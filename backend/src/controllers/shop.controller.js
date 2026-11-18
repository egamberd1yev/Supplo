import { AppDataSource } from "../config/data-source.js";
import { getShopByUserId } from "../utils/profile.js";

// POST /api/shops/connect  { code }
export async function connectToDealer(req, res) {
  try {
    const code = String(req.body.code || "").trim().toUpperCase();
    if (!code) {
      return res.status(400).json({ message: "code majburiy" });
    }

    const shop = await getShopByUserId(req.user.id);
    if (!shop) {
      return res.status(404).json({ message: "Do'kon profili topilmadi" });
    }

    const dealer = await AppDataSource.manager.findOne("Dealer", {
      where: { connectCode: code },
      relations: { user: true },
    });
    if (!dealer) {
      return res.status(404).json({ message: "Bunday kod topilmadi" });
    }

    const existing = await AppDataSource.manager.findOne("DealerShop", {
      where: { dealer: { id: dealer.id }, shop: { id: shop.id } },
    });

    if (existing?.status === "active") {
      return res.status(409).json({ message: "Siz bu dillerga allaqachon ulangansiz" });
    }
    if (existing?.status === "removed") {
      return res
        .status(403)
        .json({ message: "Diller sizni chiqarib yuborgan, qayta ulanish mumkin emas" });
    }

    const link = await AppDataSource.transaction(async (manager) => {
      const created = await manager.save(
        "DealerShop",
        manager.create("DealerShop", { dealer, shop, status: "active" })
      );

      await manager.save(
        "Notification",
        manager.create("Notification", {
          user: dealer.user,
          type: "shop_connected",
          message: `${shop.name} (${shop.address}) do'koni sizga bog'landi`,
          data: {
            dealerShopId: created.id,
            shopId: shop.id,
            shopName: shop.name,
            address: shop.address,
            phone: shop.phone,
          },
        })
      );

      return created;
    });

    res.status(201).json({
      message: "Dillerga muvaffaqiyatli ulandingiz",
      dealerShopId: link.id,
      dealer: {
        id: dealer.id,
        companyName: dealer.companyName,
        address: dealer.address,
      },
    });
  } catch (err) {
    if (err.code === "23505") {
      return res.status(409).json({ message: "Siz bu dillerga allaqachon ulangansiz" });
    }
    console.error("connectToDealer error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// GET /api/shops/dealers
export async function myDealers(req, res) {
  try {
    const shop = await getShopByUserId(req.user.id);
    if (!shop) {
      return res.status(404).json({ message: "Do'kon profili topilmadi" });
    }

    const links = await AppDataSource.manager.find("DealerShop", {
      where: { shop: { id: shop.id }, status: "active" },
      relations: { dealer: { user: true } },
      order: { createdAt: "DESC" },
    });

    res.json(
      links.map((l) => ({
        dealerShopId: l.id,
        connectedAt: l.createdAt,
        dealer: {
          id: l.dealer.id,
          companyName: l.dealer.companyName,
          address: l.dealer.address,
          phone: l.dealer.user?.phone || null,
        },
      }))
    );
  } catch (err) {
    console.error("myDealers error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}