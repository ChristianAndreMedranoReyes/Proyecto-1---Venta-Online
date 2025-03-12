import mongoose from "mongoose";

const roleSchema = mongoose.Schema({
    role: {
        type: String,
        required: [true, "Role is required"],
        unique: true
    }
})

export default mongoose.model('Role', roleSchema);