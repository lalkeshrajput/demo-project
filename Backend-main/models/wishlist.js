import mongoose from 'mongoose';
const wishlistSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  item_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Item' }]
}, { timestamps: true });

// const Wishlist = mongoose.model('Wishlist', wishlistSchema);
const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', wishlistSchema);
export default Wishlist;