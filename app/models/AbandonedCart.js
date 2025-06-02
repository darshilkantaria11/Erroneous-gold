// models/AbandonedCart.js
import mongoose from "mongoose";

const AbandonedCartSchema = new mongoose.Schema({
  name: String,
  phone: { type: String, required: true },
  cart: Object,
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.AbandonedCart || mongoose.model("AbandonedCart", AbandonedCartSchema);
