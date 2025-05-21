"use client";

import { useState, useEffect, useRef } from "react";
import { generateOTP } from "../../lib/otp";
import Image from "next/image";
import Logo from "../../../public/logo.svg";

export default function LoginPopup({ onClose, onSuccess }) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [otpRef, setOtpRef] = useState("");
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);
  const inputsRef = useRef([]);
  const popupRef = useRef(null);
  const phoneInputRef = useRef(null);


  // Phone input change: allow only digits, max 10 chars
  const handlePhoneChange = (e) => {
    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
    setPhone(val);
  };

  const handleSendOtp = async () => {
    if (!name.trim()) return setError("Name is required");
    if (!/^\d{10}$/.test(phone)) return setError("Enter valid 10-digit number");

    const generated = generateOTP();
    setOtpRef(generated);
    setLoading(true);
    setError("");

    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone, otp: generated }),
    });

    const data = await res.json();
    setLoading(false);

    if (!res.ok) return setError(data.error || "Failed to send OTP");

    setOtpSent(true);
    setTimer(30);
    setOtp(Array(6).fill(""));
    inputsRef.current[0]?.focus();
  };

  // OTP input handlers:
  const handleOtpChange = (i, val) => {
    if (!/^\d?$/.test(val)) return;
    const updated = [...otp];
    updated[i] = val;
    setOtp(updated);
    if (val && i < 5) inputsRef.current[i + 1]?.focus();
    if (!val && i > 0) inputsRef.current[i - 1]?.focus();
  };

  const handleOtpKeyDown = (e, i) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[i]) {
        newOtp[i] = "";
        setOtp(newOtp);
        inputsRef.current[i]?.focus();
      } else if (i > 0) {
        inputsRef.current[i - 1]?.focus();
        const prevOtp = [...otp];
        prevOtp[i - 1] = "";
        setOtp(prevOtp);
      }
    } else if (e.key === "ArrowLeft" && i > 0) {
      e.preventDefault();
      inputsRef.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < 5) {
      e.preventDefault();
      inputsRef.current[i + 1]?.focus();
    } else if (e.key.match(/^[0-9]$/)) {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[i] = e.key;
      setOtp(newOtp);
      if (i < 5) inputsRef.current[i + 1]?.focus();
    } else if (e.key !== "Tab") {
      e.preventDefault();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData("text").trim();
    if (!/^\d{6}$/.test(pasteData)) return;
    const pasteOtp = pasteData.split("");
    setOtp(pasteOtp);
    inputsRef.current[5]?.focus();
  };

  const verifyOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp !== otpRef) {
      setError("Incorrect OTP");
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
      return;
    }

    try {
      await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": process.env.NEXT_PUBLIC_API_KEY,
        },
        body: JSON.stringify({ name, number: phone }),
      });
    } catch (err) {
      console.error("Login DB error:", err);
    }

    setSuccessMessage(true);
    setError("");

    setTimeout(() => {
      onSuccess({ name, phone });
      onClose();
    }, 5000);
  };

  useEffect(() => {
    if (otpSent && timer > 0) {
      const t = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(t);
    }
  }, [otpSent, timer]);

  useEffect(() => {
    if (otp.every((d) => d !== "")) verifyOtp();
  }, [otp]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const resetOtpState = () => {
    setOtpSent(false);
    setOtp(Array(6).fill(""));
    setTimer(30);
    setError("");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
      <div
        ref={popupRef}
        className="bg-white rounded-2xl p-6 sm:p-8 w-full max-w-sm shadow-2xl animate-fade-in"
      >
        <div className="flex flex-col items-center space-y-2 mb-6">
          <Image src={Logo} alt="Company Logo" width={120} height={40} />
          <h2 className="text-2xl font-bold text-center text-c4">
            Welcome to <br /> ERRONEOUS GOLD
          </h2>
          <p className="text-sm text-gray-600 text-center px-2">
            Your name deserves to shine ✨ <br />
            Login to personalize your necklace and track your order!
          </p>
        </div>

        {successMessage ? (
          <div className="text-center space-y-3">
            <h3 className="text-xl font-semibold text-green-600">
              Welcome, {name}!
            </h3>
            <p className="text-sm text-gray-600">
              You&apos;ve successfully logged in 🎉
            </p>
            <p className="text-sm text-gray-500">Enjoy shopping...</p>
          </div>
        ) : otpSent ? (
          <>
            <p className="text-center text-sm text-gray-700 mb-2">
              Enter the 6-digit OTP sent to <strong>+91 {phone}</strong>
            </p>
            <div className="flex justify-center gap-2 mb-3">
              {otp.map((digit, i) => (
                <input
                  key={i}
                  ref={(el) => (inputsRef.current[i] = el)}
                  className={`w-10 h-12 border text-xl text-center rounded-md
                    ${error ? "border-red-500 shake" : "border-gray-300"}`}
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(e, i)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            <div className="flex justify-between items-center text-xs text-gray-500 mb-2">
              <span>Resend in {timer}s</span>
              <button
                disabled={timer > 0}
                onClick={handleSendOtp}
                className={`text-c4 font-medium ${timer > 0 ? "opacity-50" : "hover:underline"
                  }`}
              >
                Resend OTP
              </button>
            </div>
            <button
              onClick={resetOtpState}
              className="text-xs text-gray-500 underline mb-2 mx-auto block"
            >
              Change number
            </button>
          </>
        ) : (
          <>
            <input
              className="w-full border border-gray-300 rounded-lg p-3 mb-3 text-sm focus:outline-none focus:ring-2 focus:ring-c2"
              placeholder="Your name"
              value={name}
              autoComplete="name"
              onChange={(e) => setName(e.target.value)}
            />
            {/* Example location: before the Send OTP button */}
            {/* Add this block in place of your old phone input */}

            <div>
              <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 mb-2 bg-white focus-within:ring-2 focus-within:ring-blue-500">
                <span className="text-gray-700 pr-2 mr-2 border-r border-black">+91</span>
                <input
                  type="tel"
                  inputMode="numeric"
                  maxLength={10}
                  value={phone}
                  onChange={handlePhoneChange}
                  placeholder="Enter 10 digit mobile number"
                  className="w-full outline-none bg-transparent"
                  autoComplete="tel"
                  disabled={loading}
                  ref={phoneInputRef}
                />
              </div>
            </div>

            <button
              className="w-full bg-c4 text-white font-semibold py-2 rounded-lg hover:bg-c4 transition"
              onClick={handleSendOtp}
              disabled={loading}
            >
              {loading ? "Sending OTP..." : "Send OTP via WhatsApp"}
            </button>
          </>
        )}

        {error && (
          <p className="text-sm text-red-600 text-center mt-2">{error}</p>
        )}

        <button
          onClick={onClose}
          className="mt-4 w-full text-xs text-gray-500 hover:underline text-center"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}
