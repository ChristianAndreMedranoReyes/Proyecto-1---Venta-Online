import Product from "./product.model.js";
import Category from "../category/category.model.js";

export const saveProduct = async (req, res) => {
    try {
        const { name, description, brand, price, stock, categoryName } = req.body;
        const authenticatedUser = req.usuario;

        if (!authenticatedUser || authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para agregar un producto",
            });
        }

        const category = await Category.findOne({ name: categoryName });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: "La categoría especificada no existe",
            });
        }

        const product = new Product({
            name,
            description,
            brand,
            price,
            stock,
            category: category._id,
        });

        await product.save();

        res.status(201).json({
            success: true,
            message: "Producto agregado exitosamente",
            product,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al agregar el producto",
            error,
        });
    }
};

export const listProducts = async (req, res) => {
    try {
        const products = await Product.find({ status: true })
            .populate("category", "name");

        res.json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener los productos",
            error,
        });
    }
};

export const bestSellingProducts = async (req, res) => {
    try {
        const products = await Product.find({ stock: { $lte: 5 }, status: true })
            .populate("category", "name");

        res.json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener productos con poco stock",
            error,
        });
    }
};

export const searchProductsByName = async (req, res) => {
    try {
        const { name } = req.params;
        const regex = new RegExp(name, "i");

        const products = await Product.find({ name: regex, status: true })
            .populate("category", "name");

        res.json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al buscar productos por nombre",
            error,
        });
    }
};

export const filterProductsByCategory = async (req, res) => {
    try {
        const { categoryName } = req.params;
        const category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, "i") } });

        if (!category) {
            return res.status(404).json({
                success: false,
                message: `Categoría '${categoryName}' no encontrada`,
            });
        }

        const products = await Product.find({ category: category._id, status: true })
            .populate("category", "name");

        res.json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al filtrar productos por categoría",
            error,
        });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const authenticatedUser = req.usuario;
        if (!authenticatedUser || authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para actualizar productos",
            });
        }

        const { id } = req.params;
        const { name, description, brand, price, stock, categoryName } = req.body;

        let updateData = { name, description, brand, price, stock };

        if (categoryName) {
            const category = await Category.findOne({ name: { $regex: new RegExp(`^${categoryName}$`, "i") } });

            if (!category) {
                return res.status(404).json({
                    success: false,
                    message: "Categoría especificada no encontrada",
                });
            }

            updateData.category = category._id;
        }

        const product = await Product.findByIdAndUpdate(id, updateData, { new: true });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        res.json({
            success: true,
            message: "Producto actualizado correctamente",
            product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al actualizar el producto",
            error,
        });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const authenticatedUser = req.usuario;
        if (!authenticatedUser || authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para eliminar productos",
            });
        }

        const { id } = req.params;
        const product = await Product.findByIdAndUpdate(id, { status: false });

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado",
            });
        }

        res.status(200).json({
            success: true,
            message: "Producto eliminado correctamente",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al eliminar el producto",
            error,
        });
    }
};

export const stockOut = async (req, res) => {
    try {
        const authenticatedUser = req.usuario;
        if (!authenticatedUser || authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para ver productos agotados",
            });
        }

        const products = await Product.find({ stock: 0 })
            .populate("category", "name");

        res.json({
            success: true,
            products,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al obtener productos agotados",
            error,
        });
    }
};
