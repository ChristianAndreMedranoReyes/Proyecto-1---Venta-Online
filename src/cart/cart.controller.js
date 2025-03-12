import Cart from "./cart.model.js";
import Product from "../product/product.model.js";

export const createCart = async (req, res) => {
    try {
        const authenticatedUser = req.usuario;

        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: "No estás autenticado",
            });
        }

        const existingCart = await Cart.findOne({ user: authenticatedUser._id });

        if (existingCart) {
            return res.status(400).json({
                success: false,
                message: "El usuario ya tiene un carrito",
            });
        }

        const newCart = new Cart({ user: authenticatedUser._id, products: [] });
        await newCart.save();

        res.status(201).json({
            success: true,
            message: "Carrito creado exitosamente",
            cart: newCart,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error al crear el carrito",
            error,
        });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const authenticatedUser = req.usuario;
        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: "No estás autenticado",
            });
        }

        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        if (!product || !product.status) {
            return res.status(404).json({
                success: false,
                message: "Producto no encontrado o no disponible",
            });
        }

        if (product.stock < quantity) {
            return res.status(400).json({
                success: false,
                message: "Stock insuficiente",
            });
        }

        let cart = await Cart.findOne({ user: authenticatedUser._id });

        if (!cart) {
            cart = new Cart({ user: authenticatedUser._id, products: [] });
        }

        const existingProduct = cart.products.find(p => p.product.toString() === productId);

        if (existingProduct) {
            existingProduct.quantity += quantity;
        } else {
            cart.products.push({ product: productId, quantity });
        }

        product.stock -= quantity;
        await product.save();

        const total = await calculateCartTotal(cart);
        cart.total = total;

        await cart.save();

        
        const populatedCart = await Cart.findById(cart._id)
            .populate("products.product", "name price");

            const userCart = await Cart.findById(cart._id).populate("user", "name");

            res.status(200).json({
                success: true,
                message: `Producto agregado al carrito de ${userCart.user.name}`,
                cart: {
                    user: userCart.user.name, 
                    total: cart.total,
                    products: populatedCart.products.map(item => ({
                        name: item.product.name,
                        quantity: item.quantity,
                        price: item.product.price
                    })),
                },
            });

    } catch (error) {
        console.error("Error en addProductToCart:", error);
        res.status(500).json({
            success: false,
            message: "Error al agregar producto al carrito",
            error: error.message || error
        });
    }
};

const calculateCartTotal = async (cart) => {
    let total = 0;
    for (const item of cart.products) {
        const product = await Product.findById(item.product);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    return total;
};

export const getCart = async (req, res) => {
    try {
        const authenticatedUser = req.usuario;

        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: "No estás autenticado",
            });
        }

        const cart = await Cart.findOne({ user: authenticatedUser._id })
            .populate("products.product", "name price");

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "No tienes un carrito",
            });
        }

        res.status(200).json({
            success: true,
            cart: {
                total: cart.total,
                products: cart.products.map(item => ({
                    name: item.product.name,
                    quantity: item.quantity,
                    price: item.product.price
                }))
            }
        });

    } catch (error) {
        console.error("Error en getCart:", error);
        res.status(500).json({
            success: false,
            message: "Error al obtener el carrito",
            error: error.message || error,
        });
    }
};

export const deleteCart = async (req, res) => {
    try {
        const authenticatedUser = req.usuario;

        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: "No estás autenticado",
            });
        }

        const cart = await Cart.findOne({ user: authenticatedUser._id });

        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "No tienes un carrito para eliminar",
            });
        }

        for (const item of cart.products) {
            const product = await Product.findById(item.product);
            if (product) {
                product.stock += item.quantity;
                await product.save();
            }
        }

        await Cart.findByIdAndDelete(cart._id);

        res.status(200).json({
            success: true,
            message: "Carrito eliminado exitosamente y stock restaurado",
        });

    } catch (error) {
        console.error("Error en deleteCart:", error);
        res.status(500).json({
            success: false,
            message: "Error al eliminar el carrito",
            error: error.message || error,
        });
    }
};