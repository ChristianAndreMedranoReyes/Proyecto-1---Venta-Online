import ShoppingCart from "../cart/cart.model.js";
import Invoice from "./invoice.model.js";
import Product from "../product/product.model.js";

export const createInvoiceFromCart = async (req, res) => {
    try {
        const authenticatedUser = req.usuario; 

        if (!authenticatedUser) {
            return res.status(401).json({
                success: false,
                message: "No estás autenticado",
            });
        }
        const cart = await ShoppingCart.findOne({ user: authenticatedUser._id }).populate("products.product");

        if (!cart || cart.products.length === 0) {
            return res.status(400).json({
                success: false,
                message: "El carrito está vacío",
            });
        }

        const newInvoice = new Invoice({
            user: authenticatedUser._id,
            products: cart.products,
            total: cart.total,
            date: new Date(), 
        });

        await newInvoice.save();

        await ShoppingCart.findOneAndDelete({ user: authenticatedUser._id });

        return res.status(201).json({
            success: true,
            message: "Factura creada exitosamente",
            invoice: newInvoice,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Error al generar la factura",
            error: error.message,
        });
    }
};


export const listarFacturasUsuario = async (req, res) => {
    try {
        const userId = req.usuario._id; 

        const facturas = await Invoice.find({ user: userId }).populate("products.product");

        res.json({
            success: true,
            facturas,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Error al obtener las facturas",
        });
    }
};

export const editarFactura = async (req, res) => {
    try {
        const authenticatedUser = req.usuario;
        if (!authenticatedUser || authenticatedUser.role !== "ADMIN_ROLE") {
            return res.status(403).json({
                success: false,
                message: "No tienes permisos para editar facturas",
            });
        }

        const { id } = req.params;
        const { products } = req.body; 

        let factura = await Invoice.findById(id).populate("products.product");

        if (!factura) {
            return res.status(404).json({
                success: false,
                message: "Factura no encontrada",
            });
        }

        for (const item of factura.products) {
            const product = await Product.findById(item.product._id);
            if (product) {
                product.stock += item.quantity; 
                await product.save();
            }
        }

        let newProductList = [];
        let newTotal = 0;

        for (const item of products) {
            const product = await Product.findById(item.productId);
            if (!product || !product.status) {
                return res.status(404).json({
                    success: false,
                    message: `Producto con ID ${item.productId} no encontrado o no disponible`,
                });
            }

            if (product.stock < item.quantity) {
                return res.status(400).json({
                    success: false,
                    message: `Stock insuficiente para el producto ${product.name}`,
                });
            }

            product.stock -= item.quantity; 
            await product.save();

            newProductList.push({ product: item.productId, quantity: item.quantity });
            newTotal += product.price * item.quantity; 
        }

        factura.products = newProductList;
        factura.total = newTotal;
        factura.date = new Date();

        await factura.save();

        return res.status(200).json({
            success: true,
            message: "Factura editada exitosamente",
            factura,
        });

    } catch (error) {
        console.error("Error en editarFactura:", error);
        return res.status(500).json({
            success: false,
            message: "Error al editar la factura",
            error: error.message || error,
        });
    }
};



