import User from "../model/user";
import { Market, Bet } from "../model/market";
import { marketSchema, betSchema } from "../types/market";
import mongoose from "mongoose";

const onramp = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { $inc: { balance: 500 } },
            { returnDocument: "after" },
        );

        if (!user)
            return res.status(404).json({
                message: "User not Found",
            });

        return res.status(200).json({
            message: "Balance updated successfully",
            balance: user.balance,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const createMarket = async (req, res) => {
    const result = marketSchema.safeParse(req.body);

    if (!result.success)
        return res.status(400).json({
            message: result.error.issues[0]?.message,
        });

    try {
        const existingUser = await User.findById(req.user.id);

        if (!existingUser)
            return res.status(404).json({
                message: "User not Found",
            });

        const existingMarket = await Market.findOne({
            title: result.data.title,
        });

        if (existingMarket)
            return res.status(400).json({
                message: "Market already exists",
            });

        const user = await User.findOneAndUpdate(
            { _id: req.user.id, balance: { $gte: result.data.initialWager } },
            { $inc: { balance: -result.data.initialWager } },
            { returnDocument: "after" },
        );

        if (!user)
            return res.status(400).json({
                message: "Insufficient Funds",
            });

        try {
            const newMarket = await Market.create({
                title: result.data.title,
                side: result.data.side,
                initialWager: result.data.initialWager,
                remainingWager: result.data.initialWager,
                creatorId: req.user.id,
            });

            return res.status(201).json({
                message: "New Market has been created",
                market: newMarket,
                balance: user.balance,
            });
        } catch (err) {
            await User.findByIdAndUpdate(req.user.id, {
                $inc: { balance: result.data.initialWager },
            });
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

const betMarket = async (req, res) => {
    const result = betSchema.safeParse(req.body);

    if (!result.success)
        return res.status(400).json({
            message: result.error.issues[0]?.message,
        });

    try {
        const existingUser = await User.findById(req.user.id);

        if (!existingUser)
            return res.status(404).json({
                message: "User not Found",
            });

        if (!mongoose.Types.ObjectId.isValid(result.data.marketId)) {
            return res.status(400).json({
                message: "Invalid market ID format",
            });
        }

        const existingMarket = await Market.findById(result.data.marketId);

        if (!existingMarket)
            return res.status(404).json({
                message: "Market does not exists",
            });

        if (existingMarket.resolution !== null) {
            return res.status(400).json({
                message: "Market is already resolved",
            });
        }

        if (existingMarket.creatorId === req.user.id) {
            return res.status(400).json({
                message: "You cannot bet against your own market",
            });
        }

        const user = await User.findOneAndUpdate(
            { _id: req.user.id, balance: { $gte: result.data.betAmount } },
            { $inc: { balance: -result.data.betAmount } },
            { returnDocument: "after" },
        );

        if (!user)
            return res.status(400).json({
                message: "Insufficient Funds",
            });

        const market = await Market.findOneAndUpdate(
            {
                _id: result.data.marketId,
                remainingWager: { $gte: result.data.betAmount },
            },
            { $inc: { remainingWager: -result.data.betAmount } },
            { returnDocument: "after" },
        );

        if (!market) {
            await User.findByIdAndUpdate(req.user.id, {
                $inc: { balance: result.data.betAmount },
            });
            return res.status(400).json({
                message: "Bet exceeds remaining market capacity",
            });
        }

        try {
            const newBet = await Bet.create({
                userId: req.user.id,
                marketId: result.data.marketId,
                betAmount: result.data.betAmount,
            });

            return res.status(201).json({
                message: "New Bet has been created",
                bet: newBet,
                balance: user.balance,
                remainingMarketCapacity: market.remainingWager,
            });
        } catch (err) {
            await User.findByIdAndUpdate(req.user.id, {
                $inc: { balance: result.data.betAmount },
            });
            await Market.findByIdAndUpdate(result.data.marketId, {
                $inc: { remainingWager: result.data.betAmount },
            });
            return res.status(500).json({
                message: "Internal Server Error",
            });
        }
    } catch (err) {
        return res.status(500).json({
            message: "Internal Server Error",
        });
    }
};

export { onramp, createMarket, betMarket };
