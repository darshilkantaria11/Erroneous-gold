import { Schema, model, models } from "mongoose";

const reviewSchema = new Schema({
  productId: {
    type: String,
    required: true,
    trim: true,
  },
  userName: {
    type: String,
    required: true,
    trim: true,
  },
  userNumber: {
    type: String,
    required: true,
    trim: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  description: {
    type: String,
    trim: true,
  },
}, { timestamps: true });

export default models.Review || model("Review", reviewSchema);
