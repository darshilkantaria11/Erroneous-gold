import crypto from "crypto";
import Order from "../../models/order";
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

        const { number, name, address, items, method } = orderData;

        // Generate a unique orderId (you can use a timestamp + random hex for simplicity)
         const orderId =
      pad(nowIST.getDate()) +
      pad(nowIST.getMonth() + 1) +
      nowIST.getFullYear() +
      pad(nowIST.getHours()) +
      pad(nowIST.getMinutes()) +
      pad(nowIST.getSeconds()) +
      number;

        const orderItems = items.map((item) => ({
            orderId, // ✅ Required field injected here
            productId: item.id,
            quantity: item.quantity,
            amount: (item.price - 100) * item.quantity,
            method,
            pincode: address.pincode,
            city: address.city,
            state: address.state,
            fullAddress: address.line1,
            engravedName: item.name || "",
            createdAt: new Date(),
        }));

        const existingOrder = await Order.findOne({ number });

        if (existingOrder) {
            existingOrder.items.push(...orderItems);
            await existingOrder.save();
        } else {
            await Order.create({
                number,
                name,
                items: orderItems,
            });
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
