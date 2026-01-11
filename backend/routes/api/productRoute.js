const express = require('express');
const router = express.Router();

// Product Model (make sure path is correct - adjust if needed)
const Product = require('../../models/Products');

// @route   GET /api/products
// @desc    Get ALL products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});


// @route   POST /api/products
// @desc    Create a new product
router.post('/', async (req, res) => {
  try {
    const { name, description, price, quantity, photo } = req.body;

    // Simple validation
    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'Name, price, and quantity are required' });
    }

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      photo: photo || null,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (err) {
    console.error('POST /api/products error:', err);
    res.status(500).json({ message: 'Server error creating product', error: err.message });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
router.put('/:id', async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json(updatedProduct);
  } catch (err) {
    console.error('PUT /api/products error:', err);
    res.status(500).json({ message: 'Server error updating product', error: err.message });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
router.delete('/:id', async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({ success: true, message: 'Product deleted' });
  } catch (err) {
    console.error('DELETE /api/products error:', err);
    res.status(500).json({ message: 'Server error deleting product', error: err.message });
  }
});

module.exports = router;