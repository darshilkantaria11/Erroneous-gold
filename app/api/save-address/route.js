import { dbConnect } from "../../utils/mongoose";
import User from "../../models/user";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { number, address, email } = await req.json();

    if (
      !number ||
      !address ||
      !address.pincode ||
      !address.city ||
      !address.state ||
      !address.fullAddress
    ) {
      return NextResponse.json({ error: "Invalid input" }, { status: 400 });
    }

    const user = await User.findOne({ number });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // ✅ Update or add address
    if (user.addresses && user.addresses.length > 0) {
      user.addresses[0] = address;
    } else {
      user.addresses.push(address);
    }

    // ✅ Update email if provided
    if (email) {
      user.email = email;
    }

    await user.save();

    return NextResponse.json({ message: "Address and email saved" }, { status: 200 });
  } catch (error) {
    console.error("User Save Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
