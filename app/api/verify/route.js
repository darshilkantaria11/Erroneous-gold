import crypto from "crypto";
import Order from "../../models/order";
import Coupon from "../../models/Coupon";
import { dbConnect } from "../../utils/mongoose";

export async function POST(req) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      orderData,
    } = body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature !== razorpay_signature) {
      return new Response(
        JSON.stringify({ success: false, message: "Invalid signature" }),
        { status: 400 }
      );
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
    } = orderData;

    // Generate order ID
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

    const orderItems = items.map((item) => ({
      orderId,
      productId: item.id,
      quantity: item.quantity,
      amount: (item.price - 100) * item.quantity, // Apply quantity discount
      method,
      pincode: address.pincode,
      city: address.city,
      state: address.state,
      fullAddress: address.line1,
      engravedName: item.name || "",
      createdAt: new Date(),
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

    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (error) {
    console.error("Verification error:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Verification failed" }),
      { status: 500 }
    );
  }
}