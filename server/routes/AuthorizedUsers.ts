import express from "express";
import {AddingAuthorizedUserHandler} from "../AWS/AuthorisedUsersFunctions";

const router = express.Router();

// Endpoint to add an authorized user
router.post("/addAuthorizedUser", async (req, res) => {
    const { username, authorizedUser } = req.body;
    const result = await AddingAuthorizedUserHandler(username, authorizedUser);
    res.json(result);
});

export default router;

