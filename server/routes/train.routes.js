const express = require("express");
const router = express.Router();
const trainController = require("../controllers/train.controller");
const authenticate = require("../middleware/auth");
const requireRole = require("../middleware/roleCheck");

// Protected routes (Both Admin and Staff can read)
router.use(authenticate);

router.get("/", trainController.getAll);
router.get("/search", trainController.search);
router.get("/:id", trainController.getById);

// Admin only routes
router.use(requireRole("admin"));

router.post("/", trainController.create);
router.put("/:id", trainController.update);
router.delete("/:id", trainController.remove);

module.exports = router;
