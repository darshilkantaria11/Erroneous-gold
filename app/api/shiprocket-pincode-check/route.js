// app/api/shiprocket-pincode-check/route.js
export async function GET(req) {
    const { searchParams } = new URL(req.url);
    const pincode = searchParams.get("pincode");
    const pickupPostcode = "360002"; // Your store pincode
    const token = process.env.SHIPROCKET_API_TOKEN;
  
    try {
      const res = await fetch(
        `https://apiv2.shiprocket.in/v1/external/courier/serviceability?pickup_postcode=${pickupPostcode}&delivery_postcode=${pincode}&cod=0&weight=1`, // Changed weight to 1kg for testing
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (!res.ok) throw new Error(`Shiprocket API error: ${res.statusText}`);
      
      const data = await res.json();
      console.log("Shiprocket Full Response:", JSON.stringify(data, null, 2));
  
      const serviceable = data?.status === 200 && data.data?.available_courier_companies?.length > 0;
      let shippingCharge = 0;
      let expectedDate = "";
  
      if (serviceable) {
        // Get the recommended courier or first available
        const courier = data.data.available_courier_companies.find(c => c.courier_company_id === data.data.shiprocket_recommended_courier_id) 
                      || data.data.available_courier_companies[0];
  
        console.log("Selected Courier:", JSON.stringify(courier, null, 2));
  
        // Get shipping charge - different field names in different responses
        shippingCharge = courier?.freight_charge || 
                        courier?.rate || 
                        courier?.shipping_cost || 
                        0;
  
        // Parse ETD
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
        shippingCharge: parseFloat(shippingCharge) || 0
      });
  
    } catch (error) {
      console.error("Shiprocket Error:", error);
      return Response.json(
        { serviceable: false, error: error.message },
        { status: 500 }
      );
    }
  }