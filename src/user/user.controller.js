import { response } from "express";
import { hash, verify } from "argon2";
import User from "./user.model.js";

export const updateUser = async (req, res = response) => {
    try {
        const { id } = req.params; 
        const userId = req.usuario._id; 
        const userRole = req.usuario.role; 
        const { oldPassword, newPassword, role, ...data } = req.body;

        const userToUpdateId = userRole === "CLIENT_ROLE" ? userId.toString() : id;

        const existingUser = await User.findById(userToUpdateId);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado"
            });
        }

        if (userRole === "ADMIN_ROLE" && role) {
            data.role = role;
        } else if (userRole !== "ADMIN_ROLE" && userId.toString() !== userToUpdateId) {
            return res.status(403).json({
                success: false,
                msg: "No tienes permisos para modificar este usuario"
            });
        }

        data.email = existingUser.email;

        if (newPassword) {
            if (!oldPassword) {
                return res.status(400).json({
                    success: false,
                    msg: "Debe proporcionar la contraseña antigua"
                });
            }

            const isMatch = await verify(existingUser.password, oldPassword);
            if (!isMatch) {
                return res.status(400).json({
                    success: false,
                    msg: "La contraseña antigua es incorrecta"
                });
            }

            data.password = await hash(newPassword);
        }

        const user = await User.findByIdAndUpdate(userToUpdateId, data, { new: true });

        res.status(200).json({
            success: true,
            msg: "Usuario actualizado correctamente",
            user
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            msg: "Error al actualizar usuario",
            error
        });
    }
};

export const deleteUser = async (req, res = response) => {
    try {
        const { id } = req.params; 
        const userId = req.usuario._id; 
        const userRole = req.usuario.role; 

        const userToDeleteId = userRole === "CLIENT_ROLE" ? userId : id;

        const user = await User.findById(userToDeleteId);
        if (!user) {
            return res.status(404).json({
                success: false,
                msg: "Usuario no encontrado",
            });
        }

        if (userRole === "CLIENT_ROLE") {
            if (userId.toString() !== userToDeleteId.toString()) {
                return res.status(403).json({
                    success: false,
                    msg: "No tienes permiso para eliminar otro usuario"
                });
            }

            const { password } = req.body;
            if (!password) {
                return res.status(400).json({
                    success: false,
                    msg: "Debe ingresar su contraseña para desactivar su cuenta"
                });
            }

            const esIgual = await verify(user.password, password);
            if (!esIgual) {
                return res.status(400).json({
                    success: false,
                    msg: "La contraseña actual es incorrecta"
                });
            }
        }

        if (userRole === "ADMIN_ROLE" && user.role === "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                msg: "No puedes eliminar a otro administrador"
            });
        }

        if (userRole === "ADMIN_ROLE" && userId.toString() === userToDeleteId.toString()) {
            return res.status(403).json({
                success: false,
                msg: "No puedes eliminar tu propia cuenta"
            });
        }

            user.status = false;
        await user.save();

        res.status(200).json({
            success: true,
            msg: "Usuario desactivado correctamente",
            user
        });

    } catch (error) {
        console.error("Error en deleteUser:", error);

        res.status(500).json({
            success: false,
            msg: "Error al desactivar usuario",
            error: error.message || error
        });
    }
};

export const createAdmin = async () => {
    try {

        const verifyUser = await User.findOne({ username: "admin" });
        
        if (!verifyUser) {
            const encryptedPassword = await hash("admin123456");
            const adminUser = new User({
                name: "Admin",
                username: "admin",
                email: "admin@gmail.com",
                password: encryptedPassword,
                role: "ADMIN_ROLE"
            });

            await adminUser.save();
            console.log("│Admin creado correctamente.│");
        } else {
            console.log("│Admin ya existe en la base de datos.│");
        }
    } catch (error) {
        console.error("│Error al crear el admin│:", error);
    }
};

