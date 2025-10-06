import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';

// Import routes
import authRoutes from './routes/auth.js';
import userRoutes from './routes/users.js';
import carBrandRoutes from './routes/carBrands.js';
import carModelRoutes from './routes/carModels.js';
import partCategoryRoutes from './routes/partCategories.js';
import carPartRoutes from './routes/carParts.js';
import listingRoutes from './routes/listings.js';
import searchRoutes from './routes/search.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';
import { notFound } from './middleware/notFound.js';

// Import database
import { initDatabase, testConnection } from './config/database.js';

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
        cb.name as brand_name,
        cm.name as model_name,
        cm.production_year,
        pc.name as category_name
      FROM product_listings pl
      LEFT JOIN car_brands cb ON pl.brand_id = cb._id
      LEFT JOIN car_models cm ON pl.model_id = cm._id
      LEFT JOIN categories pc ON pl.category_id = pc._id
      WHERE pl.status = 'AVAILABLE'
      ORDER BY pl.created_date DESC
    `);
    
    res.json({
      success: true,
      data: result.rows
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

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/car-brands', carBrandRoutes);
app.use('/api/car-models', carModelRoutes);
app.use('/api/part-categories', partCategoryRoutes);
app.use('/api/car-parts', carPartRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/search', searchRoutes);

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
