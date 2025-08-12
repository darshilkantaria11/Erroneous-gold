import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/mongoose";
import Coupon from "../../models/Coupon";

export async function POST(req) {
  try {
    await dbConnect();
    const { couponCode, userPhone } = await req.json();
    
    if (!couponCode || !userPhone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }
    
    // Only WELCOME50 is valid
    if (couponCode !== "WELCOME50") {
      return NextResponse.json(
        { valid: false, message: "Invalid coupon code" },
        { status: 200 }
      );
    }
    
    // Check if user has already used this coupon
    const existing = await Coupon.findOne({ userPhone, couponCode });
    if (existing) {
      return NextResponse.json(
        { valid: false, message: "Coupon already used" },
        { status: 200 }
      );
    }
    
    // Valid coupon
    return NextResponse.json(
      { 
        valid: true, 
        couponCode, 
        discount: 50,
        message: "Coupon applied successfully" 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Coupon Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}