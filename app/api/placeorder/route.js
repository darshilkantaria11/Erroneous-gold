import { dbConnect } from "../../utils/mongoose";
import Order from "../../models/order";
import Coupon from "../../models/Coupon";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();

    const { 
      number, 
      name, 
      email, 
      address, 
      items, 
      method,
      total,
      couponCode,
      discountAmount
    } = await req.json();

    if (!number || !name || !email || !address || !items || !method || !total) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate order ID
    const nowUTC = new Date();
    const istOffset = 5.5 * 60 * 60 * 1000;
    const nowIST = new Date(nowUTC.getTime() + istOffset);
    const nowISTT = new Date(nowUTC.getTime());

    const pad = (n) => n.toString().padStart(2, "0");

    const orderId =
      pad(nowIST.getDate()) +
      pad(nowIST.getMonth() + 1) +
      nowIST.getFullYear() +
      pad(nowIST.getHours()) +
      pad(nowIST.getMinutes()) +
      pad(nowIST.getSeconds()) +
      number;

    // Build items array
    const orderItems = items.map((item) => ({
      productId: item.id,
      quantity: item.quantity,
      amount: total,
      method,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      fullAddress: address.line1,
      engravedName: item.name || "",
      createdAt: nowISTT,
      orderId,
    }));

    // Create order
    const existingOrder = await Order.findOne({ number });

    if (existingOrder) {
      existingOrder.items.push(...orderItems);
      existingOrder.name = name;
      existingOrder.email = email;
      existingOrder.total = total;
      existingOrder.couponCode = couponCode || null;
      existingOrder.discountAmount = discountAmount || 0;
      await existingOrder.save();
    } else {
      await Order.create({
        number,
        name,
        email,
        items: orderItems,
        total,
        couponCode: couponCode || null,
        discountAmount: discountAmount || 0
      });
    }

    // Record coupon usage if applied
    if (couponCode && discountAmount > 0) {
      try {
        await Coupon.create({
          userPhone: number,
          couponCode,
          orderId
        });
      } catch (couponError) {
        console.error("Failed to record coupon usage:", couponError);
      }
    }

    return NextResponse.json({ message: "Order placed successfully", orderId }, { status: 201 });
  } catch (error) {
    console.error("Order Submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}