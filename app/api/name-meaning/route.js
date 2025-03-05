import { NextResponse } from "next/server";
import axios from "axios";
import cheerio from "cheerio";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const name = searchParams.get("name");

  if (!name) {
    return NextResponse.json({ error: "Name is required" }, { status: 400 });
  }

  try {
    const response = await axios.get(`https://www.behindthename.com/name/${name}`);
    const $ = cheerio.load(response.data);
    const meaning = $(".namemain + .nameinfo").text().trim();

    return NextResponse.json({ name, meaning: meaning || "No meaning found" });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch name meaning" }, { status: 500 });
  }
}
