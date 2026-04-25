const Post = require("../models/Post");
const Purchase = require("../models/Purchase");

// Create post
const createPost = async (req, res) => {
  try {
    const { title, description, price, image, category, condition, location } = req.body;
    
    const post = new Post({
      title,
      description,
      price: Number(price),
      image,
      category,
      condition,
      location,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name,
      status: "pending"
    });
    
    await post.save();
    res.status(201).json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's posts
const getUserPosts = async (req, res) => {
  try {
    const posts = await Post.find({ 
      userId: req.user.id,
      deletedAt: null 
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get approved posts for homepage
const getApprovedPosts = async (req, res) => {
  try {
    const posts = await Post.find({ 
      status: "approved",
      deletedAt: null 
    }).sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single post
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post || post.deletedAt) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    // Increment views
    post.views += 1;
    await post.save();
    
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update post
const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post || post.deletedAt) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    const { title, description, price, image, category, condition, location } = req.body;
    
    if (title) post.title = title;
    if (description) post.description = description;
    if (price) post.price = Number(price);
    if (image) post.image = image;
    if (category) post.category = category;
    if (condition) post.condition = condition;
    if (location) post.location = location;
    
    // Reset status to pending if admin approval needed
    if (post.status === "approved") {
      post.status = "pending";
    }
    
    await post.save();
    res.json(post);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete post (soft delete)
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    
    if (post.userId.toString() !== req.user.id) {
      return res.status(403).json({ message: "Not authorized" });
    }
    
    post.deletedAt = new Date();
    await post.save();
    
    res.json({ message: "Post deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create purchase
const createPurchase = async (req, res) => {
  try {
    const { productId, title, price, quantity, total, image } = req.body;
    
    const purchase = new Purchase({
      productId,
      title,
      price: Number(price),
      quantity: Number(quantity),
      total: Number(total),
      image,
      userId: req.user.id,
      userEmail: req.user.email,
      userName: req.user.name
    });
    
    await purchase.save();
    res.status(201).json(purchase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user purchases
const getUserPurchases = async (req, res) => {
  try {
    const purchases = await Purchase.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json(purchases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  createPost,
  getUserPosts,
  getApprovedPosts,
  getPostById,
  updatePost,
  deletePost,
  createPurchase,
  getUserPurchases
};