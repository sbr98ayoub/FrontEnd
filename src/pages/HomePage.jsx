import React, { useContext, useEffect, useState } from "react";
import { UserContext } from "../context/UserContext";
import Sidebar from "../components/Sidebar";
import Dashboard from "./Dashboard";
import GenerateQuiz from "./GenerateQuiz";
import QuizHistory from "./QuizHistory";
import Profile from "./Profile";
import LeaderboardPage from "./LeaderBoard";
import ExistingExamsPage from "./ExistingExamPage";

const HomePage = () => {
  const { user } = useContext(UserContext);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [userName, setUserName] = useState("");
  const [userPhoto, setUserPhoto] = useState(null);

  // Whenever the global user changes, update the header info
  useEffect(() => {
    if (user) {
      const serverURL = "http://localhost:9090/profile-images/";
      setUserName(user.fullName || "User");
      setUserPhoto(user.profileImage ? serverURL + user.profileImage : null);
    }
  }, [user]);

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
      case "leaderboard":
        return <LeaderboardPage />;
      case "existingExams":
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
            <img
              src={userPhoto || "/images/avatar1.png"}
              alt={`${userName}'s profile`}
              className="w-16 h-16 rounded-full object-cover border-4 border-white"
            />
            <div>
              <h1 className="text-4xl font-extrabold mb-1">Hello, {userName}!</h1>
              <p className="text-lg font-medium">
                Welcome back to EMSI PREPARATOR! Let’s keep learning.
              </p>
            </div>
          </div>
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
