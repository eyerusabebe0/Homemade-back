const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, default: "other" },
    condition: { type: String, enum: ["new", "like-new", "good", "fair"], default: "good" },
    location: { type: String },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userEmail: { type: String, required: true },
    userName: { type: String, required: true },
    status: { type: String, enum: ["pending", "approved", "rejected", "payment_pending"], default: "pending" },
    paymentStatus: { type: String, enum: ["unpaid", "paid"], default: "unpaid" },
    views: { type: Number, default: 0 },
    deletedAt: { type: Date },
    rejectionReason: { type: String }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", postSchema);