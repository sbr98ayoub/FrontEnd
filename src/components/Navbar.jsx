import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";

const Navbar = () => {
  const context = useContext(UserContext);
  const navigate = useNavigate();

  // Ensure the context exists to prevent errors
  if (!context) {
    console.warn("UserContext is not available. Please wrap your application in UserProvider.");
    return null;
  }

  const { user, logout } = context;

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-gradient-to-r from-green-400 to-green-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto p-4 flex justify-between items-center">
        {/* Replace 'CodeQuest' with the logo */}
        <img src="/images/logo.png" alt="Logo" className="h-10" />
        <div className="space-x-6">
          {!user ? (
            <>
              <a
                href="/"
                className="text-white hover:text-green-200 transition duration-300"
              >
                Home
              </a>
              <a
                href="/login"
                className="text-white hover:text-green-200 transition duration-300"
              >
                Login
              </a>
              <a
                href="/register"
                className="bg-white text-green-600 px-4 py-2 rounded-lg shadow-md hover:bg-green-200 transition duration-300"
              >
                Register
              </a>
            </>
          ) : (
            <>
              <a
                href="/"
                className="text-white hover:text-green-200 transition duration-300"
              >
                Home
              </a>
              <button
                onClick={handleLogout}
                className="bg-white text-red-600 px-4 py-2 rounded-lg shadow-md hover:bg-red-200 transition duration-300"
              >
                Logout
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;