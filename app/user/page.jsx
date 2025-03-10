"use client";
import { useState } from "react";
import { auth, RecaptchaVerifier, signInWithPhoneNumber } from "../../firebaseConfig.js";

export default function OTPLogin() {
    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [verificationId, setVerificationId] = useState("");
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const setupRecaptcha = () => {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, "recaptcha-container", {
            size: "invisible",
            callback: (response) => console.log("Recaptcha verified"),
        });
    };

    const sendOTP = async () => {
        if (!phone) return alert("Enter a valid phone number");
        setLoading(true);
        setupRecaptcha();

        try {
            const confirmation = await signInWithPhoneNumber(auth, phone, window.recaptchaVerifier);
            setVerificationId(confirmation.verificationId);
            alert("OTP sent to " + phone);
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const verifyOTP = async () => {
        if (!otp) return alert("Enter OTP");

        try {
            const credential = window.firebase.auth.PhoneAuthProvider.credential(verificationId, otp);
            await auth.signInWithCredential(credential);
            setSuccess(true);
            alert("Phone number verified!");
        } catch (error) {
            alert("Invalid OTP");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
            <div className="bg-white p-8 shadow-lg rounded-lg w-full max-w-md">
                <h2 className="text-xl font-semibold text-gray-700 mb-4">Phone Login</h2>

                <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded mb-3"
                    placeholder="+91XXXXXXXXXX"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />
                <button
                    className="w-full bg-blue-500 text-white p-2 rounded"
                    onClick={sendOTP}
                    disabled={loading}
                >
                    {loading ? "Sending OTP..." : "Send OTP"}
                </button>

                <div id="recaptcha-container"></div>

                {verificationId && (
                    <>
                        <input
                            type="text"
                            className="w-full p-2 border border-gray-300 rounded mt-4"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button className="w-full bg-green-500 text-white p-2 rounded mt-2" onClick={verifyOTP}>
                            Verify OTP
                        </button>
                    </>
                )}

                {success && <p className="text-green-600 mt-4">✅ Verified Successfully!</p>}
            </div>
        </div>
    );
}
