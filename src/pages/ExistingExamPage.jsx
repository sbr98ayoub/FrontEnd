import React from "react";

const ExistingExamsPage = () => {
  // Sample existing exams data
  const exams = [
    { id: 1, title: "Mathematics Final Exam", date: "2025-01-15" },
    { id: 2, title: "Physics Midterm Exam", date: "2025-02-10" },
    { id: 3, title: "Chemistry Quiz", date: "2025-01-20" },
    { id: 4, title: "English Literature Exam", date: "2025-03-05" },
  ];

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen p-8">
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-green-700 mb-3">
          Existing Exams
        </h1>
        <p className="text-lg text-gray-700">
          Browse through pre-existing exams available for review and practice.
        </p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {exams.map((exam) => (
          <div
            key={exam.id}
            className="bg-white shadow-lg rounded-lg p-6 hover:shadow-xl transition-shadow"
          >
            <h2 className="text-xl font-semibold text-green-700 mb-2">
              {exam.title}
            </h2>
            <p className="text-gray-600 mb-4">Date: {exam.date}</p>
            <button
              className="
                bg-green-600 
                text-white 
                py-2 px-4 
                rounded-lg 
                hover:bg-green-700 
                transition-colors 
                w-full
              "
            >
              View Details
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExistingExamsPage;
