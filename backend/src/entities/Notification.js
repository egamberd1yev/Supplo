import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Notification",
  tableName: "notifications",
  columns: {
    id: { type: "int", primary: true, generated: true },
    type: { type: "varchar" }, // masalan: "shop_connected"
    message: { type: "text" },
    data: { type: "jsonb", nullable: true }, // { shopId, shopName, address }
    isRead: { type: "boolean", default: false },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    user: {
      type: "many-to-one",
      target: "User",
      onDelete: "CASCADE",
      nullable: false,
    },
  },
});