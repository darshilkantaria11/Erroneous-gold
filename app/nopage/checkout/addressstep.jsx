"use client";
import { useState, useEffect } from "react";
// import { TruckIcon, CheckCircleIcon, MapPinIcon } from "@heroicons/react/24/outline";
import { 
    TruckIcon, 
    CheckCircleIcon, 
    MapPinIcon, 
    LockClosedIcon, 
    XCircleIcon 
  } from "@heroicons/react/24/outline";

export default function AddressStep({ onNext }) {
  const [pincode, setPincode] = useState("");
  const [deliveryAvailable, setDeliveryAvailable] = useState(null);
  const [address, setAddress] = useState({ name: "", line1: "" });
  const [deliveryDate, setDeliveryDate] = useState("");
  const [isChecking, setIsChecking] = useState(false);

  // Calculate delivery date (1 week from now)
  useEffect(() => {
    const date = new Date();
    date.setDate(date.getDate() + 7);
    setDeliveryDate(date.toLocaleDateString('en-IN', { 
      weekday: 'long', 
      day: 'numeric', 
      month: 'long' 
    }));
  }, []);

  const checkPincode = async () => {
    setIsChecking(true);
    // Simulate API call
    setTimeout(() => {
      setDeliveryAvailable(true);
      setIsChecking(false);
    }, 1000);
  };

  const handleSubmit = () => {
    if (address.name && address.line1) {
      onNext(2, { address });
    }
  };

  return (
    <div className=" mx-auto space-y-6">
      <div className="text-center">
        <div className="flex justify-center mb-3">
          <TruckIcon className="h-12 w-12 text-blue-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Where Should We Deliver?</h2>
        <p className="text-gray-600">Enter your pincode to check delivery options</p>
      </div>

      <div className="  rounded-xl shadow-sm">
        <div className="flex gap-3 mb-4">
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Enter Pincode
            </label>
            <div className="relative">
              <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="6-digit pincode"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
          <div className="mt-6">
            <button
              onClick={checkPincode}
              disabled={pincode.length !== 6 || isChecking}
              className={`h-[42px] px-6 flex items-center ${
                pincode.length === 6 
                  ? 'bg-blue-600 hover:bg-blue-700' 
                  : 'bg-gray-300 cursor-not-allowed'
              } text-white rounded-lg transition-colors`}
            >
              {isChecking ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                </div>
              ) : (
                "Check"
              )}
            </button>
          </div>
        </div>

        {deliveryAvailable && (
          <div className="space-y-4 animate-fade-in">
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Delivery Available</p>
                <p className="text-sm text-green-700">Expected by {deliveryDate}</p>
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
                  placeholder="House No., Street, Area, Landmark"
                  rows="3"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                onClick={handleSubmit}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                Save & Continue to Payment
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        )}

        {deliveryAvailable === false && (
          <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3 mt-4">
            <XCircleIcon className="h-5 w-5 text-red-600" />
            <div>
              <p className="font-medium text-red-800">Delivery Not Available</p>
              <p className="text-sm text-red-700">Please check nearby pincodes or contact support</p>
            </div>
          </div>
        )}
      </div>

      {/* Trust Badges */}
      <div className="text-center space-y-2">
        <div className="flex items-center justify-center gap-4 text-gray-500">
          <CheckCircleIcon className="h-5 w-5 text-green-600" />
          <span className="text-sm">Secure Checkout</span>
          <LockClosedIcon className="h-5 w-5 text-blue-600" />
        </div>
        <p className="text-xs text-gray-500">
          100% Satisfaction Guarantee • Fast Delivery • Easy Returns
        </p>
      </div>
    </div>
  );
}