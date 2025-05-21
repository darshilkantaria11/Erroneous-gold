"use client";

import { useState, useEffect, useRef } from "react";
import { generateOTP } from "../../lib/otp"; // or inline the function

export default function LoginStep({ onNext }) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef([]);
  const phoneInputRef = useRef(null);
  const otpRef = useRef(""); // to store generated OTP safely in-memory

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
      setError("");
      if (value.length === 10 && !otpSent) {
        sendOTP(value);
      }
    }
  };

  const sendOTP = async (phoneNum = phone) => {
    try {
      setLoading(true);
      setError("");

      if (!phoneNum.match(/^\d{10}$/)) {
        throw new Error("Invalid phone number");
      }

      const generatedOtp = generateOTP();
      otpRef.current = generatedOtp; // save OTP in memory for verification

      const res = await fetch("/api/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: phoneNum, otp: generatedOtp }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to send OTP");

      setOtpSent(true);
      setShowEditPhone(false);
      setTimer(30);
      setCanResend(false);
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = () => {
    setError("");
    const enteredOtp = otp.join("");
    if (enteredOtp.length !== 6) {
      setError("Please enter complete 6-digit OTP");
      return;
    }
    if (enteredOtp !== otpRef.current) {
      setError("Invalid OTP entered");
      setOtp(Array(6).fill(""));
      inputsRef.current[0]?.focus();
      return;
    }
    onNext(1, { phone });
  };

  useEffect(() => {
    if (otp.every((d) => d !== "") && otp.length === 6) {
      verifyOTP();
    }
  }, [otp]);

  useEffect(() => {
    if (!otpSent || timer === 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [otpSent, timer]);

  useEffect(() => {
    if (otpSent && timer === 0) {
      setCanResend(true);
    }
  }, [timer, otpSent]);

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;

    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setError("");

    if (value && index < 5) {
      inputsRef.current[index + 1].focus();
    } else if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  return (
    <div className="space-y-5 px-1 mx-auto max-w-sm">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Verify with WhatsApp</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter your phone number. We'll send a secure 6-digit OTP via WhatsApp to verify.
        </p>
      </div>

      {(!otpSent || showEditPhone) && (
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
          <div className="flex items-center border border-gray-300 rounded-lg px-3 py-2 bg-white focus-within:ring-2 focus-within:ring-blue-500">
            <span className="text-gray-700 pr-2 mr-2 border-r border-black">+91</span>
            <input
              ref={phoneInputRef}
              type="tel"
              inputMode="numeric"
              maxLength={10}
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter 10 digit mobile number"
              className="w-full outline-none bg-transparent"
              disabled={loading}
            />
          </div>
        </div>
      )}

      {otpSent && !showEditPhone && (
        <div className="space-y-4">
          <div className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3">
            <div>
              <p className="text-sm text-gray-700">
                Sent to <span className="font-semibold">+91 {phone}</span>
              </p>
              <p className="text-xs text-gray-500 mt-1">WhatsApp message with 6-digit code</p>
            </div>
            <button
              onClick={() => {
                setShowEditPhone(true);
                phoneInputRef.current?.focus();
              }}
              className="text-blue-600 text-sm hover:underline font-medium"
            >
              Change
            </button>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Enter OTP</label>
            <div className="flex gap-2 justify-center">
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleOtpChange(idx, e.target.value)}
                  ref={(el) => (inputsRef.current[idx] = el)}
                  className={`w-12 h-12 text-center text-xl border rounded-lg transition-all
                    ${error ? "border-red-500 shake" : "border-gray-300"}
                    focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  disabled={loading}
                />
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between text-sm px-1">
            <span className="text-gray-500">{timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code?"}</span>
            <button
              disabled={!canResend || loading}
              onClick={() => sendOTP()}
              className={`text-blue-600 font-semibold ${!canResend ? "opacity-50 cursor-not-allowed" : "hover:underline"}`}
            >
              Resend OTP
            </button>
          </div>

          {error && <p className="text-red-600 text-center mt-1">{error}</p>}
        </div>
      )}
    </div>
  );
}
