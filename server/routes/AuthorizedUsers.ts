// server/routes/AuthorizedUsers.ts
// This file handles routes for managing authorized user access and searching users.
// It includes adding authorized users, retrieving who a user can view, and basic search functionality.

import express from "express";
import { AddingAuthorizedUserHandler, getAllowedToViewUsers, getAllowedToViewUsersFromCognito } from "../AWS/AuthorisedUsersFunctions";
import { getUsersFromCognito } from "../AWS/authService";
import { cacheRoute, cacheDel, cacheSet } from "../cache";

const router = express.Router();
const SevenDaysInSeconds = 60 * 60 * 24 * 7; // 7 days in seconds
/**
 * POST /addAuthorizedUser
 * Adds an authorized user who can view the data of the given `username`.
 * Expects: { username: string, authorizedUser: string }
 * Returns: success/failure message
 */
router.post("/addAuthorizedUser", async (req, res) => {
    const { username, authorizedUser } = req.body;
    // clear cashe for /getAllowedToViewUsers for the authorized user
    const cacheKey = `/getAllowedToViewUsers?username=${authorizedUser}`;
    cacheDel(cacheKey).catch(console.error);
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
router.get(
  "/getAllowedToViewUsers",
  cacheRoute(3600), // ✅ middleware runs first
  async (req, res) => {
    const username = req.query.username as string;
    
    const allowedUsers = await getAllowedToViewUsers(username);
    res.json(allowedUsers);
  }
);
/**
 * GET /search?query=<string>
 * Performs a simple name/email search of users (typically doctors or patients).
 * Expects: query param `query`
 * Returns: Filtered list of users that match the query string
 */
// USED FOR SEARCHING DOCTORS OR PATIENTS

// caching note: this route is cached
// cache should be invalidated when a new user is added or deleted
// so that the search results are always up-to-date
//NEED TO DO
router.get("/search", async (req, res) => {
    const query = req.query.query?.toString().toLowerCase() ?? "";
    
    const mockDoctors = await getUsersFromCognito();

    

    const matches = mockDoctors
        ? mockDoctors.filter(
            (doc) =>
                doc.name.toLowerCase().includes(query) ||
                doc.email.toLowerCase().includes(query)
        )
        : [];

    res.json(matches);
});

router.get("/search/auth", async (req, res) => {
    const query = req.query.query?.toString().toLowerCase() ?? "";
    const email = req.query.email?.toString().toLowerCase() ?? "";
    
    const mockDoctors = await getAllowedToViewUsersFromCognito(email);

    

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
