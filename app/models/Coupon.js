import { Schema, model, models } from "mongoose";

const couponSchema = new Schema({
  userPhone: {
    type: String,
    required: true,
    trim: true,
  },
  couponCode: {
    type: String,
    required: true,
    trim: true,
  },
}, {
  timestamps: true,
  // Ensure each user can only use a coupon once
  index: { fields: { userPhone: 1, couponCode: 1 }, unique: true }
});

export default models.Coupon || model("Coupon", couponSchema);