import dotenv from 'dotenv';
import { query } from './src/config/database.js';

dotenv.config();

const initMessagesSchema = async () => {
  try {
    console.log('🌱 Initializing messages schema...\n');

    // Create conversations table
    // Note: product_listings and users use _id, so we don't enforce FK constraint
    await query(`
      CREATE TABLE IF NOT EXISTS conversations (
        id TEXT PRIMARY KEY,
        buyer_id TEXT NOT NULL,
        seller_id TEXT NOT NULL,
        listing_id TEXT,
        last_message_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        UNIQUE(buyer_id, seller_id, listing_id)
      )
    `);
    console.log('✅ Conversations table created');

    // Create messages table
    await query(`
      CREATE TABLE IF NOT EXISTS messages (
        id TEXT PRIMARY KEY,
        conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
        sender_id TEXT NOT NULL,
        content TEXT NOT NULL,
        read_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('✅ Messages table created');

    // Create indexes
    await query('CREATE INDEX IF NOT EXISTS idx_conversations_buyer_id ON conversations(buyer_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_conversations_seller_id ON conversations(seller_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_conversations_listing_id ON conversations(listing_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON messages(sender_id)');
    await query('CREATE INDEX IF NOT EXISTS idx_conversations_last_message_at ON conversations(last_message_at DESC)');
    console.log('✅ Indexes created');

    console.log('\n✅ Messages schema initialized successfully!\n');
  } catch (error) {
    console.error('❌ Error initializing messages schema:', error);
    process.exit(1);
  }
};

initMessagesSchema()
  .then(() => {
    console.log('Schema initialization complete!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Schema initialization failed:', error);
    process.exit(1);
  });

