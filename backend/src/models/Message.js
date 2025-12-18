import { query } from '../config/database.js';
import { v4 as uuidv4 } from 'uuid';

export class Message {
  constructor(data) {
    this.id = data.id;
    this.conversationId = data.conversation_id;
    this.senderId = data.sender_id;
    this.content = data.content;
    this.readAt = data.read_at;
    this.createdAt = data.created_at;
  }

  // Create a new message
  static async create(messageData) {
    const { conversationId, senderId, content } = messageData;
    const messageId = uuidv4();
    
    const result = await query(
      `INSERT INTO messages (id, conversation_id, sender_id, content, created_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)
       RETURNING *`,
      [messageId, conversationId, senderId, content]
    );

    // Update conversation's last_message_at
    await query(
      `UPDATE conversations 
       SET last_message_at = CURRENT_TIMESTAMP 
       WHERE id = $1`,
      [conversationId]
    );

    return new Message(result.rows[0]);
  }

  // Find message by ID
  static async findById(id) {
    const result = await query('SELECT * FROM messages WHERE id = $1', [id]);
    return result.rows.length > 0 ? new Message(result.rows[0]) : null;
  }

  // Get all messages for a conversation
  static async findByConversationId(conversationId) {
    const result = await query(
      `SELECT m.*, u.first_name, u.last_name, u.username
       FROM messages m
       JOIN users u ON m.sender_id = u._id
       WHERE m.conversation_id = $1
       ORDER BY m.created_at ASC`,
      [conversationId]
    );
    return result.rows.map(row => ({
      ...new Message(row).toJSON(),
      senderName: `${row.first_name} ${row.last_name}`,
      senderUsername: row.username
    }));
  }

  // Mark message as read
  async markAsRead() {
    const result = await query(
      `UPDATE messages 
       SET read_at = CURRENT_TIMESTAMP 
       WHERE id = $1 AND read_at IS NULL
       RETURNING *`,
      [this.id]
    );
    return result.rows.length > 0 ? new Message(result.rows[0]) : null;
  }

  // Mark all messages in conversation as read for a user
  static async markConversationAsRead(conversationId, userId) {
    await query(
      `UPDATE messages 
       SET read_at = CURRENT_TIMESTAMP 
       WHERE conversation_id = $1 
       AND sender_id != $2 
       AND read_at IS NULL`,
      [conversationId, userId]
    );
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      conversationId: this.conversationId,
      senderId: this.senderId,
      content: this.content,
      readAt: this.readAt,
      createdAt: this.createdAt
    };
  }
}

export class Conversation {
  constructor(data) {
    this.id = data.id;
    this.buyerId = data.buyer_id;
    this.sellerId = data.seller_id;
    this.listingId = data.listing_id;
    this.lastMessageAt = data.last_message_at;
    this.createdAt = data.created_at;
  }

  // Create or get existing conversation
  static async findOrCreate(conversationData) {
    const { buyerId, sellerId, listingId } = conversationData;

    // Try to find existing conversation
    let result = await query(
      `SELECT * FROM conversations 
       WHERE buyer_id = $1 AND seller_id = $2 
       AND (listing_id = $3 OR (listing_id IS NULL AND $3 IS NULL))
       LIMIT 1`,
      [buyerId, sellerId, listingId]
    );

    if (result.rows.length > 0) {
      return new Conversation(result.rows[0]);
    }

    // Create new conversation
    const conversationId = uuidv4();
    result = await query(
      `INSERT INTO conversations (id, buyer_id, seller_id, listing_id, created_at, last_message_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)
       RETURNING *`,
      [conversationId, buyerId, sellerId, listingId]
    );

    return new Conversation(result.rows[0]);
  }

  // Find conversation by ID
  static async findById(id) {
    const result = await query('SELECT * FROM conversations WHERE id = $1', [id]);
    return result.rows.length > 0 ? new Conversation(result.rows[0]) : null;
  }

  // Get all conversations for a user
  static async findByUserId(userId) {
    const result = await query(
      `SELECT 
        c.*,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name,
        buyer.username as buyer_username,
        seller.first_name as seller_first_name,
        seller.last_name as seller_last_name,
        seller.username as seller_username,
        pl.name as listing_name,
        pl.image as listing_image,
        pl.price as listing_price,
        (SELECT COUNT(*) FROM messages m 
         WHERE m.conversation_id = c.id 
         AND m.sender_id != $1 
         AND m.read_at IS NULL) as unread_count,
        (SELECT content FROM messages m 
         WHERE m.conversation_id = c.id 
         ORDER BY m.created_at DESC LIMIT 1) as last_message_content
       FROM conversations c
       LEFT JOIN users buyer ON c.buyer_id = buyer._id
       LEFT JOIN users seller ON c.seller_id = seller._id
       LEFT JOIN product_listings pl ON c.listing_id = pl._id
       WHERE c.buyer_id = $1 OR c.seller_id = $1
       ORDER BY c.last_message_at DESC`,
      [userId]
    );

    return result.rows.map(row => {
      const conversation = new Conversation(row);
      const isBuyer = row.buyer_id === userId;
      return {
        ...conversation.toJSON(),
        otherUser: {
          id: isBuyer ? row.seller_id : row.buyer_id,
          firstName: isBuyer ? row.seller_first_name : row.buyer_first_name,
          lastName: isBuyer ? row.seller_last_name : row.buyer_last_name,
          username: isBuyer ? row.seller_username : row.buyer_username
        },
        listing: row.listing_id ? {
          id: row.listing_id,
          name: row.listing_name,
          image: row.listing_image,
          price: row.listing_price
        } : null,
        unreadCount: parseInt(row.unread_count) || 0,
        lastMessageContent: row.last_message_content
      };
    });
  }

  // Convert to JSON
  toJSON() {
    return {
      id: this.id,
      buyerId: this.buyerId,
      sellerId: this.sellerId,
      listingId: this.listingId,
      lastMessageAt: this.lastMessageAt,
      createdAt: this.createdAt
    };
  }
}

