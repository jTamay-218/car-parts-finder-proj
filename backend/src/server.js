import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import multer from 'multer';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import carBrandRoutes from './routes/carBrands.js';
import carModelRoutes from './routes/carModels.js';
import partCategoryRoutes from './routes/partCategories.js';
import carPartRoutes from './routes/carParts.js';
import listingRoutes from './routes/listings.js';
import searchRoutes from './routes/search.js';
import messageRoutes from './routes/messages.js';
import adminRoutes from './routes/admin.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Import database
import { initDatabase, testConnection } from './config/database.js';
import { uploadImage } from './config/supabase.js';

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif|webp/;
    const extname = allowedTypes.test(file.originalname.toLowerCase());
    if (extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'));
  }
});

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());

// CORS configuration
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes
  max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use(limiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Compression middleware
app.use(compression());

// Logging middleware
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Simple products endpoint for frontend
app.get('/api/products', async (req, res) => {
  try {
    const { query, execute } = await import('./config/database.js');
    const result = await query(`
      SELECT 
        pl._id as id,
        pl.name,
        pl.price,
        pl.condition,
        pl.description,
        pl.image,
        pl.status,
        pl.user_id as seller_id,
        cb.name as brand_name,
        cm.name as model_name,
        cm.production_year,
        pc.name as category_name,
        u.first_name as seller_first_name,
        u.last_name as seller_last_name,
        u.username as seller_username,
        u.email as seller_email
      FROM product_listings pl
      LEFT JOIN car_brands cb ON pl.brand_id = cb._id
      LEFT JOIN car_models cm ON pl.model_id = cm._id
      LEFT JOIN categories pc ON pl.category_id = pc._id
      LEFT JOIN users u ON pl.user_id = u._id
      WHERE pl.status = 'AVAILABLE'
      ORDER BY pl.created_date DESC
    `);
    
    // Convert price to number for all rows
    const rowsWithNumericPrice = result.rows.map(row => ({
      ...row,
      price: parseFloat(row.price),
      seller: row.seller_id ? {
        id: row.seller_id,
        firstName: row.seller_first_name,
        lastName: row.seller_last_name,
        username: row.seller_username,
        email: row.seller_email
      } : null
    }));
    
    res.json({
      success: true,
      data: rowsWithNumericPrice
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// Upload image endpoint
app.post('/api/upload-image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided'
      });
    }
    
    const imageUrl = await uploadImage(req.file.buffer, req.file.originalname);
    
    if (imageUrl) {
      res.json({
        success: true,
        imageUrl
      });
    } else {
      res.status(500).json({
        success: false,
        message: 'Failed to upload image'
      });
    }
  } catch (error) {
    console.error('Error in upload endpoint:', error);
    res.status(500).json({
      success: false,
      message: 'Error uploading image',
      error: error.message
    });
  }
});

// Create new listing (simplified for SellPage)
app.post('/api/listings', async (req, res) => {
  try {
    console.log('Received listing request:', req.body);
    const { name, description, price, condition, brand, model, year, category, image } = req.body;
    const db = await import('./config/database.js');
    const { query } = db;
    
    // Get existing brand or use a default
    let brandResult = await query('SELECT _id FROM car_brands WHERE name = $1 LIMIT 1', [brand]);
    let brandId = brandResult.rows.length > 0 ? brandResult.rows[0]._id : null;
    
    // Get existing category or use a default
    let categoryResult = await query('SELECT _id FROM categories WHERE name = $1 LIMIT 1', [category]);
    let categoryId = categoryResult.rows.length > 0 ? categoryResult.rows[0]._id : null;
    
    // Get model if exists
    let modelId = null;
    let productionYear = year ? parseInt(year) : null;
    
    if (brandId && model) {
      let modelResult = await query(
        'SELECT _id FROM car_models WHERE name = $1 LIMIT 1',
        [model]
      );
      modelId = modelResult.rows.length > 0 ? modelResult.rows[0]._id : null;
    }
    
    // Create listing with minimal required fields
    const listingId = `listing_${Date.now()}`;
    console.log('Creating listing with:', {
      listingId,
      name,
      price: parseFloat(price),
      condition,
      brandId,
      categoryId
    });
    
    // Insert with only required fields (including image)
    const insertQuery = `INSERT INTO product_listings 
       (_id, name, description, price, condition, status, brand_id, category_id, model_id, production_year, user_id, image) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`;
    
    // Get or create a valid seller user for listings
    let userResult = await query('SELECT _id FROM users WHERE username = $1 OR email = $2 LIMIT 1', ['seller', 'seller@example.com']);
    let userId;
    if (userResult.rows.length > 0) {
      userId = userResult.rows[0]._id;
    } else {
      // Create default seller user
      userId = 'seller_user_1';
      await query(
        'INSERT INTO users (_id, first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5, $6) ON CONFLICT (_id) DO NOTHING',
        [userId, 'John', 'Seller', 'seller', 'seller@example.com', 'default_password']
      );
    }
    
    const insertParams = [
      listingId,           // _id
      name,                // name
      description || '',   // description
      parseFloat(price),   // price
      condition,           // condition
      'AVAILABLE',         // status
      brandId || null,     // brand_id
      categoryId || null,  // category_id
      modelId || null,     // model_id
      productionYear,      // production_year
      userId,              // user_id
      image || null        // image
    ];
    
    console.log('Executing query:', insertQuery);
    console.log('With params:', insertParams);
    
    await query(insertQuery, insertParams);
    
    console.log('Listing created successfully with ID:', listingId);
    res.json({
      success: true,
      message: 'Listing created successfully',
      id: listingId
    });
  } catch (error) {
    console.error('Error creating listing:', error);
    console.error('Stack:', error.stack);
    res.status(500).json({
      success: false,
      message: 'Error creating listing',
      error: error.message
    });
  }
});

// Get user's listings (for My Listings page)
app.get('/api/my-listings', async (req, res) => {
  try {
    const { query } = await import('./config/database.js');
    
    // Get user from query or use default seller
    const userId = req.query.userId || 'seller_user_1';
    
    const result = await query(
      `SELECT 
        pl._id as id,
        pl.name,
        pl.price,
        pl.condition,
        pl.description,
        pl.image,
        pl.status,
        pl.created_date as createdAt,
        cb.name as brand_name,
        cm.name as model_name,
        cm.production_year,
        pc.name as category_name,
        (SELECT COUNT(*) FROM product_listings WHERE user_id = $1) as totalListings
      FROM product_listings pl
      LEFT JOIN car_brands cb ON pl.brand_id = cb._id
      LEFT JOIN car_models cm ON pl.model_id = cm._id
      LEFT JOIN categories pc ON pl.category_id = pc._id
      WHERE pl.user_id = $1
      ORDER BY pl.created_date DESC`,
      [userId]
    );
    
    // Convert price to number and add mock metrics for now
    const listings = result.rows.map(row => ({
      ...row,
      price: parseFloat(row.price),
      status: row.status === 'AVAILABLE' ? 'active' : row.status?.toLowerCase() || 'active',
      views: Math.floor(Math.random() * 300), // Mock views
      inquiries: Math.floor(Math.random() * 15) // Mock inquiries
    }));
    
    res.json({
      success: true,
      data: listings
    });
  } catch (error) {
    console.error('Error fetching user listings:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching listings',
      error: error.message
    });
  }
});

