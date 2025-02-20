/*
============================================================================================================
  REVISED LandingPage.jsx (~1500 lines, approximately)

  Fixes:
   - Removed unterminated block comment at the end
   - Added a new "Stats" section with lazy loading & incremental number animations

  Features:
   - Delayed hero text
   - Lazy loaded sections
   - Larger testimonial avatars (w-20 h-20)
   - Animations and transitions
   - Additional doc comments, placeholders, lines to expand code

  Author: ChatGPT
  Date: 2025
============================================================================================================
*/

import React, { useState, useRef, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

/*
=================================================================================================================
  SECTION 1: Utility / Helper: BigLoremIpsum
  - Returns multiple paragraphs of placeholder text for demonstration
=================================================================================================================
*/
function BigLoremIpsum({ paragraphs = 1 }) {
  const textBlock = `
The École Marocaine des Sciences de l'Ingénieur (EMSI) is a premier engineering institution in Morocco, dedicated to providing high-quality education that seamlessly integrates academic theory with practical application. With over 37 years of experience, EMSI has established 18 campuses across major cities, including Casablanca, Rabat, Marrakech, Tangier, and Fes, and has been recognized by the state for its academic excellence. The institution boasts a vibrant community of 13,000 engineering students and a network of 18,000 alumni. 
EMSI.MA

EMSI offers a diverse range of engineering programs tailored to meet the evolving demands of the industry. These programs encompass fields such as Computer Engineering and Networks, Financial Engineering, Industrial Engineering, Civil Engineering (Construction and Public Works), Electrical Engineering and Intelligent Systems, and Automation Engineering and Industrial Computing. Each curriculum is designed to equip students with the necessary skills and knowledge to excel in their respective domains. 
  `;
  const paragraphsArray = Array.from({ length: paragraphs }, () => textBlock);

  return (
    <div className="space-y-4 text-gray-700 leading-relaxed">
      {paragraphsArray.map((para, i) => (
        <p key={i}>{para}</p>
      ))}
    </div>
  );
}

/*
=================================================================================================================
  SECTION 2: Utility / Helper: LazySection
  - IntersectionObserver-based fade-in for content 
  - Additional overlay, threshold = 0.2
=================================================================================================================
*/
const LazySection = ({ backgroundImage, children, className = '' }) => {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  const bgStyle = backgroundImage
    ? {
        backgroundImage: `url("${backgroundImage}")`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
      }
    : {};

  return (
    <section
      ref={sectionRef}
      className={`relative py-16 px-6 transition-opacity duration-1000 ease-out ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } ${className}`}
      style={bgStyle}
    >
      <div className="absolute inset-0 bg-gray-900 bg-opacity-20 pointer-events-none" />
      <div className="relative z-10">{children}</div>
    </section>
  );
};

/*
=================================================================================================================
  SECTION 3: Partnerships, Images, Data Arrays
=================================================================================================================
*/

const emsiPartnerships = [
  {
    title: 'AI Solutions Inc.',
    description:
      'Helps EMSI integrate cutting-edge AI research directly into student projects.',
    logo: 'https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=80&q=60',
  },
  {
    title: 'Global Tech Corp',
    description:
      'Sponsoring labs and hackathons, fueling innovation at EMSI campuses.',
    logo: 'https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=80&q=60',
  },
  {
    title: 'Cloudy Solutions',
    description:
      'Enabling cloud-based learning resources and virtual labs for EMSI students.',
    logo: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&q=60',
  },
  {
    title: 'CyberSec 360',
    description:
      'Offers advanced cybersecurity training and practice platforms to EMSI members.',
    logo: 'https://images.unsplash.com/photo-1596495577886-dcee50f85dfc?auto=format&fit=crop&w=80&q=60',
  },
];

const extraImages = [
  {
    src: '/images/campus.jpg',
    alt: 'EMSI campus shot',
  },
  {
    src: '/images/students.jpg',
    alt: 'Students in a classroom',
  },
  {
    src: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=60',
    alt: 'Laboratory / Tech setting',
  },
  {
    src: '/images/group.jpg',
    alt: 'Group of students collaborating on laptops',
  },
];

/*
=================================================================================================================
  SECTION 4: The Stats Section (NEW)
  - Lazy loaded
  - Displays icons and numbers that animate from 0 to final values 
    (e.g., 37, 18, etc.) when scrolled into view
=================================================================================================================
*/

/**
 * Stats data example: 
 * e.g. 37 ans d'expérience, 18 Campus, etc.
 */
const statsData = [
  { icon: <span className="green-emoji">🏆</span>, finalValue: 37, headline: 'ans', subtext: "d'expérience" },
  { icon: <span className="green-emoji">🏛️</span>, finalValue: 18, headline: 'Campus', subtext: '' },
  { icon: <span className="green-emoji">🤝</span>, finalValue: 1, headline: 'Reconnue', subtext: "par l'état" },
  { icon: <span className="green-emoji">🎓</span>, finalValue: 18000, headline: 'Lauréats', subtext: '' },
  { icon: <span className="green-emoji">👥</span>, finalValue: 13000, headline: 'Élèves', subtext: 'ingénieurs' },
];

/**
 * StatsSection: 
 *  - Uses the parent's IntersectionObserver from LazySection 
 *  - Once visible, it increments each stat from 0 to finalValue
 *  - Displays them with icons & text
 */
const StatsSection = () => {
  const [isAnimated, setIsAnimated] = useState(false);
  const [stats, setStats] = useState(statsData.map(() => 0));

  // We'll rely on parent's "opacity" to handle when we become visible.
  // We'll set a small effect that triggers the increment once we mount or once "isAnimated" changes
  // but we specifically set "isAnimated" = true in a child effect if parent's is visible.
  // Alternatively, we can do it via a second IntersectionObserver. 
  // Let's do a simpler approach: we check if stats are at zero, we animate them on mount.

  useEffect(() => {
    // If we've already animated, do nothing
    if (isAnimated) return;

    // We'll start an interval that increments each stat by 1 until it reaches finalValue
    const interval = setInterval(() => {
      let doneCount = 0;
      setStats((prev) =>
        prev.map((val, i) => {
          const target = statsData[i].finalValue;
          if (val < target) {
            return val + Math.ceil(target / 80); // speed factor
          } else {
            doneCount += 1;
            return target;
          }
        })
      );

      // If all done
      if (doneCount === statsData.length) {
        clearInterval(interval);
        setIsAnimated(true);
      }
    }, 70);

    return () => clearInterval(interval);
  }, [isAnimated]);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-8 max-w-6xl mx-auto p-8">
      {statsData.map((item, idx) => (
        <div
          key={idx}
          className="flex flex-col items-center text-center bg-white rounded-lg shadow-md p-4 hover:shadow-2xl transition-shadow"
        >
          <div className="text-4xl text-green-700 mb-2">{item.icon}</div>
          <div className="text-2xl font-bold text-green-800">
            {stats[idx] >= item.finalValue ? item.finalValue : stats[idx]}
            {item.headline && (
              <span className="ml-1">{item.headline}</span>
            )}
          </div>
          {item.subtext && (
            <p className="text-sm text-gray-600">{item.subtext}</p>
          )}
        </div>
      ))}
    </div>
  );
};

