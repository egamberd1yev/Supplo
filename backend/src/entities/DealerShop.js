import { EntitySchema } from "typeorm"

export default new EntitySchema({
  name: "DealerShop",
  tableName: "dealer_shops",
  columns: {
    id: { type: "int", primary: true, generated: true },
    status: {
      type: "enum",
      enum: ["active", "removed"],
      default: "active",
    },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    dealer: {
      type: "many-to-one",
      target: "Dealer",
      inverseSide: "dealerShops",
      onDelete: "CASCADE",
      nullable: false,
    },
    shop: {
      type: "many-to-one",
      target: "Shop",
      inverseSide: "dealerShops",
      onDelete: "CASCADE",
      nullable: false,
    },
  },
  uniques: [{ name: "UQ_dealer_shop", columns: ["dealer", "shop"] }],
});