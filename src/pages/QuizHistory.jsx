import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { UserContext } from "../context/UserContext";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // optional import, not used here

/***********************************************************
 * HELPER FUNCTIONS
 * - getBase64ImageFromUrl
 * - getImageTypeFromUrl
 ***********************************************************/
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

const getImageTypeFromUrl = (imageUrl) => {
  if (!imageUrl) return "PNG";
  const lowerUrl = imageUrl.toLowerCase();
  if (lowerUrl.endsWith(".png")) return "PNG";
  if (lowerUrl.endsWith(".jpg") || lowerUrl.endsWith(".jpeg")) return "JPEG";
  return "PNG";
};

/***********************************************************
 * QUIZ HISTORY COMPONENT
 ***********************************************************/
const QuizHistory = () => {
  const { user } = useContext(UserContext);
  const [quizHistory, setQuizHistory] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [quizDetails, setQuizDetails] = useState([]);
  const [quizMetadata, setQuizMetadata] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  /***********************************************************
   * Fetch Quiz History
   ***********************************************************/
  useEffect(() => {
    const fetchQuizHistory = async () => {
      setLoading(true);
      try {
        const response = await api.get("/quiz/history", {
          params: { userId: user?.id },
        });
        // Round & display only integer part of the score
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

  /***********************************************************
   * Fetch Quiz Details
   ***********************************************************/
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

  /***********************************************************
   * PDF GENERATION
   * - Eliminates the setTextColor array usage
   * - Enhances the design (background shapes, question "cards")
   ***********************************************************/
  const downloadPDF = async () => {
    // Create a new jsPDF instance
    const doc = new jsPDF({
      orientation: "p",
      unit: "pt",
      format: "a4", // standard paper
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    /***********************************************
     * 1) Load Images (Logo + Profile)
     ***********************************************/
    const logoUrl = `${process.env.PUBLIC_URL}/images/logoEmsi.png`;
    let logoBase64 = "";
    try {
      logoBase64 = await getBase64ImageFromUrl(logoUrl);
    } catch (e) {
      console.error("Error loading EMSI logo:", e);
    }

    let profilePicBase64 = "";
    if (user?.profileImage) {
      const profileImageUrl = user.profileImage.startsWith("http")
        ? user.profileImage
        : `${process.env.PUBLIC_URL}/images/${user.profileImage}`;
      try {
        profilePicBase64 = await getBase64ImageFromUrl(profileImageUrl);
      } catch (error) {
        console.error("Error loading profile image:", error);
      }
    }

    /***********************************************
     * 2) Background
     ***********************************************/
    doc.setFillColor(240, 245, 255); // pastel bluish
    doc.rect(0, 0, pageWidth, pageHeight, "F");

    doc.setFillColor(229, 255, 229); // pale green
    doc.circle(80, 60, 50, "F");

    doc.setFillColor(255, 236, 179); // pale yellow
    doc.circle(pageWidth - 60, pageHeight - 80, 60, "F");

    /***********************************************
     * 3) Title "Quiz Report" & Logo
     ***********************************************/
    doc.setFont("helvetica", "bold");
    doc.setFontSize(26);
    doc.setTextColor(70, 70, 70);
    doc.text("Quiz Report", pageWidth / 2, 60, { align: "center" });

    if (logoBase64) {
      doc.addImage(logoBase64, "PNG", pageWidth - 120, 20, 100, 30);
    }

    let contentY = 100; // vertical offset

    /***********************************************
     * 4) Profile "Card"
     ***********************************************/
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(40, contentY, pageWidth - 80, 120, 10, 10, "F");

    // If we have a user profile pic
    if (
      profilePicBase64 &&
      profilePicBase64.startsWith("data:image") &&
      profilePicBase64.length > 100
    ) {
      const imageType = getImageTypeFromUrl(user.profileImage);
      doc.setFillColor(230, 230, 230);
      doc.circle(80, contentY + 60, 40, "F");
      doc.addImage(profilePicBase64, imageType, 40, contentY + 20, 80, 80);
    }

    // Profile text
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.setTextColor(40, 40, 40);

    let textX = 140;
    let textY = contentY + 40;
    doc.text(`Name: ${user?.fullName || "N/A"}`, textX, textY);
    textY += 20;
    doc.setFont("helvetica", "normal");
    doc.text(`Email: ${user?.email || "N/A"}`, textX, textY);
    textY += 20;
    if (user?.phone) {
      doc.text(`Phone: ${user.phone}`, textX, textY);
      textY += 20;
    }
    contentY += 140; // move below card

    /***********************************************
     * 5) Quiz Meta "Card"
     ***********************************************/
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(40, contentY, pageWidth - 80, 80, 10, 10, "F");

    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);

    let metaX = 60;
    let metaY = contentY + 30;
    doc.text("Quiz Information:", metaX, metaY);
    doc.setDrawColor(100, 100, 100);
    doc.setLineWidth(1);
    doc.line(metaX, metaY + 5, metaX + 120, metaY + 5);

    doc.setFont("helvetica", "normal");
    metaY += 25;
    doc.text(`Programming Language: ${quizMetadata.language}`, metaX, metaY);
    metaY += 18;
    doc.text(`Date: ${quizMetadata.date}`, metaX, metaY);
    metaY += 18;
    doc.text(`Score: ${quizMetadata.score}%`, metaX, metaY);

    contentY += 100; // move below meta card

    /***********************************************
     * 6) Questions & Answers
     ***********************************************/
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(40, 40, 40);

    contentY += 20;
    doc.text("Questions & Answers", 50, contentY);
    doc.line(50, contentY + 3, 200, contentY + 3);

    contentY += 20;
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);

    const leftMargin = 50;
    const cardWidth = pageWidth - leftMargin * 2;
    const cardPadding = 10;

    quizDetails.forEach((detail, index) => {
      // Page break if needed
      if (contentY + 120 > pageHeight) {
        doc.addPage();
        contentY = 50;
      }

      const correct = detail.yourAnswer === detail.correctAnswer;
      if (correct) {
        doc.setFillColor(220, 255, 220); // green
      } else {
        doc.setFillColor(255, 220, 220); // red
      }

      doc.roundedRect(leftMargin, contentY, cardWidth, 90, 8, 8, "F");

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(50, 50, 50);
      doc.text(
        `Question #${index + 1}`,
        leftMargin + cardPadding,
        contentY + 20
      );

      // Question text
      const questionText = doc.splitTextToSize(
        `Q: ${detail.question}`,
        cardWidth - cardPadding * 2
      );
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      doc.setTextColor(30, 30, 30);
      doc.text(questionText, leftMargin + cardPadding, contentY + 40);

      let answerY = contentY + 40 + questionText.length * 12 + 10;
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(`Your Answer: `, leftMargin + cardPadding, answerY);
      doc.setFont("helvetica", "normal");

      // FIX: use separate (r, g, b) args, NOT array
      if (correct) {
        doc.setTextColor(0, 150, 0); // green
      } else {
        doc.setTextColor(200, 0, 0); // red
      }
      doc.text(detail.yourAnswer, leftMargin + cardPadding + 70, answerY);

      answerY += 16;
      doc.setFont("helvetica", "bold");
      doc.setTextColor(60, 60, 60);
      doc.text(`Correct Answer: `, leftMargin + cardPadding, answerY);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(0, 100, 180);
      doc.text(detail.correctAnswer, leftMargin + cardPadding + 90, answerY);

      contentY += 100;
    });

    if (quizDetails.length === 0) {
      doc.setFont("helvetica", "italic");
      doc.setFontSize(12);
      doc.setTextColor(120, 120, 120);
      doc.text("No questions found.", 50, contentY + 20);
    }

    /***********************************************
     * 7) Footer
     ***********************************************/
    if (contentY + 60 > pageHeight) {
      doc.addPage();
      contentY = 50;
    }
    doc.setFontSize(10);
    doc.setFont("helvetica", "italic");
    doc.setTextColor(80, 80, 80);
    doc.text(
      `© ${new Date().getFullYear()} EMSI Preparator. All rights reserved.`,
      50,
      pageHeight - 40
    );

    // Save the PDF
    doc.save("quiz-report.pdf");
  };

  /***********************************************************
   * RENDER COMPONENT
   ***********************************************************/
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100 p-8">
      {/* Main Container Card */}
      <div className="bg-white p-8 rounded-3xl shadow-2xl max-w-6xl mx-auto relative overflow-hidden">
        {/* Decorative background shapes */}
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-green-200 rounded-full opacity-70 animate-pulse" />
        <div className="absolute -bottom-10 -left-10 w-60 h-60 bg-green-300 rounded-full opacity-30" />

        <h2 className="text-5xl font-extrabold text-green-700 mb-8 text-center relative z-10">
          <span className="inline-block transform hover:scale-105 transition-transform">
            Your Quiz History
          </span>
        </h2>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex flex-col items-center py-10 relative z-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-green-600 border-opacity-75 mb-4"></div>
            <p className="text-lg text-green-700 font-medium">Loading...</p>
          </div>
        )}

        {/* Error */}
        {error && !loading && (
          <div className="text-red-600 font-bold text-center py-4 relative z-10">
            {error}
          </div>
        )}

        {/* Table of Quizzes */}
        {!loading && !error && quizHistory.length > 0 && (
          <div className="overflow-x-auto relative z-10">
            <table className="w-full table-auto border-collapse bg-gray-50 rounded-xl shadow">
              <thead>
                <tr className="bg-green-600 text-white text-left">
                  <th className="p-4 font-semibold">Programming Language</th>
                  <th className="p-4 font-semibold">Date</th>
                  <th className="p-4 font-semibold text-center">Score</th>
                  <th className="p-4 font-semibold text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-green-100">
                {quizHistory.map((quiz, idx) => (
                  <tr
                    key={quiz.id}
                    className={`hover:bg-green-100 transition-colors ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="p-4">{quiz.programmingLanguage}</td>
                    <td className="p-4">{quiz.date}</td>
                    <td className="p-4 text-center font-bold text-green-800">
                      {quiz.score}%
                    </td>
                    <td className="p-4 text-center">
                      <button
                        className="inline-flex items-center bg-green-500 text-white font-medium px-4 py-2 rounded-lg shadow hover:bg-green-600 transition-transform transform hover:scale-105"
                        onClick={() =>
                          fetchQuizDetails(quiz.id, {
                            language: quiz.programmingLanguage,
                            date: quiz.date,
                            score: quiz.score,
                          })
                        }
                      >
                        <svg
                          className="w-5 h-5 mr-2"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth={2}
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 10l4.553 4.553a2.121 2.121 0 010 3l-.086.086a2.121 2.121 0 01-3 0L12 13m0 0l-3 3m3-3l3-3m-3 3h.01"
                          />
                        </svg>
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* No Quizzes */}
        {!loading && !error && quizHistory.length === 0 && (
          <p className="text-center text-gray-700 font-medium py-6 relative z-10">
            No quiz history found. Start your first quiz now!
          </p>
        )}
      </div>

      {/* Modal for Quiz Details */}
      {selectedQuiz && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          {/* Dimmed Backdrop */}
          <div
            className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm cursor-pointer"
            onClick={() => {
              setSelectedQuiz(null);
              setQuizDetails([]);
              setQuizMetadata({});
            }}
          />

          {/* Modal Container */}
          <div className="relative z-10 w-11/12 max-w-4xl max-h-[90vh] overflow-y-auto animate-fadeIn">
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-1 rounded-3xl shadow-2xl">
              <div className="bg-white rounded-3xl p-8 relative">
                {/* Floating decorative circles */}
                <div className="absolute top-2 left-2 w-6 h-6 bg-green-200 rounded-full opacity-70 animate-ping" />
                <div className="absolute top-2 left-2 w-6 h-6 bg-green-300 rounded-full opacity-50" />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-200 rounded-full opacity-70 animate-ping" />
                <div className="absolute bottom-2 right-2 w-8 h-8 bg-green-300 rounded-full opacity-50" />

                {/* Title & Close */}
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-3xl font-extrabold text-green-700">
                    Quiz Details
                  </h3>
                  <button
                    className="w-10 h-10 flex items-center justify-center bg-red-500 hover:bg-red-600 text-white rounded-full shadow transform hover:scale-105 transition duration-200"
                    onClick={() => {
                      setSelectedQuiz(null);
                      setQuizDetails([]);
                      setQuizMetadata({});
                    }}
                  >
                    ✕
                  </button>
                </div>

                {/* Metadata */}
                <div className="mb-6 space-y-2 text-lg text-gray-700">
                  <p>
                    <strong>Programming Language:</strong>{" "}
                    {quizMetadata.language}
                  </p>
                  <p>
                    <strong>Date:</strong> {quizMetadata.date}
                  </p>
                  <p>
                    <strong>Score:</strong> {Math.round(quizMetadata.score)}%
                  </p>
                  {/* <p>
                    <strong>User Name:</strong> {user?.fullName || "N/A"}
                  </p>
                  <p>
                    <strong>Email:</strong> {user?.email || "N/A"}
                  </p> */}
                  {/* {user?.phone && (
                    <p>
                      <strong>Phone:</strong> {user.phone}
                    </p>
                  )} */}
                </div>

                {/* Questions & Answers */}
                <div className="space-y-6">
                  {quizDetails.map((detail, index) => {
                    const correct = detail.yourAnswer === detail.correctAnswer;
                    return (
                      <div
                        key={index}
                        className={`relative p-6 rounded-xl shadow-md flex items-start gap-4 transition-colors ${
                          correct ? "bg-green-50" : "bg-red-50"
                        }`}
                      >
                        {/* Icon for correctness */}
                        <div
                          className={`w-12 h-12 flex-shrink-0 flex items-center justify-center rounded-full shadow ${
                            correct
                              ? "bg-green-500 text-white"
                              : "bg-red-500 text-white"
                          }`}
                        >
                          {correct ? (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                          ) : (
                            <svg
                              className="w-6 h-6"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth={2}
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-xl text-gray-800 mb-1">
                            Question:{" "}
                            <span className="font-normal">{detail.question}</span>
                          </p>
                          <p className="text-gray-800">
                            <strong>Your Answer:</strong>{" "}
                            <span
                              className={`font-bold ${
                                correct ? "text-green-700" : "text-red-700"
                              }`}
                            >
                              {detail.yourAnswer}
                            </span>
                          </p>
                          <p className="text-gray-800">
                            <strong>Correct Answer:</strong>{" "}
                            <span className="font-bold text-blue-700">
                              {detail.correctAnswer}
                            </span>
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Download PDF Button */}
                <div className="mt-8 text-right">
                  <button
                    onClick={downloadPDF}
                    className="inline-flex items-center bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg shadow-md transition duration-300 transform hover:scale-105"
                  >
                    <svg
                      className="w-5 h-5 mr-2"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 19l9-7-9-7-9 7 9 7z"
                      />
                    </svg>
                    Download as PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuizHistory;
