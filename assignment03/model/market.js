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
});

const Market = mongoose.model("Market", marketSchema);

export default Market;
