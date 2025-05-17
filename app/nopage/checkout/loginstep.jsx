"use client";
import { useEffect, useRef, useState } from "react";
import { Loader2 } from "lucide-react";

export default function LoginStep({ onNext }) {
  const [phone, setPhone] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showEditPhone, setShowEditPhone] = useState(false);
  const [canResend, setCanResend] = useState(false);


  const inputsRef = useRef([]);
  const phoneInputRef = useRef(null);

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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (!phoneNum.match(/^\d{10}$/)) {
        throw new Error("Invalid phone number");
      }

      setOtpSent(true);
      setShowEditPhone(false);
      setTimer(30);
      setCanResend(false);
      setOtp(["", "", "", ""]);
      inputsRef.current[0]?.focus();
      
    } catch (err) {
      setError(err.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTP = async () => {
    try {
      setLoading(true);
      setError("");
      const finalOTP = otp.join("");

      if (finalOTP.length !== 4) {
        throw new Error("Please enter complete OTP");
      }

      // Simulate verification
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (finalOTP !== "1234") { // Replace with actual verification
        throw new Error("Invalid OTP entered");
      }

      onNext(1, { phone });
    } catch (err) {
      setError(err.message);
      setOtp(["", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (otp.every(d => d !== "") && otp.length === 4) {
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

  const handleOtpChange = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    
    const updated = [...otp];
    updated[index] = value;
    setOtp(updated);
    setError("");

    if (value && index < 3) {
      inputsRef.current[index + 1].focus();
    } else if (!value && index > 0) {
      inputsRef.current[index - 1].focus();
    }
  };

  useEffect(() => {
    if (otpSent && timer === 0) {
      setCanResend(true);
    }
  }, [timer, otpSent]);
  

  return (
    <div className="space-y-5 px-1  mx-auto">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Verify with WhatsApp</h2>
        <p className="text-sm text-gray-600 mt-1">
          Enter your phone number. We&apos;ll send a secure 4-digit OTP via WhatsApp to verify.
        </p>
      </div>

      <div className="space-y-4">
        {(!otpSent || showEditPhone) && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
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
            <div className="flex items-center justify-between bg-gray-50  rounded-lg">
              <div>
                <p className="text-sm text-gray-700">
                  Sent to <span className="font-semibold">+91 {phone}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  WhatsApp message with 4-digit code
                </p>
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter OTP
              </label>
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

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-500">
                {timer > 0 ? `Resend OTP in ${timer}s` : "Didn't receive code?"}
              </span>
              <button
                onClick={() => sendOTP()}
                disabled={timer > 0 || loading}
                className={`text-blue-600 font-medium ${
                  timer > 0 ? "opacity-50 cursor-not-allowed" : "hover:underline"
                }`}
              >
                Resend OTP
              </button>
            </div>
          </div>
        )}

        {error && (
          <div className="text-red-600 text-sm flex items-center gap-2 mt-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
            </svg>
            {error}
          </div>
        )}
      </div>

      {loading && (
        <div className="flex justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-blue-600" />
        </div>
      )}
    </div>
  );
}