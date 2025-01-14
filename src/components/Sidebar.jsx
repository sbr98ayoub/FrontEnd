import React, { useContext, useState } from "react";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

const Sidebar = ({ onSelect }) => {
  const { logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [activeKey, setActiveKey] = useState("dashboard");

  const menuItems = [
    { title: "Dashboard", icon: "📊", key: "dashboard" },
    { title: "Generate Quiz", icon: "📝", key: "generateQuiz" },
    { title: "Quizzes History", icon: "📜", key: "history" },
    { title: "Leaderboard", icon: "🏆", key: "leaderboard" }, // New Section
    { title: "Existing Exams", icon: "📚", key: "existingExams" }, // New Section
    { title: "Profile", icon: "👤", key: "profile" },
    { title: "Logout", icon: "⬅️", key: "logout" },
  ];

  const handleSelect = (key) => {
    if (key === "logout") {
      logout();
      navigate("/login");
    } else {
      setActiveKey(key);
      onSelect(key);
    }
  };

  return (
    <aside className="bg-gradient-to-b from-green-600 to-green-800 text-white w-64 min-h-screen p-6 shadow-lg">
      {/* Add Logo */}
      <div className="flex justify-center mb-8">
        <img
          src="/images/logo.png" // Replace with the path to your logo
          alt="EMSI PREPARATOR Logo"
          className="h-10"
        />
      </div>
      <ul className="space-y-4">
        {menuItems.map((item) => (
          <li
            key={item.key}
            className={`flex items-center gap-3 cursor-pointer p-3 rounded-lg transition-all 
              ${
                activeKey === item.key
                  ? "bg-green-500 text-white shadow-lg"
                  : "hover:bg-green-700 hover:text-green-300"
              }`}
            onClick={() => handleSelect(item.key)}
          >
            <span className="text-2xl">{item.icon}</span>
            <span className="text-lg">{item.title}</span>
          </li>
        ))}
      </ul>
    </aside>
  );
};

export default Sidebar;
