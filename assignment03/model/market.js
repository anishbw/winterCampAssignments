import mongoose from "mongoose";

const marketSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true,
    },
    side: {
        type: Boolean,
        required: true,
    },
    initialWager: {
        type: Number,
        required: true,
    },
    creatorId: {
        type: String,
        required: true,
    },
    resolution: {
        type: Boolean,
        default: null,
    },
    remainingWager: {
        type: Number,
        required: true,
    },
});

const betSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    marketId: {
        type: String,
        required: true,
    },
    betAmount: {
        type: Number,
        required: true,
    },
});

const Market = mongoose.model("Market", marketSchema);
const Bet = mongoose.model("Bet", betSchema);

export { Market, Bet };
