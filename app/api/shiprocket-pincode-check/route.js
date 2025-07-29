let shiprocketToken = null;
let tokenFetchedAt = null;

async function getShiprocketToken() {
  const shouldRefresh = !shiprocketToken || (Date.now() - tokenFetchedAt) > 1000 * 60 * 60 * 23;

  if (!shouldRefresh) return shiprocketToken;

  const loginRes = await fetch("https://apiv2.shiprocket.in/v1/external/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: process.env.SHIPROCKET_EMAIL,
      password: process.env.SHIPROCKET_PASSWORD,
    }),
  });

  const loginData = await loginRes.json();

  if (!loginRes.ok) {
    console.error("Shiprocket Login Failed", loginData);
    throw new Error("Failed to authenticate with Shiprocket");
  }

  shiprocketToken = loginData.token;
  tokenFetchedAt = Date.now();

  return shiprocketToken;
}


export async function GET(req) {
   const apiKey = req.headers.get("x-api-key");
  if (apiKey !== process.env.NEXT_PUBLIC_API_KEY) {
    return new Response("Unauthorized", { status: 401 });
  }
  try {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");
    const quantity = parseInt(searchParams.get("quantity")) || 1;

    const pickupPostcode = "360002";
    const weight = parseInt(process.env.SHIPPING_WEIGHT) || 100;
    const length = parseInt(process.env.SHIPPING_LENGTH) || 10;
    const width = parseInt(process.env.SHIPPING_WIDTH) || 10;
    const height = parseInt(process.env.SHIPPING_HEIGHT) || 10;

    const totalWeight = (weight / 1000) * quantity;
    const volumetricWeight = ((length * width * height) / 5000) * quantity;
    const chargeableWeight = Math.max(totalWeight, volumetricWeight);

    const token = await getShiprocketToken();

    const url = new URL("https://apiv2.shiprocket.in/v1/external/courier/serviceability");
    url.searchParams.append("pickup_postcode", pickupPostcode);
    url.searchParams.append("delivery_postcode", pincode);
    url.searchParams.append("cod", 0);
    url.searchParams.append("weight", chargeableWeight.toFixed(2));
    url.searchParams.append("length", length);
    url.searchParams.append("width", width);
    url.searchParams.append("height", height);

    const res = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!res.ok) {
      throw new Error(`Shiprocket API error: ${res.statusText}`);
    }

    const data = await res.json();
    const serviceable =
      data?.status === 200 && data.data?.available_courier_companies?.length > 0;

    let shippingCharge = 0;
    let expectedDate = "";

    if (serviceable) {
      const courier =
        data.data.available_courier_companies.find(
          (c) => c.courier_company_id === data.data.shiprocket_recommended_courier_id
        ) || data.data.available_courier_companies[0];

      shippingCharge =
        courier?.freight_charge ||
        courier?.rate ||
        courier?.shipping_cost ||
        0;

     if (courier?.etd) {
  const originalDate = new Date(courier.etd);
  const finalDate = new Date(originalDate);
  finalDate.setDate(originalDate.getDate() + 5); // add 5 days

  expectedDate = finalDate.toLocaleDateString("en-IN", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

    }

    return Response.json({
      serviceable,
      expectedDate,
      shippingCharge: parseFloat(shippingCharge.toFixed(2)) || 0,
    });
  } catch (error) {
    console.error("Shiprocket Error:", error);
    return Response.json(
      { serviceable: false, error: error.message },
      { status: 500 }
    );
  }
}
