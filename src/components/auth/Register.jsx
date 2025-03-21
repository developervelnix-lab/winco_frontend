import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import generateRandomToken from "@/utils/randomTokenGenerator";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";

const Register = ({ onSwitchToLogin, onClose }) => {
  const [phoneNumber, setPhoneNumber] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null); // State to manage toast messages

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000); // Automatically dismiss toast after 3 seconds
  };

  const isValidPhoneNumber = (number) => /^\d{10}$/.test(number);

  const handlePhoneChange = (e) => {
    setPhoneNumber(e.target.value);
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOtp(value);
      setOtpError("");
    }
  };

  const validatePasswords = (pass, confirmPass) => {
    if (!pass || !confirmPass) return "";
    return pass !== confirmPass ? "Passwords do not match" : "";
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordError(validatePasswords(e.target.value, confirmPassword));
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordError(validatePasswords(password, e.target.value));
  };

  const handleReferralChange = (e) => {
    setReferralCode(e.target.value);
  };

  const handleGetOtp = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setOtpError("Please enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("https://api.ranamatch.com/router/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Route: "route-send-sms",
          AuthToken: generateRandomToken(32),
        },
        body: JSON.stringify({ SMS_MOBILE: phoneNumber }),
      });

      const data = await response.json();

      if (data.status_code === "otp_error") {
        setOtpError("We failed to send OTP! Please try again!");
        showToast("error", "Failed to send OTP. Please try again!");
      } else if (data.status_code === "otp_limit_error") {
        setOtpError(
          "You have reached the limit of OTP requests! Please try again later!"
        );
        showToast("error", "OTP request limit reached. Please try later!");
      } else if (data.status_code === "success") {
        setOtpSent(true);
        setIsLoading(false);
        setOtpError("");
        showToast("success", "OTP sent successfully!");
      }
    } catch (error) {
      setOtpError("Something went wrong! Please try again.");
      showToast("error", "Something went wrong. Please try again!");
      console.error("OTP Request Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (!otp || otp.length !== 6) {
      setOtpError("Please enter a valid 6-digit OTP");
      return;
    }
    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      return;
    }

    try {
      const response = await fetch("https://api.ranamatch.com/router/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Route: "route-create-account",
          AuthToken: generateRandomToken(32),
        },
        body: JSON.stringify({
          SIGNUP_MOBILE: phoneNumber,
          SIGNUP_PASSWORD: password,
          SIGNUP_OTP: otp,
          SIGNUP_INVITE_CODE: referralCode || "",
        }),
      });

      const data = await response.json();
      console.log(data);

      if (data.status_code === "success") {
        showToast("success", "Registration successful!");
        sessionStorage.setItem("auth_secret_key", data.data[0].auth_secret_key);
        sessionStorage.setItem("account_id", data.data[0].account_id);
        if (onClose) onClose();
      } else if (data.status_code === "already_registered") {
        showToast("error", "Already registered! Please login.");
      } else {
        showToast("error", "Registration failed! Please try again.");
      }
    } catch (error) {
      showToast("error", "Something went wrong! Please try again.");
      console.error("Registration Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-xs my-4">
        <div className="relative bg-white p-4 rounded-lg shadow-lg w-full border border-gray-200 overflow-hidden">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-800 hover:text-red-700 bg-white rounded-full p-1"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
          <h2 className="text-xl font-serif text-center mb-4 text-gray-800">
            Create Account
          </h2>
          <form onSubmit={handleRegister} className="space-y-3 relative z-10">
            <div className="group">
              <label className="text-xs font-medium text-gray-600 mb-1 block">
                Mobile Number
              </label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-grow flex">
                  <span className="flex-1 px-4 py-4 bg-gray-200 border border-r-0 border-gray-300 rounded-l-md text-gray-800 text-sm">
                    +91
                  </span>
                  <input
                    type="tel"
                    value={phoneNumber}
                    onChange={handlePhoneChange}
                    className="flex-grow px-3 py-2 bg-white border border-gray-300 rounded-r-md text-gray-800 focus:ring-1 focus:ring-red-600 transition-all text-sm"
                    placeholder="9876543210"
                    disabled={otpSent}
                    required
                  />
                </div>
                <button
                  type="button"
                  onClick={handleGetOtp}
                  disabled={isLoading || otpSent}
                  className={`px-3 py-2 rounded-md font-medium transition-all duration-300 text-sm ${
                    otpSent
                      ? "bg-red-600 text-white"
                      : "bg-red-600 text-white hover:bg-red-700"
                  }`}
                >
                  {isLoading ? "Sending..." : otpSent ? "OTP Sent" : "Get OTP"}
                </button>
              </div>
              {otpError && (
                <p className="text-red-600 text-xs mt-1">{otpError}</p>
              )}
            </div>
            {otpSent && (
              <>
                <div className="group">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Enter OTP
                  </label>
                  <input
                    type="number"
                    value={otp}
                    onChange={handleOtpChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-1 focus:ring-red-500 transition-all text-sm"
                    placeholder="Enter 6-digit OTP"
                    required
                  />
                </div>
                <div className="group">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Create Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-1 focus:ring-red-500 transition-all text-sm"
                    placeholder="Create a secure password"
                    required
                  />
                </div>
                <div className="group">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-1 focus:ring-red-600 transition-all text-sm"
                    placeholder="Confirm your password"
                    required
                  />
                  {passwordError && (
                    <p className="text-red-600 text-xs mt-1">{passwordError}</p>
                  )}
                </div>
                <div className="group">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Referral Code{" "}
                    <span className="text-gray-500">(Optional)</span>
                  </label>
                  <input
                    type="text"
                    value={referralCode}
                    onChange={handleReferralChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:ring-1 focus:ring-red-500 transition-all text-sm"
                    placeholder="Enter referral code if you have one"
                  />
                  <p className="text-gray-500 text-xs mt-1">
                    Get ₹100 bonus when you use a referral code
                  </p>
                </div>
                <button
                  type="submit"
                  disabled={
                    isLoading ||
                    otp.length !== 6 ||
                    !password ||
                    !confirmPassword ||
                    passwordError
                  }
                  className="w-full py-2 mt-2 bg-red-600 text-white font-bold rounded-md transition-all text-sm hover:bg-red-700 hover:scale-105 disabled:opacity-50"
                >
                  {isLoading ? "Processing..." : "Register"}
                </button>
              </>
            )}
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={onSwitchToLogin}
                className="text-red-600 hover:underline"
              >
                Login
              </button>
            </p>
          </div>
        </div>
      </div>

     {/* Toast Container */}
{toast && (
  <div
    className="fixed top-4 right-4 sm:w-auto w-full flex sm:justify-end justify-center z-50"
  >
    <Toast>
      {/* Icon */}
      <div
        className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${
          toast.type === "success"
            ? "bg-green-100 text-green-700"
            : "bg-red-100 text-red-700"
        }`}
      >
        {toast.type === "success" ? (
          <HiCheck className="h-5 w-5" />
        ) : (
          <HiX className="h-5 w-5" />
        )}
      </div>

      {/* Message */}
      <div className="ml-3 text-sm font-normal">{toast.message}</div>

      {/* Dismiss Button */}
      <Toast.Toggle onDismiss={() => setToast(null)} />
    </Toast>
  </div>
)}

    </>
  );
};

export default Register;