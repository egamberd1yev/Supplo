import { EntitySchema } from "typeorm";

export default new EntitySchema({
  name: "User",
  tableName: "users",
  columns: {
    id: { type: "int", primary: true, generated: true },
    name: { type: "varchar" },
    email: { type: "varchar", unique: true },
    password: { type: "varchar", select: false },
    phone: { type: "varchar", nullable: true },
    role: { type: "enum", enum: ["dealer", "shop"] },
    createdAt: { type: "timestamp", createDate: true },
  },
});