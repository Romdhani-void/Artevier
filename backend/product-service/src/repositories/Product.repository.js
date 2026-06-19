const Product = require('../models/Product.model');

class ProductRepository {
  async create(data) {
    return Product.create(data);
  }

  async findById(id) {
    return Product.findById(id);
  }

  async findBySlug(slug) {
    return Product.findOne({ slug });
  }

  async update(id, data) {
    return Product.findByIdAndUpdate(id, data, { new: true, runValidators: true });
  }

  async delete(id) {
    return Product.findByIdAndDelete(id);
  }

  async findAll(filters = {}) {
    const {
      page = 1,
      limit = 12,
      search = '',
      minPrice,
      maxPrice,
      material,
      color,
      shape,
      featured,
      sort = 'newest',
    } = filters;

    const query = {};

    if (search) {
      query.$text = { $search: search };
    }
    if (minPrice !== undefined || maxPrice !== undefined) {
      query.price = {};
      if (minPrice !== undefined) query.price.$gte = minPrice;
      if (maxPrice !== undefined) query.price.$lte = maxPrice;
    }
    if (material) query.material = material;
    if (color) query.color = { $regex: color, $options: 'i' };
    if (shape) query.shape = shape;
    if (featured !== undefined) query.featured = featured;

    const sortOptions = {
      newest: { createdAt: -1 },
      'price-asc': { price: 1 },
      'price-desc': { price: -1 },
      popularity: { salesCount: -1 },
    };

    const skip = (page - 1) * limit;
    const [products, total] = await Promise.all([
      Product.find(query)
        .sort(sortOptions[sort] || sortOptions.newest)
        .skip(skip)
        .limit(limit),
      Product.countDocuments(query),
    ]);

    return { products, total, page, pages: Math.ceil(total / limit) };
  }

  async findFeatured(limit = 6) {
    return Product.find({ featured: true }).sort({ createdAt: -1 }).limit(limit);
  }

  async findBestSellers(limit = 6) {
    return Product.find().sort({ salesCount: -1 }).limit(limit);
  }

  async findRelated(product, limit = 4) {
    return Product.find({
      _id: { $ne: product._id },
      $or: [{ material: product.material }, { shape: product.shape }],
    }).limit(limit);
  }

  async countAll() {
    return Product.countDocuments();
  }

  async getLowStock(threshold = 5) {
    return Product.find({ stock: { $lte: threshold } }).sort({ stock: 1 });
  }

  async incrementSalesCount(productId, quantity) {
    return Product.findByIdAndUpdate(productId, { $inc: { salesCount: quantity } });
  }

  async decrementStock(productId, quantity) {
    return Product.findByIdAndUpdate(
      productId,
      { $inc: { stock: -quantity } },
      { new: true }
    );
  }
}

module.exports = new ProductRepository();
