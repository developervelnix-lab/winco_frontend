import React, { useState } from "react";
import { Eye, EyeOff, Lock, X } from "lucide-react";
import { Toast } from "flowbite-react";
import { API_URL } from "@/utils/constants";

const PasswordChangeForm = () => {
  const authSecretKey = sessionStorage.getItem('auth_secret_key');
  const userId = sessionStorage.getItem('account_id');

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState({
    oldPassword: false,
    newPassword: false,
    confirmPassword: false,
  });
  const [toast, setToast] = useState({ message: "", type: "", visible: false });

  const togglePasswordVisibility = (field) => {
    setShowPassword((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const changePassword = async () => {
    if (!authSecretKey) {
      setToast({ message: "Authentication failed. Please log in.", type: "error", visible: true });
      return;
    }

    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'AuthToken': authSecretKey,
          'Route': 'route-change-password'
        },
        body: JSON.stringify({
          "USER_ID": userId,
          "OLD_PASSWORD": formData.oldPassword,
          "NEW_PASSWORD": formData.newPassword
        })
      });

      const result = await response.json();

      if (result.status_code == "success") {
        setToast({ message: "Password changed successfully!", type: "success", visible: true });
        setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
      } else if (result.status_code == "authorization_error") {
        setToast({ message: "Please login again.", type: "error", visible: true });
      } else if (result.status_code == "password_error") {
        setToast({ message: "Incorrect old password. Please try again.", type: "error", visible: true });
      } else {
        setToast({ message: "Failed to change password. Please try again.", type: "error", visible: true });
      }
    } catch (error) {
      setToast({ message: "Network error. Please check your connection.", type: "error", visible: true });
    }
  };

  const handleSubmit = () => {
    if (formData.newPassword !== formData.confirmPassword) {
      setToast({ message: "Passwords do not match.", type: "error", visible: true });
      return;
    }
    changePassword();
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-xl shadow-md relative">
      {toast.visible && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50">
          <Toast className={`w-[90vw] md:w-[400px] ${toast.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
            <div className="flex items-center justify-between w-full">
              <span>{toast.message}</span>
              <button onClick={() => setToast({ ...toast, visible: false })} className="ml-4">
                <X size={18} />
              </button>
            </div>
          </Toast>
        </div>
      )}

      <h2 className="text-lg font-semibold mb-4">Change Password</h2>

      <div className="space-y-4">
        {[
          { label: "Old Password", name: "oldPassword" },
          { label: "New Password", name: "newPassword" },
          { label: "Confirm Password", name: "confirmPassword" },
        ].map(({ label, name }) => (
          <div key={name}>
            <label className="block text-sm font-medium mb-1">{label}</label>
            <div className="relative">
              <span className="absolute inset-y-0 left-3 flex items-center text-gray-400">
                <Lock size={16} />
              </span>
              <input
                type={showPassword[name] ? "text" : "password"}
                name={name}
                value={formData[name]}
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border rounded-md bg-gray-50 focus:ring-2 focus:ring-red-400"
                placeholder={label}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                onClick={() => togglePasswordVisibility(name)}
              >
                {showPassword[name] ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between mt-6">
        <button
          className="px-4 py-2 border border-red-500 text-red-500 rounded-md hover:bg-red-100"
          onClick={() => setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" })}
        >
          Cancel
        </button>
        <button
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          onClick={handleSubmit}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default PasswordChangeForm;
