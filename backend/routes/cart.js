const express = require('express');
const router = express.Router();
const Cart = require('../models/Cart');

// GET cart
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [], totalAmount: 0 });
      await cart.save();
    }
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch cart'
    });
  }
});

// POST add to cart
router.post('/add', async (req, res) => {
  try {
    const { userId, foodItemId, name, price, image } = req.body;
    
    let cart = await Cart.findOne({ userId });
    
    if (!cart) {
      cart = new Cart({ userId, items: [] });
    }
    
    const existingItem = cart.items.find(item => item.foodItemId === foodItemId);
    
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        foodItemId,
        name,
        price,
        quantity: 1,
        image
      });
    }
    
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    
    res.json({
      success: true,
      data: cart,
      message: 'Item added to cart'
    });
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to add to cart'
    });
  }
});

// PUT update quantity
router.put('/update', async (req, res) => {
  try {
    const { userId, foodItemId, quantity } = req.body;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    const item = cart.items.find(item => item.foodItemId === foodItemId);
    if (item) {
      if (quantity <= 0) {
        cart.items = cart.items.filter(item => item.foodItemId !== foodItemId);
      } else {
        item.quantity = quantity;
      }
    }
    
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error updating cart:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update cart'
    });
  }
});

// DELETE item from cart
router.delete('/:userId/:foodItemId', async (req, res) => {
  try {
    const { userId, foodItemId } = req.params;
    
    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, error: 'Cart not found' });
    }
    
    cart.items = cart.items.filter(item => item.foodItemId !== foodItemId);
    cart.totalAmount = cart.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    await cart.save();
    
    res.json({
      success: true,
      data: cart
    });
  } catch (error) {
    console.error('Error removing item:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to remove item'
    });
  }
  router.delete('/clear/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.json({
        success: true,
        message: 'Cart is already empty',
        data: {
          items: [],
          totalAmount: 0
        }
      });
    }

    cart.items = [];
    cart.totalAmount = 0;
    await cart.save();

    res.json({
      success: true,
      message: 'Cart cleared successfully',
      data: {
        items: [],
        totalAmount: 0
      }
    });
  } catch (error) {
    console.error('Error clearing cart:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear cart',
      error: error.message
    });
  }
});

module.exports = router;
});


module.exports = router;