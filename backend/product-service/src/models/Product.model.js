const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    slug: { type: String, unique: true, index: true },
    description: { type: String, required: true, maxlength: 5000 },
    price: { type: Number, required: true, min: 0 },
    material: {
      type: String,
      required: true,
      enum: ['Ceramic', 'Copper', 'Stone', 'Stainless Steel', 'Fireclay', 'Granite Composite'],
    },
    color: { type: String, required: true, trim: true },
    shape: {
      type: String,
      required: true,
      enum: ['Rectangular', 'Round', 'Oval', 'Square', 'Farmhouse', 'Vessel'],
    },
    stock: { type: Number, required: true, min: 0, default: 0 },
    dimensions: { type: String, required: true },
    weight: { type: String, required: true },
    featured: { type: Boolean, default: false },
    images: [{ type: String }],
    salesCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

productSchema.pre('save', function generateSlug(next) {
  if (this.isModified('name') || !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true }) + '-' + Date.now().toString(36);
  }
  next();
});

productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ price: 1, material: 1, color: 1, shape: 1 });

module.exports = mongoose.model('Product', productSchema);
