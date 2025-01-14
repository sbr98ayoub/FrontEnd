import React, { useState, useContext } from "react";
import CircularProgress from "@mui/material/CircularProgress";
import api from "../api/api";
import { UserContext } from "../context/UserContext";

/**
 * GenerateQuiz Component
 * Enhancements:
 * - Customized progress bar with smooth transition
 * - Animated question card with a more distinctive style
 * - More elegant modals with subtle animations
 * - Maintains existing functionality (generate quiz, answer, store quiz)
 * - Respects your green-themed color palette & general styling
 */
const GenerateQuiz = () => {
  // ------------------ State & Context ------------------
  const { user } = useContext(UserContext);

  const [language, setLanguage] = useState("");
  const [difficulty, setDifficulty] = useState("");
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [quizComplete, setQuizComplete] = useState(false);
  const [quizResult, setQuizResult] = useState(null);
  const [modalMessage, setModalMessage] = useState(null);

  // ------------------ Handlers ------------------

  /**
   * Handle quiz generation from the server.
   */
  const handleGenerate = async (e) => {
    e.preventDefault();
    setIsGenerating(true);

    try {
      const response = await api.post("/quiz/generate", {
        programmingLanguage: language,
        difficulty,
      });

      if (response.status === 200) {
        setQuestions(response.data.questions);
      } else {
        throw new Error("Failed to generate quiz.");
      }
    } catch (error) {
      console.error("Error generating quiz:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  /**
   * Handle user's answer selection.
   * Moves to the next question or marks quiz as complete.
   */
  const handleAnswer = (answer) => {
    const updatedAnswers = {
      ...userAnswers,
      [questions[currentQuestionIndex].id]: answer,
    };

    setUserAnswers(updatedAnswers);

    if (currentQuestionIndex + 1 < questions.length) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizComplete(true);
      submitQuiz(updatedAnswers);
    }
  };

  /**
   * Submit quiz to server for evaluation.
   */
  const submitQuiz = async (finalAnswers) => {
    try {
      const response = await api.post("/quiz/submit", null, {
        params: {
          id: user?.id,
          ...finalAnswers,
        },
      });

      if (response.status === 200) {
        setQuizResult(response.data);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error.response?.data || error.message);
    }
  };

  /**
   * Store quiz for future history retrieval.
   */
  const storeQuiz = async () => {
    setModalMessage(null);

    if (!questions.length) {
      setModalMessage({
        type: "error",
        message: "No quiz data available to store.",
      });
      return;
    }

    const quizData = questions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      correctAnswer: question.correctAnswer,
      userResponse: userAnswers[question.id] || null,
    }));

    try {
      const response = await api.post("/quiz/store", quizData, {
        params: { userId: user?.id, programmingLanguage: language },
      });

      if (response.status === 200) {
        setModalMessage({ type: "success", message: "Quiz stored successfully!" });
      } else {
        setModalMessage({ type: "error", message: "Failed to store quiz." });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Error storing quiz. Please try again.";
      setModalMessage({ type: "error", message: errorMessage });
    }
  };

  // ------------------ Render Helpers ------------------

  /**
   * Render the question card with a smooth progress bar and improved styling.
   */
  const renderQuestion = () => {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <div
        className="
          bg-white 
          p-6 
          rounded-lg 
          shadow-2xl 
          max-w-4xl 
          mx-auto 
          transition-transform 
          duration-500 
          ease-in-out 
          animate-fadeInSlideUp
        "
      >
        {/* Question Header with progress */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-green-800 mb-2 md:mb-0">
              Question {currentQuestionIndex + 1} of {questions.length}
            </h2>
            <p className="text-sm text-gray-500">
              {/* Additional info if desired */}
            </p>
          </div>
          {/* Smooth Progress Bar */}
          <div className="w-full md:w-1/2 bg-gray-300 rounded-full mt-4 md:mt-0 overflow-hidden shadow-inner">
            <div
              className="bg-green-500 h-3 rounded-full transition-all duration-700 ease-in-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Text */}
        <div
          className="
            bg-green-50 
            p-4 
            rounded-lg 
            border-l-4 
            border-green-400 
            mb-6 
            shadow-sm
          "
        >
          <p className="text-lg text-gray-800 leading-relaxed">{question.question}</p>
        </div>

        {/* Answer Options */}
        <div className="space-y-4">
          {Object.entries(question.options).map(([key, option]) => (
            <button
              key={key}
              onClick={() => handleAnswer(key)}
              className="
                block 
                w-full 
                p-4 
                text-left 
                rounded-md 
                bg-white 
                border 
                border-gray-200 
                hover:bg-green-100
                hover:border-green-300 
                transition-colors 
                duration-300
                focus:outline-none 
                focus:ring-2 
                focus:ring-green-300
              "
            >
              <span className="font-semibold text-green-700 mr-2">{key}.</span>{" "}
              <span className="text-gray-700">{option}</span>
            </button>
          ))}
        </div>
      </div>
    );
  };

  /**
   * Render quiz results, with corrections and a "Store Quiz" button.
   */
  const renderResults = () => (
    <div className="bg-white p-8 rounded-lg shadow-2xl max-w-4xl mx-auto animate-fadeIn">
      <h2 className="text-3xl font-extrabold text-green-700 mb-6">Quiz Results</h2>
      <p className="text-gray-700 mb-8 text-lg">
        Your Score:{" "}
        <span className="text-green-500 font-bold text-2xl">
          {quizResult?.scorePercentage}%
        </span>
      </p>

      {quizResult?.corrections?.length > 0 && (
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-green-700 mb-4">Corrections:</h3>
          <ul className="space-y-4">
            {quizResult.corrections.map((correction, index) => (
              <li
                key={index}
                className="
                  p-4 
                  bg-gray-100 
                  rounded-md 
                  shadow-md 
                  text-gray-700
                  border-l-4 border-green-400
                "
              >
                <p className="text-base mb-2">
                  <strong className="text-green-800">Question:</strong>{" "}
                  {correction.question || "N/A"}
                </p>
                <p className="text-base mb-1">
                  <strong className="text-green-800">Your Answer:</strong>{" "}
                  <span className="italic">{correction.yourAnswer || "N/A"}</span>
                </p>
                <p className="text-base">
                  <strong className="text-green-800">Correct Answer:</strong>{" "}
                  <span className="underline">{correction.correctAnswer || "N/A"}</span>
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="text-center">
        <button
          onClick={storeQuiz}
          className="
            bg-green-600 
            text-white 
            py-3 px-8 
            rounded-lg 
            shadow-lg 
            hover:bg-green-700 
            transition-colors 
            duration-300
            text-xl
          "
        >
          Store Quiz
        </button>
      </div>
    </div>
  );

  // ------------------ Main JSX Return ------------------
  return (
    <div
      className="
        bg-gradient-to-b 
        from-green-50 
        to-green-100 
        min-h-screen 
        p-8 
        font-sans 
        overflow-auto
      "
    >
      {/* Title & Subtext */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-green-700 mb-3">
          Generate Your Quiz
        </h1>
        <p className="text-lg text-gray-700">
          Customize and take quizzes to improve your skills!
        </p>
      </div>

      {/* Start Screen / Generate Form */}
      {!questions.length && !quizComplete && (
        <div
          className="
            bg-white 
            p-8 
            rounded-lg 
            shadow-2xl 
            max-w-3xl 
            mx-auto 
            animate-fadeInSlideUp
          "
        >
          <h2 className="text-3xl font-bold text-green-700 mb-6">Start Your Quiz</h2>
          <form onSubmit={handleGenerate} className="grid gap-6">
            <div>
              <label
                htmlFor="language"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Programming Language
              </label>
              <input
                type="text"
                id="language"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                placeholder="Enter programming language"
                className="
                  p-3 
                  block 
                  w-full 
                  rounded-md 
                  border 
                  border-gray-300 
                  shadow-sm 
                  focus:ring-green-500 
                  focus:border-green-500
                  text-gray-800
                "
                required
              />
            </div>
            <div>
              <label
                htmlFor="difficulty"
                className="block text-sm font-medium text-gray-600 mb-2"
              >
                Difficulty Level
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className="
                  p-3 
                  block 
                  w-full 
                  rounded-md 
                  border 
                  border-gray-300 
                  shadow-sm 
                  focus:ring-green-500 
                  focus:border-green-500
                  text-gray-800
                "
                required
              >
                <option value="">Select Difficulty</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>
            <button
              type="submit"
              className="
                mt-6 
                w-full 
                bg-green-500 
                text-white 
                py-3 
                rounded-lg 
                hover:bg-green-600 
                transition 
                text-lg
              "
            >
              Generate Quiz
            </button>
          </form>
        </div>
      )}

      {/* Loading Overlay */}
      {isGenerating && (
        <div
          className="
            fixed 
            inset-0 
            bg-black 
            bg-opacity-50 
            flex 
            items-center 
            justify-center 
            z-50
          "
        >
          <div
            className="
              bg-white 
              p-8 
              rounded-lg 
              shadow-2xl 
              text-center 
              animate-fadeIn
            "
          >
            <CircularProgress className="mb-4 text-green-500" />
            <h2 className="text-2xl font-bold text-green-700 mb-2">
              Generating Quiz...
            </h2>
            <p className="text-gray-700 mt-4">
              Please wait while we prepare your quiz.
            </p>
          </div>
        </div>
      )}

      {/* Question Cards */}
      {questions.length > 0 && !quizComplete && renderQuestion()}

      {/* Results View */}
      {quizComplete && quizResult && renderResults()}

      {/* Modal Message */}
      {modalMessage && (
        <div
          className="
            fixed 
            inset-0 
            bg-black 
            bg-opacity-50 
            flex 
            items-center 
            justify-center 
            z-50
            animate-fadeIn
          "
        >
          <div
            className="
              bg-white 
              p-6 
              rounded-lg 
              shadow-xl 
              text-center 
              w-11/12 
              max-w-md
              transition-transform
              duration-500
            "
          >
            <p
              className={
                modalMessage.type === "success"
                  ? "text-green-500 font-bold text-lg"
                  : "text-red-500 font-bold text-lg"
              }
            >
              {modalMessage.message}
            </p>
            <button
              onClick={() => setModalMessage(null)}
              className="
                mt-6 
                bg-green-500 
                text-white 
                py-2 px-6 
                rounded-lg 
                hover:bg-green-600 
                transition
              "
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateQuiz;

/* 
  OPTIONAL EXTRA STYLES:
  You can add these animations to your Tailwind config or a separate CSS:
  
  @keyframes fadeIn {
    0% { opacity: 0; }
    100% { opacity: 1; }
  }
  .animate-fadeIn {
    animation: fadeIn 0.5s ease forwards;
  }

  @keyframes fadeInSlideUp {
    0% { opacity: 0; transform: translateY(30px); }
    100% { opacity: 1; transform: translateY(0); }
  }
  .animate-fadeInSlideUp {
    animation: fadeInSlideUp 0.6s ease forwards;
  }
*/
