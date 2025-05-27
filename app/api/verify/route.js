import crypto from "crypto";

export async function POST(req) {
  try {
    const body = await req.json();

    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (generated_signature === razorpay_signature) {
      return new Response(JSON.stringify({ success: true }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ success: false, message: "Invalid signature" }), { status: 400 });
    }
  } catch (error) {
    console.error("Verification error:", error);
    return new Response(JSON.stringify({ success: false, message: "Verification failed" }), { status: 500 });
  }
}
