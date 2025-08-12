import { Schema, model, models } from "mongoose";

const wishlistSchema = new Schema({
  userPhone: {
    type: String,
    required: true,
    trim: true,
  },
  productId: {
    type: String,
    required: true,
    trim: true,
  },
}, { 
  timestamps: true,
  // Ensure each user can only have one entry per product
  index: { fields: { userPhone: 1, productId: 1 }, unique: true }
});

export default models.Wishlist || model("Wishlist", wishlistSchema);