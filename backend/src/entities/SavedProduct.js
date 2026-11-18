import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "SavedProduct",
  tableName: "saved_products",
  columns: {
    id: { type: "int", primary: true, generated: true },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    shop: {
      type: "many-to-one",
      target: "Shop",
      onDelete: "CASCADE",
      nullable: false,
    },
    product: {
      type: "many-to-one",
      target: "Product",
      onDelete: "CASCADE",
      nullable: false,
    },
  },
  uniques: [{ name: "UQ_saved_shop_product", columns: ["shop", "product"] }],
});