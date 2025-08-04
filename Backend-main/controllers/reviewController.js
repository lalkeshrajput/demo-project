import Review from '../models/feedback.js';

export const addReview = async (req, res) => {
  const { item_id, rating, comment } = req.body;
  const review = await Review.create({ item_id, user_id: req.user._id, rating, comment });
  res.status(201).json(review);
};

export const getItemReviews = async (req, res) => {
  const reviews = await Review.find({ item_id: req.params.id }).populate('user_id', 'name');
  res.json(reviews);
};
