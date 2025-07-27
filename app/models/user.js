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
    immutable: true,
  },
  email: {
    type: String,
    trim: true,
    lowercase: true,
    default: null,
  },
  token: {
    type: String,
    default: null,
  },
  addresses: {
    type: [addressSchema],
    default: [],
  },
}, { timestamps: true });

export default models.User || model("User", userSchema);
