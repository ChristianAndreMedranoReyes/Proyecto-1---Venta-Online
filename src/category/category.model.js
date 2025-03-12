import { Schema, model } from 'mongoose';

const categorySchema = new Schema({
    name: {
        type: String,
        required: [true, "El nombre de la categoría es obligatorio"],
        maxLength: [50, "Máximo 50 caracteres"],
        minLength: [1, "Debe tener al menos 1 caracter"],
        trim: true,
        unique: true
    },
    status: {
        type: Boolean,
        default: true
    }
},
    {
        timestamps: true,
        versionKey: false
    }
);

export default model("Category", categorySchema);