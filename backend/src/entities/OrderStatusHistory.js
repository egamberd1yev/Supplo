import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "OrderStatusHistory",
  tableName: "order_status_history",
  columns: {
    id: { type: "int", primary: true, generated: true },
    status: { type: "varchar" },
    actorRole: { type: "enum", enum: ["shop", "dealer"] },
    comment: { type: "text", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      inverseSide: "history",
      onDelete: "CASCADE",
      nullable: false,
    },
  },
});