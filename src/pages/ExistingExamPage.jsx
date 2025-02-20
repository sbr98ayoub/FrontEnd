/* 
==========================================================================================================
    GIANT SINGLE-FILE EXAMPLE: "ExistingExamsPage.jsx"
    ~ Approximately 1,000 lines of code demonstrating React + Tailwind + extensive content ~
    This file includes:
      - Massive doc comments
      - Large data arrays
      - Multiple subcomponents
      - Lazy loading images
      - Collapsible sections
      - Parallax hero section
      - Overly verbose text blocks
      - A random FAQ section
      - And more!

    DISCLAIMER:
      This code is intentionally overkill for demonstration purposes. 
      In real practice, break it into separate components, reduce repeated code, 
      and structure the project with clear, maintainable patterns.

    For demonstration, it references numerous pictures from Unsplash 
    (public domain or permitted images), plus placeholders where needed.

    We hope this massive example showcases 
    how "powerful" your React + Tailwind page can be with creativity and some lines of code :-)
==========================================================================================================
*/

import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/*
==========================================================================================================
  Section 1:  Helper / Utility Hooks & Components
  - LazyImage: a custom Intersection Observer-based lazy loader for images.
  - Collapsible: a small component for a show/hide toggle with transitions.
  - LoremIpsum: just a function to output a chunk of placeholder text.
==========================================================================================================
*/

/** 
 * LazyImage:
 * - Accepts 'src', 'alt', and optional 'className'.
 * - Uses IntersectionObserver to render the <img> tag only when it appears in viewport.
 * - Adds a fade-in effect onLoad.
 */
const LazyImage = ({ src, alt, className = '' }) => {
  const [isInView, setIsInView] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const imgRef = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return (
    <div ref={imgRef} className={`overflow-hidden ${className}`}>
      {isInView && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-700 ease-in-out ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      )}
    </div>
  );
};

/**
 * Collapsible:
 * - A simple wrapper component that toggles between collapsed and expanded states 
 *   using a "max-height" approach for smooth transitions.
 * - Accepts 'title', 'children' content, and optional booleans or callbacks for control.
 */
const Collapsible = ({
  title,
  defaultExpanded = false,
  children,
  className = '',
}) => {
  const [expanded, setExpanded] = useState(defaultExpanded);

  return (
    <div className={`border border-gray-200 rounded-md shadow-sm p-4 ${className}`}>
      <div
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between cursor-pointer"
      >
        <h3 className="text-lg font-bold text-green-700">{title}</h3>
        <span className="text-gray-500 hover:text-green-600 transition-colors">
          {expanded ? '[-]' : '[+]'}
        </span>
      </div>
      <div
        className={`transition-all duration-500 ease-in-out overflow-hidden mt-2 ${
          expanded ? 'max-h-[2000px]' : 'max-h-0'
        }`}
      >
        {expanded && <div className="pt-2">{children}</div>}
      </div>
    </div>
  );
};

/**
 * LoremIpsum:
 * - Returns a large chunk of placeholder text for demonstration.
 * - This helps pad out our code and UI with realistic text.
 */
function LoremIpsum() {
  return (
    <p className="text-gray-700 mb-4">
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
      sollicitudin condimentum diam, a congue nulla scelerisque a. Nulla dapibus
      leo eget lorem tempus, nec blandit sapien bibendum. Vestibulum quis nunc
      non ante tincidunt tincidunt. Donec scelerisque leo ipsum, at consectetur
      felis blandit quis. Phasellus nec eros vulputate, pharetra enim at,
      maximus leo. In sodales sem quam, vitae pellentesque sem placerat in.
      Maecenas sed tincidunt nunc. Phasellus tempor elementum suscipit. Etiam
      eget gravida lacus, vel fringilla metus. Nulla nisl felis, convallis
      fermentum nibh ut, vehicula sagittis orci. Quisque sagittis malesuada
      scelerisque. Duis interdum tortor in lacus interdum vestibulum. Sed
      viverra purus quis massa euismod venenatis. Vivamus vel ipsum sed ante
      placerat aliquam id in erat. Pellentesque mattis arcu vel magna mollis,
      gravida luctus diam placerat. Proin non placerat purus.
    </p>
  );
}

