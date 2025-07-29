// server/routes/AuthorizedUsers.ts
// This file handles routes for managing authorized user access and searching users.
// It includes adding authorized users, retrieving who a user can view, and basic search functionality.

import express from "express";
import { AddingAuthorizedUserHandler, getAllowedToViewUsers } from "../AWS/AuthorisedUsersFunctions";
import { getUsersFromCognito } from "../AWS/authService";

const router = express.Router();

/**
 * POST /addAuthorizedUser
 * Adds an authorized user who can view the data of the given `username`.
 * Expects: { username: string, authorizedUser: string }
 * Returns: success/failure message
 */
router.post("/addAuthorizedUser", async (req, res) => {
    const { username, authorizedUser } = req.body;
    const result = await AddingAuthorizedUserHandler(username, authorizedUser);
    res.json(result);
});

/**
 * GET /getAllowedToViewUsers?username=<username>
 * Retrieves a list of users that the given `username` is allowed to view.
 * Expects: query param `username`
 * Returns: Array of user emails/usernames
 */
// THIS IS MAINLY USED FOR DCOCTORS SO THEY ARE ABLE TO SEE THIER PATIENTS
router.get("/getAllowedToViewUsers", async (req, res) => {
    const username = req.query.username as string;
    console.log(`Fetching allowed to view users for: ${username}`);
    const allowedUsers = await getAllowedToViewUsers(username);
    res.json(allowedUsers);
});

/**
 * GET /search?query=<string>
 * Performs a simple name/email search of users (typically doctors or patients).
 * Expects: query param `query`
 * Returns: Filtered list of users that match the query string
 */
// USED FOR SEARCHING DOCTORS OR PATIENTS
router.get("/search", async (req, res) => {
    const query = req.query.query?.toString().toLowerCase() ?? "";
    
    const mockDoctors = await getUsersFromCognito();

    console.log(mockDoctors);

    const matches = mockDoctors
        ? mockDoctors.filter(
            (doc) =>
                doc.name.toLowerCase().includes(query) ||
                doc.email.toLowerCase().includes(query)
        )
        : [];

    res.json(matches);
});

export default router;
