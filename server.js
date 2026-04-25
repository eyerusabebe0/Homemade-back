const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const adminRoutes = require('./routes/adminRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/admin', adminRoutes);

// MongoDB Connection - Fixed version without deprecated options
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/arasbaby')
.then(() => console.log('MongoDB connected successfully'))
.catch(err => console.log('DB Error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));