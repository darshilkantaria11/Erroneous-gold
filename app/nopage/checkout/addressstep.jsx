"use client";
import { useState, useEffect } from "react";
import { 
  TruckIcon, 
  CheckCircleIcon, 
  MapPinIcon, 
  LockClosedIcon, 
  XCircleIcon 
} from "@heroicons/react/24/outline";

export default function AddressStep({ onNext }) {
    const [shippingCharge, setShippingCharge] = useState(0); // Add this state
  const [pincode, setPincode] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [address, setAddress] = useState({ name: "", line1: "" });
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isChecking, setIsChecking] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    serviceable: null,
    shippingCharge: 0,
    expectedDate: ""
  });

  useEffect(() => {
    const checkPincode = async () => {
      if (pincode.length === 6) {
        setIsChecking(true);
        try {
          const res = await fetch(`/api/shiprocket-pincode-check?pincode=${pincode}`);
          const data = await res.json();
          
          console.log("Pincode Check Response:", data);

          if (data.error) throw new Error(data.error);

          setDeliveryInfo({
            serviceable: data.serviceable,
            shippingCharge: data.shippingCharge,
            expectedDate: data.expectedDate
          });

        } catch (error) {
          console.log("Pincode check failed:", error);
          setDeliveryInfo({
            serviceable: false,
            shippingCharge: 0,
            expectedDate: ""
          });
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkPincode();
  }, [pincode]);

  const handleSubmit = () => {
    if (address.name && address.line1) {
      onNext(2, { 
        address,
        shippingCharge: deliveryInfo.shippingCharge
      });
    }
  };

  return (
    <div className="mx-auto space-y-6 px-1">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <TruckIcon className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Confirm Your Delivery</h2>
        <p className="text-gray-600">Enter your pincode and let us handle the rest!</p>
      </div>

      <div className="rounded-xl shadow-sm">
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Delivery Pincode
          </label>
          <div className="relative">
            <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={pincode}
              onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
              placeholder="Enter 6-digit pincode"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          {isChecking && (
            <p className="text-sm text-blue-600 mt-1 animate-pulse">Checking serviceability...</p>
          )}
        </div>
        {/* {deliveryInfo.serviceable && (
        <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <div>
            <p className="font-medium text-green-800">
              Delivery Available! Shipping: ₹{deliveryInfo.shippingCharge}
            </p>
            <p className="text-sm text-green-700">
              Estimated delivery by {deliveryInfo.expectedDate}
            </p>
          </div>
        </div>
      )} */}

        {deliveryInfo.serviceable && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">We deliver to your area!</p>
                <p className="text-sm text-green-700">
                  🚚 Estimated delivery by <strong>{deliveryInfo.expectedDate}</strong>. Order now and receive it fast!
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={address.name}
                  onChange={(e) => setAddress({ ...address, name: e.target.value })}
                  placeholder="Ex: Ramesh Kumar"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Complete Address
                </label>
                <textarea
                  value={address.line1}
                  onChange={(e) => setAddress({ ...address, line1: e.target.value })}
                  placeholder="House No., Street Name, Area, Landmark"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Continue to Secure Payment
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {deliveryInfo.serviceable === false && (
          <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3 mt-4">
            <XCircleIcon className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Sorry, we don’t deliver there yet.</p>
              <p className="text-sm text-red-700">Try a nearby pincode or reach out to our support team for help.</p>
            </div>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="text-center space-y-2 mt-6">
        <div className="flex items-center justify-center gap-4 text-gray-500">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <span className="text-sm">Secure Checkout</span>
          <LockClosedIcon className="h-5 w-5 text-blue-600" />
        </div>
        <p className="text-xs text-gray-500">
          Fast Delivery • Hassle-Free Returns • 100% Satisfaction Guaranteed
        </p>
      </div>
    </div>
  );
}
