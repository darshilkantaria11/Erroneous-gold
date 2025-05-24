import { dbConnect } from "../../utils/mongoose";
import Product from "../../models/product";
import { NextResponse } from "next/server";

const API_KEY = process.env.NEXT_PUBLIC_API_KEY;

export async function GET(req) {
    const authKey = req.headers.get("x-api-key");
    if (!authKey || authKey !== API_KEY) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("q");

    try {
        await dbConnect();
        let query = {};
        if (keyword) {
            const regex = new RegExp(keyword, "i");
            query = {
                $or: [
                    { productName: regex },
                    { description: regex },
                    { material: regex },
                ],
            };
        }

        const products = await Product.find(query);
        return NextResponse.json(products);
    } catch (err) {
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
