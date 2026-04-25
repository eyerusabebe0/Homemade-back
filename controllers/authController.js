const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const signup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    let userRole = 'user';
    if (cleanEmail === 'eyerusabebe0@gmail.com') {
      userRole = 'admin';
    }

    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email: cleanEmail,
      password: hashedPassword,
      phone,
      role: userRole
    });

    await newUser.save();

    const token = jwt.sign(
      { id: newUser._id, role: newUser.role },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const cleanEmail = email.trim().toLowerCase();

    const user = await User.findOne({ email: cleanEmail });

    if (!user) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    let userRole = user.role;
    if (cleanEmail === 'eyerusabebe0@gmail.com') {
      userRole = 'admin';
    }

    const token = jwt.sign(
      { id: user._id, role: userRole },
      process.env.JWT_SECRET || 'your_secret_key_here',
      { expiresIn: '7d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: userRole
      }
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json({ success: true, user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { signup, login, getMe };