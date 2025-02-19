import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { UserContext } from "../context/UserContext";
import { jsPDF } from "jspdf";
import "jspdf-autotable";

// Helper function to convert an image URL to a Base64 string
const getBase64ImageFromUrl = async (imageUrl) => {
  const res = await fetch(imageUrl);
  const blob = await res.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(blob);
  });
};

// Helper function to determine image type from URL
const getImageTypeFromUrl = (imageUrl) => {
  if (!imageUrl) return "PNG";
  const lowerUrl = imageUrl.toLowerCase();
  if (lowerUrl.endsWith(".png")) {
    return "PNG";
  } else if (lowerUrl.endsWith(".jpg") || lowerUrl.endsWith(".jpeg")) {
    return "JPEG";
  }
  return "PNG";
};

const QuizHistory = () => {
  const { user } = useContext(UserContext);
  const [quizHistory, setQuizHistory] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDetails, setQuizDetails] = useState([]);
  const [quizMetadata, setQuizMetadata] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuizHistory = async () => {
      setLoading(true);
      try {
        const response = await api.get("/quiz/history", {
          params: { userId: user?.id },
        });
        // Round and display only the integer part of the score
        const updatedHistory = response.data.map((quiz) => ({
          ...quiz,
          score: Math.round(quiz.score),
        }));
        setQuizHistory(updatedHistory);
      } catch (err) {
        setError(err.response?.data || "Failed to fetch quiz history.");
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchQuizHistory();
    }
  }, [user]);

  const fetchQuizDetails = async (quizId, metadata) => {
    setLoading(true);
    setError("");
    try {
      const response = await api.get("/quiz/details", {
        params: { quizId, userId: user?.id },
      });

      setQuizDetails(
        response.data.map((detail) => ({
          question: detail.question,
          correctAnswer: detail.correctAnswer,
          yourAnswer: detail.userResponse || "N/A",
        }))
      );
      setQuizMetadata(metadata);
      setSelectedQuiz(quizId);
    } catch (err) {
      const errorMessage =
        err.response?.data?.message || "Failed to fetch quiz details.";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // const closeDetails = () => {
  //   setSelectedQuiz(null);
  //   setQuizDetails([]);
  //   setQuizMetadata({});
  // };

  /**
   * Download PDF of the quiz details.
   * - Loads a logo and the current user's profile image from the public folder.
   * - Adds enhanced header details (User info and Quiz metadata) with custom fonts.
   * - Inserts a table of quiz questions with conditional styling for the answers.
   */
  const downloadPDF = async () => {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    // --- Add Logo ---
    const logoUrl = `${process.env.PUBLIC_URL}/images/logoEmsi.png`;
    let logoBase64 = "";
    try {
      logoBase64 = await getBase64ImageFromUrl(logoUrl);
    } catch (error) {
      console.error("Error loading logo image:", error);
    }
    if (logoBase64 && logoBase64.startsWith("data:image") && logoBase64.length > 100) {
      // Place the logo at the top right
      doc.addImage(logoBase64, "PNG", pageWidth - 50, 10, 40, 20);
    } else {
      console.warn("Logo image data is missing or incomplete. Skipping logo.");
    }

    // --- Add User Profile Picture ---
    let profilePicBase64 = "";
    if (user?.profileImage) {
      // If profileImage is not a full URL, assume it's relative to public/images
      const profileImageUrl = user.profileImage.startsWith("http")
        ? user.profileImage
        : `${process.env.PUBLIC_URL}/images/${user.profileImage}`;
      try {
        profilePicBase64 = await getBase64ImageFromUrl(profileImageUrl);
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    }
    if (profilePicBase64 && profilePicBase64.startsWith("data:image") && profilePicBase64.length > 100) {
      const imageType = getImageTypeFromUrl(user.profileImage);
      // Place the profile picture at the top left
      doc.addImage(profilePicBase64, imageType, 10, 10, 30, 30);
    } else {
      console.warn("Profile image data is missing or incomplete. Skipping profile image.");
    }

    // --- Set Header Fonts and Title ---
    doc.setFont("helvetica", "bold");
    doc.setFontSize(18);
    doc.text("Quiz Report", pageWidth / 2, 40, { align: "center" });

    // --- Add User & Quiz Details ---
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    // Left Column: User Information
    doc.text(`Name: ${user?.fullName || "N/A"}`, 14, 50);
    doc.text(`Email: ${user?.email || "N/A"}`, 14, 56);
    if (user?.phone) {
      doc.text(`Phone: ${user.phone}`, 14, 62);
    }
    // Right Column: Quiz Metadata
    doc.text(`Programming Language: ${quizMetadata.language}`, pageWidth / 2 + 10, 50);
    doc.text(`Date: ${quizMetadata.date}`, pageWidth / 2 + 10, 56);
    doc.text(`Score: ${quizMetadata.score}%`, pageWidth / 2 + 10, 62);
    doc.line(14, 66, pageWidth - 14, 66); // Horizontal line

    // --- Prepare Table Data ---
    const tableData = quizDetails.map((detail) => [
      detail.question,
      detail.yourAnswer,
      detail.correctAnswer,
    ]);

    // --- Add Table with Enhanced Design ---
    doc.autoTable({
      head: [["Question", "Your Answer", "Correct Answer"]],
      body: tableData,
      startY: 72,
      theme: "grid",
      headStyles: { fillColor: [46, 204, 113], textColor: 255, halign: "center" },
      styles: { fontSize: 10 },
      didParseCell: function (data) {
        if (data.section === "body" && data.column.index === 1) {
          const yourAnswer = data.row.raw[1];
          const correctAnswer = data.row.raw[2];
          if (yourAnswer === correctAnswer) {
            data.cell.styles.fillColor = [198, 239, 206]; // light green
          } else {
            data.cell.styles.fillColor = [255, 199, 206]; // light red
          }
        }
      },
    });

    // --- Save the PDF ---
    doc.save("quiz-report.pdf");
  };

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen p-8">
      <div className="bg-white p-8 rounded-lg shadow-xl">
        <h2 className="text-4xl font-bold text-green-700 mb-6 text-center">
          🎓 Your Quiz History
        </h2>

        {loading && (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-opacity-75"></div>
            <p className="ml-4 text-lg text-green-700 font-medium">Loading...</p>
          </div>
        )}

        {error && (
          <div className="text-red-600 font-bold text-center py-4">
            {error}
          </div>
        )}

        {!loading && !error && quizHistory.length > 0 && (
          <table className="table-auto w-full bg-gray-100 rounded-lg overflow-hidden shadow-md">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="px-6 py-4">Programming Language</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Score</th>
                <th className="px-6 py-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {quizHistory.map((quiz) => (
                <tr
                  key={quiz.id}
                  className="hover:bg-green-100 transition-all duration-200"
                >
                  <td className="px-6 py-4">{quiz.programmingLanguage}</td>
                  <td className="px-6 py-4">{quiz.date}</td>
                  <td className="px-6 py-4 text-center">{quiz.score}%</td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-green-600 transition duration-200"
                      onClick={() =>
                        fetchQuizDetails(quiz.id, {
                          language: quiz.programmingLanguage,
                          date: quiz.date,
                          score: quiz.score,
                        })
                      }
                    >
                      View Details
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {!loading && !error && quizHistory.length === 0 && (
          <p className="text-center text-gray-700 font-medium">
            No quiz history found. Start your first quiz now!
          </p>
        )}
      </div>

      {selectedQuiz && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-8 rounded-lg shadow-2xl w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-3xl font-bold text-green-700">Quiz Details</h3>
              <button
                className="text-gray-600 hover:text-red-600 font-bold text-lg"
                onClick={() => {
                  setSelectedQuiz(null);
                  setQuizDetails([]);
                  setQuizMetadata({});
                }}
              >
                ✖ Close
              </button>
            </div>
            <div className="mb-6">
              <p className="text-gray-800">
                <strong>Programming Language:</strong> {quizMetadata.language}
              </p>
              <p className="text-gray-800">
                <strong>Date:</strong> {quizMetadata.date}
              </p>
              <p className="text-gray-800">
                <strong>Score:</strong> {Math.round(quizMetadata.score)}%
              </p>
              <p className="text-gray-800">
                <strong>User Name:</strong> {user?.fullName || "N/A"}
              </p>
              <p className="text-gray-800">
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              {user?.phone && (
                <p className="text-gray-800">
                  <strong>Phone:</strong> {user.phone}
                </p>
              )}
            </div>
            <ul className="space-y-6">
              {quizDetails.map((detail, index) => (
                <li
                  key={index}
                  className={`p-6 rounded-lg shadow-md ${
                    detail.yourAnswer === detail.correctAnswer
                      ? "bg-green-100"
                      : "bg-red-100"
                  }`}
                >
                  <p className="font-semibold text-lg text-gray-800">
                    <strong>Question:</strong> {detail.question}
                  </p>
                  <p className="mt-2 text-gray-800">
                    <strong>Your Answer:</strong>{" "}
                    <span
                      className={`font-bold ${
                        detail.yourAnswer === detail.correctAnswer
                          ? "text-green-700"
                          : "text-red-700"
                      }`}
                    >
                      {detail.yourAnswer}
                    </span>
                  </p>
                  <p className="mt-2 text-gray-800">
                    <strong>Correct Answer:</strong>{" "}
                    <span className="font-bold text-blue-700">
                      {detail.correctAnswer}
                    </span>
                  </p>
                </li>
              ))}
            </ul>
            <button
              onClick={downloadPDF}
              className="mt-6 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300"
            >
              Download as PDF
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
