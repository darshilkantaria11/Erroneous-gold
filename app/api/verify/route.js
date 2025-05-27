import crypto from "crypto";
import Order from "../../models/order";
import { dbConnect } from "../../utils/mongoose";

export async function POST(req) {
    try {
        // Step 1: Parse request body
        const body = await req.json();
        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderData,
        } = body;

        // Step 2: Verify Razorpay signature
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

        // Step 3: Connect to database
        await dbConnect();

        const { number, name, address, items, method } = orderData;

        // Step 4: Format order items
        const orderItems = items.map((item) => ({
            productId: item.id,
            quantity: item.quantity,
            amount: (item.price - 100) * item.quantity,
            method,
            pincode: address.pincode,
            city: address.city,
            state: address.state,
            fullAddress: address.line1,
        }));

        // Step 5: Save order to DB
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

        // Step 6: Return success
        return new Response(JSON.stringify({ success: true }), { status: 200 });
    } catch (error) {
        console.error("Verification error:", error);
        return new Response(
            JSON.stringify({ success: false, message: "Verification failed" }),
            { status: 500 }
        );
    }
}
