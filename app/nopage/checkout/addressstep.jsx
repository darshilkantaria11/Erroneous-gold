"use client";
import { useState, useEffect } from "react";
import {
  TruckIcon,
  CheckCircleIcon,
  MapPinIcon,
  LockClosedIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";
import { useCart } from "../context/CartContext";

export default function AddressStep({ onNext }) {
  const { getTotalItems } = useCart();
  const quantity = getTotalItems();
  const [postOfficeOptions, setPostOfficeOptions] = useState([]);


  const [pincode, setPincode] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({
    email: "",
    pincode: "",
    city: "",
    state: "",
    line1: "",
    serviceable: "",
  });
  const [address, setAddress] = useState({ city: "", state: "", line1: "" });
  const [deliveryInfo, setDeliveryInfo] = useState({
    serviceable: null,
    shippingCharge: 0,
    expectedDate: "",
  });
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    const fetchAddress = async () => {
      const storedUser = JSON.parse(localStorage.getItem("user"));
      const phone = storedUser?.phone;
      const storedEmail = storedUser?.email;

      // Set email if available
      if (storedEmail) setEmail(storedEmail);

      if (!phone) return;

      try {
        const res = await fetch(`/api/get-address?number=${phone}`);
        if (!res.ok) throw new Error("Address not found");

        const data = await res.json();

        // Set email from API if available
        if (data.email) setEmail(data.email);

        if (data.address) {
          setPincode(data.address.pincode || "");
          setAddress({
            city: data.address.city || "",
            state: data.address.state || "",
            line1: data.address.fullAddress || "",
          });
        }
      } catch (err) {
        console.log("Prefill address failed:", err.message);
      }
    };

    fetchAddress();
  }, []);

  useEffect(() => {
    const checkPincode = async () => {
      if (pincode.length === 6) {
        setIsChecking(true);
        try {
          const res = await fetch(
            `/api/shiprocket-pincode-check?pincode=${pincode}&quantity=${quantity}`,
            {
              headers: {
                "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
              },
            }
          );
          const data = await res.json();
          if (data.error) throw new Error(data.error);

          setDeliveryInfo({
            serviceable: data.serviceable,
            shippingCharge: data.shippingCharge,
            expectedDate: data.expectedDate,
          });

          if (data.serviceable) {
            setErrors((prev) => ({ ...prev, pincode: "", serviceable: "" }));
          }

          // 📍 Fetch post office options for dropdown
          const locationRes = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
          const locationData = await locationRes.json();
          const postOffices = locationData?.[0]?.PostOffice || [];

          const options = postOffices.map(po => ({
            label: `${po.Name}, ${po.District}`,
            city: po.Name,
            district: po.District,
            state: po.State,
          }));

          setPostOfficeOptions(options);

          // Autofill city and state from first option
          if (options.length > 0) {
            setAddress(prev => ({
              ...prev,
              city: options[0].label,
              state: options[0].state,
            }));
          }
        } catch (error) {
          console.error("Pincode check failed:", error.message);
          setDeliveryInfo({
            serviceable: false,
            shippingCharge: 0,
            expectedDate: "",
          });
          setPostOfficeOptions([]);
        } finally {
          setIsChecking(false);
        }
      }
    };

    checkPincode();
  }, [pincode, quantity]);


  const validateForm = () => {
    const newErrors = {
      email: "",
      pincode: "",
      city: "",
      state: "",
      line1: "",
      serviceable: "",
    };

    let isValid = true;

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Invalid email format";
      isValid = false;
    }

    // Pincode validation
    if (pincode.length !== 6) {
      newErrors.pincode = "Pincode must be 6 digits";
      isValid = false;
    }

    // Serviceability check
    if (!deliveryInfo.serviceable) {
      newErrors.serviceable = "Sorry, we don't deliver to this area";
      isValid = false;
    }

    // Address fields validation
    if (!address.city.trim()) {
      newErrors.city = "City is required";
      isValid = false;
    }

    if (!address.state.trim()) {
      newErrors.state = "State is required";
      isValid = false;
    }

    if (!address.line1.trim()) {
      newErrors.line1 = "Complete address is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async () => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const phone = storedUser?.phone;

    if (!validateForm()) return;

    try {
      await fetch("/api/save-address", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({
          number: phone,
          email,
          address: { pincode, city: address.city, state: address.state, fullAddress: address.line1 },
        }),
      });

      onNext(2, {
        address: { ...address, pincode },
        shippingCharge: deliveryInfo.shippingCharge,
        email,
      });
    } catch (error) {
      console.error("Address save failed:", error);
    }
  };

  return (
    <div className="mx-auto space-y-6 px-1">
      {/* Email Input */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email Address <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setErrors(prev => ({ ...prev, email: "" }));
            }}
            placeholder="you@example.com"
            className={`w-full pl-4 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"
              }`}
          />
        </div>
        {errors.email && (
          <p className="text-sm text-red-600 mt-1">
            {errors.email}
          </p>
        )}
      </div>

      {/* Pincode */}
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Delivery Pincode <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <MapPinIcon className="h-5 w-5 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={pincode}
            onChange={(e) => {
              const value = e.target.value.replace(/\D/g, "").slice(0, 6);
              setPincode(value);
              setErrors(prev => ({ ...prev, pincode: "" }));
            }}
            placeholder="Enter 6-digit pincode"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${errors.pincode ? "border-red-500" : "border-gray-300"
              }`}
          />
        </div>

        {isChecking && (
          <p className="text-sm text-blue-600 mt-1 animate-pulse">
            Checking serviceability...
          </p>
        )}

        {errors.pincode && (
          <p className="text-sm text-red-600 mt-1">
            {errors.pincode}
          </p>
        )}
      </div>

      {/* If pincode is serviceable, show full address form */}
      {pincode.length === 6 && (
        <div className={`space-y-4 animate-fade-in ${deliveryInfo.serviceable === false ? 'border-l-4 border-red-500 pl-4' : ''}`}>
          {deliveryInfo.serviceable === false && (
            <div className="bg-red-50 p-4 rounded-lg flex items-center gap-3">
              <XCircleIcon className="h-5 w-5 text-red-600" />
              <div>
                <p className="font-medium text-red-800">
                  Sorry, we don&apos;t deliver to this area
                </p>
                <p className="text-sm text-red-700">
                  Please try a different pincode
                </p>
              </div>
            </div>
          )}

          {deliveryInfo.serviceable && (
            <div className="bg-green-50 p-4 rounded-lg flex items-center gap-3">
              <CheckCircleIcon className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">
                  We deliver to your area!
                </p>
                <p className="text-sm text-green-700">
                  🚚 Estimated delivery by{" "}
                  <strong>{deliveryInfo.expectedDate}</strong>.
                </p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div className="flex gap-4">
              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Area / City <span className="text-red-500">*</span>
                </label>
                <select
                  value={address.city}
                  onChange={(e) => {
                    const selectedOption = postOfficeOptions.find(opt => opt.label === e.target.value);
                    setAddress(prev => ({
                      ...prev,
                      city: selectedOption?.label || "",
                      state: selectedOption?.state || "",
                    }));
                    setErrors(prev => ({ ...prev, city: "" }));
                  }}
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.city ? "border-red-500" : "border-gray-300"
                    }`}
                >
                  {postOfficeOptions.map((option, index) => (
                    <option key={index} value={option.label}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.city && (
                  <p className="text-sm text-red-600 mt-1">{errors.city}</p>
                )}
              </div>


              <div className="w-1/2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={address.state}
                  onChange={(e) => {
                    setAddress({ ...address, state: e.target.value });
                    setErrors(prev => ({ ...prev, state: "" }));
                  }}
                  readOnly
                  placeholder="Ex: Maharashtra"
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.state ? "border-red-500" : "border-gray-300"
                    }`}
                />
                {errors.state && (
                  <p className="text-sm text-red-600 mt-1">
                    {errors.state}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Complete Address <span className="text-red-500">*</span>
              </label>
              <textarea
                value={address.line1}
                onChange={(e) => {
                  setAddress({ ...address, line1: e.target.value });
                  setErrors(prev => ({ ...prev, line1: "" }));
                }}
                placeholder="House No., Street Name, Area, Landmark"
                rows="3"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.line1 ? "border-red-500" : "border-gray-300"
                  }`}
              />
              {errors.line1 && (
                <p className="text-sm text-red-600 mt-1">
                  {errors.line1}
                </p>
              )}
            </div>

            {errors.serviceable && (
              <p className="text-sm text-red-600 mt-1">
                {errors.serviceable}
              </p>
            )}

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
            >
              <LockClosedIcon className="h-5 w-5" />
              Continue to Secure Payment
            </button>
          </div>
        </div>
      )}
    </div>
  );
}