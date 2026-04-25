const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth");
const User = require("../models/User");

// Get all favorites
router.get("/favorites", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate("favorites");
    res.json(user.favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch favorites" });
  }
});

// Check if property is favorite
router.get("/favorites/:propertyId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const isFavorite = user.favorites.includes(req.params.propertyId);
    res.json({ isFavorite });
  } catch (err) {
    res.status(500).json({ message: "Failed to check favorite status" });
  }
});

// Add to favorites
router.post("/favorites/:propertyId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user.favorites.includes(req.params.propertyId)) {
      user.favorites.push(req.params.propertyId);
      await user.save();
    }
    
    // Populate and return updated favorites
    const updatedUser = await User.findById(req.user.id).populate("favorites");
    res.json(updatedUser.favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to add favorite" });
  }
});

// Remove from favorites
router.delete("/favorites/:propertyId", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    
    user.favorites = user.favorites.filter(
      fav => fav.toString() !== req.params.propertyId
    );
    await user.save();
    
    // Populate and return updated favorites
    const updatedUser = await User.findById(req.user.id).populate("favorites");
    res.json(updatedUser.favorites);
  } catch (err) {
    res.status(500).json({ message: "Failed to remove favorite" });
  }
});

const { isAdmin } = require("../middleware/auth");

router.get("/admin/stats", auth, isAdmin, async (req, res) => {
  try {
    const userCount = await User.countDocuments({ role: "user" });
    const ownerCount = await User.countDocuments({ role: "owner" });
    res.json({ userCount, ownerCount });
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch stats" });
  }
});

router.get("/admin/all", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find({}, "name email phone role createdAt");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Failed to fetch users" });
  }
});

module.exports = router;