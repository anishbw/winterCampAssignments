import { Router } from "express";
import {
    signup,
    signin,
    onramp,
    profile,
    walletEvents,
} from "../controller/auth";
import protectRoute from "../middleware/auth";

const authRouter = Router();

authRouter.post("/signup", signup);
authRouter.post("/signin", signin);
authRouter.post("/onramp", protectRoute, onramp);
authRouter.get("/profile", protectRoute, profile);
authRouter.get("/transactions", protectRoute, walletEvents);

export default authRouter;
