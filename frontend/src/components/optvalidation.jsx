import React, { useRef, useState, useEffect } from "react";

const OtpValidation = ({ email }) => {
  const [OTP, setOTP] = useState(new Array(4).fill(""));
  const inputRef = useRef([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [otpStatus, setOtpStatus] = useState(null);

  const [resendTimer, setResendTimer] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);

  useEffect(() => {
    let timer;
    if (resendTimer > 0) {
      timer = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendTimer]);

  const verifyOtp = async () => {
    const otp = OTP.join("");
    if (otp.length < 4) {
      setMessage("Please enter the complete OTP");
      setOtpStatus("error");
      return;
    }
    try {
      const response = await fetch("https://authentication-n46c.vercel.app/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      console.log(response);
      const data = await response.json();
      if (response.ok) {
        setOtpStatus("success");
        window.location = "/login";
      } else {
        setOtpStatus("error");
        setMessage(data.message);
      }
    } catch (err) {
      setOtpStatus("error");
      setMessage("Server error. Try again.");
      console.log(err);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);
    try {
      const response = await fetch("https://authentication-n46c.vercel.app/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();
      console.log(data);
      
      if (response.ok) {
        setMessage("OTP resent successfully!");
        setOtpStatus(null);
        setOTP(["", "", "", ""]);
        setResendTimer(30);
      } else {
        setMessage(data.message);
      }
    } catch (err) {
      setMessage("Server error. Try again.");
      console.log(err);
    }finally{
      setResendLoading(false);
      setOtpStatus("success");
    }
    
  };

  const handleChange = async(i, e) => {
    const value = e.target.value;
    if (isNaN(value)) return;

    const newOtp = [...OTP];
    newOtp[i] = value.substring(value.length - 1);
    setOTP(newOtp);

    if (value && i < 3 && inputRef.current[i + 1]) {
      inputRef.current[i + 1].focus();
    }

    
    setMessage("");
    setOtpStatus(null);
  };

  useEffect(() => {
    const code = OTP.join("");
    console.log("njsn");
    
    const autoverify = async () => {
      if (code.length === 4) {
        setLoading(true);
        await verifyOtp();
        setLoading(false);
      } else {
        setOtpStatus(null);
      }
    };

    autoverify();
  }, [OTP]);

  const handleClick = (i) => {
    const firstEmpty = OTP.indexOf("");
    if (i > 0 && !OTP[i - 1] && inputRef.current[firstEmpty]) {
      inputRef.current[firstEmpty].focus();
    }
  };

  const handleBackspace = (e, i) => {
    if (e.key === "Backspace" && i > 0 && !OTP[i]) {
      inputRef.current[i - 1].focus();
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    await verifyOtp();
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-white p-8 rounded-sm shadow-sm w-[360px] text-center">
        <h2 className="text-xl font-semibold mb-2">Verify Your Email</h2>
        <p className="text-sm text-gray-600 mb-6">
          Enter the 4-digit code sent to your email
        </p>

        <div className="flex justify-center mb-3">
          {OTP.map((itm, i) => (
            <input
              key={i}
              type="text"
              maxLength={1}
              value={itm}
              disabled={loading}
              onChange={(e) => handleChange(i, e)}
              ref={(el) => (inputRef.current[i] = el)}
              onClick={() => handleClick(i)}
              onKeyDown={(e) => handleBackspace(e, i)}
              className={`w-12 h-12 mx-1 text-center text-2xl rounded-sm border outline-none 
              ${
                otpStatus === "success" 
                  ? "border-green-500 "
                  : otpStatus === "error" && message !== ""
                  ? "border-red-500  "
                  : "border-gray-300 focus:ring-1 focus:ring-black"
              }`}
            />
          ))}
        </div>

        {message && <p className={`${otpStatus == "success" ?"text-green-400":"text-red-500"} text-sm mb-4`}>{message}</p>}

        <button
          type="submit"
          onClick={handleSubmit}
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

          {loading ? "Verifying..." : "Verify OTP"}
        </button>

        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500 mb-1">Didn’t receive the OTP?</p>

          <span
            onClick={
              resendTimer === 0 && !resendLoading ? handleResendOtp : null
            }
            className={`text-sm font-medium cursor-pointer transition-colors duration-200
      ${
        resendTimer > 0 || resendLoading
          ? "text-gray-400 cursor-not-allowed"
          : "text-blue-600 hover:text-blue-800"
      }`}
          >
            {resendLoading
              ? "Resending..."
              : resendTimer > 0
              ? `Resend OTP in ${resendTimer}s`
              : "Resend OTP"}
          </span>
        </div>
      </div>
    </div>
  );
};

export default OtpValidation;
