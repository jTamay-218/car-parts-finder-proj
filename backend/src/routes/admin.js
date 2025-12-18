import express from 'express';
import { authenticateToken, requireAdmin } from '../middleware/auth.js';
import { query } from '../config/database.js';
import { Conversation, Message } from '../models/Message.js';

const router = express.Router();

// All admin routes require authentication and admin role
router.use(authenticateToken);
router.use(requireAdmin);

// Get all conversations across the platform
router.get('/conversations', async (req, res, next) => {
  try {
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
        (SELECT COUNT(*) FROM messages m 
         WHERE m.conversation_id = c.id 
         AND m.read_at IS NULL) as unread_count,
        (SELECT content FROM messages m 
         WHERE m.conversation_id = c.id 
         ORDER BY m.created_at DESC LIMIT 1) as last_message_content
       FROM conversations c
       LEFT JOIN users buyer ON c.buyer_id = buyer._id
       LEFT JOIN users seller ON c.seller_id = seller._id
       LEFT JOIN product_listings pl ON c.listing_id = pl._id
       ORDER BY c.last_message_at DESC`
    );

    const conversations = result.rows.map(row => ({
      id: row.id,
      buyerId: row.buyer_id,
      sellerId: row.seller_id,
      listingId: row.listing_id,
      buyerName: `${row.buyer_first_name} ${row.buyer_last_name}`,
      sellerName: `${row.seller_first_name} ${row.seller_last_name}`,
      listingName: row.listing_name,
      unreadCount: parseInt(row.unread_count) || 0,
      lastMessageContent: row.last_message_content,
      lastMessageAt: row.last_message_at,
      createdAt: row.created_at
    }));

    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
});

// Get all listings
router.get('/listings', async (req, res, next) => {
  try {
    const result = await query(
      `SELECT 
        pl._id as id,
        pl.name,
        pl.price,
        pl.condition,
        pl.description,
        pl.image,
        pl.status,
        pl.user_id as seller_id,
        pl.created_date,
        cb.name as brand_name,
        cm.name as model_name,
        u.username as seller_username,
        u.email as seller_email
      FROM product_listings pl
      LEFT JOIN car_brands cb ON pl.brand_id = cb._id
      LEFT JOIN car_models cm ON pl.model_id = cm._id
      LEFT JOIN users u ON pl.user_id = u._id
      ORDER BY pl.created_date DESC`
    );

    const listings = result.rows.map(row => ({
      ...row,
      price: parseFloat(row.price),
      seller: row.seller_id ? {
        id: row.seller_id,
        username: row.seller_username,
        email: row.seller_email
      } : null
    }));

    res.json({
      success: true,
      data: listings
    });
  } catch (error) {
    next(error);
  }
});

// Update listing status
router.patch('/listings/:id/status', async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    await query(
      'UPDATE product_listings SET status = $1 WHERE _id = $2',
      [status, id]
    );

    res.json({
      success: true,
      message: 'Listing status updated successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete listing
router.delete('/listings/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM product_listings WHERE _id = $1', [id]);

    res.json({
      success: true,
      message: 'Listing deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Get conversation with all messages (admin view)
router.get('/conversations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Get conversation details
    const convResult = await query(
      `SELECT 
        c.*,
        buyer.first_name as buyer_first_name,
        buyer.last_name as buyer_last_name,
        buyer.username as buyer_username,
        buyer.email as buyer_email,
        seller.first_name as seller_first_name,
        seller.last_name as seller_last_name,
        seller.username as seller_username,
        seller.email as seller_email,
        pl.name as listing_name,
        pl._id as listing_id
      FROM conversations c
      LEFT JOIN users buyer ON c.buyer_id = buyer._id
      LEFT JOIN users seller ON c.seller_id = seller._id
      LEFT JOIN product_listings pl ON c.listing_id = pl._id
      WHERE c.id = $1`,
      [id]
    );

    if (convResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Get all messages
    const messagesResult = await query(
      `SELECT 
        m.*,
        u.first_name as sender_first_name,
        u.last_name as sender_last_name,
        u.username as sender_username
      FROM messages m
      LEFT JOIN users u ON m.sender_id = u._id
      WHERE m.conversation_id = $1
      ORDER BY m.created_at ASC`,
      [id]
    );

    const conversation = convResult.rows[0];
    const messages = messagesResult.rows.map(row => ({
      id: row.id,
      conversationId: row.conversation_id,
      senderId: row.sender_id,
      content: row.content,
      readAt: row.read_at,
      createdAt: row.created_at,
      senderName: `${row.sender_first_name} ${row.sender_last_name}`,
      senderUsername: row.sender_username
    }));

    res.json({
      success: true,
      data: {
        id: conversation.id,
        buyerId: conversation.buyer_id,
        sellerId: conversation.seller_id,
        listingId: conversation.listing_id,
        buyerName: `${conversation.buyer_first_name} ${conversation.buyer_last_name}`,
        buyerEmail: conversation.buyer_email,
        buyerUsername: conversation.buyer_username,
        sellerName: `${conversation.seller_first_name} ${conversation.seller_last_name}`,
        sellerEmail: conversation.seller_email,
        sellerUsername: conversation.seller_username,
        listingName: conversation.listing_name,
        lastMessageAt: conversation.last_message_at,
        createdAt: conversation.created_at,
        messages
      }
    });
  } catch (error) {
    next(error);
  }
});

// Delete a conversation (admin only)
router.delete('/conversations/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    // Delete conversation (messages will be cascade deleted)
    await query('DELETE FROM conversations WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Conversation deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// Delete a message (admin only)
router.delete('/messages/:id', async (req, res, next) => {
  try {
    const { id } = req.params;

    await query('DELETE FROM messages WHERE id = $1', [id]);

    res.json({
      success: true,
      message: 'Message deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

export default router;

