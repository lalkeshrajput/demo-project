import express from 'express';
import { createItem, getItems,updateItem,deleteItem ,getItemsByOwner,getFeaturedItems,checkItemAvailability} from '../controllers/itemController.js';
import { verifyToken } from '../middleware/authMiddleware.js';
import upload from '../middleware/upload.js'; 
import Category from "../models/category.js";
import Item from "../models/item.js"; // ✅ Add this line

// const upload = multer({ storage });
const router = express.Router();

router.post('/', verifyToken, upload.array("images", 5), createItem);
router.get('/', getItems);
// GET /api/items/owner
router.get('/owner', verifyToken, async (req, res) => {
  try {
    const items = await Item.find({ owner_id: req.user._id }).populate('category');
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user listings' });
  }
});
router.get('/featured', getFeaturedItems);


router.put('/:id', verifyToken, updateItem);   // 🔐 Protected
router.delete('/:id', verifyToken, deleteItem);

router.get('/:id', async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('category')
      .populate('owner', 'name email'); // ✅ populate only needed fields

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



// GET /api/items/category/:slug
router.get('/category/:slug', async (req, res) => {
  try {
    const slug = req.params.slug;

    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    const items = await Item.find({ category: category._id }).populate("category", "title slug");
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});



router.post('/check-availability', verifyToken, checkItemAvailability);


export default router;
