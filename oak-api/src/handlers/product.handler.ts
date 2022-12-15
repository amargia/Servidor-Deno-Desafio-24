import { Context, helpers } from "../../deps.ts";
import logger from "../middlewares/logger.ts";
import { Product } from "../types/product.types.ts";

const DB_PRODUCTS: Product[] = [];
DB_PRODUCTS.push({ uuid: "1", name: "Monitor", description: "Monitor para PC", price: 65000 });
DB_PRODUCTS.push({ uuid: "2", name: "Teclado", description: "Teclado para PC", price: 25000 });
DB_PRODUCTS.push({ uuid: "3", name: "Mouse", description: "Mouse para PC", price: 15000 });



export const findAll = async (ctx: Context) => {
  try {
    ctx.response.status = 200;
    logger.debug(`status: ${ctx.response.status} method: findAll handler`);

    ctx.response.body = await { code: "00", data: DB_PRODUCTS };
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { code: "99", msg: error };
  }
};

export const findProduct = async (ctx: Context) => {
  try {
    const { productId } = helpers.getQuery(ctx, { mergeParams: true });
    const product = await DB_PRODUCTS.find((u) => u.uuid == productId);

    if (product) {
      ctx.response.body = await { code: "00", data: product };
    } else {
      ctx.response.body = await {
        code: "01",
        msg: `Producto con id ${productId} no encontrado.`,
      };
    }
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { code: "99", msg: error };
  }
};

export const createProduct = async (ctx: Context) => {
  try {
    ctx.response.status = 201;
    logger.debug(`status: ${ctx.response.status} method: createProduct handler`);

    const { name, description, price } = await ctx.request.body().value;

    const newId = Number(DB_PRODUCTS[DB_PRODUCTS.length - 1].uuid) + 1;
    const product: Product = {
      uuid: newId.toString(),
      name: name,
      description: description,
      price: price, 
    };
    DB_PRODUCTS.push(product);

    ctx.response.body = await { code: "00", data: product };
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { code: "99", msg: error };
  }
};

export const updateProduct = async (ctx: Context) => {
  try {
    ctx.response.status = 202;
    logger.debug(`status: ${ctx.response.status} method: updateProduct handler`);

    const { productId } = helpers.getQuery(ctx, { mergeParams: true });
    const productIndex = await DB_PRODUCTS.findIndex((u) => u.uuid == productId);

    if (productIndex) {
      const { name, description, price } = await ctx.request.body().value;
      DB_PRODUCTS.splice(productIndex, 1, {
        uuid: productId,
        name,
        description,
        price        
      });

      ctx.response.body = {
        code: "00",
        data: { uuid: productId, name, description, price },
      };
    } else {
      ctx.response.body = {
        code: "01",
        msg: `Producto con id ${productId} no encontrado.`,
      };
    }
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { msg: error };
  }
};

export const deleteProduct = async (ctx: Context) => {
  try {
    ctx.response.status = 200;
    logger.debug(`status: ${ctx.response.status} method: deleteProduct handler`);

    const { productId } = helpers.getQuery(ctx, { mergeParams: true });
    const productIndex = await DB_PRODUCTS.findIndex((u) => u.uuid == productId);

    if (productIndex) {
      DB_PRODUCTS.splice(productIndex, 1);

      ctx.response.body = {
        code: "00",
        msg: `Producto con id ${productId} eliminado`,
      };
    } else {
      ctx.response.body = {
        code: "01",
        msg: `Producto con id ${productId} no encontrado.`,
      };
    }
  } catch (error) {
    ctx.response.status = 500;

    logger.error(`status: ${ctx.response.status} ${error}`);
    ctx.response.body = { msg: error };
  }
};
