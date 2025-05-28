import { dbConnect } from "../../utils/mongoose";
import User from "../../models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    const url = new URL(req.url);
    const number = url.searchParams.get("number");
    const token = url.searchParams.get("token");

    if (!number || !token) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    await dbConnect();
    const user = await User.findOne({ number });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify token
    if (user.token !== token) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    return NextResponse.json({
      message: "User verified",
      user: {
        name: user.name,
        number: user.number,
        addresses: user.addresses,
      },
    });
  } catch (err) {
    console.error("Verification Error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
