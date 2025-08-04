import express from "express";
import {
  createCategory,
  getAllCategories,
  getCategoryBySlug,
  deleteCategory
} from "../controllers/categoryController.js";
import upload from "../middleware/upload.js";

const router = express.Router();

router.post("/",upload.single("image"), createCategory);                  // Create
router.get("/", getAllCategories);                // Read all
router.get("/:slug", getCategoryBySlug);          // Read one by slug
router.delete("/:id", deleteCategory);            // Delete

export default router;
