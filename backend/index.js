const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
const blogRoutes = require('./routes/blog');
const adminRoutes = require('./routes/admin'); // Import admin routes
const userRoutes = require('./routes/user'); // Import user routes
require('dotenv').config();

const app = express();

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// Serve uploaded files statically
app.use('/uploads', express.static('uploads'));

// Enable CORS for frontend origin
app.use(cors({
  origin: process.env.FRONTEND_URL || ['http://localhost:5173', 'https://cms-frontend-rgf4.onrender.com'],
  credentials: true,
}));

// Parse JSON bodies
app.use(express.json());

// Mount blog routes
app.use('/api/blogs', blogRoutes);

// Mount admin routes
app.use('/api/admin', adminRoutes);

// Mount user routes
app.use('/api/user', userRoutes);

// MongoDB connection string, replace with your own or use env variable
const mongoURI = process.env.MONGODB_URI || 'mongodb+srv://nihalanihitesh13_db_user:LhN8E2chhBAab7Us@cluster0.swyrh.mongodb.net/blogcms?retryWrites=true&w=majority';

mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
    const PORT = process.env.PORT || 5001;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });
