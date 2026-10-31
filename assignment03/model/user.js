import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
    },
    balance: {
        type: Number,
        default: 0,
        required: false,
    },
});

const transactionSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
});

const User = mongoose.model("User", userSchema);
const WalletEvent = mongoose.model("WalletEvent", transactionSchema);

export { WalletEvent, User };
