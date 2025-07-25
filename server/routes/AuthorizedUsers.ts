import express from "express";
import {AddingAuthorizedUserHandler, getAllowedToViewUsers} from "../AWS/AuthorisedUsersFunctions";
import {getUsersFromCognito} from "../AWS/authService";

const router = express.Router();

// Endpoint to add an authorized user
router.post("/addAuthorizedUser", async (req, res) => {
    const { username, authorizedUser } = req.body;
    const result = await AddingAuthorizedUserHandler(username, authorizedUser);
    res.json(result);
});

router.get("/getAllowedToViewUsers", async (req, res) => {
    const username  = req.query.username as string;
    console.log(`Fetching allowed to view users for: ${username}`);
    const allowedUsers = await getAllowedToViewUsers(username);
    res.json(allowedUsers);
});

router.get("/search", async (req, res) => {
  const query = req.query.query?.toString().toLowerCase() ?? "";
  const mockDoctors = await getUsersFromCognito(); // This should be replaced with actual data fetching logic
  console.log(mockDoctors)
  const matches = mockDoctors
    ? mockDoctors.filter(
        (doc) =>
          doc.name.toLowerCase().includes(query) || doc.email.toLowerCase().includes(query)
      )
    : [];
  res.json(matches);
});

export default router;

