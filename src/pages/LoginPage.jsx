import React, { useState, useContext } from "react";
import api from "../api/api";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const LoginPage = () => {
  const { login } = useContext(UserContext); // Access login function from UserContext
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous error

    try {
      const response = await api.post("/user/login", { email, password });

      if (response.status === 200) {
        console.log("Login successful:", response.data);

        const userData = {
          id: response.data.userId,
          email: response.data.email,
          fullName: response.data.fullName,
          profileImage: response.data.profileImage, // Include profile image
        };

        localStorage.setItem("user", JSON.stringify(userData)); // Save user data to localStorage
        login(userData); // Update UserContext with user data
        navigate("/home"); // Redirect to home page after successful login
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      setError(err.response?.data || "Login failed. Please try again.");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow flex items-center justify-center">
        <div className="flex flex-row w-full max-w-6xl bg-white shadow-xl rounded-lg overflow-hidden">
          {/* Left Section with Image */}
          <div
            className="w-1/2 relative bg-cover bg-center"
            style={{
              backgroundImage: "url('/images/discussion.png')",
            }}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-green-700 via-green-600 to-transparent opacity-90"></div>
            <div className="absolute bottom-8 left-8 text-white">
              <h2 className="text-4xl font-extrabold mb-4">Welcome Back!</h2>
              <p className="text-lg">
                Access your personalized quizzes and take the next step in your journey with EMSI PREPARATOR.
              </p>
            </div>
          </div>

          {/* Right Section with Form */}
          <div className="w-1/2 p-10 bg-gray-50">
            <h2 className="text-3xl font-bold text-green-600 text-center mb-6">Login to EMSI PREPARATOR</h2>
            <form className="space-y-6" onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Password</label>
                <input
                  type="password"
                  placeholder="Your Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
              >
                Login
              </button>
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>
            <p className="mt-6 text-center text-gray-600">
              Don't have an account?{" "}
              <a href="/register" className="text-green-600 font-medium hover:underline">
                Sign Up
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default LoginPage;
