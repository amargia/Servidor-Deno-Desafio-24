import { Router } from "../../deps.ts";
import {
  findAll,
  findProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../handlers/product.handler.ts";

export const router = new Router()
  .get("/api/product", findAll)
  .get("/api/product/:productId", findProduct)
  .post("/api/product", createProduct)
  .put("/api/product/:productId", updateProduct)
  .delete("/api/product/:productId", deleteProduct);
