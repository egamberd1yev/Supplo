import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppDataSource } from "../config/data-source.js";
import { generateUniqueConnectCode } from "../utils/generateCode.js";

function signToken(user) {
  return jwt.sign({ id: user.id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
}

async function getProfile(manager, user) {
  if (user.role === "dealer") {
    return manager.findOne("Dealer", { where: { user: { id: user.id } } });
  }
  return manager.findOne("Shop", { where: { user: { id: user.id } } });
}

export async function register(req, res) {
  try {
    const { role, name, email, password, phone, companyName, shopName, address } =
      req.body;

    if (!["dealer", "shop"].includes(role)) {
      return res.status(400).json({ message: "role dealer yoki shop bo'lishi kerak" });
    }
    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email va password majburiy" });
    }
    if (password.length < 6) {
      return res.status(400).json({ message: "Parol kamida 6 ta belgi bo'lishi kerak" });
    }
    if (role === "dealer" && !companyName) {
      return res.status(400).json({ message: "companyName majburiy" });
    }
    if (role === "shop" && (!shopName || !address)) {
      return res.status(400).json({ message: "shopName va address majburiy" });
    }

    const normalizedEmail = email.trim().toLowerCase();

    const result = await AppDataSource.transaction(async (manager) => {
      const existing = await manager.findOne("User", {
        where: { email: normalizedEmail },
      });
      if (existing) return { conflict: true };

      const hashed = await bcrypt.hash(password, 10);

      const user = await manager.save(
        "User",
        manager.create("User", {
          name,
          email: normalizedEmail,
          password: hashed,
          phone: phone || null,
          role,
        })
      );

      let profile;
      if (role === "dealer") {
        profile = await manager.save(
          "Dealer",
          manager.create("Dealer", {
            companyName,
            address: address || null,
            connectCode: await generateUniqueConnectCode(manager),
            user,
          })
        );
      } else {
        profile = await manager.save(
          "Shop",
          manager.create("Shop", {
            name: shopName,
            address,
            phone: phone || null,
            user,
          })
        );
      }

      return { user, profile };
    });

    if (result.conflict) {
      return res.status(409).json({ message: "Bu email allaqachon ro'yxatdan o'tgan" });
    }

    const { user, profile } = result;

    res.status(201).json({
      token: signToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      profile,
    });
  } catch (err) {
    console.error("register error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function login(req, res) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "email va password majburiy" });
    }

    const user = await AppDataSource.getRepository("User")
      .createQueryBuilder("user")
      .addSelect("user.password")
      .where("user.email = :email", { email: email.trim().toLowerCase() })
      .getOne();

    if (!user) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Email yoki parol noto'g'ri" });
    }

    const profile = await getProfile(AppDataSource.manager, user);

    res.json({
      token: signToken(user),
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      profile,
    });
  } catch (err) {
    console.error("login error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

export async function me(req, res) {
  try {
    const user = await AppDataSource.manager.findOne("User", {
      where: { id: req.user.id },
    });

    if (!user) {
      return res.status(404).json({ message: "Foydalanuvchi topilmadi" });
    }

    const profile = await getProfile(AppDataSource.manager, user);

    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
      profile,
    });
  } catch (err) {
    console.error("me error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}