import mongoose from "mongoose";

const usersSchema = new mongoose.Schema(
    {
        name: {
            type: String
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        role: {
            type: String,
            enum: ['user', 'admin', 'dealer'],
            default: 'user'
        },
        password: {
            type: String,
            required: true
        }
    },
    {
        timestamps: true,
    }


);

const User = mongoose.model("User", usersSchema);

export { User };