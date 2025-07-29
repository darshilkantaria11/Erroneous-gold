import { dbConnect } from "../../utils/mongoose";
import Order from "../../models/order";
import { NextResponse } from "next/server";

// Define available coupons
const AVAILABLE_COUPONS = [
  { code: "WELCOME50", discount: 50, title: "Welcome Discount" },
  // Add more coupons here as needed
  // { code: "DIWALI50", discount: 50, title: "Diwali Special" },
];

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    await dbConnect();

    // Find coupons already used by this email
    const usedCoupons = await Order.aggregate([
      { $unwind: "$items" },
      { $match: { "items.email": email } },
      { $group: { _id: "$items.coupon" } }
    ]);

    const usedCouponCodes = usedCoupons.map(c => c._id).filter(Boolean);

    // Filter out coupons that have been used
    const availableCoupons = AVAILABLE_COUPONS.filter(
      coupon => !usedCouponCodes.includes(coupon.code)
    );

    return NextResponse.json(availableCoupons, { status: 200 });
  } catch (error) {
    console.error("Available coupons error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}