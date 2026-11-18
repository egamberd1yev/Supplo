import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "Product",
  tableName: "products",
  columns: {
    id: { type: "int", primary: true, generated: true },
    name: { type: "varchar" },
    description: { type: "text", nullable: true },
    size: { type: "varchar", nullable: true },
    price: { type: "decimal", precision: 12, scale: 2, nullable: true },
    imageUrl: { type: "varchar", nullable: true },
    isActive: { type: "boolean", default: true },
    createdAt: { type: "timestamp", createDate: true },
  },
  relations: {
    dealer: {
      type: "many-to-one",
      target: "Dealer",
      inverseSide: "products",
      onDelete: "CASCADE",
      nullable: false,
    },
  },
});