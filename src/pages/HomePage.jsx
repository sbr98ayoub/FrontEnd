import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import GenerateQuiz from "./GenerateQuiz";
import QuizHistory from "./QuizHistory";
import Profile from "./Profile";
import LeaderboardPage from "./LeaderBoard";
import ExistingExamsPage from "./ExistingExamPage";

const HomePage = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);
  

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (userData) {
      setUserName(userData.fullName || "User");
      setUserPhoto(userData.photo || null); // Add `photo` in your user object if available
    }
  }, []);

  const renderActiveSection = () => {
    switch (activeSection) {
      case "dashboard":
        return <Dashboard />;
      case "generateQuiz":
        return <GenerateQuiz />;
      case "history":
        return <QuizHistory />;
      case "profile":
        return <Profile />;
      case "leaderboard": // New case
        return <LeaderboardPage />;
      case "existingExams": // New case
        return <ExistingExamsPage />;
      default:
        return null;
    }
  };

  return (
    <div className="flex">
      <Sidebar onSelect={setActiveSection} />
      <div className="flex-grow bg-gray-100 min-h-screen">
        {/* Enhanced Header */}
        <header className="bg-gradient-to-r from-green-600 to-green-400 text-white p-8 flex items-center shadow-lg">
          <div className="flex items-center space-x-4">
            {/* User Photo */}
            <img
              src={userPhoto || "/images/avatar1.png"} // Replace with actual default photo path
              alt={`${userName}'s profile`}
              className="w-16 h-16 rounded-full object-cover border-4 border-white"
            />
            {/* User Info */}
            <div>
              <h1 className="text-4xl font-extrabold mb-1">Hello, {userName}!</h1>
              <p className="text-lg font-medium">
                Welcome back to EMSI PREPARATOR! Let’s keep learning.
              </p>
            </div>
          </div>
          {/* Notifications or Quick Actions */}
          <div className="ml-auto flex items-center space-x-4">
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg shadow hover:bg-green-100 transition">
              Notifications
            </button>
            <button className="bg-white text-green-600 px-4 py-2 rounded-lg shadow hover:bg-green-100 transition">
              Quick Actions
            </button>
          </div>
        </header>
        <main className="p-8">{renderActiveSection()}</main>
      </div>
    </div>
  );
};

export default HomePage;
