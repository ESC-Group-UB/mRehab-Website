import express from "express";
import {addAuthorizedUser} from "../AWS/awsDBfunctions";

const router = express.Router();

// Endpoint to add an authorized user
router.post("/addAuthorizedUser", async (req, res) => {
    

});

export default router;

