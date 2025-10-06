import { NextResponse } from "next/server";



export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");
    const quantity = searchParams.get("quantity") || 1;
    const origin_pin = process.env.DELHIVERY_ORIGIN_PIN || "122003";

    if (!pincode) {
      return NextResponse.json({ error: "Missing pincode" }, { status: 400 });
    }

    const token = process.env.DELHIVERY_TOKEN;
    if (!token) {
      console.error("❌ Missing Delhivery Token");
      return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 1. Serviceability Check
    const serviceabilityURL = `https://track.delhivery.com/c/api/pin-codes/json/?filter_codes=${pincode}`;

    const serviceRes = await fetch(serviceabilityURL, {
      method: "GET",
      headers: {
        "Authorization": `Token ${token}`,
        "Accept": "application/json",
      },
    });

    if (!serviceRes.ok) {
      const errorStatus = serviceRes.status;
      console.error(`❌ Delhivery Serviceability API returned HTTP ${errorStatus}`);

      if (errorStatus === 401) {
        return NextResponse.json(
          { error: "Authentication failed. Please check your API token." },
          { status: 401 }
        );
      }
      
      return NextResponse.json(
        { error: "Service check temporarily unavailable" },
        { status: 502 }
      );
    }

    const serviceData = await serviceRes.json();

    // FIXED: Correct serviceability logic
    let isServiceable = false;

    if (Array.isArray(serviceData) && serviceData.length === 0) {
      isServiceable = false;
    } else {
      // FIX: Removed [0] from postal_code access
      const postalCodeData = serviceData?.delivery_codes?.[0]?.postal_code;
      console.log("Processed postalCodeData:", postalCodeData);
      
      // FIX: Removed 'const' to update the outer variable
      isServiceable = postalCodeData?.pre_paid === "Y" || postalCodeData?.cod === "Y";
      console.log("Is serviceable?", isServiceable);
    }

    // 2. Expected TAT
    // 2. Expected TAT - WITH DEBUG LOGGING
let expectedDate = "";
const tatURL = `https://track.delhivery.com/api/dc/expected_tat?origin_pin=${origin_pin}&destination_pin=${pincode}&mot=S&pdt=B2C`;

console.log("🔄 Making TAT API request to:", tatURL);

const tatRes = await fetch(tatURL, {
  method: "GET",
  headers: {
    "Authorization": `Token ${token}`,
    "Accept": "application/json",
  },
});

console.log("📨 TAT API HTTP Status:", tatRes.status);

// Get the raw response text first for debugging
const tatText = await tatRes.text();
console.log("📄 Raw TAT API Response:", tatText);

if (tatRes.ok) {
  try {
    const tatData = JSON.parse(tatText);
    console.log("🔍 Parsed TAT Data Structure:", JSON.stringify(tatData, null, 2));
    
    // FIX: The API returns the TAT in days, not a date string.
    if (tatData.success && tatData.data && tatData.data.tat !== undefined) {
      const tatInDays = tatData.data.tat;
      
      // Calculate the expected date by adding TAT days to today
      const today = new Date();
      const expectedDeliveryDate = new Date();
      expectedDeliveryDate.setDate(today.getDate() + tatInDays + 5);
      
      // Format the date as a string (e.g., "2023-10-15")
      expectedDate = expectedDeliveryDate.toISOString().split('T')[0];
      console.log("📅 Calculated expectedDate value:", expectedDate);
    } else {
      console.warn("⚠️ TAT data is missing or request was not successful.");
    }
    
  } catch (parseError) {
    console.error("❌ Failed to parse TAT JSON:", parseError);
    console.error("📄 Problematic response text was:", tatText);
  }
} else {
  console.warn("⚠️ TAT API returned an error, continuing without delivery date");
  console.warn("🔧 HTTP Status:", tatRes.status);
  console.warn("📄 Error response body:", tatText);
}

// 3. Combine final response WITH LOGGING
const finalResponse = {
  serviceable: isServiceable,
  expectedDate,
  shippingCharge: isServiceable ? 0 : 0,
};

console.log("🎯 Sending final response to frontend:", JSON.stringify(finalResponse, null, 2));

return NextResponse.json(finalResponse);
    
  } catch (err) {
    console.error("❌ Unexpected Delhivery API Error:", err);
    return NextResponse.json(
      { error: "A network error occurred while checking serviceability." },
      { status: 500 }
    );
  }
}