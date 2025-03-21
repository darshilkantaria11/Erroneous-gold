import { dbConnect } from '../../utils/mongoose';
import Product from '../../models/product';
import { NextResponse } from 'next/server';

// Secure API Key (Store in .env file)
const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(req) {
    // Get API Key from headers
    const authKey = req.headers.get("x-api-key");

    // Check if API key is missing or incorrect
    if (!authKey || authKey !== API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        await dbConnect();
        const products = await Product.find(); // Fetch all products from the database
        return NextResponse.json(products);
    } catch (error) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
