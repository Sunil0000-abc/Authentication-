import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (!storedUser) {
      navigate("/login"); 
    } else {
      setUser(JSON.parse(storedUser));
    }
  }, [navigate]);

  if (!user) return null; 

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm">

        
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center text-2xl font-bold">
            {getInitials(user.name)}
          </div>
        </div>

        <h1 className="text-3xl font-bold text-center mb-4">
          Welcome 👋 {user.name.split(" ")[0]}
        </h1>

        <p className="text-gray-600 mb-2 text-center">
          <strong>Name:</strong> {user.name}
        </p>

        <p className="text-gray-600 mb-6 text-center">
          <strong>Email:</strong> {user.email}
        </p>

        <button
          onClick={handleLogout}
          className="bg-red-500 w-full text-white py-2 rounded-md hover:bg-red-600 transition"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
