import { dbConnect } from "../../utils/mongoose";
import Product from "../../models/product";
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(req) {
    const authKey = req.headers.get("x-api-key");
    if (!authKey || authKey !== API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(url.searchParams.get("limit")) || 20;
    const skip = (page - 1) * limit;

    try {
        await dbConnect();
        const products = await Product.find().skip(skip).limit(limit);
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}