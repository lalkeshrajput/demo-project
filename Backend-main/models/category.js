import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true },
  slug: { type: String, unique: true },
  image: { type: String }
}, { timestamps: true });

categorySchema.pre('save', function (next) {
  if (this.isModified('title')) {
    this.slug = slugify(this.title, { lower: true });
  }
  next();
});

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);
export default Category;