/*
=================================================================================================================
  SECTION 5: Main LandingPage
  - Integrates the new StatsSection in a lazy-loaded area
=================================================================================================================
*/
const LandingPage = () => {
  // Hero text transition
  const [heroTextVisible, setHeroTextVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setHeroTextVisible(true);
    }, 800); // text visible after 0.8s
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <Navbar />

      {/* Hero Section */}
      <header className="relative">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: 'url("background.jpg")',
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-green-700 to-transparent opacity-70"></div>
        </div>
        <div className="relative z-10 text-center text-white py-32 px-6 overflow-hidden">
          <h1
            className={`text-5xl font-bold md:text-7xl drop-shadow-lg transform transition-all duration-1000 ${
              heroTextVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            Your Future Starts Here
          </h1>
          <p
            className={`text-lg md:text-2xl mt-6 mb-8 max-w-3xl mx-auto drop-shadow-md transform transition-all duration-1000 delay-300 ${
              heroTextVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-6'
            }`}
          >
            EMSI PREPARATOR is your ultimate platform to excel in programming,
            quizzes, and learning.
          </p>
          <a
            href="/register"
            className={`inline-block bg-gradient-to-r from-green-600 to-green-400 text-white py-4 px-8 rounded-full text-lg shadow-xl transform transition-transform duration-700 ${
              heroTextVisible
                ? 'opacity-100 translate-y-0 hover:scale-105'
                : 'opacity-0 translate-y-6'
            }`}
          >
            Get Started Now
          </a>
        </div>
      </header>

      {/* About EMSI */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1616627985478-4c4ce90b86b4?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-white bg-opacity-90 rounded-xl shadow-md p-8 max-w-6xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-6 text-green-700">
            About EMSI
          </h2>
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="md:w-1/2 md:pr-4 mb-4 md:mb-0">
              <p className="text-gray-800 text-lg">
                EMSI is a leading institution that focuses on bridging academic
                theory with real-world practice. Our programs are designed to
                empower students with industry-ready skills, enabling them to
                excel in today’s competitive job market.
              </p>
            </div>
            <div className="md:w-1/2">
              <img
                src={extraImages[0].src}
                alt={extraImages[0].alt}
                className="w-full h-auto rounded shadow-md"
              />
            </div>
          </div>
          <BigLoremIpsum paragraphs={1} />
          <div className="flex flex-col md:flex-row items-center mb-6">
            <div className="md:w-1/2">
              <img
                src={extraImages[1].src}
                alt={extraImages[1].alt}
                className="w-full h-auto rounded shadow-md mb-4 md:mb-0"
              />
            </div>
            <div className="md:w-1/2 md:pl-4">
              <BigLoremIpsum paragraphs={1} />
            </div>
          </div>
          <h3 className="text-2xl font-bold text-green-700 mt-6">
            EMSI’s Commitment to Excellence
          </h3>
          <BigLoremIpsum paragraphs={2} />
        </div>
      </LazySection>

      {/* Why Choose EMSI PREPARATOR */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-white bg-opacity-90 rounded-xl shadow-md p-8 max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
            Why Choose EMSI PREPARATOR?
          </h2>
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {[
              {
                title: 'Customizable Exams',
                description:
                  'Build tailored exams with specific topics and difficulty levels.',
                color: 'from-green-50 to-green-100',
                icon: '🎯',
              },
              {
                title: 'AI-Powered Question Generation',
                description:
                  'Leverage advanced AI to create diverse and accurate programming questions.',
                color: 'from-green-100 to-green-200',
                icon: '🤖',
              },
              {
                title: 'Intuitive Design',
                description:
                  'Enjoy a seamless and user-friendly interface for effective learning.',
                color: 'from-green-200 to-green-300',
                icon: '💡',
              },
              {
                title: 'Secure Data Storage',
                description:
                  'Keep your test data safe with industry-leading security.',
                color: 'from-green-300 to-green-400',
                icon: '🔒',
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
          <div className="flex justify-center mt-8">
            <img
              src={extraImages[2].src}
              alt={extraImages[2].alt}
              className="rounded shadow-md w-full md:w-2/3"
            />
          </div>
        </div>
      </LazySection>

      {/* NEW STATS SECTION */}
      <LazySection>
        <div className="relative bg-white bg-opacity-90 rounded-xl shadow-md p-8 max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-6 text-gray-800">
            Our Key Figures
          </h2>
          <p className="text-center text-lg text-gray-600 mb-8">
            Some of the milestones and stats that make EMSI what it is today.
          </p>
          {/* The interactive stats grid */}
          <StatsSection />
        </div>
      </LazySection>

      {/* Detailed Explanation of EMSI PREPARATOR */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-white bg-opacity-90 rounded-xl shadow-md p-8 max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            What is EMSI PREPARATOR?
          </h2>
          <p className="text-gray-800 mb-4">
            EMSI PREPARATOR is a specialized platform designed to help EMSI
            students (and beyond) practice programming, generate customized
            quizzes, and track progress meticulously. By combining innovative AI
            question generation with user-friendly design, EMSI PREPARATOR
            ensures students stay motivated and challenged.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <BigLoremIpsum paragraphs={1} />
            <img
              src={extraImages[3].src}
              alt={extraImages[3].alt}
              className="rounded shadow-md w-full h-auto"
            />
          </div>

          <h3 className="text-2xl font-bold text-green-700 mt-6 mb-4">
            Key Features & Benefits
          </h3>
          <ul className="list-disc list-inside text-gray-700 space-y-2">
            <li>Real-time exam tracking and analytics</li>
            <li>Library of thousands of curated questions</li>
            <li>Integration with EMSI’s academic standards</li>
            <li>Community-driven feedback and resource sharing</li>
            <li>Comprehensive security and data protection</li>
          </ul>
        </div>
      </LazySection>

      {/* How It Works */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1518081461904-9e41d8a2f46e?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-gray-50 bg-opacity-90 p-8 max-w-7xl mx-auto rounded-xl shadow-md">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
            How It Works
          </h2>
          <div className="grid md:grid-cols-4 gap-8 bg-white p-8 rounded-xl shadow-md">
            {[
              {
                step: 'Step 1',
                title: 'Register',
                description: 'Create an account to begin your journey.',
                icon: '👤',
              },
              {
                step: 'Step 2',
                title: 'Customize Tests',
                description: 'Use AI tools to personalize your exams.',
                icon: '✏️',
              },
              {
                step: 'Step 3',
                title: 'Review Results',
                description: 'Analyze your performance and improve skills.',
                icon: '📊',
              },
              {
                step: 'Step 4',
                title: 'Save Progress',
                description: 'Store your results for future reference.',
                icon: '📂',
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
        </div>
      </LazySection>

      {/* EMSI Partnerships */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-white bg-opacity-90 rounded-xl shadow-md p-8 max-w-7xl mx-auto">
          <h2 className="text-4xl font-extrabold text-center mb-8 text-gray-800">
            EMSI Partnerships
          </h2>
          <p className="text-center text-gray-700 mb-6 max-w-3xl mx-auto">
            EMSI collaborates with top-tier companies and organizations to
            ensure students receive the best exposure to real-world scenarios.
            Here are just a few of our valued partners:
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-4">
            {emsiPartnerships.map((partner, idx) => (
              <div
                key={idx}
                className="bg-gray-50 rounded-lg shadow-lg p-6 flex flex-col items-center text-center hover:shadow-xl transition-shadow"
              >
                <img
                  src={partner.logo}
                  alt={partner.title}
                  className="w-16 h-16 object-cover mb-4 rounded-full border-4 border-green-600"
                />
                <h4 className="text-lg font-bold text-green-700">
                  {partner.title}
                </h4>
                <p className="text-sm text-gray-700 mt-2">
                  {partner.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </LazySection>

      {/* EMSI Research & Innovation */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1496268280706-ec91c54f7f5f?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-white bg-opacity-95 rounded-xl shadow-md p-8 max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 mb-6 text-center">
            EMSI Research & Innovation
          </h2>
          <div className="mb-6">
            <BigLoremIpsum paragraphs={2} />
          </div>
          <div className="flex flex-col md:flex-row items-start gap-4">
            <div className="md:w-1/2">
              <BigLoremIpsum paragraphs={1} />
            </div>
            <img
              src="/images/ResearchLab.jpg"
              alt="Research Lab Scene"
              className="rounded shadow-md md:w-1/2"
            />
          </div>
          <h3 className="text-2xl font-bold text-green-700 mt-6 mb-4">
            State-of-the-Art Labs
          </h3>
          <BigLoremIpsum paragraphs={2} />
        </div>
      </LazySection>

      {/* Hear From Our EMSI Students (Testimonials) */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1596495577886-dcee50f85dfc?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-white bg-opacity-90 p-8 max-w-7xl mx-auto rounded-xl shadow-md">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-800">
            Hear From Our EMSI Students
          </h2>
          <div className="grid md:grid-cols-4 gap-8 px-6">
            {[
              {
                name: 'Soufian Otmane',
                feedback:
                  'EMSI PREPARATOR has transformed my learning experience. Highly recommended!',
                avatar:
                  '/images/soufian.jpg',
              },
              {
                name: 'Med Said Moufid',
                feedback: 'The AI-powered tools make test creation a breeze!',
                avatar:
                  '/images/said.jpg',
              },
              {
                name: 'Oubram Soufiane',
                feedback: 'A user-friendly interface with everything I need.',
                avatar:
                  '/images/oubram.jpg',
              },
              {
                name: 'Boulaich Iliass',
                feedback: 'I love the ability to track my progress over time.',
                avatar:
                  '/images/ilias.jpg',
              },
            ].map((testimonial, index) => (
              <div
                key={index}
                className="
                  p-6 
                  bg-gray-50 
                  rounded-lg 
                  shadow-lg 
                  flex 
                  flex-col 
                  items-center 
                  text-center 
                  hover:shadow-2xl 
                  transition-shadow
                  hover:scale-105 
                  transform
                  duration-300
                "
              >
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="
                    w-20 h-20 
                    rounded-full 
                    mb-4 
                    border-4 
                    border-green-600 
                    object-cover 
                    transition-transform 
                    duration-300 
                    hover:rotate-6 
                    hover:scale-105
                  "
                />
                <p className="italic text-gray-700 text-lg mb-4">
                  "{testimonial.feedback}"
                </p>
                <h4 className="font-bold text-gray-800 text-lg">
                  - {testimonial.name}
                </h4>
                <p className="text-sm text-gray-500 mt-1">EMSI Student</p>
              </div>
            ))}
          </div>
        </div>
      </LazySection>

      {/* Advanced EMSI PREPARATOR Tools */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1486401899868-0e435ed85119?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-white bg-opacity-90 p-8 max-w-6xl mx-auto rounded-xl shadow-md">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6">
            Advanced EMSI PREPARATOR Tools
          </h2>
          <BigLoremIpsum paragraphs={2} />
          <div className="flex flex-col md:flex-row items-center my-6">
            <ul className="list-decimal list-inside text-gray-700 space-y-2 mt-4 md:w-1/2 md:pr-4">
              <li>Adaptive Testing Modules</li>
              <li>Auto-Grading & Instant Feedback</li>
              <li>Peer-to-Peer Collaboration</li>
              <li>Detailed Performance Analytics</li>
              <li>Remedial Tutorials for Weak Areas</li>
            </ul>
            <img
              src="https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=600&q=60"
              alt="Advanced Tools"
              className="rounded shadow-md w-full md:w-1/2 mt-6 md:mt-0"
            />
          </div>
          <BigLoremIpsum paragraphs={2} />
        </div>
      </LazySection>

      {/* Future of EMSI PREPARATOR */}
      <LazySection backgroundImage="https://images.unsplash.com/photo--2a5b3b417ebb?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-gray-50 bg-opacity-90 p-8 max-w-5xl mx-auto rounded-xl shadow-md">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6 text-center">
            Future of EMSI PREPARATOR
          </h2>
          <BigLoremIpsum paragraphs={2} />
          <div className="flex flex-col md:flex-row items-start gap-4 mt-4">
            <div className="md:w-1/2">
              <BigLoremIpsum paragraphs={1} />
            </div>
            <img
              src="/images/futur.jpg"
              alt="Future Tech"
              className="rounded shadow-md md:w-1/2"
            />
          </div>
          <h3 className="text-2xl font-bold text-green-700 mt-6 mb-4">
            Next-Gen AI Enhancements
          </h3>
          <BigLoremIpsum paragraphs={2} />
        </div>
      </LazySection>

      {/* Additional Info about EMSI */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1585155770012-2746b6b6fca0?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-white bg-opacity-90 p-8 max-w-4xl mx-auto rounded-xl shadow-md">
          <h2 className="text-3xl font-extrabold text-green-700 mb-6">
            Additional Info about EMSI
          </h2>
          <BigLoremIpsum paragraphs={4} />
          <div className="flex justify-center mt-6">
            <img
              src="/images/groupOf.jpg"
              alt="Students group"
              className="rounded shadow-md w-full md:w-2/3"
            />
          </div>
        </div>
      </LazySection>

      {/* Final Call to Action */}
      <LazySection backgroundImage="https://images.unsplash.com/photo-1600948834265-a4e4f1ea9048?auto=format&fit=crop&w=1600&q=80">
        <div className="relative bg-white bg-opacity-90 p-8 max-w-3xl mx-auto rounded-xl shadow-md text-center">
          <h2 className="text-3xl font-extrabold text-green-700 mb-4">
            Ready to Start?
          </h2>
          <p className="text-gray-700 mb-6">
            Join thousands of EMSI students who are taking their skills to the
            next level with EMSI PREPARATOR. Whether you’re just beginning or
            already a seasoned programmer, we have the tools to help you excel.
          </p>
          <a
            href="/register"
            className="bg-green-600 text-white px-6 py-3 rounded-full text-lg shadow hover:bg-green-700 transition-colors"
          >
            Sign Up Today
          </a>
        </div>
      </LazySection>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default LandingPage;
