import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { query } from './src/config/database.js';

dotenv.config();

const SALT_ROUNDS = 12;

// Generate UUID v4
const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Create user in database
const createUser = async (userData) => {
  const { firstName, lastName, username, email, password, role, admin } = userData;
  
  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
  
  // Generate UUID for the user
  const userId = generateUUID();
  
  // Insert into database
  const result = await query(
    `INSERT INTO users (id, first_name, last_name, username, email, password, role, admin, created_date)
     VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())
     RETURNING id, first_name, last_name, username, email, role, admin, created_date`,
    [userId, firstName, lastName, username, email, hashedPassword, role, admin]
  );
  
  return result.rows[0];
};

// Check if user already exists
const userExists = async (email, username) => {
  const emailCheck = await query('SELECT id FROM users WHERE email = $1', [email]);
  const usernameCheck = await query('SELECT id FROM users WHERE username = $1', [username]);
  
  return {
    emailExists: emailCheck.rows.length > 0,
    usernameExists: usernameCheck.rows.length > 0
  };
};

// Main seed function
const seedUsers = async () => {
  try {
    console.log('🌱 Starting user seed...\n');

    // Create Admin User
    console.log('Creating admin user...');
    const adminData = {
      firstName: 'Admin',
      lastName: 'User',
      username: 'admin',
      email: 'admin@carparts.com',
      password: 'Admin123!@#',
      role: 'admin',
      admin: true
    };

    const adminExists = await userExists(adminData.email, adminData.username);
    
    if (adminExists.emailExists || adminExists.usernameExists) {
      console.log('⚠️  Admin user already exists. Skipping...');
    } else {
      const admin = await createUser(adminData);
      console.log('✅ Admin user created successfully!');
      console.log(`   ID: ${admin.id}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Username: ${admin.username}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Admin: ${admin.admin}\n`);
    }

    // Create Buyer User
    console.log('Creating buyer user...');
    const buyerData = {
      firstName: 'John',
      lastName: 'Doe',
      username: 'buyer',
      email: 'buyer@carparts.com',
      password: 'Buyer123!@#',
      role: 'buyer',
      admin: false
    };

    const buyerExists = await userExists(buyerData.email, buyerData.username);
    
    if (buyerExists.emailExists || buyerExists.usernameExists) {
      console.log('⚠️  Buyer user already exists. Skipping...');
    } else {
      const buyer = await createUser(buyerData);
      console.log('✅ Buyer user created successfully!');
      console.log(`   ID: ${buyer.id}`);
      console.log(`   Email: ${buyer.email}`);
      console.log(`   Username: ${buyer.username}`);
      console.log(`   Role: ${buyer.role}`);
      console.log(`   Admin: ${buyer.admin}\n`);
    }

    // Create Seller User (bonus)
    console.log('Creating seller user...');
    const sellerData = {
      firstName: 'Jane',
      lastName: 'Smith',
      username: 'seller',
      email: 'seller@carparts.com',
      password: 'Seller123!@#',
      role: 'seller',
      admin: false
    };

    const sellerExists = await userExists(sellerData.email, sellerData.username);
    
    if (sellerExists.emailExists || sellerExists.usernameExists) {
      console.log('⚠️  Seller user already exists. Skipping...');
    } else {
      const seller = await createUser(sellerData);
      console.log('✅ Seller user created successfully!');
      console.log(`   ID: ${seller.id}`);
      console.log(`   Email: ${seller.email}`);
      console.log(`   Username: ${seller.username}`);
      console.log(`   Role: ${seller.role}`);
      console.log(`   Admin: ${seller.admin}\n`);
    }

    console.log('✅ User seeding completed!\n');
    console.log('📝 Login Credentials:');
    console.log('\n   Admin User:');
    console.log('   Email: admin@carparts.com');
    console.log('   Password: Admin123!@#');
    console.log('\n   Buyer User:');
    console.log('   Email: buyer@carparts.com');
    console.log('   Password: Buyer123!@#');
    console.log('\n   Seller User:');
    console.log('   Email: seller@carparts.com');
    console.log('   Password: Seller123!@#');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
    process.exit(1);
  }
};

// Run the seed
seedUsers()
  .then(() => {
    console.log('Seeding complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exit(1);
  });




