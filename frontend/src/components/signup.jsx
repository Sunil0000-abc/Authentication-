import React, { useState } from "react";
import OtpValidation from "./optvalidation";
import { Link } from "react-router-dom";
import { RxEyeOpen } from "react-icons/rx";
import { LuEyeClosed } from "react-icons/lu";

const SignUp = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState({});
  const [showOtp, setShowOtp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setshowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
    setMessage("");
  };

  const createUser = async (data) => {
    try {
      const response = await fetch("https://authentication-d6vh.vercel.app/auth/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        setShowOtp(true);
      } else {
        setMessage(result.message);
      }
    } catch (err) {
      console.error("Error creating user:", err);
      setMessage("Server error. Try again.");
    }finally {
      setLoading(false);
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { name, email, password } = formData;
    const newErr = {};
    if (!name) newErr.name = "Name is required";
    else if (!/^[a-zA-Z ]{3,30}$/.test(name))
      newErr.name = "Name must be 3-30 letters";
    if (!email) newErr.email = "Email is required";
    if (!password) newErr.password = "Password is required";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
      newErr.password =
        "Password must be 8+ chars, include upper, lower, number & special char";

    setError(newErr);
    if (Object.keys(newErr).length > 0) return;

    setLoading(true);
    await createUser(formData);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      {!showOtp ? (
        <div className="bg-white p-8 rounded-sm shadow-sm w-[360px]">
          <h2 className="text-2xl font-semibold text-center mb-4">Sign Up</h2>

          <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter name"
                className={`border p-2 rounded-md focus:outline-none focus:ring-1 ${
                  error.name
                    ? "border-red-500 ring-red-300"
                    : "border-gray-300 ring-black"
                }`}
              />
              {error.name && (
                <p className="text-red-500 text-xs mt-1">{error.name}</p>
              )}
            </div>

            <div className="flex flex-col">
              <label className="text-gray-700 text-sm mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
                className={`border p-2 rounded-md focus:outline-none focus:ring-1 ${
                  error.email
                    ? "border-red-500 ring-red-300"
                    : "border-gray-300 ring-black"
                }`}
              />
              {error.email && (
                <p className="text-red-500 text-xs mt-1">{error.email}</p>
              )}
            </div>

            <div className="flex flex-col w-full">
              <label className="text-gray-700 text-sm mb-1">Password</label>

              <div className="relative w-full">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter password"
                  className={`border p-2 pr-10 rounded-md w-full focus:outline-none focus:ring-1 ${
                    error.password
                      ? "border-red-500 ring-red-300"
                      : "border-gray-300 ring-black"
                  }`}
                />

                <span
                  className="absolute right-2 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500"
                  onClick={() => setshowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <LuEyeClosed size={20} />
                  ) : (
                    <RxEyeOpen size={20} />
                  )}
                </span>
              </div>

              {error.password && (
                <p className="text-red-500 text-xs mt-1">{error.password}</p>
              )}
            </div>

            {message && (
              <p className="text-red-500 text-sm text-center">{message}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded-sm text-white font-semibold text-sm flex items-center justify-center gap-2
    ${
      loading
        ? "bg-gray-700 opacity-60 cursor-not-allowed"
        : "bg-black hover:bg-gray-800"
    }`}
            >
              {loading && (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              )}

              {loading ? "Creating Account..." : "Sign UP"}
            </button>
          </form>

          <p className="text-sm text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">
              Login
            </Link>
          </p>
        </div>
      ) : (
        <OtpValidation email={formData.email} />
      )}
    </div>
  );
};

export default SignUp;
