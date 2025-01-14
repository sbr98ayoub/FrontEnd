import React, { useState } from "react";
import api from "../api/api"; // Use the configured Axios instance
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useNavigate } from "react-router-dom"; // Assuming you're using react-router for navigation

const RegisterPage = () => {
  const [formData, setFormData] = useState({ fullName: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [successModal, setSuccessModal] = useState(false); // Modal state
  const navigate = useNavigate(); // For navigation

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      const response = await api.post("/user/register", formData);
      if (response.status === 200) {
        setSuccessModal(true); // Show success modal
        setFormData({ fullName: "", email: "", password: "" }); // Reset form
        setTimeout(() => {
          navigate("/login");
        }, 3000);
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError("Email is already in use. Please use a different email.");
      } else {
        setError("Registration failed. Please try again later.");
      }
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
              <h2 className="text-4xl font-extrabold mb-4">Join EMSI PREPARATOR!</h2>
              <p className="text-lg">
                Empower your future with interactive resources and a vibrant community.
              </p>
            </div>
          </div>

          {/* Right Section with Form */}
          <div className="w-1/2 p-10">
            <h2 className="text-3xl font-bold text-green-600 text-center mb-6">
              Create Your Account
            </h2>
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  placeholder="Insert your full name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Email</label>
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold">Password</label>
                <input
                  type="password"
                  name="password"
                  placeholder="Your Password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full p-4 border rounded-lg focus:ring focus:ring-green-300"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-green-600 text-white text-lg font-semibold rounded-lg shadow-lg hover:bg-green-700 transition duration-300"
              >
                Register
              </button>
              {error && <p className="text-red-500 text-center mt-4">{error}</p>}
            </form>
            <p className="mt-6 text-center text-gray-600">
              Already have an account?{" "}
              <a href="/login" className="text-green-600 font-medium hover:underline">
                Sign in
              </a>
            </p>
          </div>
        </div>
      </main>
      <Footer />

      {/* Success Modal */}
      {successModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <h2 className="text-2xl font-bold text-green-600">Registration Successful!</h2>
            <p className="mt-4">You will be redirected to the login page shortly.</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default RegisterPage;
