const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');

const Product = require('../../models/Products');

// --------------------
// Multer setup
// --------------------
// Save uploaded files to uploads/products
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/products');
  },
  filename: function (req, file, cb) {
    // Keep original filename or add timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// --------------------
// Routes
// --------------------

// GET all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();

    // Convert photo field to full URL for frontend
    const mappedProducts = products.map(p => ({
      ...p._doc,
      photo: p.photo ? `/uploads/products/${p.photo}` : null
    }));

    res.json(mappedProducts);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Database error' });
  }
});

// POST create new product with optional image
router.post('/', upload.single('photo'), async (req, res) => {
  try {
    const { name, description, price, quantity } = req.body;

    if (!name || !price || !quantity) {
      return res.status(400).json({ message: 'Name, price, and quantity are required' });
    }

    const photo = req.file ? req.file.filename : null;

    const newProduct = new Product({
      name,
      description,
      price,
      quantity,
      photo
    });

    const savedProduct = await newProduct.save();

    res.status(201).json({
      ...savedProduct._doc,
      photo: photo ? `/uploads/products/${photo}` : null
    });
  } catch (err) {
    console.error('POST /api/products error:', err);
    res.status(500).json({ message: 'Server error creating product', error: err.message });
  }
});

// PUT update product (with optional new photo)
router.put('/:id', upload.single('photo'), async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (req.file) {
      updateData.photo = req.file.filename;
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.status(200).json({
      ...updatedProduct._doc,
      photo: updatedProduct.photo ? `/uploads/products/${updatedProduct.photo}` : null
    });
  } catch (err) {
    console.error('PUT /api/products error:', err);
    res.status(500).json({ message: 'Server error updating product', error: err.message });
  }
});

// DELETE product
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
