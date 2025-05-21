import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/mongoose";

import User from "../../models/user";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const number = searchParams.get("number");

    if (!number) {
      return NextResponse.json({ error: "Phone number is required" }, { status: 400 });
    }

    await dbConnect();

    const user = await User.findOne({ number }).lean();

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.addresses || user.addresses.length === 0) {
      return NextResponse.json({ error: "No address found" }, { status: 404 });
    }

    const latestAddress = user.addresses[user.addresses.length - 1];

    return NextResponse.json({ address: latestAddress }, { status: 200 });
  } catch (error) {
    console.error("Get address error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