/*
==========================================================================================================
  Section 2: Big data structures with categories, multiple items, images, etc.
  We'll fill them with references to Unsplash images to "add some pictures from the web".
==========================================================================================================
*/

/** 
 * Potential category data 
 * (We intentionally bloat this array with many categories 
 *  and multiple images to reach a large amount of lines 
 *  and illustrate a wide variety of topics.)
 */
const bigCategoryList = [
  {
    title: 'Front End',
    description:
      'Focus on building dynamic and interactive user interfaces using JavaScript, React, Vue, or Angular.',
    languages: [
      {
        id: 1,
        name: 'JavaScript',
        image:
          'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'The essential scripting language for modern web development.',
      },
      {
        id: 2,
        name: 'React',
        image:
          'https://images.unsplash.com/photo-1593720214474-43f6e2be3ea8?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'A powerful library for building user interfaces with reusable components.',
      },
      {
        id: 3,
        name: 'Vue',
        image:
          'https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'A progressive framework for building user interfaces quickly and easily.',
      },
      {
        id: 4,
        name: 'Angular',
        image:
          'https://images.unsplash.com/photo-1612831196805-22cdf3faa6d6?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Google’s TypeScript-based framework for scalable web applications.',
      },
      {
        id: 5,
        name: 'Svelte',
        image:
          'https://images.unsplash.com/photo-1530639833923-e3f4d7b56647?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'A compiler that helps you build highly reactive user interfaces with minimal overhead.',
      },
    ],
  },
  {
    title: 'Back End',
    description:
      'Server-side programming, databases, and APIs using languages like Python, Java, Node.js, etc.',
    languages: [
      {
        id: 6,
        name: 'Python',
        image:
          'https://images.unsplash.com/photo-1623768835391-7213f0b201d2?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'A versatile language great for everything from web back ends to data analysis.',
      },
      {
        id: 7,
        name: 'Java',
        image:
          'https://images.unsplash.com/photo-1515515676523-2dda7a44f0c5?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Widely used in enterprise environments, robust and platform-independent.',
      },
      {
        id: 8,
        name: 'Node.js',
        image:
          'https://images.unsplash.com/photo-1603127831548-f5c56bb0b6f6?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'JavaScript runtime environment for building fast, scalable server-side applications.',
      },
      {
        id: 9,
        name: 'C#',
        image:
          'https://images.unsplash.com/photo-1544785349-c4a5301826fd?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Microsoft’s modern language powering many back ends, especially in the .NET ecosystem.',
      },
      {
        id: 10,
        name: 'Ruby on Rails',
        image:
          'https://images.unsplash.com/photo-1497493292307-31c376b6e479?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Convention-over-configuration framework for quick and easy back-end dev.',
      },
    ],
  },
  {
    title: 'Networking',
    description:
      'Protocols, topologies, routers, firewalls, and everything related to data communications.',
    languages: [
      {
        id: 11,
        name: 'Networks 101',
        image:
          'https://images.unsplash.com/photo-1603791440384-56cd371ee9c5?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Learn the basics of IP addressing, subnets, and fundamental protocols like TCP/IP.',
      },
      {
        id: 12,
        name: 'Cisco Routing',
        image:
          'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Dive into configuring Cisco routers, VLANs, OSPF, EIGRP, and more.',
      },
      {
        id: 13,
        name: 'Network Security',
        image:
          'https://images.unsplash.com/photo-1544194215-541c2d3561a2?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Focuses on securing networks using firewalls, IDS/IPS, and best practices.',
      },
    ],
  },
  {
    title: 'AI & Data',
    description:
      'Machine Learning, Deep Learning, and Data processing frameworks: TensorFlow, PyTorch, etc.',
    languages: [
      {
        id: 14,
        name: 'TensorFlow',
        image:
          'https://images.unsplash.com/photo-1492724441997-5dc865305da6?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Google’s powerful library for building and training neural networks at scale.',
      },
      {
        id: 15,
        name: 'PyTorch',
        image:
          'https://images.unsplash.com/photo-1515060927253-cfbaxd7177r8?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Flexible framework by Facebook AI for fast experimentation in deep learning.',
      },
      {
        id: 16,
        name: 'Data Science w/ Python',
        image:
          'https://images.unsplash.com/photo-1554108491-4e8e24b9da82?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Pandas, NumPy, Matplotlib, and scikit-learn for data analysis & machine learning.',
      },
    ],
  },
  {
    title: 'Security',
    description:
      'Penetration testing, cryptography, secure coding practices, and security certifications.',
    languages: [
      {
        id: 17,
        name: 'Pen Testing Basics',
        image:
          'https://images.unsplash.com/photo-1518432035791-00fb7c47b0e8?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Learn the fundamentals of ethical hacking, vulnerability scanning, and exploit methods.',
      },
      {
        id: 18,
        name: 'Cryptography 101',
        image:
          'https://images.unsplash.com/photo-1590870730801-b0b829cb5888?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Explore encryption/decryption, hashing, symmetric and asymmetric cryptography.',
      },
      {
        id: 19,
        name: 'Web App Security',
        image:
          'https://images.unsplash.com/photo-1503945438517-f65904a52ce6?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Delve into OWASP top 10 vulnerabilities, secure code reviews, and best practices.',
      },
    ],
  },
  {
    title: 'DevOps',
    description:
      'Continuous Integration, Continuous Deployment, Docker, Kubernetes, and agile processes.',
    languages: [
      {
        id: 20,
        name: 'Docker',
        image:
          'https://images.unsplash.com/photo-1518773553398-650c184e0bb3?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Containerization platform to package applications and dependencies consistently.',
      },
      {
        id: 21,
        name: 'Kubernetes',
        image:
          'https://images.unsplash.com/photo-1591696331118-917e06c0bf44?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Orchestrate containerized applications for scaling and management across clusters.',
      },
      {
        id: 22,
        name: 'Jenkins',
        image:
          'https://images.unsplash.com/photo-1587620985032-3e62ad4ab7ef?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Automate the build, test, and deployment pipeline for faster, reliable releases.',
      },
    ],
  },
  {
    title: 'Cloud Computing',
    description:
      'Services and frameworks on AWS, Azure, GCP. Infrastructure as a Service (IaaS), etc.',
    languages: [
      {
        id: 23,
        name: 'AWS Fundamentals',
        image:
          'https://images.unsplash.com/photo-1534278931828-c0e11ee3f9cf?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Learn about EC2, S3, RDS, and essential AWS services for building scalable apps.',
      },
      {
        id: 24,
        name: 'Azure Basics',
        image:
          'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Microsoft’s cloud platform with integrated services for data, AI, DevOps, and more.',
      },
      {
        id: 25,
        name: 'Google Cloud',
        image:
          'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'GCP provides global infrastructure, big data tools, and AI services for modern apps.',
      },
    ],
  },
  {
    title: 'Databases',
    description:
      'SQL, NoSQL, in-memory stores, scaling, sharding, indexing, replication, etc.',
    languages: [
      {
        id: 26,
        name: 'MySQL',
        image:
          'https://images.unsplash.com/photo-1611732666890-9d7cd6f96db6?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Popular open-source relational database, widely used for web applications.',
      },
      {
        id: 27,
        name: 'MongoDB',
        image:
          'https://images.unsplash.com/photo-1543269664-76bc3997d9ea?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Document-based NoSQL database for flexible schemas and rapid development.',
      },
      {
        id: 28,
        name: 'Redis',
        image:
          'https://images.unsplash.com/photo-1600267177077-177e18f57ac1?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'In-memory data store for caching, message brokering, and real-time analytics.',
      },
    ],
  },
  {
    title: 'Mobile Development',
    description:
      'iOS, Android, cross-platform frameworks like React Native, Flutter, etc.',
    languages: [
      {
        id: 29,
        name: 'Android (Kotlin)',
        image:
          'https://images.unsplash.com/photo-1481277542470-605612bd2d61?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Build modern Android apps using Kotlin, the official recommended language.',
      },
      {
        id: 30,
        name: 'iOS (Swift)',
        image:
          'https://images.unsplash.com/photo-15044661858-57d074685165?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Apple’s language for building iOS, macOS, watchOS, and tvOS apps with Swift.',
      },
      {
        id: 31,
        name: 'React Native',
        image:
          'https://images.unsplash.com/photo-1585079549019-afa7550a2ea2?auto=format&fit=crop&w=400&q=60',
        shortDesc:
          'Leverage React knowledge to create native mobile apps for Android and iOS.',
      },
    ],
  },
  // You can keep adding more categories if you want to bloat the code even further...
];

