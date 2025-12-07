import React, { useState } from "react";
import { Link } from "react-router-dom";
import { RxEyeOpen } from "react-icons/rx";
import { LuEyeClosed } from "react-icons/lu";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setshowPassword] = useState(false);

  const fetchUser = async () => {
    try {
      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.status === 200) {
        localStorage.setItem(
          "user",
          JSON.stringify({ name: data.user.name, email: data.user.email })
        );
        window.location.href = "/dashboard";
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      console.error("Error logging in user:", err);
      setMessage("Server error. Try again.");
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    const { email, password } = formData;
    const newErr = {};
    if (!email) newErr.email = "Email is required";
    if (!password) newErr.password = "Password is required";
    else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/.test(password))
      newErr.password =
        "Password must be 8+ chars, include upper, lower, number & special char";

    setError(newErr);
    if (Object.keys(newErr).length > 0) return;

    setLoading(true);
    await fetchUser();
    setLoading(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (value.trim() !== "") {
      setError((prev) => ({ ...prev, [name]: "" }));
    }
  };

  return (
    <div className="flex justify-center items-center h-screen ">
      <div className="bg-white p-8 rounded-sm shadow-sm w-[360px]">
        <h2 className="text-2xl font-semibold text-center mb-4">Login</h2>

        <form className="flex flex-col space-y-4" onSubmit={onSubmit}>
          <div className="flex flex-col">
            <label className="text-gray-700 text-sm mb-1">Email</label>
            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
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

            {loading ? "Please wait..." : "Log In"}
          </button>
        </form>

        <p className="text-sm text-center mt-4">
          Don't have an account?{" "}
          <Link to="/" className="text-blue-500 hover:underline">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
