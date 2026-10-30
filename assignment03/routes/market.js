import protectRoute from "../middleware/auth";
import { Router } from "express";
import { onramp, createMarket } from "../controller/market";

const marketRouter = Router();

marketRouter.post("/onramp", protectRoute, onramp);
marketRouter.post("/market", protectRoute, createMarket);

export default marketRouter;
