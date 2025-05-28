import { dbConnect } from "../../utils/mongoose";
import User from "../../models/user";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;
    const JWT_SECRET = process.env.JWT_SECRET;

    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { name, number } = await req.json();

    if (!name || !number) {
      return NextResponse.json({ error: "Name and number are required" }, { status: 400 });
    }

    let user = await User.findOne({ number });

    if (user) {
      if (user.name !== name) {
        user.name = name;
      }

      const token = jwt.sign({ id: user._id, number: user.number }, JWT_SECRET, { expiresIn: "7d" });
      user.token = token;
      await user.save();

      return NextResponse.json({
        message: "Login successful",
        user: {
          name: user.name,
          number: user.number,
          token,
          addresses: user.addresses,
        },
      });
    }

    const token = jwt.sign({ number }, JWT_SECRET, { expiresIn: "7d" });

    const newUser = new User({
      name,
      number,
      token,
    });

    await newUser.save();

    return NextResponse.json({
      message: "User created successfully",
      user: {
        name: newUser.name,
        number: newUser.number,
        token,
        addresses: [],
      },
    }, { status: 201 });

  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
