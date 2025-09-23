import express, { Request, Response } from "express";
import { ordersByEmail, Order } from "../AWS/orders";

const ordersRouter = express.Router();

ordersRouter.use(express.json());

ordersRouter.get("/byEmail", async (req: Request, res: Response) => {
  try {
    const email = req.query.email as string;
    if (!email) {
        res.status(400).json({ error: "Email query parameter is required" });
        return;
    }

    
    const orders = await ordersByEmail(email);
      res.json({ orders });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });


export default ordersRouter;