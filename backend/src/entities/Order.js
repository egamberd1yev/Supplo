import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Order",
  tableName: "orders",
  columns: {
    id: { type: "int", primary: true, generated: true },
    status: {
      type: "enum",
      enum: ["pending", "confirmed", "rejected", "cancelled", "delivering", "delivered"],
      default: "pending",
    },
    note: { type: "text", nullable: true }, // do'kon izohi
    dealerNote: { type: "text", nullable: true }, // dillerning oxirgi izohi
    deliveryAddress: { type: "varchar", length: 300, nullable: true },
    totalAmount: { type: "decimal", precision: 14, scale: 2, default: 0 },
    confirmedAt: { type: "timestamp", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
    updatedAt: { type: "timestamp", updateDate: true },
  },
  relations: {
    dealer: {
      type: "many-to-one",
      target: "Dealer",
      onDelete: "RESTRICT",
      nullable: false,
    },
    shop: {
      type: "many-to-one",
      target: "Shop",
      onDelete: "RESTRICT",
      nullable: false,
    },
    items: {
      type: "one-to-many",
      target: "OrderItem",
      inverseSide: "order",
    },
    history: {
      type: "one-to-many",
      target: "OrderStatusHistory",
      inverseSide: "order",
    },
  },
});