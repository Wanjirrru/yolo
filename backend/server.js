const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const productRoute = require('./routes/api/productRoute');

// --------------------
// Database connection
// --------------------
const MONGODB_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/yolomy';

mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => console.log('Database connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err.message));

// --------------------
// Express app setup
// --------------------
const app = express();

// Body parser for JSON
app.use(express.json());

// CORS
app.use(cors());

// Serve uploaded images
// This makes `/uploads/products/...` accessible to the frontend
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));

// Routes
app.use('/api/products', productRoute);

// --------------------
// Server
// --------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
