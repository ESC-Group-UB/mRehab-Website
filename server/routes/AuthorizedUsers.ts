import express from "express";
import {addAuthorizedUser, addUserToYourAllowedToView} from "../AWS/AuthorisedUsersFunctions";

const router = express.Router();

// Endpoint to add an authorized user
router.post("/addAuthorizedUser", async (req, res) => {
    const { username, authorizedUser } = req.body;
    try {
        await addAuthorizedUser(username, authorizedUser);
        await addUserToYourAllowedToView(username, authorizedUser);
        res.status(200).json({ message: `Successfully added ${authorizedUser} to ${username}'s allowed users.` });
    } catch (error) {
        console.error("Error adding authorized user:", error);
        res.status(500).json({ error: "Failed to add authorized user." });
    }
    

});

export default router;

