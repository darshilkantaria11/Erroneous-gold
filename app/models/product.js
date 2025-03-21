import { Schema, model, models } from "mongoose";

const productSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
    },
    strikeoutPrice: {
      type: Number,
      required: [true, "Strikeout price is required"],
    },
    originalPrice: {
      type: Number,
      required: [true, "Original price is required"],
    },
    img1: {
      type: String,
      required: [true, "Image 1 is required"],
    },
    img2: {
      type: String,
      required: [true, "Image 2 is required"],
    },
    img3: {
      type: String,
      required: [true, "Image 3 is required"],
    },
    img4: {
      type: String,
      required: [true, "Image 4 is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    material: {
      type: String,
      required: [true, "Material is required"],
      trim: true,
    },
    fontName: {
      type: String,
      required: [true, "Font name is required"],
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manage createdAt and updatedAt
  }
);

export default models.Product || model("Product", productSchema);
