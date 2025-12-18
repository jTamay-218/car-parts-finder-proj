import express from 'express';
import { Conversation, Message } from '../models/Message.js';
import { authenticateToken } from '../middleware/auth.js';
import { query } from '../config/database.js';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// Get all conversations for the current user
router.get('/conversations', async (req, res, next) => {
  try {
    const conversations = await Conversation.findByUserId(req.user.id);
    res.json({
      success: true,
      data: conversations
    });
  } catch (error) {
    next(error);
  }
});

// Get a specific conversation by ID
router.get('/conversations/:conversationId', async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    // Check if user is part of this conversation
    if (conversation.buyerId !== req.user.id && conversation.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Get messages for this conversation
    const messages = await Message.findByConversationId(conversationId);

    // Mark messages as read
    await Message.markConversationAsRead(conversationId, req.user.id);

    // Get other user info
    const isBuyer = conversation.buyerId === req.user.id;
    const otherUserId = isBuyer ? conversation.sellerId : conversation.buyerId;
    
    const userResult = await query(
      'SELECT _id as id, first_name, last_name, username, email FROM users WHERE _id = $1',
      [otherUserId]
    );

    // Get listing info if exists
    let listing = null;
    if (conversation.listingId) {
      const listingResult = await query(
        `SELECT _id as id, name, image, price, condition, description 
         FROM product_listings WHERE _id = $1`,
        [conversation.listingId]
      );
      if (listingResult.rows.length > 0) {
        listing = listingResult.rows[0];
      }
    }

    res.json({
      success: true,
      data: {
        ...conversation.toJSON(),
        otherUser: userResult.rows[0] ? {
          id: userResult.rows[0].id,
          firstName: userResult.rows[0].first_name,
          lastName: userResult.rows[0].last_name,
          username: userResult.rows[0].username
        } : null,
        listing,
        messages
      }
    });
  } catch (error) {
    next(error);
  }
});

// Create a new conversation or get existing one
router.post('/conversations', async (req, res, next) => {
  try {
    const { sellerId, listingId } = req.body;
    const buyerId = req.user.id;

    if (!sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Seller ID is required'
      });
    }

    // Don't allow users to message themselves
    if (buyerId === sellerId) {
      return res.status(400).json({
        success: false,
        message: 'Cannot create conversation with yourself'
      });
    }

    // Verify seller exists
    const sellerResult = await query('SELECT _id FROM users WHERE _id = $1', [sellerId]);
    if (sellerResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Seller not found'
      });
    }

    // Verify listing exists if provided
    if (listingId) {
      const listingResult = await query('SELECT _id FROM product_listings WHERE _id = $1', [listingId]);
      if (listingResult.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Listing not found'
        });
      }
    }

    // Find or create conversation
    const conversation = await Conversation.findOrCreate({
      buyerId,
      sellerId,
      listingId: listingId || null
    });

    res.status(201).json({
      success: true,
      data: conversation.toJSON()
    });
  } catch (error) {
    next(error);
  }
});

// Send a message in a conversation
router.post('/conversations/:conversationId/messages', async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { content } = req.body;

    if (!content || content.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    // Verify conversation exists and user is part of it
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.buyerId !== req.user.id && conversation.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Create message
    const message = await Message.create({
      conversationId,
      senderId: req.user.id,
      content: content.trim()
    });

    // Get sender info
    const senderResult = await query(
      'SELECT first_name, last_name, username FROM users WHERE _id = $1',
      [req.user.id]
    );

    res.status(201).json({
      success: true,
      data: {
        ...message.toJSON(),
        senderName: senderResult.rows[0] 
          ? `${senderResult.rows[0].first_name} ${senderResult.rows[0].last_name}`
          : 'Unknown',
        senderUsername: senderResult.rows[0]?.username || 'unknown'
      }
    });
  } catch (error) {
    next(error);
  }
});

// Mark conversation as read
router.post('/conversations/:conversationId/read', async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({
        success: false,
        message: 'Conversation not found'
      });
    }

    if (conversation.buyerId !== req.user.id && conversation.sellerId !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    await Message.markConversationAsRead(conversationId, req.user.id);

    res.json({
      success: true,
      message: 'Conversation marked as read'
    });
  } catch (error) {
    next(error);
  }
});

export default router;

