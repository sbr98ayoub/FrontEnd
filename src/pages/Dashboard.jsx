import React, { useEffect, useState, useContext } from "react";
import { Line, Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import api from "../api/api";
import { UserContext } from "../context/UserContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const Dashboard = () => {
  const { user } = useContext(UserContext);
  const [lineChartData, setLineChartData] = useState(null);
  const [barChartData, setBarChartData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data from backend endpoint
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get("/quiz/dashboard", {
          params: { userId: user?.id },
        });
        if (response.status === 200) {
          const dashboardData = response.data;
          // Extract and transform the "completionTrends" data.
          // Assume backend returns an object with keys as month names and values as counts.
          const monthOrder = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
          ];
          const completionTrends = dashboardData.completionTrends || {};
          const sortedMonths = Object.keys(completionTrends).sort(
            (a, b) => monthOrder.indexOf(a) - monthOrder.indexOf(b)
          );
          const lineData = {
            labels: sortedMonths,
            datasets: [
              {
                label: "Quiz Completion Trends",
                data: sortedMonths.map((month) => completionTrends[month]),
                borderColor: "#38a169",
                backgroundColor: "rgba(56, 161, 105, 0.2)",
                tension: 0.4,
                fill: true,
              },
            ],
          };

          // Extract and transform the "performanceByTopic" data.
          // Assume backend returns an object with programming languages as keys and average scores as values.
          const performanceByTopic = dashboardData.performanceByTopic || {};
          const topics = Object.keys(performanceByTopic);
          const barData = {
            labels: topics,
            datasets: [
              {
                label: "Performance by Topic",
                data: topics.map((topic) => performanceByTopic[topic]),
                backgroundColor: topics.map((_, index) => {
                  const colors = [
                    "#68d391",
                    "#48bb78",
                    "#38a169",
                    "#2f855a",
                    "#22543d",
                  ];
                  return colors[index % colors.length];
                }),
              },
            ],
          };

          setLineChartData(lineData);
          setBarChartData(barData);
        } else {
          setError("Failed to fetch dashboard data.");
        }
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError("Error fetching dashboard data.");
      } finally {
        setLoading(false);
      }
    };

    if (user && user.id) {
      fetchDashboardData();
    }
  }, [user]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg space-y-8">
      {/* Decorative Header */}
      <header className="text-center space-y-4">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Welcome to Your <span className="text-green-600">Dashboard</span>!
        </h2>
        <p className="text-lg text-gray-600">Here's what you can do:</p>
        <div className="flex justify-center space-x-8">
          <p className="bg-green-100 px-4 py-2 rounded-lg shadow hover:bg-green-200 transition">
            📊 <strong>Track your quiz scores and history.</strong>
          </p>
          <p className="bg-green-100 px-4 py-2 rounded-lg shadow hover:bg-green-200 transition">
            🌟 <strong>See personalized recommendations.</strong>
          </p>
          <p className="bg-green-100 px-4 py-2 rounded-lg shadow hover:bg-green-200 transition">
            🚀 <strong>Monitor your progress in programming topics.</strong>
          </p>
        </div>
      </header>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Line Chart */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold text-green-600 mb-4 text-center">
            Quiz Completion Trends
          </h3>
          {lineChartData && <Line data={lineChartData} />}
        </div>

        {/* Bar Chart */}
        <div className="bg-gray-50 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-bold text-green-600 mb-4 text-center">
            Performance by Topic
          </h3>
          {barChartData && <Bar data={barChartData} />}
        </div>
      </div>

      {/* Additional Widgets */}
      <div className="bg-green-100 p-6 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
        <h3 className="text-2xl font-bold text-green-800 mb-4">🎯 Current Goals</h3>
        <ul className="list-disc pl-6 space-y-2 text-gray-700">
          <li>
            Complete <strong className="text-green-600">5 quizzes</strong> this week.
          </li>
          <li>
            Improve your <strong className="text-green-600">JavaScript</strong> skills.
          </li>
          <li>
            Explore advanced topics in <strong className="text-green-600">React</strong>.
          </li>
        </ul>
      </div>

      {/* Call to Action */}
      <div className="text-center">
        <button className="bg-green-600 text-white px-8 py-3 rounded-lg shadow-lg hover:bg-green-700 transition">
          Start a New Quiz
        </button>
      </div>
    </div>
  );
};

export default Dashboard;
