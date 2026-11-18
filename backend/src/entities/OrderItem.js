import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "OrderItem",
  tableName: "order_items",
  columns: {
    id: { type: "int", primary: true, generated: true },
    productName: { type: "varchar" }, // buyurtma vaqtidagi nusxa
    productSize: { type: "varchar", nullable: true },
    unitPrice: { type: "decimal", precision: 12, scale: 2 }, // buyurtma vaqtidagi narx
    quantity: { type: "int" },
  },
  relations: {
    order: {
      type: "many-to-one",
      target: "Order",
      inverseSide: "items",
      onDelete: "CASCADE",
      nullable: false,
    },
    product: {
      type: "many-to-one",
      target: "Product",
      onDelete: "SET NULL",
      nullable: true,
    },
  },
});