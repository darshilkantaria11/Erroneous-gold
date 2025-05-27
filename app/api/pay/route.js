import Razorpay from "razorpay";
import { dbConnect } from "../../utils/mongoose";
import Product from '../../models/product';

export async function POST(req) {
  try {
    const body = await req.json();
    const { items, shippingCharge = 0 } = body;

    await dbConnect();

    let subtotal = 0;

    // Fetch real prices from DB
    for (const item of items) {
      const product = await Product.findById(item.id).lean();
      if (!product) {
        return new Response(JSON.stringify({ success: false, message: "Product not found" }), { status: 400 });
      }

      const itemPrice = product.originalPrice;
      const quantity = item.quantity;

      subtotal += itemPrice * quantity;
    }

    const discount = 100; // apply this only if prepaid, adjust as needed
    const total = subtotal - discount;

    if (total <= 0) {
      return new Response(JSON.stringify({ success: false, message: "Invalid total" }), { status: 400 });
    }

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_SECRET,
    });

    const order = await razorpay.orders.create({
      amount: total * 100, // convert to paise
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`,
    });

    return new Response(
      JSON.stringify({ success: true, razorpayOrderId: order.id }),
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating order:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Order creation failed" }),
      { status: 500 }
    );
  }
}
