import { signUpSchema, signInSchema } from "../types/auth";
import { User, WalletEvent } from "../model/user";
import jwt from "jsonwebtoken";

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

        try {
            await WalletEvent.create({
                userId: req.user.id,
                amount: 500,
                type: "onramp",
            });
        } catch (err) {
            await User.findByIdAndUpdate(
                req.user.id,
                { $inc: { balance: -500 } },
                { returnDocument: "after" },
            );
            throw err;
        }

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

const signup = async (req, res) => {
    const result = signUpSchema.safeParse(req.body);

    if (!result.success)
        return res.status(400).json({
            message: result.error.issues[0]?.message,
        });

    try {
        const hash = await Bun.password.hash(result.data.password);
        await User.create({
            username: result.data.username,
            password: hash,
        });

        return res.status(201).json({
            message: `Account ${result.data.username} created successfully`,
        });
    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "Username already taken",
            });
        }

        return res.status(500).json({
            message: "Internal server error",
        });
    }
};
const signin = async (req, res) => {
    const result = signInSchema.safeParse(req.body);

    if (!result.success)
        return res.status(400).json({
            message: result.error.issues[0]?.message,
        });

    try {
        const user = await User.findOne({
            username: result.data.username,
        });

        if (!user)
            return res.status(401).json({
                message: "Invalid Credentials",
            });

        const check = await Bun.password.verify(
            result.data.password,
            user.password,
        );

        if (!check)
            return res.status(401).json({
                message: "Invalid Credentials",
            });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        return res.status(200).json({
            message: `Signed in successfully`,
            token: token,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const profile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        if (!user)
            return res.status(404).json({
                message: "User not Found",
            });

        return res.status(200).json({
            userName: user.username,
            balance: user.balance,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

const walletEvents = async (req, res) => {
    try {
        const transactions = await WalletEvent.find({
            userId: req.user.id,
        }).sort({ _id: -1 });

        return res.status(200).json({
            message: "Transactions fetched successfully",
            transactions,
        });
    } catch (err) {
        return res.status(500).json({
            message: "Internal server error",
        });
    }
};

export { signin, signup, onramp, profile, walletEvents };
