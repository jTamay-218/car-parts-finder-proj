# Car Parts Finder Backend API

A comprehensive backend API for the Car Parts Finder & Exchange platform, built with Node.js, Express, and PostgreSQL.

## Features

- **User Management**: Registration, authentication, profile management
- **Car Data Management**: Brands, models, parts, and categories
- **Listings System**: Create, update, delete, and search product listings
- **Advanced Search**: Full-text search with filters and suggestions
- **File Upload**: Image upload for parts and listings
- **Security**: JWT authentication, input validation, rate limiting
- **Database**: PostgreSQL with optimized queries and relationships

## Tech Stack

- **Runtime**: Node.js (ES Modules)
- **Framework**: Express.js
- **Database**: PostgreSQL
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **File Upload**: Multer
- **Logging**: Custom logger with file output

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── middleware/
│   │   ├── auth.js             # Authentication middleware
│   │   ├── validation.js       # Input validation
│   │   ├── errorHandler.js     # Error handling
│   │   └── notFound.js         # 404 handler
│   ├── models/
│   │   ├── User.js             # User model
│   │   ├── CarBrand.js         # Car brand model
│   │   ├── CarModel.js         # Car model model
│   │   ├── PartCategory.js     # Part category model
│   │   ├── CarPart.js          # Car part model
│   │   └── ProductListing.js   # Product listing model
│   ├── routes/
│   │   ├── auth.js             # Authentication routes
│   │   ├── users.js            # User management routes
│   │   ├── carBrands.js        # Car brand routes
│   │   ├── carModels.js        # Car model routes
│   │   ├── partCategories.js   # Part category routes
│   │   ├── carParts.js         # Car part routes
│   │   ├── listings.js         # Product listing routes
│   │   └── search.js           # Search routes
│   ├── services/
│   │   ├── searchService.js    # Search business logic
│   │   └── listingService.js   # Listing business logic
│   ├── utils/
│   │   ├── fileUpload.js       # File upload utilities
│   │   └── logger.js           # Logging utilities
│   └── server.js               # Main server file
├── uploads/                    # File upload directory
├── logs/                       # Log files directory
├── package.json
├── env.example                 # Environment variables example
└── README.md
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `POST /api/auth/refresh` - Refresh JWT token
- `POST /api/auth/logout` - Logout user

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `PUT /api/users/:id/password` - Update user password
- `GET /api/users/:id/listings` - Get user's listings
- `DELETE /api/users/:id` - Delete user (admin only)

### Car Brands
- `GET /api/car-brands` - Get all car brands
- `GET /api/car-brands/:id` - Get brand by ID
- `GET /api/car-brands/:id/models` - Get models for brand
- `GET /api/car-brands/:id/parts` - Get parts for brand
- `POST /api/car-brands` - Create brand (admin only)
- `PUT /api/car-brands/:id` - Update brand (admin only)
- `DELETE /api/car-brands/:id` - Delete brand (admin only)

### Car Models
- `GET /api/car-models` - Get all car models
- `GET /api/car-models/:id` - Get model by ID
- `GET /api/car-models/:id/parts` - Get compatible parts for model
- `POST /api/car-models` - Create model (admin only)
- `PUT /api/car-models/:id` - Update model (admin only)
- `DELETE /api/car-models/:id` - Delete model (admin only)

### Part Categories
- `GET /api/part-categories` - Get all categories
- `GET /api/part-categories/:id` - Get category by ID
- `GET /api/part-categories/:id/parts` - Get parts in category
- `POST /api/part-categories` - Create category (admin only)
- `PUT /api/part-categories/:id` - Update category (admin only)
- `DELETE /api/part-categories/:id` - Delete category (admin only)

### Car Parts
- `GET /api/car-parts` - Get all parts with filters
- `GET /api/car-parts/:id` - Get part by ID
- `GET /api/car-parts/:id/models` - Get compatible models for part
- `POST /api/car-parts` - Create part (admin only)
- `PUT /api/car-parts/:id` - Update part (admin only)
- `POST /api/car-parts/:id/compatibility` - Add part compatibility (admin only)
- `DELETE /api/car-parts/:id/compatibility/:modelId` - Remove compatibility (admin only)
- `DELETE /api/car-parts/:id` - Delete part (admin only)

