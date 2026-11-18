import User from "./entities/User.js";
import Dealer from "./entities/Dealer.js";
import Shop from "./entities/Shop.js";
import DealerShop from "./entities/DealerShop.js";
import Product from "./entities/Product.js";
import Notification from "./entities/Notification.js";

for (const e of [User, Dealer, Shop, DealerShop, Product, Notification]) {
  console.log(e?.options?.name, "->", e?.options?.tableName);
}