/*
==========================================================================================================
  Section 3: Large Additional Arrays or Test Data
  - We might want "testimonials" or "FAQs" or "featured articles," etc. 
  - We'll create some arrays that contain images from Unsplash with placeholders. 
  - This is purely to enlarge code and show how we might structure big data.
==========================================================================================================
*/

// A large array for "testimonials"
const testimonialsData = [
  {
    id: 1,
    name: 'Alice Johnson',
    role: 'Front End Developer',
    testimonial:
      'I started with no real knowledge of frameworks, and the Knowledge Hub gave me exactly what I needed to master React!',
    image:
      'https://images.unsplash.com/photo-1560298805-c56f76a16b07?auto=format&fit=crop&w=100&q=60',
  },
  {
    id: 2,
    name: 'Bob Smith',
    role: 'Networking Engineer',
    testimonial:
      'The Networking section’s exam-style questions were really close to the real thing—helped me ace my CCNA!',
    image:
      'https://images.unsplash.com/photo-1502641927521-00c4f006e8f4?auto=format&fit=crop&w=100&q=60',
  },
  {
    id: 3,
    name: 'Charlie Davis',
    role: 'AI Researcher',
    testimonial:
      'Deep Learning resources are top-notch. The practice quizzes on neural networks were exactly what I needed.',
    image:
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=100&q=60',
  },
  {
    id: 4,
    name: 'Diana Prince',
    role: 'Security Analyst',
    testimonial:
      'I appreciate how thorough the security category is—covering pen testing, cryptography, and more all in one place.',
    image:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=crop&w=100&q=60',
  },
  {
    id: 5,
    name: 'Ethan Brown',
    role: 'DevOps Engineer',
    testimonial:
      'Finally found a single resource that covers Docker, Kubernetes, Jenkins, and the entire CI/CD pipeline!',
    image:
      'https://images.unsplash.com/photo-1620756069106-1c8c3591dca3?auto=format&fit=crop&w=100&q=60',
  },
];

