const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');

// Only configure multer when needed (not globally)
const upload = multer();

const productRoute = require('./routes/api/productRoute');

// --------------------
// Database connection
// --------------------

// Use Docker-provided Mongo URI, fallback only for local dev
const MONGODB_URI =
  process.env.MONGO_URI || 'mongodb://localhost:27017/yolomy';

// Connect to MongoDB
mongoose
  .connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    console.log('Database connected successfully');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// --------------------
// Express app setup
// --------------------

const app = express();

// Body parser
app.use(express.json());

// CORS
app.use(cors());

app.use('/images', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/products', productRoute);

// --------------------
// Server
// --------------------

const PORT = process.env.PORT || 5000;


app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT}`);
});
