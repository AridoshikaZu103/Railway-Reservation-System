const express = require("express");
const router = express.Router();
const passengerController = require("../controllers/passenger.controller");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/roleCheck");

// Protected routes (Both Admin and Passenger can read/write self)
router.use(authenticate);

router.get("/", passengerController.getAll);
router.get("/:id", passengerController.getById);
router.post("/", passengerController.create);

// Admin only routes
router.use(requireRole("admin"));

router.put("/:id", passengerController.update);
router.delete("/:id", passengerController.remove);

module.exports = router;