// A large array for "FAQs"
const faqData = [
  {
    question: 'How do I sign up for an exam?',
    answer:
      'Simply navigate to the relevant category, expand the section, and choose your language/technology. You will see a "View Exams" button that directs you to the enrollment page.',
  },
  {
    question: 'Are there any prerequisites?',
    answer:
      'While some categories like AI & Data may suggest a background in math or programming, you can jump in at any time. We also offer beginner-friendly resources.',
  },
  {
    question: 'Can I retake an exam?',
    answer:
      'Absolutely! Our platform encourages repeat attempts to cement your knowledge. You can retake an exam after a cooldown period of 24 hours.',
  },
  {
    question: 'How frequently is the content updated?',
    answer:
      'We strive to update our question banks and study materials monthly. Our content team actively reviews feedback to keep exams relevant.',
  },
  {
    question: 'Do I get a certificate upon completion?',
    answer:
      'Yes, if you achieve a passing score on any exam, you will receive a digitally verifiable certificate that you can share with employers or on social media.',
  },
  {
    question: 'Is there any cost associated?',
    answer:
      'Basic exams and quizzes are free. We offer premium plans for advanced or specialized exams, which also come with detailed video explanations.',
  },
  {
    question: 'What if I find errors or outdated info?',
    answer:
      'Please reach out via our support page. We appreciate user feedback and fix inaccuracies as soon as possible.',
  },
  {
    question: 'Do you offer live workshops or tutoring?',
    answer:
      'Yes! We occasionally host live workshops on trending topics. Keep an eye on our events page for upcoming sessions.',
  },
  // We can keep adding more FAQ items to inflate the code...
];

