import Item from '../models/item.js';

export const createItem = async (req, res) => {
  try {
    const {
      title,
      description,
      pricing,
      condition,
      category,
      images,
      deposit,
      location,
    } = req.body;

    const ownerId = req.user.id; // ✅ This comes from verifyToken middleware

    const item = new Item({
      title,
      description,
      pricing,
      condition,
      category,
      images,
      deposit,
      location,
      owner: ownerId, // ✅ Store the logged-in user as the owner
    });

    await item.save();
    const populatedItem = await Item.findById(item._id).populate('category');
    res.status(201).json(populatedItem);
  } catch (error) {
    console.error("Error creating item:", error);
    res.status(500).json({ error: 'Failed to create item' });
  }
};

// GET /api/items
export const getItems = async (req, res) => {
  try {
    const { location } = req.query;
    let filter = {};

    if (location) {
      filter['location'] = { $regex: location, $options: 'i' }; // case-insensitive match
    }

    const items = await Item.find(filter).populate('category');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
};




export const updateItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Ensure the logged-in user is the owner
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Not your item' });
    }

    const updatedItem = await Item.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedItem);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteItem = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Item not found' });

    // Ensure the logged-in user is the owner
    if (item.owner.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Forbidden: Not your item' });
    }

    await Item.findByIdAndDelete(req.params.id);
    res.json({ message: 'Item deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
// controllers/itemController.js

export const getItemsByOwner = async (req, res) => {
  try {
    const ownerId = req.user.id || req.user._id;
    const items = await Item.find({ owner: ownerId });
    res.status(200).json({ items });
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch items' });
  }
};

// In your item controller (e.g. itemController.js)
export const getItemById = async (req, res) => {
  try {
    const item = await Item.findById(req.params.id)
      .populate('owner', 'name email createdAt');

    if (!item) return res.status(404).json({ message: 'Item not found' });

    res.json(item);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getFeaturedItems = async (req, res) => {
  try {
    const { location } = req.query;

    const query = { status: 'available' };

    if (location) {
      console.log("📍 Filtering by location:", location);
      query.location = { $regex: new RegExp(location.trim(), 'i') };
    }

    console.log("🛠️ Final MongoDB query:", query);

    const featuredItems = await Item.find(query).limit(8);
    res.status(200).json(featuredItems);
  } catch (err) {
    console.error("❌ Error fetching featured items:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id || req.user._id;

    const { name, phone, address } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { name, phone, address },
      { new: true, runValidators: true }
    );

    console.log("✅ Updated user:", updatedUser); // DEBUG log
    res.json(updatedUser);
  } catch (error) {
    console.error("❌ Error updating profile:", error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
};

import Order from '../models/order.js';

export const checkItemAvailability = async (req, res) => {
  try {
    const { item_id, rental_start_date, rental_end_date } = req.body;

    if (!item_id || !rental_start_date || !rental_end_date) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const start = new Date(rental_start_date);
    const end = new Date(rental_end_date);

    // ✅ Corrected Query: check inside items array
    const overlappingOrders = await Order.find({
      'items.item_id': item_id,
      status: { $nin: ['cancelled', 'returned'] },
      'items.startDate': { $lte: end },
      'items.endDate': { $gte: start }
    });

    if (overlappingOrders.length > 0) {
      return res.json({
        available: false,
        message: 'Item is not available for the selected dates'
      });
    }

    return res.json({
      available: true,
      message: 'Item is available for selected dates'
    });

  } catch (err) {
    console.error('🔴 Availability Check Error:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};




