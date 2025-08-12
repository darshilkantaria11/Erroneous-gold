import { NextResponse } from "next/server";
import { dbConnect } from "../../../utils/mongoose";
import Coupon from "../../../models/Coupon";

export async function POST(req) {
  try {
    await dbConnect();
    const { userPhone } = await req.json();
    
    if (!userPhone) {
      return NextResponse.json(
        { error: "userPhone required" },
        { status: 400 }
      );
    }
    
    // Check if user has used WELCOME50 before
    const existing = await Coupon.findOne({ 
      userPhone, 
      couponCode: "WELCOME50" 
    });
    
    return NextResponse.json(
      { 
        eligible: !existing,
        message: existing 
          ? "Coupon already used" 
          : "Eligible for coupon"
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Coupon Check Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}