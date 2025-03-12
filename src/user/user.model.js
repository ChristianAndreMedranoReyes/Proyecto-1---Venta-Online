import { Schema, model } from "mongoose";

const userSchema = Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxLeght: [50, "Max is 50 characters"]
    },
    username: {
        type: String,
        unique: true
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minLenght: 6
    },
    role: {
        type: String,
        enum: ['ADMIN_ROLE', 'CLIENT_ROLE'],
        default: 'CLIENT_ROLE'
    },
    status: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }

);

userSchema.methods.toJSON = function () {
    const { __v, password, _id, ...usuario } = this.toObject({ getters: true });

    if (_id) {
        usuario.uid = _id.toString(); // Convierte `_id` en string para evitar problemas
    }

    return usuario;
};

export default model ('User', userSchema)