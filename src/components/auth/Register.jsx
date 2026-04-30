import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import generateRandomToken from "@/utils/randomTokenGenerator";
import { Toast } from "flowbite-react";
import { HiCheck, HiX } from "react-icons/hi";
import { API_URL } from "@/utils/constants";
import { useColors } from '../../hooks/useColors';
import { FONTS } from '../../constants/theme';

const Register = ({ onSwitchToLogin, onClose }) => {
  const COLORS = useColors();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [successView, setSuccessView] = useState(false);
  const [toast, setToast] = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3000);
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

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleGetOtp = async () => {
    if (!isValidPhoneNumber(phoneNumber)) {
      setOtpError("Please enter a valid 10-digit phone number");
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch(API_URL + "?Route=route-send-sms", {
        method: "POST",
        mode: "cors",
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
        setOtpError("You have reached the limit of OTP requests! Please try again later!");
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
      const fetchUrl = `${API_URL}?Route=route-create-account&AuthToken=${encodeURIComponent(generateRandomToken(32))}&_t=${Date.now()}`;
      console.log("🚀 [Register] Attempting registration...", { url: fetchUrl });

      const response = await fetch(fetchUrl, {
        method: "POST",
        mode: "cors",
        headers: {
          "Content-Type": "application/json",
          Route: "route-create-account",
          AuthToken: generateRandomToken(32),
        },
        body: JSON.stringify({
          SIGNUP_MOBILE: phoneNumber,
          SIGNUP_USERNAME: username,
          SIGNUP_PASSWORD: password,
          SIGNUP_OTP: otp,
          SIGNUP_INVITE_CODE: referralCode || "",
        }),
      });

      const data = await response.json();
      console.log("✅ [Register] API Response:", data);

      if (data.status_code === "success") {
        localStorage.setItem("auth_secret_key", data.data[0].auth_secret_key);
        localStorage.setItem("account_id", data.data[0].account_id);
        
        console.log("🔑 [Register] Session stored. Dispatching refresh...");
        // Trigger global data refresh for same-tab components
        window.dispatchEvent(new Event('site-data-refresh'));
        
        setSuccessView(true);
        setTimeout(() => {
          if (onClose) onClose();
        }, 2500);
      } else if (data.status_code === "already_registered") {
        showToast("error", "Already registered! Please login.");
      } else if (data.status_code === "username_exists") {
        showToast("error", "Username already exists! Please choose another.");
      } else {
        showToast("error", data.message || "Registration failed! Please try again.");
      }
    } catch (error) {
      console.error("❌ [Register] Request Error:", error);
      showToast("error", "Something went wrong! Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="mx-auto w-full max-w-sm my-4 px-4">
        <div 
          className="relative p-5 rounded-2xl shadow-2xl w-full border border-black/10 dark:border-white/10 overflow-hidden transition-all duration-300 mx-auto"
          style={{ backgroundColor: COLORS.bg2, backdropFilter: 'blur(10px)' }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-black/60 dark:text-white/60 hover:text-black dark:text-white bg-black/5 dark:bg-white/5 hover:bg-gray-100 dark:bg-white/10 rounded-full p-1.5 transition-all z-20"
          >
            <FontAwesomeIcon icon={faTimes} className="w-3.5 h-3.5" />
          </button>

          {successView ? (
            <div className="text-center py-8 animate-fade-in relative z-10">
              <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-green-500/10 mb-6 relative">
                <div className="absolute inset-0 rounded-full bg-green-500/20 animate-ping"></div>
                <svg className="h-12 w-12 text-green-500 z-10 animate-[bounce_1s_ease-in-out_infinite]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-black uppercase tracking-wider mb-2 text-black dark:text-white" style={{ fontFamily: FONTS.display }}>
                Registration <span className="text-green-500">Successful!</span>
              </h2>
              <p className="text-xs mb-8 text-black/60 dark:text-white/60" style={{ fontFamily: FONTS.ui }}>
                Your account is ready. Time to start winning!
              </p>
              <button
                onClick={onClose}
                className="w-full py-3 text-white font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 text-xs hover:scale-[1.02] shadow-xl"
                style={{ background: COLORS.brandGradient, fontFamily: FONTS.head }}
              >
                Continue →
              </button>
            </div>
          ) : (
            <>
              {/* Logo/Title Area */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-black uppercase tracking-wider mb-1" style={{ color: COLORS.text, fontFamily: FONTS.display }}>
                  Create <span style={{ color: COLORS.brand }}>Account</span>
                </h2>
                <p className="text-[10px]" style={{ color: COLORS.muted, fontFamily: FONTS.ui }}>
                  Join us and start your winning journey!
                </p>
              </div>

              <div 
                className="space-y-4 relative z-10"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    if (!(isLoading || otp.length !== 6 || !password || !confirmPassword || passwordError || !username)) {
                      handleRegister(e);
                    }
                  }
                }}
              >
                <div className="flex items-center gap-3">
                  <label className="w-1/3 text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest block" style={{ fontFamily: FONTS.head }}>
                    Mobile
                  </label>
                  <div className="flex-grow flex gap-2">
                    <div className="flex-grow relative group">
                      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                        <span className="text-xs font-bold" style={{ color: COLORS.brand }}>+91</span>
                      </div>
                      <input
                        type="tel"
                        value={phoneNumber}
                        onChange={handlePhoneChange}
                        className="w-full pr-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all text-xs shadow-inner"
                        placeholder="9999999999"
                        disabled={otpSent}
                        required
                        style={{ fontFamily: FONTS.ui, paddingLeft: '45px' }}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={handleGetOtp}
                      disabled={isLoading || otpSent}
                      className={`px-3 py-2 rounded-xl font-bold uppercase tracking-widest transition-all duration-300 shadow-lg whitespace-nowrap text-[10px] ${
                        otpSent ? "bg-black/5 dark:bg-white/10 text-black/40 dark:text-white/40" : "text-white"
                      }`}
                      style={{ 
                        background: otpSent ? 'transparent' : COLORS.brandGradient,
                        fontFamily: FONTS.head 
                      }}
                    >
                      {isLoading ? "..." : otpSent ? "SENT" : "Get OTP"}
                    </button>
                  </div>
                </div>
                {otpError && (
                  <div className="bg-red-500/10 border border-red-500/20 py-1.5 px-3 rounded-lg">
                    <p className="text-red-500 text-[10px] text-center font-medium">{otpError}</p>
                  </div>
                )}

                {otpSent && (
                  <div className="space-y-3 animate-fade-in">
                    <div className="flex items-center gap-3">
                      <label className="w-1/3 text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest block" style={{ fontFamily: FONTS.head }}>
                        Username
                      </label>
                      <input
                        type="text"
                        value={username}
                        onChange={handleUsernameChange}
                        className="flex-grow px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all text-xs shadow-inner"
                        placeholder="Create username"
                        required
                        style={{ fontFamily: FONTS.ui }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="w-1/3 text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest block" style={{ fontFamily: FONTS.head }}>
                        OTP Code
                      </label>
                      <input
                        type="text"
                        value={otp}
                        onChange={handleOtpChange}
                        className="flex-grow px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all text-xs tracking-[0.2em] text-center font-bold shadow-inner"
                        placeholder="••••••"
                        maxLength={6}
                        required
                        style={{ fontFamily: FONTS.ui }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="w-1/3 text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest block" style={{ fontFamily: FONTS.head }}>
                        Password
                      </label>
                      <input
                        type="password"
                        value={password}
                        onChange={handlePasswordChange}
                        className="flex-grow px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all text-xs shadow-inner"
                        placeholder="Create password"
                        required
                        style={{ fontFamily: FONTS.ui }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="w-1/3 text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest block" style={{ fontFamily: FONTS.head }}>
                        Confirm
                      </label>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="flex-grow px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all text-xs shadow-inner"
                        placeholder="Confirm password"
                        required
                        style={{ fontFamily: FONTS.ui }}
                      />
                    </div>

                    <div className="flex items-center gap-3">
                      <label className="w-1/3 text-[10px] font-bold text-black/50 dark:text-white/50 uppercase tracking-widest block" style={{ fontFamily: FONTS.head }}>
                        Referral
                      </label>
                      <input
                        type="text"
                        value={referralCode}
                        onChange={handleReferralChange}
                        className="flex-grow px-3 py-2 bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 rounded-xl text-black dark:text-white placeholder-black/30 dark:placeholder-white/20 focus:outline-none focus:ring-1 focus:ring-brand focus:border-brand transition-all text-xs shadow-inner"
                        placeholder="Bonus code (Optional)"
                        style={{ fontFamily: FONTS.ui }}
                      />
                    </div>

                    {passwordError && (
                      <div className="bg-red-500/10 border border-red-500/20 py-1.5 px-3 rounded-lg">
                        <p className="text-red-500 text-[10px] text-center font-medium">{passwordError}</p>
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={handleRegister}
                      disabled={isLoading || otp.length !== 6 || !password || !confirmPassword || passwordError || !username}
                      className="w-full py-3 mt-1 text-white font-black uppercase tracking-[0.2em] rounded-xl transition-all duration-300 text-xs hover:scale-[1.02] active:scale-[0.98] shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed group"
                      style={{ background: COLORS.brandGradient, fontFamily: FONTS.head }}
                    >
                      <span className="flex items-center justify-center gap-2">
                        {isLoading ? "Processing..." : "REGISTER NOW"}
                        {!isLoading && (
                          <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        )}
                      </span>
                    </button>
                  </div>
                )}
              </div>

              <div className="mt-6 text-center border-t border-black/5 dark:border-white/5 pt-4">
                <p className="text-[10px]" style={{ color: COLORS.muted, fontFamily: FONTS.ui }}>
                  Already registered?{" "}
                  <button 
                    onClick={onSwitchToLogin} 
                    className="font-bold hover:underline transition-all"
                    style={{ color: COLORS.brand }}
                  >
                    LOGIN HERE
                  </button>
                </p>
              </div>
            </>
          )}
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
