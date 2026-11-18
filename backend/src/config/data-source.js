import "dotenv/config";
import "reflect-metadata";
import { DataSource } from "typeorm";

import User from "../entities/User.js";
import Dealer from "../entities/Dealer.js";
import Shop from "../entities/Shop.js";
import DealerShop from "../entities/DealerShop.js";
import Product from "../entities/Product.js";
import Notification from "../entities/Notification.js";
import Order from "../entities/Order.js";
import OrderItem from "../entities/OrderItem.js";
import OrderStatusHistory from "../entities/OrderStatusHistory.js";
import SavedProduct from "../entities/SavedProduct.js";

export const AppDataSource = new DataSource({
  type: "postgres",
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  synchronize: true, // faqat development uchun
  entities: [
    User,
    Dealer,
    Shop,
    DealerShop,
    Product,
    Notification,
    Order,
    OrderItem,
    OrderStatusHistory,
    SavedProduct,
  ],
});