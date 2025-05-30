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

    // Generate order ID: format DDMMYYYYHHMMSS + mobileNumber (IST time)
    const nowUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(nowUTC.getTime() + istOffset);

    const pad = (n) => n.toString().padStart(2, "0");

    const orderId =
      pad(nowIST.getDate()) +
      pad(nowIST.getMonth() + 1) +
      nowIST.getFullYear() +
      pad(nowIST.getHours()) +
      pad(nowIST.getMinutes()) +
      pad(nowIST.getSeconds()) +
      number;

    // Build items array with orderId included
    const orderItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      amount: item.price * item.quantity,
      method,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      fullAddress: address.line1,
      engravedName: item.name || "",
      createdAt: nowIST,
      orderId, // <-- added here
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

    return NextResponse.json({ message: "Order placed successfully", orderId }, { status: 201 });
  } catch (error) {
    console.error("Order Submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
