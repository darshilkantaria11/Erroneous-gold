import { Schema, model, models } from "mongoose";

const itemSchema = new Schema(
  {
    productId: {
      type: String,
      required: true,
      trim: true,
    },
    quantity: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    method: {
      type: String,
      enum: ["cod", "prepaid"],
      required: true,
    },
    pincode: {
      type: String,
      required: true,
      trim: true,
    },
    city: {
      type: String,
      required: true,
      trim: true,
    },
    state: {
      type: String,
      required: true,
      trim: true,
    },
    fullAddress: {
      type: String,
      required: true,
      trim: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,  // this will store order item date/time when inserted
    },
  },
  { _id: true } // allow mongoose to create _id for each item
);

const orderSchema = new Schema(
  {
    number: {
      type: String,
      required: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    items: [itemSchema], // use itemSchema here
  },
  { timestamps: true } // document-level createdAt and updatedAt
);

export default models.Order || model("Order", orderSchema);
