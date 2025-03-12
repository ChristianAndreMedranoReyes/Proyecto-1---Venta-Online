import { validationResult } from "express-validator";

export const validarCampos = (req, res, next) => {
    const error = validationResult(req);

    if(!error.isEmpty()){
        return res.status(400).json({
            success: false,
            errors: error.mapped()
        });
    }

    next();
}