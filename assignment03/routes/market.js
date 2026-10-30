import protectRoute from "../middleware/auth";
import { Router } from "express";
import {
    createMarket,
    betMarket,
    showMarket,
    showBet,
} from "../controller/market";

const marketRouter = Router();

marketRouter.post("/market", protectRoute, createMarket);
marketRouter.get("/market", showMarket);
marketRouter.post("/market/bet", protectRoute, betMarket);
marketRouter.get("/market/bets", protectRoute, showBet);

export default marketRouter;