### Product Listings
- `GET /api/listings` - Get all listings with filters
- `GET /api/listings/:id` - Get listing by ID
- `POST /api/listings` - Create listing
- `PUT /api/listings/:id` - Update listing
- `DELETE /api/listings/:id` - Delete listing
- `GET /api/listings/user/:userId` - Get user's listings
- `PATCH /api/listings/:id/status` - Update listing status

### Search
- `GET /api/search` - Global search
- `GET /api/search/suggestions` - Get search suggestions
- `POST /api/search/advanced` - Advanced search with filters

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd car-parts-finder-proj/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env
   ```
   Edit `.env` with your configuration:
   ```env
   PORT=3001
   NODE_ENV=development
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=car_parts_finder
   DB_USER=your_username
   DB_PASSWORD=your_password
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRES_IN=7d
   FRONTEND_URL=http://localhost:5173
   ```

4. **Set up the database**
   - Create a PostgreSQL database
   - Run the provided SQL schema to create tables
   - Update database credentials in `.env`

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 3001 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | car_parts_finder |
| `DB_USER` | Database username | - |
| `DB_PASSWORD` | Database password | - |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration | 7d |
| `FRONTEND_URL` | Frontend URL for CORS | http://localhost:5173 |
| `MAX_FILE_SIZE` | Max file upload size | 5242880 (5MB) |
| `UPLOAD_PATH` | File upload directory | ./uploads |
| `RATE_LIMIT_WINDOW_MS` | Rate limit window | 900000 (15 min) |
| `RATE_LIMIT_MAX_REQUESTS` | Max requests per window | 100 |

## Database Schema

The API uses the following main entities:
- **Users**: User accounts and authentication
- **Car Brands**: Car manufacturers (Toyota, Honda, etc.)
- **Car Models**: Specific car models with year ranges
- **Part Categories**: Types of car parts (Brakes, Engine, etc.)
- **Car Parts**: Individual parts with compatibility
- **Product Listings**: User listings for parts
- **Parts Compatibility**: Many-to-many relationship between parts and models

## Security Features

- **JWT Authentication**: Secure token-based authentication
- **Input Validation**: Comprehensive validation using Joi
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS Protection**: Configurable cross-origin resource sharing
- **Helmet Security**: Security headers and protection
- **Password Hashing**: bcrypt for secure password storage
- **SQL Injection Protection**: Parameterized queries

## Error Handling

The API provides consistent error responses:
```json
{
  "error": "Error type",
  "message": "Human-readable error message",
  "details": "Additional error details",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "path": "/api/endpoint",
  "method": "GET"
}
```

## Logging

The API includes comprehensive logging:
- **Request Logging**: All HTTP requests and responses
- **Error Logging**: Detailed error information with stack traces
- **Database Logging**: Query execution and performance
- **Authentication Logging**: Login attempts and security events
- **File Logging**: Daily log files in the `logs/` directory

## File Upload

The API supports image uploads for parts and listings:
- **Supported Formats**: JPEG, PNG, GIF, WebP
- **File Size Limit**: 5MB per file
- **Multiple Files**: Up to 5 files per request
- **Storage**: Local file system (configurable for cloud storage)

## API Documentation

### Authentication
All protected routes require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Pagination
Most list endpoints support pagination:
```
GET /api/endpoint?page=1&limit=20
```

### Filtering
Search and list endpoints support various filters:
```
GET /api/listings?condition=new&minPrice=50&maxPrice=200&location=New York
```

### Search
The API provides multiple search capabilities:
- **Global Search**: Search across all entities
- **Full-text Search**: PostgreSQL full-text search
- **Suggestions**: Auto-complete functionality
- **Advanced Search**: Complex filtering and sorting

## Development

### Running Tests
```bash
npm test
```

### Linting
```bash
npm run lint
```

### Database Migrations
Database schema changes should be managed through SQL migration files.

## Deployment

### Production Considerations
1. Set `NODE_ENV=production`
2. Use a production database
3. Configure proper CORS settings
4. Set up SSL/TLS certificates
5. Configure reverse proxy (nginx)
6. Set up monitoring and logging
7. Configure file storage (AWS S3, etc.)

### Docker Support
The API can be containerized using Docker:
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3001
CMD ["npm", "start"]
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.
