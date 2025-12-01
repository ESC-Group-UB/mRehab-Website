import express, { Request, Response } from "express";
import multer from "multer";
import { uploadCsvToLatestLogging } from "../AWS/latestLoggingService";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

router.post("/", upload.single("csv"), async (req: Request, res: Response): Promise<void> => {
  try {
    const email = (req.body?.email as string)?.trim();
    const file = req.file;

    if (!email) {
      res.status(400).json({ ok: false, error: "email field is required" });
      return;
    }

    if (!file) {
      res.status(400).json({ ok: false, error: "CSV file is required under field `csv`" });
      return;
    }

    if (file.mimetype !== "text/csv" && !file.originalname.toLowerCase().endsWith(".csv")) {
      res.status(400).json({ ok: false, error: "Uploaded file must be a CSV" });
      return;
    }

    const result = await uploadCsvToLatestLogging(email, file.buffer, file.originalname);

    res.status(201).json({
      ok: true,
      message: "CSV uploaded successfully",
      location: result,
    });
  } catch (err: any) {
    console.error("❌ CSV upload failed:", err);
    res.status(500).json({ ok: false, error: err?.message || "Failed to upload CSV" });
  }
});

export default router;

