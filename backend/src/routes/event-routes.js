import { Router } from "express";
import {
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  getUpcomingEvents,
  updateEvent,
} from "../controllers/event-controller.js";

const router = Router();

// Express yukarıdan aşağı dener: sabit adres (/upcoming) /:id'den ÖNCE yazılır,
// yoksa "upcoming" bir id sanılır ve 404 döner.
router.get("/", getEvents);
router.get("/upcoming", getUpcomingEvents);
router.get("/:id", getEventById);
router.post("/", createEvent);
router.patch("/:id", updateEvent);
router.delete("/:id", deleteEvent);

export default router;
