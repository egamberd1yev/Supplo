import { AppDataSource } from "../config/data-source.js";

export function getDealerByUserId(userId) {
  return AppDataSource.manager.findOne("Dealer", {
    where: { user: { id: userId } },
  });
}

export function getShopByUserId(userId) {
  return AppDataSource.manager.findOne("Shop", {
    where: { user: { id: userId } },
  });
}