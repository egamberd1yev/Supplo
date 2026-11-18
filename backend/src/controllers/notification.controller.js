import { AppDataSource } from "../config/data-source.js";

// GET /api/notifications
export async function listNotifications(req, res) {
  try {
    const where = { user: { id: req.user.id } };

    const [notifications, unreadCount] = await Promise.all([
      AppDataSource.manager.find("Notification", {
        where,
        order: { createdAt: "DESC" },
        take: 50,
      }),
      AppDataSource.manager.count("Notification", {
        where: { ...where, isRead: false },
      }),
    ]);

    res.json({ unreadCount, notifications });
  } catch (err) {
    console.error("listNotifications error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// PATCH /api/notifications/:id/read
export async function markRead(req, res) {
  try {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "id noto'g'ri" });
    }

    const notification = await AppDataSource.manager.findOne("Notification", {
      where: { id, user: { id: req.user.id } },
    });
    if (!notification) {
      return res.status(404).json({ message: "Bildirishnoma topilmadi" });
    }

    notification.isRead = true;
    await AppDataSource.manager.save("Notification", notification);

    res.json({ message: "O'qilgan deb belgilandi" });
  } catch (err) {
    console.error("markRead error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}

// PATCH /api/notifications/read-all
export async function markAllRead(req, res) {
  try {
    await AppDataSource.manager
      .createQueryBuilder()
      .update("Notification")
      .set({ isRead: true })
      .where('"userId" = :uid AND "isRead" = false', { uid: req.user.id })
      .execute();

    res.json({ message: "Hammasi o'qilgan deb belgilandi" });
  } catch (err) {
    console.error("markAllRead error:", err);
    res.status(500).json({ message: "Server xatosi" });
  }
}