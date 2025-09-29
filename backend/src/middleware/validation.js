import Joi from 'joi';

// Validation middleware factory
export const validate = (schema, property = 'body') => {
  return (req, res, next) => {
    const { error, value } = schema.validate(req[property], { 
      abortEarly: false,
      stripUnknown: true 
    });

    if (error) {
      const errorDetails = error.details.map(detail => ({
        field: detail.path.join('.'),
        message: detail.message,
        value: detail.context?.value
      }));

      return res.status(400).json({
        error: 'Validation failed',
        message: 'Please check your input data',
        details: errorDetails
      });
    }

    // Replace the original data with validated and sanitized data
    req[property] = value;
    next();
  };
};

// Common validation schemas
export const schemas = {
  // User schemas
  userRegistration: Joi.object({
    firstName: Joi.string().min(2).max(50).required(),
    lastName: Joi.string().min(2).max(50).required(),
    username: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required()
  }),

  userLogin: Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required()
  }),

  userUpdate: Joi.object({
    firstName: Joi.string().min(2).max(50),
    lastName: Joi.string().min(2).max(50),
    username: Joi.string().alphanum().min(3).max(30),
    email: Joi.string().email()
  }),

  passwordUpdate: Joi.object({
    currentPassword: Joi.string().required(),
    newPassword: Joi.string().min(8).max(128).required()
  }),

  // Car brand schemas
  carBrand: Joi.object({
    name: Joi.string().min(1).max(100).required()
  }),

  // Car model schemas
  carModel: Joi.object({
    name: Joi.string().min(1).max(100).required(),
    carBrandId: Joi.string().uuid().required(),
    yearsStart: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1),
    yearsEnd: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1)
  }).custom((value, helpers) => {
    if (value.yearsStart && value.yearsEnd && value.yearsStart > value.yearsEnd) {
      return helpers.error('custom.yearsOrder');
    }
    return value;
  }).messages({
    'custom.yearsOrder': 'Start year must be less than or equal to end year'
  }),

  // Part category schemas
  partCategory: Joi.object({
    name: Joi.string().min(1).max(100).required()
  }),

  // Car part schemas
  carPart: Joi.object({
    name: Joi.string().min(1).max(200).required(),
    carPartCategoryId: Joi.string().uuid().required(),
    serialNumber: Joi.string().max(100),
    description: Joi.string().max(1000),
    price: Joi.number().precision(2).min(0).max(999999.99),
    image: Joi.string().uri().max(500),
    condition: Joi.string().valid('new', 'like_new', 'good', 'fair', 'poor'),
    carModelId: Joi.string().uuid(),
    carBrandId: Joi.string().uuid()
  }),

  // Product listing schemas
  productListing: Joi.object({
    carPartId: Joi.string().uuid(),
    name: Joi.string().min(1).max(200).required(),
    description: Joi.string().max(1000),
    priceUsd: Joi.number().precision(2).min(0).max(999999.99),
    condition: Joi.string().valid('new', 'like_new', 'good', 'fair', 'poor').required(),
    location: Joi.string().max(200),
    status: Joi.string().valid('active', 'pending', 'sold', 'hidden').default('active'),
    phoneNumber: Joi.string().pattern(/^[\+]?[1-9][\d]{0,15}$/).max(20),
    email: Joi.string().email().max(100),
    model: Joi.string().max(100),
    year: Joi.number().integer().min(1900).max(new Date().getFullYear() + 1)
  }),

  // Search schemas
  search: Joi.object({
    q: Joi.string().min(1).max(200),
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20),
    categoryId: Joi.string().uuid(),
    brandId: Joi.string().uuid(),
    modelId: Joi.string().uuid(),
    condition: Joi.string().valid('new', 'like_new', 'good', 'fair', 'poor'),
    minPrice: Joi.number().precision(2).min(0),
    maxPrice: Joi.number().precision(2).min(0),
    location: Joi.string().max(200),
    status: Joi.string().valid('active', 'pending', 'sold', 'hidden').default('active')
  }),

  // Pagination schemas
  pagination: Joi.object({
    page: Joi.number().integer().min(1).default(1),
    limit: Joi.number().integer().min(1).max(100).default(20)
  }),

  // UUID parameter validation
  uuidParam: Joi.object({
    id: Joi.string().uuid().required()
  }),

  // Compatibility schemas
  compatibility: Joi.object({
    carPartId: Joi.string().uuid().required(),
    carModelId: Joi.string().uuid().required()
  })
};

// Custom validation functions
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

export const validatePhoneNumber = (phone) => {
  // International phone number format
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
  return phoneRegex.test(phone);
};

// Sanitize input
export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '');
  }
  return input;
};

// Validate file upload
export const validateFileUpload = (allowedTypes = ['image/jpeg', 'image/png', 'image/gif']) => {
  return (req, res, next) => {
    if (!req.file) {
      return next();
    }

    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: 'Invalid file type',
        message: `Only ${allowedTypes.join(', ')} files are allowed`
      });
    }

    const maxSize = parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024; // 5MB default
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: 'File too large',
        message: `File size must be less than ${maxSize / (1024 * 1024)}MB`
      });
    }

    next();
  };
};
