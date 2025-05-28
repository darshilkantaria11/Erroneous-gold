import { dbConnect } from "../../utils/mongoose";
import Order from "../../models/order";
import { NextResponse } from "next/server";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const number = searchParams.get("number");

    if (!number) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    await dbConnect();

    const orders = await Order.find({ number }).sort({ createdAt: -1 });

    return NextResponse.json({ orders });
  } catch (error) {
    console.error("Fetch Orders Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
