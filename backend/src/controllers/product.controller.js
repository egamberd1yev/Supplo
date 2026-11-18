import { ILike } from "typeorm";
import { AppDataSource } from "../config/data-source.js";
import { getDealerByUserId, getShopByUserId } from "../utils/profile.js";
import { fileToUrl, deleteUploadedFile } from "../utils/files.js";

function toDto(p) {
  return {
    id: p.id,
    name: p.name,
    description: p.description,
    size: p.size,
    price: p.price === null || p.price === undefined ? null : Number(p.price),
    imageUrl: p.imageUrl,
    isActive: p.isActive,
    createdAt: p.createdAt,
  };
}

function parsePrice(value) {
  if (value === undefined || value === null || String(value).trim() === "") {
    return { ok: true, value: null };
  }
  const n = Number(value);
  if (Number.isNaN(n) || n < 0) return { ok: false };
  return { ok: true, value: n };
}

function textOrNull(value) {
  const s = String(value ?? "").trim();
  return s || null;
}

// POST /api/dealers/products   (multipart/form-data: name, description, size, price, image)
export async function createProduct(req, res) {
  const imageUrl = fileToUrl(req.file);

  try {
    const dealer = await getDealerByUserId(req.user.id);
    if (!dealer) {
      await deleteUploadedFile(imageUrl);
      return res.status(404).json({ message: "Diller profili topilmadi" });
    }

    const name = String(req.body.name || "").trim();
    if (!name) {
      await deleteUploadedFile(imageUrl);
      return res.status(400).json({ message: "name majburiy" });
    }

    const price = parsePrice(req.body.price);
    if (!price.ok) {
      await deleteUploadedFile(imageUrl);
      return res.status(400).json({ message: "price noto'g'ri" });
    }

    const product = await AppDataSource.manager.save(
      "Product",
      AppDataSource.manager.create("Product", {
        name,
        description: textOrNull(req.body.description),
        size: textOrNull(req.body.size),
        price: price.value,
        imageUrl,
        dealer,
      })
    );

    res.status(201).json(toDto(product));
  } catch (err) {
    await deleteUploadedFile(imageUrl);
    console.error("createProduct error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// GET /api/dealers/products?search=
export async function listMyProducts(req, res) {
  try {
    const dealer = await getDealerByUserId(req.user.id);
    if (!dealer) {
      return res.status(404).json({ message: "Diller profili topilmadi" });
    }

    const search = String(req.query.search || "").trim();

    const products = await AppDataSource.manager.find("Product", {
      where: {
        dealer: { id: dealer.id },
        isActive: true,
        ...(search ? { name: ILike(`%${search}%`) } : {}),
      },
      order: { createdAt: "DESC" },
    });

    res.json(products.map(toDto));
  } catch (err) {
    console.error("listMyProducts error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// PATCH /api/dealers/products/:id   (JSON yoki multipart; hamma maydon ixtiyoriy)
export async function updateProduct(req, res) {
  const newImageUrl = fileToUrl(req.file);

  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      await deleteUploadedFile(newImageUrl);
      return res.status(400).json({ message: "id noto'g'ri" });
    }

    const dealer = await getDealerByUserId(req.user.id);
    if (!dealer) {
      await deleteUploadedFile(newImageUrl);
      return res.status(404).json({ message: "Diller profili topilmadi" });
    }

    const product = await AppDataSource.manager.findOne("Product", {
      where: { id, dealer: { id: dealer.id }, isActive: true },
    });
    if (!product) {
      await deleteUploadedFile(newImageUrl);
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }

    const body = req.body || {};

    if (body.name !== undefined) {
      const name = String(body.name).trim();
      if (!name) {
        await deleteUploadedFile(newImageUrl);
        return res.status(400).json({ message: "name bo'sh bo'lishi mumkin emas" });
      }
      product.name = name;
    }

    if (body.description !== undefined) product.description = textOrNull(body.description);
    if (body.size !== undefined) product.size = textOrNull(body.size);

    if (body.price !== undefined) {
      const price = parsePrice(body.price);
      if (!price.ok) {
        await deleteUploadedFile(newImageUrl);
        return res.status(400).json({ message: "price noto'g'ri" });
      }
      product.price = price.value;
    }

    const oldImageUrl = product.imageUrl;
    if (newImageUrl) product.imageUrl = newImageUrl;

    const saved = await AppDataSource.manager.save("Product", product);

    if (newImageUrl) await deleteUploadedFile(oldImageUrl);

    res.json(toDto(saved));
  } catch (err) {
    await deleteUploadedFile(newImageUrl);
    console.error("updateProduct error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// DELETE /api/dealers/products/:id
// Mahsulot o'chirilmaydi, isActive=false bo'ladi (keyin buyurtmalar tarixi buzilmasligi uchun)
export async function deleteProduct(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id noto'g'ri" });
    }

    const dealer = await getDealerByUserId(req.user.id);
    if (!dealer) {
      return res.status(404).json({ message: "Diller profili topilmadi" });
    }

    const product = await AppDataSource.manager.findOne("Product", {
      where: { id, dealer: { id: dealer.id }, isActive: true },
    });
    if (!product) {
      return res.status(404).json({ message: "Mahsulot topilmadi" });
    }

    product.isActive = false;
    await AppDataSource.manager.save("Product", product);

    res.json({ message: "Mahsulot o'chirildi" });
  } catch (err) {
    console.error("deleteProduct error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// GET /api/shops/dealers/:dealerId/products?search=   (faqat ulangan do'kon uchun)
export async function listDealerProductsForShop(req, res) {
  try {
    const dealerId = Number(req.params.dealerId);
    if (!Number.isInteger(dealerId)) {
      return res.status(400).json({ message: "dealerId noto'g'ri" });
    }

    const shop = await getShopByUserId(req.user.id);
    if (!shop) {
      return res.status(404).json({ message: "Do'kon profili topilmadi" });
    }

    const link = await AppDataSource.manager.findOne("DealerShop", {
      where: { dealer: { id: dealerId }, shop: { id: shop.id }, status: "active" },
    });
    if (!link) {
      return res.status(403).json({ message: "Siz bu dillerga ulanmagansiz" });
    }

    const search = String(req.query.search || "").trim();

    const products = await AppDataSource.manager.find("Product", {
      where: {
        dealer: { id: dealerId },
        isActive: true,
        ...(search ? { name: ILike(`%${search}%`) } : {}),
      },
      order: { createdAt: "DESC" },
    });

    res.json(products.map(toDto));
  } catch (err) {
    console.error("listDealerProductsForShop error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}