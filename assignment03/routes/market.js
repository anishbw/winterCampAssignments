import protectRoute from "../middleware/auth";
import { Router } from "express";
import { createMarket, betMarket } from "../controller/market";

const marketRouter = Router();

marketRouter.post("/market", protectRoute, createMarket);
marketRouter.post("/bet", protectRoute, betMarket);

export default marketRouter;
