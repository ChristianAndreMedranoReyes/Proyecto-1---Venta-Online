import { body } from "express-validator";
import { validarCampos } from "./validar-campos.js";
import { existenteEmail } from "../helpers/db-validator.js";

export const registerValidator = [
    body("name", "The name is required").not().isEmpty(),
    body("email", "You must enter a valid email").not().isEmpty().isEmail(),
    body("email").custom(existenteEmail),
    body("password", "Password must be at last 6 characters").isLength({ min: 6}),
    validarCampos
];

export const loginValidator = [
    body("email").optional().isEmail().withMessage("Ingresa una direccion de correo valida"),
    body("username").optional().isString().withMessage("Ingresa un username valido"),
    body("password", "La contraseña debe tener minimo 6 caracteres").isLength({ min: 6}),
    validarCampos
]

