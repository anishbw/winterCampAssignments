import protectRoute from "../middleware/auth";
import { Router } from "express";
import { createMarket, betMarket, showMarket } from "../controller/market";

const marketRouter = Router();

marketRouter.post("/market", protectRoute, createMarket);
marketRouter.get("/market", showMarket);
marketRouter.post("/bet", protectRoute, betMarket);

export default marketRouter;
