const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Artisan Sink Studio API',
      version: '1.0.0',
      description: 'MEAN Stack marketplace API for handmade sinks',
      contact: { name: 'Artisan Sink Studio', email: 'support@artisansinkstudio.com' },
    },
    servers: [{ url: 'http://localhost:3000', description: 'Development server' }],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            firstName: { type: 'string' },
            lastName: { type: 'string' },
            email: { type: 'string', format: 'email' },
            role: { type: 'string', enum: ['admin', 'customer'] },
            phone: { type: 'string' },
            address: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Product: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            name: { type: 'string' },
            slug: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            material: { type: 'string' },
            color: { type: 'string' },
            shape: { type: 'string' },
            stock: { type: 'integer' },
            dimensions: { type: 'string' },
            weight: { type: 'string' },
            featured: { type: 'boolean' },
            images: { type: 'array', items: { type: 'string' } },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Order: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            userId: { type: 'string' },
            items: { type: 'array', items: { type: 'object' } },
            totalPrice: { type: 'number' },
            shippingAddress: { type: 'object' },
            status: { type: 'string', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'] },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Review: {
          type: 'object',
          properties: {
            _id: { type: 'string' },
            productId: { type: 'string' },
            userId: { type: 'string' },
            rating: { type: 'integer', minimum: 1, maximum: 5 },
            comment: { type: 'string' },
            createdAt: { type: 'string', format: 'date-time' },
          },
        },
        Error: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            message: { type: 'string' },
          },
        },
      },
    },
    tags: [
      { name: 'Auth', description: 'Authentication endpoints' },
      { name: 'Users', description: 'User profile management' },
      { name: 'Products', description: 'Product catalog' },
      { name: 'Orders', description: 'Orders and cart' },
      { name: 'Reviews', description: 'Product reviews' },
      { name: 'Admin', description: 'Admin management' },
      { name: 'Contact', description: 'Contact form' },
    ],
  },
  apis: [],
};

module.exports = swaggerJsdoc(options);
