import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const TestHistoryPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Test History</h1>
        <div className="space-y-4">
          {[
            { id: 1, language: "Java", date: "2024-12-18" },
            { id: 2, language: "Python", date: "2024-12-19" },
          ].map((test, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-lg shadow-md flex justify-between"
            >
              <span>{test.language}</span>
              <span className="text-gray-600">{test.date}</span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default TestHistoryPage;
