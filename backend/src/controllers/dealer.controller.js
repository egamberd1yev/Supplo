import { AppDataSource } from "../config/data-source.js";
import { getDealerByUserId } from "../utils/profile.js";

// GET /api/dealers/shops?status=active|removed
export async function myShops(req, res) {
  try {
    const dealer = await getDealerByUserId(req.user.id);
    if (!dealer) {
      return res.status(404).json({ message: "Diller profili topilmadi" });
    }

    const status = req.query.status === "removed" ? "removed" : "active";

    const links = await AppDataSource.manager.find("DealerShop", {
      where: { dealer: { id: dealer.id }, status },
      relations: { shop: true },
      order: { createdAt: "DESC" },
    });

    res.json(
      links.map((l) => ({
        id: l.id,
        status: l.status,
        connectedAt: l.createdAt,
        shop: {
          id: l.shop.id,
          name: l.shop.name,
          address: l.shop.address,
          phone: l.shop.phone,
        },
      }))
    );
  } catch (err) {
    console.error("myShops error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// PATCH /api/dealers/shops/:id/remove   (:id = DealerShop id)
export async function removeShop(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id noto'g'ri" });
    }

    const dealer = await getDealerByUserId(req.user.id);
    if (!dealer) {
      return res.status(404).json({ message: "Diller profili topilmadi" });
    }

    const link = await AppDataSource.manager.findOne("DealerShop", {
      where: { id, dealer: { id: dealer.id } },
    });
    if (!link) {
      return res.status(404).json({ message: "Do'kon topilmadi" });
    }

    link.status = "removed";
    await AppDataSource.manager.save("DealerShop", link);

    res.json({ message: "Do'kon chiqarib yuborildi" });
  } catch (err) {
    console.error("removeShop error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}