import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Shop",
  tableName: "shops",
  columns: {
    id: { type: "int", primary: true, generated: true },
    name: { type: "varchar" },
    address: { type: "varchar" },
    phone: { type: "varchar", nullable: true },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: true,
      onDelete: "CASCADE",
    },
    dealerShops: {
      type: "one-to-many",
      target: "DealerShop",
      inverseSide: "shop",
    },
  },
});