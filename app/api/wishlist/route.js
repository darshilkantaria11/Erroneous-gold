import { NextResponse } from "next/server";
import { dbConnect } from "../../utils/mongoose";
import Wishlist from "../../models/Wishlist";

export async function POST(req) {
  try {
    await dbConnect();
    const { userPhone, productId } = await req.json();

    if (!userPhone || !productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if already exists
    const existing = await Wishlist.findOne({ userPhone, productId });
    if (existing) {
      return NextResponse.json(
        { message: "Product already in wishlist" },
        { status: 200 }
      );
    }

    const newWishlist = await Wishlist.create({ userPhone, productId });
    return NextResponse.json(
      { message: "Added to wishlist", wishlist: newWishlist },
      { status: 201 }
    );
  } catch (error) {
    console.error("Wishlist Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function DELETE(req) {
  try {
    await dbConnect();
    const { userPhone, productId } = await req.json();

    if (!userPhone || !productId) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result = await Wishlist.deleteOne({ userPhone, productId });
    
    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Item not found in wishlist" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Removed from wishlist" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    await dbConnect();
    const userPhone = req.nextUrl.searchParams.get("userPhone");
    
    if (!userPhone) {
      return NextResponse.json(
        { error: "User phone required" },
        { status: 400 }
      );
    }

    const wishlist = await Wishlist.find({ userPhone });
    return NextResponse.json(
      { wishlist },  // Return full wishlist items, not just IDs
      { status: 200 }
    );
  } catch (error) {
    console.error("Wishlist Error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}