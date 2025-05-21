import { dbConnect } from "../../utils/mongoose";
import User from "../../models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    // 🔒 Extract API Key from Headers
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    // ❌ Reject Unauthorized Requests
    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { name, number } = await req.json();

    if (!name || !number) {
      return NextResponse.json({ error: "Name and number are required" }, { status: 400 });
    }

    const existingUser = await User.findOne({ number });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 200 });
    }

    const newUser = new User({ name, number });
    await newUser.save();

    return NextResponse.json({ message: "User created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
