"use client";

import { useState, useEffect } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebaseConfig.js";
import { useRouter } from "next/navigation";

export default function PhoneAuth() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [confirmationResult, setConfirmationResult] = useState(null);
    const [message, setMessage] = useState("");
    const router = useRouter();

    useEffect(() => {
        // Ensure reCAPTCHA is created only once
        if (!window.recaptchaVerifier) {
            window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
                size: "invisible",
                callback: (response) => {
                    console.log("reCAPTCHA Verified!");
                },
                'expired-callback': () => {
                    setMessage("reCAPTCHA expired. Please try again.");
                }
            });
        }
    }, []);

    const sendOTP = async () => {
        if (phone.length !== 10) {
            setMessage("Enter a valid 10-digit phone number");
            return;
        }

        setMessage("Sending OTP...");
        const fullPhone = `+91${phone}`;

        try {
            const appVerifier = window.recaptchaVerifier;
            const result = await signInWithPhoneNumber(auth, fullPhone, appVerifier);
            setConfirmationResult(result);
            setMessage("OTP Sent! Please check your phone.");
        } catch (error) {
            setMessage(`Error: ${error.message}`);
        }
    };

    const verifyOTP = async () => {
        if (!otp || !confirmationResult) {
            setMessage("Please enter OTP");
            return;
        }

        try {
            const result = await confirmationResult.confirm(otp);
            setMessage("Phone Number Verified Successfully!");
            console.log("User Info:", result.user);
            router.push("/dashboard"); // Redirect after successful login
        } catch (error) {
            setMessage("Invalid OTP. Please try again.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                <h1 className="text-2xl font-bold text-center mb-4">Phone Authentication</h1>

                <div id="recaptcha-container"></div> {/* Important */}

                <div className="mb-4">
                    <input
                        type="text"
                        placeholder="Enter Phone Number (10 digits)"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full px-4 py-2 border rounded-md"
                    />
                    <button
                        onClick={sendOTP}
                        className="mt-3 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600"
                    >
                        Send OTP
                    </button>
                </div>

                {confirmationResult && (
                    <div className="mt-4">
                        <input
                            type="text"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                            className="w-full px-4 py-2 border rounded-md"
                        />
                        <button
                            onClick={verifyOTP}
                            className="mt-3 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
                        >
                            Verify OTP
                        </button>
                    </div>
                )}

                {message && <p className="text-center mt-3 text-red-500">{message}</p>}
            </div>
        </div>
    );
}
