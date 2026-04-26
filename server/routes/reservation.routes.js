const express = require("express");
const router = express.Router();
const reservationController = require("../controllers/reservation.controller");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/roleCheck");

// Protected routes (Both Admin and Passenger can read/book)
router.use(authenticate);

router.get("/", reservationController.getAll);
router.post("/", reservationController.create);

// Admin only routes
router.use(requireRole("admin"));

router.patch("/:id/cancel", reservationController.cancel);

module.exports = router;
