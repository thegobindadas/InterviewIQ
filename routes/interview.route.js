import express from "express";
import { startInterview, submitAnswer, evaluateInterview } from "../controllers/interview.controller.js";



const router = express.Router();



router.route("/start").post(startInterview);

router.route("/answer").post(submitAnswer);

router.route("/evaluate/:sessionId").get(evaluateInterview);





export default router;