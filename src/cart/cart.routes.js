import { Router } from "express";
import { createCart, addProductToCart, getCart, deleteCart } from "./cart.controller.js";
import { validarJWT } from "../middlewares/validar-jwt.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT
    ],
    createCart
);

router.put(
    "/add",
    [ 
        validarJWT
    ], 
    addProductToCart
); 

router.get(
    "/",
    [
        validarJWT
    ], 
    getCart
); 

router.delete(
    "/",
    [
        validarJWT
    ], 
    deleteCart
); 

export default router;
