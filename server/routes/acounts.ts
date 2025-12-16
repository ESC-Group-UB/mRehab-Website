import express, { Request, Response, NextFunction } from "express";
import {
  updateAccountProfile,
  deleteAccountEverywhere,
  changeAccountPassword,
} from "../AWS/ProfileFunctions";

// 👇 If you already have an auth middleware somewhere, import it instead:
// Lightweight requireAuth middleware (inlined): extracts Bearer token and decodes JWT payload (no signature verification)
const requireAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization || (req.headers as any).Authorization;
  if (!authHeader || Array.isArray(authHeader)) {
    res.status(401).json({ message: "Unauthorized: missing Authorization header" });
    return;
  }

  const parts = (authHeader as string).split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    res.status(401).json({ message: "Unauthorized: invalid Authorization header" });
    return;
  }

  const token = parts[1];
  (req as any).token = token;

  // Try to decode JWT payload without verifying signature to extract 'sub'
  try {
    const payloadPart = token.split(".")[1];
    if (payloadPart) {
      // base64url -> base64
      const padded = payloadPart.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((payloadPart.length + 3) % 4);
      const decoded = Buffer.from(padded, "base64").toString("utf8");
      const payload = JSON.parse(decoded);
      if (payload && payload.sub) {
        (req as any).user = { sub: payload.sub, ...payload };
      }
    }
  } catch (e) {
    // ignore decode errors; user will remain undefined
  }

  next();
};

const router = express.Router();

// Extend Request type so TypeScript knows about user + token fields
interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    [key: string]: any;
  };
  token?: string; // raw access token from Authorization header
}

 // ---------- UPDATE PROFILE ----------
 // PUT /auth/update-info
 router.put(
   "/update-info",
   requireAuth,
   async (req: AuthenticatedRequest, res: Response) => {
     try {
       const accessToken = req.token;
       const sub = req.user?.sub;

       if (!accessToken || !sub) {
          res
           .status(401)
           .json({ message: "Unauthorized: missing user or token" });
          return;
       }

       console.log("update-info request body:", req.body);

       const { given_name, last_name, address } = req.body as {
         given_name?: string;
         last_name?: string;
         address?: object;
       };

       console.log("Updating profile for user:", sub);
       console.log("New data:", { given_name, last_name, address });

       await updateAccountProfile({
         accessToken: accessToken!,
         sub: sub!,
         given_name,
         last_name,
         address,
       });

        res.json({ message: "Profile updated successfully" });
     } catch (err: any) {
       console.error("update-profile error:", err);
        res
         .status(500)
         .json({ message: err.message || "Failed to update profile" });
     }
   }
 );
 // ---------- CHANGE PASSWORD ----------
 // POST /auth/change-password
 router.post(
   "/change-password",
   requireAuth,
   async (req: AuthenticatedRequest, res: Response) => {
     try {
       const accessToken = req.token;

       if (!accessToken) {
          res
           .status(401)
           .json({ message: "Unauthorized: missing access token" });
          return;
       }

       const { currentPassword, newPassword } = req.body as {
         currentPassword?: string;
         newPassword?: string;
       };

       if (!currentPassword || !newPassword) {
          res.status(400).json({
           message: "currentPassword and newPassword are required",
         });
         return;
       }

       await changeAccountPassword({
         accessToken: accessToken!,
         currentPassword,
         newPassword,
       });

        res.json({ message: "Password changed successfully" });
     } catch (err: any) {
       console.error("change-password error:", err);
        res
         .status(500)
         .json({ message: err.message || "Failed to change password" });
     }
   }
 );
 // ---------- DELETE ACCOUNT ----------
 // POST /auth/delete-account
 router.post(
   "/delete-account",
   requireAuth,
   async (req: AuthenticatedRequest, res: Response) => {
     try {
       const sub = req.user?.sub;

       if (!sub) {
          res
           .status(401)
           .json({ message: "Unauthorized: missing user" });
          return;
       }

       await deleteAccountEverywhere({ sub: sub! });

        res.json({ message: "Account deleted" });
     } catch (err: any) {
       console.error("delete-account error:", err);
        res
         .status(500)
         .json({ message: err.message || "Failed to delete account" });
     }
   }
 );

export default router;
