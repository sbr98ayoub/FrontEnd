import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-green-400 to-green-600 shadow-lg sticky top-0 z-50">
      <div className="container mx-auto text-center">
        <p>
          © {new Date().getFullYear()} <span className="font-bold">Ecole marocaine des Sciences de l'ingenieur²</span>. All Rights Reserved.
        </p>
        <div className="space-x-4 mt-4">
          <a
            href="/privacy"
            className="hover:underline hover:text-gray-300 transition"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="hover:underline hover:text-gray-300 transition"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
