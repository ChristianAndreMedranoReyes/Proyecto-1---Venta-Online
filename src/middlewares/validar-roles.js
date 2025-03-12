export const validarRoles = (...rolesPermitidos) => {
    return (req, res, next) => {
        console.log("🔍 Usuario en validarRoles:", req.usuario);

        if (!req.usuario) {
            console.log("❌ ERROR: `validarRoles` se ejecutó antes que `validarJWT`");
            return res.status(500).json({
                success: false,
                message: "Se quiere verificar el rol sin validar el token primero",
            });
        }

        const { role, name } = req.usuario;
        console.log("✅ Usuario autenticado:", name, "| Rol:", role);
        console.log("🔍 Roles permitidos:", rolesPermitidos);

        // 🔹 Convertimos rolesPermitidos a un array plano para evitar errores
        const rolesValidos = [...rolesPermitidos];

        console.log("🔍 ¿Está el rol del usuario en la lista de roles permitidos?", rolesValidos.includes(role));

        if (!rolesValidos.includes(role)) {
            console.log("❌ ERROR: Usuario sin permisos");
            return res.status(403).json({
                success: false,
                message: `No tienes permisos para realizar esta acción. Se requiere uno de estos roles: ${rolesValidos.join(", ")}`,
            });
        }

        next();
    };
};
