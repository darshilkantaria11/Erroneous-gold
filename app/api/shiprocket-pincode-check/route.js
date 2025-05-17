export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");
    const quantity = parseInt(searchParams.get("quantity")) || 1;
  
    const pickupPostcode = "360002";
    const token = process.env.SHIPROCKET_API_TOKEN;
    const weight = parseInt(process.env.SHIPPING_WEIGHT) || 400; // grams
    const length = parseInt(process.env.SHIPPING_LENGTH) || 30; // cm
    const width = parseInt(process.env.SHIPPING_WIDTH) || 30;  // cm
    const height = parseInt(process.env.SHIPPING_HEIGHT) || 30; // cm
  
    try {
      // Calculate total shipping parameters based on quantity
      const singleWeightKg = weight / 1000; // Convert grams to kg
      const totalWeight = singleWeightKg * quantity;
  
      const volumetricWeightPerItem = (length * width * height) / 5000;
      const totalVolumetricWeight = volumetricWeightPerItem * quantity;
  
      const chargeableWeight = Math.max(totalWeight, totalVolumetricWeight);
  
      const url = new URL("https://apiv2.shiprocket.in/v1/external/courier/serviceability");
      url.searchParams.append("pickup_postcode", pickupPostcode);
      url.searchParams.append("delivery_postcode", pincode);
      url.searchParams.append("cod", 0);
      url.searchParams.append("weight", chargeableWeight.toFixed(2));
      url.searchParams.append("length", length);
      url.searchParams.append("width", width);
      url.searchParams.append("height", height);
  
      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
  
      if (!res.ok) throw new Error(`Shiprocket API error: ${res.statusText}`);
  
      const data = await res.json();
  
      const serviceable =
        data?.status === 200 && data.data?.available_courier_companies?.length > 0;
  
      let shippingCharge = 0;
      let expectedDate = "";
  
      if (serviceable) {
        const courier =
          data.data.available_courier_companies.find(
            c => c.courier_company_id === data.data.shiprocket_recommended_courier_id
          ) || data.data.available_courier_companies[0];
  
        // ✅ Use the direct final shipping charge from Shiprocket
        shippingCharge =
          courier?.freight_charge ||
          courier?.rate ||
          courier?.shipping_cost ||
          0;
  
        if (courier?.etd) {
          expectedDate = new Date(courier.etd).toLocaleDateString("en-IN", {
            weekday: "long",
            day: "numeric",
            month: "long"
          });
        }
      }
  
      return Response.json({
        serviceable,
        expectedDate,
        shippingCharge: parseFloat(shippingCharge.toFixed(2)) || 0
      });
  
    } catch (error) {
      console.error("Shiprocket Error:", error);
      return Response.json(
        { serviceable: false, error: error.message },
        { status: 500 }
      );
    }
  }
  