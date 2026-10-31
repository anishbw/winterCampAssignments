import jwt from "jsonwebtoken";

const protectRoute = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({
            message: "Unauthorized access",
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    } catch (err) {
        if (err.name === "TokenExpiredError") {
            return res.status(401).json({
                message: "Token has expired. Please log in again.",
            });
        }

        return res.status(401).json({
            message: "Unauthorized access",
        });
    }
};

export default protectRoute;
