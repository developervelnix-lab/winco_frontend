import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import generateRandomToken from "@/utils/randomTokenGenerator";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { Navigate } from "react-router-dom";

const Login = ({ onSwitchToRegister, onClose }) => {
  const [loginMethod, setLoginMethod] = useState("mobile");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState(null); // State to manage toast messages

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000); // Automatically dismiss toast after 3 seconds
  };

  const handlePhoneChange = (e) => {
    let value = e.target.value.replace(/\D/g, "");
    setPhoneNumber(value);
    setError("");
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    setError("");
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setError("");
  };

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (value.length <= 6 && /^\d*$/.test(value)) {
      setOtp(value);
      setError("");
    }
  };

  const handleGetOtp = async () => {
    if (phoneNumber.length < 10) {
      setError("Please enter a valid phone number");
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
      console.log(data);
      if (data.status_code === "otp_error") {
        setError("We failed to send OTP! Please try again!");
        showToast("error", "Failed to send OTP. Please try again!");
      } else if (data.status_code === "otp_limit_error") {
        setError("You have reached the limit of OTP requests! Please try again later!");
        showToast("error", "OTP request limit reached. Please try later!");
      } else if (data.status_code === "success") {
        setOtpSent(true);
        setError("");
        showToast("success", "OTP sent successfully!");
      }
    } catch (error) {
      setError("Something went wrong! Please try again.");
      showToast("error", "Something went wrong. Please try again!");
      console.error("OTP Request Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    let loginData = {};

    if (loginMethod === "mobile") {
      if (!otpSent) {
        handleGetOtp();
        return;
      }

      if (otp.length !== 6) {
        setError("Please enter a valid 6-digit OTP");
        return;
      }
      loginData = {
        MOBILE: phoneNumber,
        USER_OTP: otp,
      };
    } else {
      if (!username) {
        setError("Please enter your username");
        return;
      }

      if (!password) {
        setError("Please enter your password");
        return;
      }

      loginData = {
        LOGIN_ID: username,
        LOGIN_PASSWORD: password,
      };
    }

    setIsLoading(true);
    try {
      const response = await fetch("https://api.ranamatch.com/router/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Route: "route-login",
          AuthToken: generateRandomToken(32),
        },
        body: JSON.stringify(loginData),
      });

      const result = await response.json();

      if (result.status_code === "success") {
        showToast("success", "Login Successful");
        sessionStorage.setItem("auth_secret_key", result.data[0].auth_secret_key);
        sessionStorage.setItem("account_id", result.data[0].account_id);
        if (onClose) onClose();
        Navigate('/')
      } else if (result.status_code === "password_error") {
        showToast("error", "Incorrect password. Please try again!");
      } else {
        showToast("error", "Login Failed. Please try again!");
      }
    } catch (error) {
      showToast("error", "Error during login. Please try again!");
      console.error("Login Error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-xs my-4">
        <div className="relative bg-white p-4 m-3 rounded-xl shadow-lg w-full max-w-sm border border-gray-200 overflow-hidden transition-all duration-300 mx-auto">
          <button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-800 hover:text-red-700 bg-white rounded-full p-1"
          >
            <FontAwesomeIcon icon={faTimes} className="w-5 h-5" />
          </button>
          <h2 className="text-2xl font-serif text-center mb-4 text-gray-800">
            Login
          </h2>
          <div className="flex mb-4 bg-gray-100 p-1 rounded-md">
            <button
              type="button"
              onClick={() => setLoginMethod("mobile")}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                loginMethod === "mobile"
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-red-50"
              }`}
            >
              Mobile Number
            </button>
            <button
              type="button"
              onClick={() => setLoginMethod("username")}
              className={`flex-1 py-2 text-xs font-medium rounded-md transition-colors ${
                loginMethod === "username"
                  ? "bg-red-600 text-white"
                  : "text-gray-600 hover:bg-red-50"
              }`}
            >
              Username
            </button>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            {loginMethod === "mobile" ? (
              <>
                <div className="group">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Mobile Number
                  </label>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <div className="flex items-center">
                      <span className="bg-gray-200 px-3 py-2 rounded-l-md border border-r-0 border-gray-300 text-sm">
                        +91
                      </span>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="w-full px-3 py-2 bg-white border border-gray-300 rounded-r-md rounded-l-none text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                        placeholder="9999999999"
                        disabled={otpSent}
                        required
                      />
                    </div>
                    {!otpSent && (
                      <button
                        type="button"
                        onClick={handleGetOtp}
                        disabled={isLoading}
                        className="w-full sm:w-auto px-3 py-2 rounded-md font-medium transition-all duration-300 bg-red-600 hover:bg-red-700 text-white text-sm"
                      >
                        {isLoading ? "Sending..." : "Get OTP"}
                      </button>
                    )}
                  </div>
                </div>

                {otpSent && (
                  <div className="group">
                    <label className="text-xs font-medium text-gray-600 mb-1 block">
                      Enter OTP
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={handleOtpChange}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                      placeholder="Enter 6-digit OTP"
                      maxLength={6}
                      required
                    />
                  </div>
                )}
              </>
            ) : (
              <>
                <div className="group">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={handleUsernameChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                    placeholder="Enter your username"
                    required
                  />
                </div>

                <div className="group">
                  <label className="text-xs font-medium text-gray-600 mb-1 block">
                    Password
                  </label>
                  <input
                    type="password"
                    value={password}
                    onChange={handlePasswordChange}
                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 transition-all text-sm"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </>
            )}

            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}

            <button
              type="submit"
              disabled={
                isLoading ||
                (loginMethod === "mobile" && otpSent && otp.length !== 6)
              }
              className="w-full py-2 mt-2 bg-red-600 hover:bg-red-700 text-white font-bold rounded-md transition-all duration-300 text-sm hover:scale-105 disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Login"}
            </button>
          </form>
          <div className="mt-4 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?
              <a onClick={onSwitchToRegister} className="text-red-600 hover:underline">
                Register
              </a>
            </p>
         
          </div>
        </div>
      </div>

    {/* Toast Container */}
{toast && (
  <div
    className="fixed top-4 right-4 sm:right-4 sm:w-auto w-full flex justify-center z-50"
  >
    <Toast className="flex items-center">
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

export default Login;