// Update listing status (for deactivate)
app.patch('/api/my-listings/:id/status', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const { query } = await import('./config/database.js');
    
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }
    
    // Update the listing status
    await query(
      'UPDATE product_listings SET status = $1 WHERE _id = $2',
      [status, id]
    );
    
    res.json({
      success: true,
      message: 'Listing status updated successfully'
    });
  } catch (error) {
    console.error('Error updating listing status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating listing status',
      error: error.message
    });
  }
});

// Update entire listing (for edit)
app.patch('/api/my-listings/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, condition, brand, category, model, year } = req.body;
    const { query } = await import('./config/database.js');
    
    // Get brand ID
    let brandId = null;
    if (brand) {
      const brandResult = await query('SELECT _id FROM car_brands WHERE name = $1 LIMIT 1', [brand]);
      brandId = brandResult.rows.length > 0 ? brandResult.rows[0]._id : null;
    }
    
    // Get category ID
    let categoryId = null;
    if (category) {
      const categoryResult = await query('SELECT _id FROM categories WHERE name = $1 LIMIT 1', [category]);
      categoryId = categoryResult.rows.length > 0 ? categoryResult.rows[0]._id : null;
    }
    
    // Get model ID
    let modelId = null;
    if (model && brandId) {
      const modelResult = await query('SELECT _id FROM car_models WHERE name = $1 AND car_brand_id = $2 LIMIT 1', [model, brandId]);
      modelId = modelResult.rows.length > 0 ? modelResult.rows[0]._id : null;
    }
    
    // Build update query
    const updateQuery = `
      UPDATE product_listings 
      SET 
        name = $1,
        description = $2,
        price = $3,
        condition = $4,
        brand_id = $5,
        category_id = $6,
        model_id = $7,
        production_year = $8
      WHERE _id = $9
      RETURNING *
    `;
    
    const result = await query(updateQuery, [
      name,
      description || '',
      parseFloat(price),
      condition,
      brandId,
      categoryId,
      modelId,
      year ? parseInt(year) : null,
      id
    ]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Listing not found'
      });
    }
    
    res.json({
      success: true,
      message: 'Listing updated successfully',
      data: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating listing',
      error: error.message
    });
  }
});

// Checkout endpoint
app.post('/api/checkout', async (req, res) => {
  try {
    const { userId, items, total, shipping, payment } = req.body;
    const { query } = await import('./config/database.js');
    
    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No items in cart'
      });
    }
    
    // Mark all items as SOLD
    const itemIds = items.map(item => item.id);
    
    for (const itemId of itemIds) {
      await query(
        'UPDATE product_listings SET status = $1 WHERE _id = $2',
        ['SOLD', itemId]
      );
    }
    
    // In a real app, you would:
    // 1. Create an order record
    // 2. Process payment
    // 3. Send confirmation emails
    // For now, we just mark items as sold
    
    res.json({
      success: true,
      message: 'Order placed successfully',
      orderId: `order_${Date.now()}`,
      items: itemIds
    });
  } catch (error) {
    console.error('Error processing checkout:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing checkout',
      error: error.message
    });
  }
});

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/car-brands', carBrandRoutes);
app.use('/api/car-models', carModelRoutes);
app.use('/api/part-categories', partCategoryRoutes);
app.use('/api/car-parts', carPartRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/admin', adminRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Car Parts Finder API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      users: '/api/users',
      carBrands: '/api/car-brands',
      carModels: '/api/car-models',
      partCategories: '/api/part-categories',
      carParts: '/api/car-parts',
      listings: '/api/listings',
      search: '/api/search'
    }
  });
});

// Error handling middleware
app.use(notFound);
app.use(errorHandler);

// Initialize database and start server
const startServer = async () => {
  try {
    // Initialize database
    await initDatabase();
    await testConnection();
    
    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🌐 Health check: http://localhost:${PORT}/health`);
      console.log(`🔧 Products API: http://localhost:${PORT}/api/products`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();

export default app;
