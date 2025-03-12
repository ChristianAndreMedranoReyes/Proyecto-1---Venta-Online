import jwt from "jsonwebtoken";
import User from "../user/user.model.js";

export const validarJWT = async (req, res, next) => {
    console.log("🔍 Headers recibidos:", req.headers);

    const token = req.header("x-token");

    if (!token) {
        return res.status(401).json({ msg: "No hay token en la petición" });
    }

    try {
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);
        const usuario = await User.findById(uid);

        if (!usuario) {
            return res.status(401).json({ msg: "Usuario no existe en la base de datos" });
        }

        console.log("✅ Usuario autenticado:", usuario.name, "| Rol:", usuario.role);

        if (!usuario.status) {
            return res.status(401).json({ msg: "Token no válido - Usuario desactivado" });
        }

        req.usuario = usuario;
        next();
    } catch (e) {
        console.log("❌ Error en validarJWT:", e);
        res.status(401).json({ msg: "Token no válido" });
    }
};
