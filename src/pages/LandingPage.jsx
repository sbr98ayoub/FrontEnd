import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const LandingPage = () => {
  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen flex flex-col">
      <Navbar />

      {/* Hero Section */}
      <header className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('background.jpg')", // Replace with an appropriate hero image
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-transparent opacity-70"></div>
        </div>
        <div className="relative z-10 text-center text-white py-32 px-6">
          <h1 className="text-5xl font-bold md:text-7xl drop-shadow-lg animate-fadeIn">
            Your Future Starts Here
          </h1>
          <p className="text-lg md:text-2xl mt-6 mb-8 max-w-3xl mx-auto drop-shadow-md animate-slideUp">
            EMSI PREPARATOR is your ultimate platform to excel in programming, quizzes, and learning.
          </p>
          <a
            href="/register"
            className="bg-gradient-to-r from-green-600 to-green-400 text-white py-4 px-8 rounded-full text-lg hover:scale-105 transition-transform shadow-xl"
          >
            Get Started Now
          </a>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Why Choose EMSI PREPARATOR?
        </h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">
          {[
            {
              title: "Customizable Exams",
              description:
                "Build tailored exams with specific topics and difficulty levels.",
              color: "from-green-50 to-green-100",
              icon: "🎯",
            },
            {
              title: "AI-Powered Question Generation",
              description:
                "Leverage advanced AI to create diverse and accurate programming questions.",
              color: "from-green-100 to-green-200",
              icon: "🤖",
            },
            {
              title: "Intuitive Design",
              description:
                "Enjoy a seamless and user-friendly interface for effective learning.",
              color: "from-green-200 to-green-300",
              icon: "💡",
            },
            {
              title: "Secure Data Storage",
              description:
                "Keep your test data safe with industry-leading security.",
              color: "from-green-300 to-green-400",
              icon: "🔒",
            },
          ].map((feature, index) => (
            <div
              key={index}
              className={`p-8 bg-gradient-to-br ${feature.color} rounded-xl shadow-lg hover:scale-105 transition-transform`}
            >
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-2xl font-bold text-gray-800 mb-4">
                {feature.title}
              </h3>
              <p className="text-gray-700">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-16 bg-gray-50">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          How It Works
        </h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6 bg-white p-8 rounded-xl shadow-md">
          {[
            {
              step: "Step 1",
              title: "Register",
              description: "Create an account to begin your journey.",
              icon: "👤",
            },
            {
              step: "Step 2",
              title: "Customize Tests",
              description: "Use AI tools to personalize your exams.",
              icon: "✏️",
            },
            {
              step: "Step 3",
              title: "Review Results",
              description: "Analyze your performance and improve skills.",
              icon: "📊",
            },
            {
              step: "Step 4",
              title: "Save Progress",
              description: "Store your results for future reference.",
              icon: "📂",
            },
          ].map((step, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-lg shadow-lg hover:bg-green-100 transition-colors"
            >
              <div className="text-4xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-bold text-green-600 mb-4">
                {step.step}: {step.title}
              </h3>
              <p className="text-gray-700">{step.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
          Hear From Our Users
        </h2>
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-8 px-6">
          {[
            {
              name: "Jane Doe",
              feedback:
                "EMSI PREPARATOR has transformed my learning experience. Highly recommended!",
              avatar: "/images/avatar1.png",
            },
            {
              name: "John Smith",
              feedback:
                "The AI-powered tools make test creation a breeze!",
              avatar: "/images/avatar2.jpg",
            },
            {
              name: "Emily Rose",
              feedback: "A user-friendly interface with everything I need.",
              avatar: "/images/avatar3.png",
            },
            {
              name: "Michael Lee",
              feedback:
                "I love the ability to track my progress over time.",
              avatar: "/images/avatar4.png",
            },
          ].map((testimonial, index) => (
            <div
              key={index}
              className="p-6 bg-gray-50 rounded-lg shadow-lg hover:shadow-2xl transition-shadow"
            >
              <img
                src={testimonial.avatar}
                alt={testimonial.name}
                className="w-16 h-16 rounded-full mb-4 mx-auto border-4 border-green-600"
              />
              <p className="italic text-gray-700 text-lg mb-4">
                "{testimonial.feedback}"
              </p>
              <h4 className="font-bold text-gray-800 text-center text-lg">
                - {testimonial.name}
              </h4>
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LandingPage;