/*
==========================================================================================================
  Section 4: Main Page Component
  - We'll define multiple sub-sections:
      1) Hero with parallax background
      2) Introduction / dynamic text
      3) Category listing with collapsibles & lazy-loaded images
      4) A big testimonials section
      5) Possibly another big chunk of LoremIpsum for "extra content"
      6) A frequently asked questions section
      7) A final footer
==========================================================================================================
*/

const ExistingExamsPage = () => {
  const navigate = useNavigate();
  const [expandedCategoryIndex, setExpandedCategoryIndex] = useState(null);

  // Collapsing and expanding categories
  const handleToggleCategory = (index) => {
    if (expandedCategoryIndex === index) {
      setExpandedCategoryIndex(null);
    } else {
      setExpandedCategoryIndex(index);
    }
  };

  const handleLanguageClick = (langName) => {
    // Navigate to the exam detail page
    navigate(`/exams/${langName}`);
  };

  return (
    <div className="min-h-screen w-full flex flex-col justify-start bg-gray-50">
      {/* 
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          4.1 Hero Section with Parallax 
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */}
      <section
        className="relative h-[60vh] md:h-[70vh] lg:h-[80vh] bg-fixed bg-center bg-cover flex items-center justify-center"
        style={{
          backgroundImage:
            'url("https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1600&q=80")',
        }}
      >
        <div className="absolute inset-0 bg-green-900 bg-opacity-50" />
        <div className="relative z-10 text-center text-white px-4">
          <h1 className="text-5xl font-extrabold mb-4 drop-shadow-lg">
            Welcome to EMSI-PREPARATOR
          </h1>
          <p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
            Your one-stop platform for comprehensive exams, practice tests, and
            study resources across dozens of in-demand tech fields.
          </p>
          <a
            href="#categories"
            className="inline-block px-8 py-3 bg-green-600 hover:bg-green-700 transition-colors rounded-full font-semibold"
          >
            Explore Categories
          </a>
        </div>
      </section>

      {/* 
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          4.2 Introduction / Additional Static Text
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */}
      <section className="bg-white py-12 px-4 sm:px-8 lg:px-16">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-6">
            Unlock Your Potential
          </h2>
          <p className="text-gray-700 leading-relaxed mb-4">
            Whether you're a budding developer, a network engineer, a cloud
            specialist, or an AI researcher, our platform ensures you have
            access to the latest, most relevant questions and resources. We
            continuously update our exam pools to reflect industry trends and
            best practices. Dive in, practice, and watch your skills soar!
          </p>
          <p className="text-gray-700 leading-relaxed">
            We pride ourselves on delivering not just exams but an entire
            ecosystem of learning. Our community-driven approach means you can
            also learn from fellow professionals, share your insights, and
            become a part of an ever-growing network of tech enthusiasts.
          </p>
        </div>
      </section>

      {/* 
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          4.3 Category Listing
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */}
      <section
        id="categories"
        className="bg-gradient-to-b from-green-50 to-green-100 py-12 px-4 sm:px-8 lg:px-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
            Our Exam Categories
          </h2>

          {/* Large container for categories */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {bigCategoryList.map((cat, index) => {
              const isExpanded = expandedCategoryIndex === index;
              return (
                <div
                  key={cat.title}
                  className="bg-white shadow rounded-lg p-6 transition-all border border-gray-200"
                >
                  <div
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => handleToggleCategory(index)}
                  >
                    <h3 className="text-xl font-semibold text-green-700">
                      {cat.title}
                    </h3>
                    <span className="text-gray-500 hover:text-green-600 transition-colors">
                      {isExpanded ? '[-]' : '[+]'}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">{cat.description}</p>

                  {/* Expandable area */}
                  <div
                    className={`mt-4 overflow-hidden transition-all duration-500 ${
                      isExpanded ? 'max-h-[1200px]' : 'max-h-0'
                    }`}
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                      {cat.languages.map((lang) => (
                        <div
                          key={lang.id}
                          className="border border-gray-100 rounded-lg shadow-sm hover:shadow-lg transition-shadow p-3 flex flex-col cursor-pointer"
                          onClick={() => handleLanguageClick(lang.name)}
                        >
                          <LazyImage
                            src={lang.image}
                            alt={lang.name}
                            className="mb-2 h-40 flex items-center justify-center bg-gray-50 rounded"
                          />
                          <h4 className="text-md font-semibold text-green-700 mb-1">
                            {lang.name}
                          </h4>
                          <p className="text-xs text-gray-600 flex-grow">
                            {lang.shortDesc}
                          </p>
                          <button className="mt-2 w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 transition-colors text-sm">
                            View Exams
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          4.4 Testimonials Section
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */}
      <section className="py-12 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-8">
            What Our Learners Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonialsData.map((person) => (
              <div
                key={person.id}
                className="bg-green-50 p-6 rounded-lg shadow flex flex-col items-center text-center"
              >
                <div className="w-24 h-24 mb-4">
                  <LazyImage
                    src={person.image}
                    alt={person.name}
                    className="rounded-full w-24 h-24 object-cover"
                  />
                </div>
                <p className="italic text-gray-700 mb-4">
                  “{person.testimonial}”
                </p>
                <h4 className="text-green-800 font-semibold">
                  — {person.name}, {person.role}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          4.5 Extra Content (e.g. A Large Lorem Ipsum or Additional Explanation)
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */}
      <section className="py-12 px-4 sm:px-8 lg:px-16 bg-green-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-green-700 mb-4">
            The Learning Approach
          </h2>
          <LoremIpsum />
          <LoremIpsum />
          <h3 className="text-xl font-bold text-green-700 mt-6 mb-2">
            Tailoring Your Study Experience
          </h3>
          <p className="text-gray-700 mb-4">
            Every learner has a unique style. Some prefer diving into practice
            tests immediately, while others read extensive documentation first.
            Our platform accommodates both. With step-by-step tutorials, videos,
            and scenario-based challenges, you can build confidence in
            real-world contexts.  
          </p>
          <p className="text-gray-700 mb-4">
            We also provide advanced analytics on your performance, helping you
            identify areas of improvement, measure progress over time, and
            compare results with other learners worldwide. 
          </p>
          <LoremIpsum />
        </div>
      </section>

      {/* 
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          4.6 FAQ Section 
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */}
      <section className="py-12 px-4 sm:px-8 lg:px-16 bg-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-green-700 text-center mb-10">
            Frequently Asked Questions
          </h2>
          <div className="space-y-6">
            {faqData.map((item, i) => (
              <Collapsible key={i} title={item.question}>
                <p className="text-gray-700">{item.answer}</p>
              </Collapsible>
            ))}
          </div>
        </div>
      </section>

      {/* 
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
          4.7 Final Footer
        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
      */}
      <footer className="bg-green-100 py-8 text-center mt-12">
        <p className="text-gray-700 mb-2">
          &copy; {new Date().getFullYear()} EMSI-PREPARATOR. All rights reserved.
        </p>
        <p className="text-gray-500 text-sm">
          Built with{' '}
          <span className="font-bold text-green-600">React</span> &{' '}
          <span className="font-bold text-green-600">Tailwind CSS</span>.
          Powered by curiosity and a passion for learning.
        </p>
      </footer>
    </div>
  );
};

export default ExistingExamsPage;

/*
==========================================================================================================
  THE END
  ~1,000 lines (approx) of extremely verbose code, 
   including multi-line doc comments, big arrays, 
   multiple sub-components, extensive sections, 
   lazy loading, and references to images from the web (Unsplash).
==========================================================================================================
*/
