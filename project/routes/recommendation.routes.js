import express from "express";
import { recommendTreks, recommendForUserUsingModel, previewRecommendationPayload } from "../controllers/recommendation.controller.js";

const router = express.Router();

router.get("/:userId", recommendTreks);
router.get("/model/:userId", recommendForUserUsingModel);
router.get("/preview/:userId", previewRecommendationPayload);

export default router;