import Category from "../models/category.js";

// Create a new category

import slugify from "slugify";

// Create a new category
export const createCategory = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) return res.status(400).json({ error: "Title is required" });

    const slug = slugify(title, { lower: true });
    const image = req.file ? req.file.path : "";

    const category = new Category({ title, slug, image });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    console.error("Create category error:", err.message);
    res.status(400).json({ error: "Failed to create category" });
  }
};

// Get all categories
export const getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find().sort({ createdAt: -1 });
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch categories" });
  }
};

// Get category by slug
export const getCategoryBySlug = async (req, res) => {
  try {
    const category = await Category.findOne({ slug: req.params.slug });
    if (!category) return res.status(404).json({ error: "Category not found" });
    res.status(200).json(category);
  } catch (err) {
    res.status(500).json({ error: "Error fetching category" });
  }
};

// Delete a category by ID
export const deleteCategory = async (req, res) => {
  try {
    const deleted = await Category.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: "Failed to delete category" });
  }
};

