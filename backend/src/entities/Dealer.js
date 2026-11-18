import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Dealer",
  tableName: "dealers",
  columns: {
    id: { type: "int", primary: true, generated: true },
    companyName: { type: "varchar" },
    address: { type: "varchar", nullable: true },
    connectCode: { type: "varchar", unique: true },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    user: {
      type: "one-to-one",
      target: "User",
      joinColumn: true,
      onDelete: "CASCADE",
    },
    products: {
      type: "one-to-many",
      target: "Product",
      inverseSide: "dealer",
    },
    dealerShops: {
      type: "one-to-many",
      target: "DealerShop",
      inverseSide: "dealer",
    },
  },
});