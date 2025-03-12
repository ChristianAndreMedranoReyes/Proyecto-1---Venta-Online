import { Schema, model } from "mongoose";

const productSchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre del producto es obligatorio"],
        maxLength: [100, "Máximo 100 caracteres"],
        trim: true
    },
    description: {
        type: String,
        maxLength: [500, "Máximo 500 caracteres"],
        trim: true
    },
    brand: {
        type: String,
        required: [true, "La marca es obligatoria"],
        maxLength: [50, "No más de 50 caracteres"],
        trim: true,
    },
    price: {
        type: Number,
        required: [true, "El precio es obligatorio"],
        min: [0, "El precio no puede ser negativo"]
    },
    stock: {
        type: Number,
        required: [true, "El stock es obligatorio"],
        min: [0, "El stock no puede ser negativo"]
    },
    category: {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: [true, "La categoría es obligatoria"],
    },
    status: {
        type: Boolean,
        default: true
    }
}, 
{ 
    timestamps: true, 
    versionKey: false });

export default model("Product", productSchema);


