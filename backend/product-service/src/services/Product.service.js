const path = require('path');
const fs = require('fs');
const productRepository = require('../repositories/Product.repository');
const reviewRepository = require('../repositories/Review.repository');
const { AppError } = require('../../../shared/errors');

class ProductService {
  parseFilters(query) {
    return {
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 12,
      search: query.search || '',
      minPrice: query.minPrice ? parseFloat(query.minPrice) : undefined,
      maxPrice: query.maxPrice ? parseFloat(query.maxPrice) : undefined,
      material: query.material || '',
      color: query.color || '',
      shape: query.shape || '',
      featured: query.featured === 'true' ? true : query.featured === 'false' ? false : undefined,
      sort: query.sort || 'newest',
    };
  }

  async getProducts(query) {
    const filters = this.parseFilters(query);
    return productRepository.findAll(filters);
  }

  async getProductById(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404);
    const rating = await reviewRepository.getAverageRating(id);
    return { ...product.toObject(), avgRating: rating.avgRating, reviewCount: rating.count };
  }

  async getProductBySlug(slug) {
    const product = await productRepository.findBySlug(slug);
    if (!product) throw new AppError('Product not found', 404);
    const rating = await reviewRepository.getAverageRating(product._id);
    return { ...product.toObject(), avgRating: rating.avgRating, reviewCount: rating.count };
  }

  async getFeatured() {
    return productRepository.findFeatured();
  }

  async getBestSellers() {
    return productRepository.findBestSellers();
  }

  async getRelated(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404);
    return productRepository.findRelated(product);
  }

  getFilterOptions() {
    return {
      materials: ['Ceramic', 'Copper', 'Stone', 'Stainless Steel', 'Fireclay', 'Granite Composite'],
      shapes: ['Rectangular', 'Round', 'Oval', 'Square', 'Farmhouse', 'Vessel'],
      colors: ['White', 'Black', 'Gray', 'Copper', 'Beige', 'Navy', 'Matte Black'],
    };
  }

  async updateStock(id, quantity) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404);
    const newStock = product.stock + quantity;
    if (newStock < 0) throw new AppError('Insufficient stock', 400);
    product.stock = newStock;
    if (quantity > 0) product.salesCount += quantity;
    await product.save();
    return product;
  }
}

class AdminProductService {
  async create(data, files) {
    const images = files?.map((f) => `/uploads/${f.filename}`) || [];
    return productRepository.create({ ...data, images });
  }

  async update(id, data, files) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404);

    if (files?.length) {
      data.images = [...(product.images || []), ...files.map((f) => `/uploads/${f.filename}`)];
    }

    return productRepository.update(id, data);
  }

  async delete(id) {
    const product = await productRepository.findById(id);
    if (!product) throw new AppError('Product not found', 404);

    product.images?.forEach((img) => {
      const filePath = path.join(__dirname, '../../', img.replace(/^\//, ''));
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    });

    await productRepository.delete(id);
    return { message: 'Product deleted successfully' };
  }

  async getAll(query) {
    return productRepository.findAll({
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 20,
      search: query.search || '',
    });
  }

  async getInventory() {
    const [total, lowStock] = await Promise.all([
      productRepository.countAll(),
      productRepository.getLowStock(),
    ]);
    return { totalProducts: total, lowStockItems: lowStock };
  }

  async getStats() {
    const total = await productRepository.countAll();
    return { totalProducts: total };
  }
}

class ReviewService {
  async getReviews(productId, query) {
    return reviewRepository.findByProduct(productId, {
      page: parseInt(query.page, 10) || 1,
      limit: parseInt(query.limit, 10) || 10,
    });
  }

  async createReview(productId, userId, userName, data) {
    const product = await productRepository.findById(productId);
    if (!product) throw new AppError('Product not found', 404);

    const existing = await reviewRepository.findByProductAndUser(productId, userId);
    if (existing) throw new AppError('You have already reviewed this product', 409);

    return reviewRepository.create({
      productId,
      userId,
      userName,
      rating: data.rating,
      comment: data.comment,
    });
  }
}

module.exports = {
  productService: new ProductService(),
  adminProductService: new AdminProductService(),
  reviewService: new ReviewService(),
};
