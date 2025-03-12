import { Router } from "express";
import { createInvoiceFromCart, listarFacturasUsuario, editarFactura } from "./invoice.controller.js";
import { check } from "express-validator";
import { validarCampos } from "../middlewares/validar-campos.js";
import { validarJWT } from "../middlewares/validar-jwt.js";
import { validarRoles } from "../middlewares/validar-roles.js";

const router = Router();

router.post(
    "/",
    [
        validarJWT
    ],
    createInvoiceFromCart
);

router.get(
    "/", 
    [
        validarJWT
    ], 
    listarFacturasUsuario
);

router.put(
    "/:id",
    [
        validarJWT,
        validarRoles("ADMIN_ROLE"),
        validarCampos,
    ],
    editarFactura
);

export default router;
