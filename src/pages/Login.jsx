import React, { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/ContextProvider";
import { Link, useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/login",
        {
          email,
          password,
        }
      );
      if (response.data.success) {
        login(response.data.user);
        localStorage.setItem("token", response.data.token);
        navigate("/");
      }
    } catch (error) {
      if (error.response) {
        // Server responded with a status code other than 2xx
        console.log("Error Response:", error.response.data);
        alert(error.response.data.message || "Login failed!");
      } else if (error.request) {
        // No response from the server
        console.log("Error Request:", error.request);
        alert("No response from the server. Please try again later.");
      } else {
        // Error setting up the request
        console.log("Error Message:", error.message);
        alert("An unexpected error occurred. Please try again.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="border shadow p-6 w-80 bg-white">
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-3 border"
              type="email"
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Email"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700" htmlFor="password">
              Password
            </label>
            <input
              className="w-full px-3 py-3 border"
              type="password"
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter Password"
              required
            />
          </div>
          <button className="w-full bg-teal-600 text-white py-2" type="submit">
            Login
          </button>
          <p className="text-center">
            Don&apos;t have an account? <Link to="/signup">Sign Up</Link>
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
