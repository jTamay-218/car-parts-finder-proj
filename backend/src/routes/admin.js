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

export default router;

