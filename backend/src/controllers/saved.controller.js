import { AppDataSource } from "../config/data-source.js";
import { getShopByUserId } from "../utils/profile.js";

function toProductDto(p) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    size: p.size,
    price: p.price === null || p.price === undefined ? null : Number(p.price),
    imageUrl: p.imageUrl,
  };
}

// POST /api/shops/saved/:productId
export async function saveProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    if (!Number.isInteger(productId)) {
      return res.status(400).json({ message: "productId noto'g'ri" });
    }

    const shop = await getShopByUserId(req.user.id);
    if (!shop) {
      return res.status(404).json({ message: "Do'kon profili topilmadi" });
    }

    const product = await AppDataSource.manager.findOne("Product", {
      where: { id: productId, isActive: true },
      relations: { dealer: true },
    });
    if (!product) {
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }

    const link = await AppDataSource.manager.findOne("DealerShop", {
      where: {
        dealer: { id: product.dealer.id },
        shop: { id: shop.id },
        status: "active",
      },
    });
    if (!link) {
      return res.status(403).json({ message: "Siz bu dillerga ulanmagansiz" });
    }

    const existing = await AppDataSource.manager.findOne("SavedProduct", {
      where: { shop: { id: shop.id }, product: { id: productId } },
    });
    if (existing) {
      return res.json({ message: "Mahsulot allaqachon saqlangan" });
    }

    await AppDataSource.manager.save(
      "SavedProduct",
      AppDataSource.manager.create("SavedProduct", { shop, product })
    );

    res.status(201).json({ message: "Mahsulot saqlandi" });
  } catch (err) {
    if (err.code === "23505") {
      return res.json({ message: "Mahsulot allaqachon saqlangan" });
    }
    console.error("saveProduct error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// DELETE /api/shops/saved/:productId
export async function unsaveProduct(req, res) {
  try {
    const productId = Number(req.params.productId);
    if (!Number.isInteger(productId)) {
      return res.status(400).json({ message: "productId noto'g'ri" });
    }

    const shop = await getShopByUserId(req.user.id);
    if (!shop) {
      return res.status(404).json({ message: "Do'kon profili topilmadi" });
    }

    const existing = await AppDataSource.manager.findOne("SavedProduct", {
      where: { shop: { id: shop.id }, product: { id: productId } },
    });
    if (!existing) {
      return res.status(404).json({ message: "Saqlangan mahsulot topilmadi" });
    }

    await AppDataSource.manager.remove("SavedProduct", existing);

    res.json({ message: "Saqlanganlardan olib tashlandi" });
  } catch (err) {
    console.error("unsaveProduct error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// GET /api/shops/saved
// Faqat hozir ulangan dillerning faol mahsulotlari chiqadi
export async function listSaved(req, res) {
  try {
    const shop = await getShopByUserId(req.user.id);
    if (!shop) {
      return res.status(404).json({ message: "Do'kon profili topilmadi" });
    }

    const saved = await AppDataSource.manager.find("SavedProduct", {
      where: {
        shop: { id: shop.id },
        product: {
          isActive: true,
          dealer: { dealerShops: { shop: { id: shop.id }, status: "active" } },
        },
      },
      relations: { product: { dealer: true } },
      order: { createdAt: "DESC" },
    });

    res.json(
      saved.map((s) => ({
        savedAt: s.createdAt,
        product: toProductDto(s.product),
        dealer: {
          id: s.product.dealer.id,
          companyName: s.product.dealer.companyName,
        },
      }))
    );
  } catch (err) {
    console.error("listSaved error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}