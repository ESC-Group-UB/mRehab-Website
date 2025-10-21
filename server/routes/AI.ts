import express, { Request, Response } from "express";
import { logAIIntent } from "../AWS/AIFunctions";

const AIRouter = express.Router();

AIRouter.use(express.json());

AIRouter.post("/intentUpload", async (req: Request, res: Response) =>{
    try {
        const { logId, timestamp, PredictedCategory, Prompt, Scores, Username, UserReportedCategory } = req.body;
    
        await logAIIntent({
            logId,
            timestamp,
            PredictedCategory,
            Prompt,
            Scores,
            Username,
            UserReportedCategory
        });
        res.status(200).json({ message: "AI intent upload received successfully" });
    } catch (error) {
        console.error("Error processing AI intent upload:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});
export default AIRouter;