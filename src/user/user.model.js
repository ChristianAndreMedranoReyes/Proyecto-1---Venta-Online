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
    password: {
        type: String,
        required: [true, "Password is required"],
        minLenght: 6
    },
    phone: {
        type: String,
        minLenght: 8,
        maxLenght: 8,
        required: true
    },
    estado: {
        type: Boolean,
        default: true
    },
},
    {
        timestamps: true,
        versionKey: false
    }

);

userSchema.methods.toJSON = function (){
    const { __v, password, id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}

export default model ('User', userSchema)