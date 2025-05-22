"use client";

import { useState, useEffect, useRef } from "react";
import { generateOTP } from "../../lib/otp";

export default function LoginStep({ onNext, defaultName = "", defaultPhone = "" }) {
  const [name, setName] = useState(defaultName);
  const [phone, setPhone] = useState(defaultPhone);
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef([]);
  const phoneInputRef = useRef(null);
  const otpRef = useRef("");

  useEffect(() => {
    const hasRedirected = sessionStorage.getItem("hasRedirected");
  
    if (!hasRedirected) {
      const storedUser = localStorage.getItem("user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        sessionStorage.setItem("hasRedirected", "true");
        onNext(1, userData); // Move to next step
      }
    }
  }, []);
  

  const handlePhoneChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    if (value.length <= 10) {
      setPhone(value);
      setError("");
    }
  };

  const sendOTP = async (phoneNum = phone) => {
    try {
      if (!name.trim()) {
        setError("Please enter your name.");
        return;
      }

      setLoading(true);
      setError("");

      if (!phoneNum.match(/^\d{10}$/)) {
        throw new Error("Invalid phone number");
      }

      const generatedOtp = generateOTP();
      otpRef.current = generatedOtp;

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

  const verifyOtp = async () => {
    const fullOtp = otp.join("");
    if (fullOtp !== otpRef.current) {
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

      localStorage.setItem("user", JSON.stringify({ name, phone }));
    } catch (err) {
      console.error("Login DB error:", err);
    }

    setError("");
    onNext(1, { name, phone });
  };

  useEffect(() => {
    if (otp.every((d) => d !== "") && otp.length === 6) {
      verifyOtp();
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


  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      e.preventDefault();
      const newOtp = [...otp];
      if (newOtp[index]) {
        newOtp[index] = "";
        setOtp(newOtp);
        inputsRef.current[index]?.focus();
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
        const prevOtp = [...otp];
        prevOtp[index - 1] = "";
        setOtp(prevOtp);
      }
    } else if (e.key.match(/^[0-9]$/)) {
      e.preventDefault();
      const newOtp = [...otp];
      newOtp[index] = e.key;
      setOtp(newOtp);
      if (index < 5) {
        inputsRef.current[index + 1]?.focus();
      }
    } else if (e.key !== "Tab") {
      e.preventDefault(); // block non-numeric keys except Tab
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

  
  
  return (
    <div className="space-y-5 px-1 mx-auto ">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Verify with WhatsApp</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter your name and phone number. We&apso;ll send a 6-digit OTP via WhatsApp to verify.
        </p>
      </div>

      {(!otpSent || showEditPhone) && (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full border border-gray-300 rounded-lg px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
              autoComplete="name"
              disabled={loading}
            />
          </div>

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
                autoComplete="tel"
                disabled={loading}
              />
            </div>
          </div>

          <button
            onClick={() => sendOTP()}
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Sending OTP..." : "Send OTP via WhatsApp"}
          </button>
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

          <p className="text-center text-sm text-gray-700 mb-2">
              Enter the 6-digit OTP sent to <strong>+91 {phone}</strong>
            </p>

            <div className="relative mb-3">
              {/* Hidden full OTP input for paste support */}
              <input
                type="text"
                inputMode="numeric"
                pattern="\d*"
                maxLength={6}
                value={otp.join("")}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "").slice(0, 6).split("");
                  setOtp([...val, ...Array(6 - val.length).fill("")]);
                }}
                className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
                aria-label="OTP input"
                autoFocus
              />

              {/* Display six digit boxes */}
              <div className="flex justify-center gap-2">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    onPaste={handlePaste}
                    ref={(el) => (inputsRef.current[i] = el)}
                    className={`w-10 h-12 text-center border text-xl font-medium rounded-md outline-none 
                      ${error ? "border-red-500 ring-red-200" : "border-gray-300"} 
                      ${otp[i] === "" && otp.slice(0, i).every((d) => d !== "") ? "border-blue-500 ring-2 ring-blue-200" : ""}
                      focus:ring-2 focus:ring-blue-400`}
                    
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