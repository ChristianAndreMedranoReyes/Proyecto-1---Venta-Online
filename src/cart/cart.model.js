import { Schema, model } from 'mongoose';

const cartSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: [true, "User is required"]
    },
    products: [{
        product: {
            type: Schema.Types.ObjectId,
            ref: "Product",
            required: [true, "Product is required"]
        },
        quantity: {
            type: Number,
            required: [true, "Quantity is required"],
            min: [1, "Quantity must be greater than 1"]
        },
    }],
    total: {
        type: Number,
        required: [true, "Total is required"],
        default: 0
    },
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("Cart", cartSchema);