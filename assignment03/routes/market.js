import protectRoute from "../middleware/auth";
import { Router } from "express";
import { onramp, createMarket, betMarket } from "../controller/market";

const marketRouter = Router();

marketRouter.post("/onramp", protectRoute, onramp);
marketRouter.post("/market", protectRoute, createMarket);
marketRouter.post("/bet", protectRoute, betMarket);

export default marketRouter;
