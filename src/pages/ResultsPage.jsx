import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const ResultsPage = () => {
  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-grow container mx-auto py-10">
        <h1 className="text-3xl font-bold text-blue-700 mb-6">Your Results</h1>
        <div className="space-y-4">
          {[
            { language: "Java", score: 80 },
            { language: "Python", score: 90 },
          ].map((result, idx) => (
            <div
              key={idx}
              className="p-4 bg-white rounded-lg shadow-md flex justify-between"
            >
              <span>{result.language}</span>
              <span className="font-semibold text-blue-700">
                Score: {result.score}%
              </span>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ResultsPage;
