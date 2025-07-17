import { dbConnect } from "../../utils/mongoose";
import Review from "../../models/review";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    const authKey = req.headers.get("x-api-key");
    const SERVER_API_KEY = process.env.NEXT_PUBLIC_API_KEY;

    if (!authKey || authKey !== SERVER_API_KEY) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const { productId, userName, userNumber, rating, description } = await req.json();

    if (!productId || !userName || !userNumber || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newReview = await Review.create({
      productId,
      userName,
      userNumber,
      rating,
      description,
    });

    return NextResponse.json({ message: "Review submitted successfully", review: newReview }, { status: 201 });
  } catch (error) {
    console.error("Review Submission Error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}