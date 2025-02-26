import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        return next(error)
    }

    next();
}