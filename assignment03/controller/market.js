import User from "../model/user";
import Market from "../model/market";
import marketSchema from "../types/market";

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

export { onramp, createMarket };
