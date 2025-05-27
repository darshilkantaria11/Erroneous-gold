import { dbConnect } from "../../utils/mongoose";
import Order from "../../models/order";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { number, name, address, items, method } = await req.json();

    if (!number || !name || !address || !items || !method) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Include createdAt date for each item explicitly (optional here, default also works)
    const orderItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      amount: item.price * item.quantity,
      method,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      fullAddress: address.line1,
      createdAt: new Date(),
    }));

    const existingOrder = await Order.findOne({ number });

    if (existingOrder) {
      // Append new items to existing order
      existingOrder.items.push(...orderItems);
      await existingOrder.save();
    } else {
      // Create a new order
      await Order.create({
        number,
        name,
        items: orderItems,
      });
    }

    return NextResponse.json({ message: "Order placed successfully" }, { status: 201 });
  } catch (error) {
    console.error("Order Submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
