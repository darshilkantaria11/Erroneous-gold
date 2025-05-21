import { Schema, model, models } from "mongoose";

const addressSchema = new Schema({
  pincode: String,
  city: String,
  state: String,
  fullAddress: String,
}, { _id: false });

const userSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  number: {
    type: String,
    required: true,
    unique: true,
    immutable: true, // Prevent updates to the number once saved
  },
  addresses: {
    type: [addressSchema],
    default: [],
  },
}, { timestamps: true });

export default models.User || model("User", userSchema);
