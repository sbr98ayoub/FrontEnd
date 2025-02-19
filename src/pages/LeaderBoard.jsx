import React, { useEffect, useRef, useState } from "react";
import Confetti from "react-confetti";

const LeaderboardPage = () => {
  // Sample (and extended) leaderboard data with random profile images
  const leaderboardData = [
    {
      rank: 1,
      name: "Sabbar Ayoub",
      score: 98,
      prize: "OSTOOOOORAAAAA",
      photo: "/images/ayoub.jpg",
    },
    {
      rank: 2,
      name: "OTMANE Soufian",
      score: 95,
      prize: "KHARII",
      photo: "/images/soufian.jpg",
    },
    {
      rank: 3,
      name: "MED SAID MOUFID",
      score: 93,
      prize: "NAAAA9S",
      photo: "/images/said.jpg",
    },
    {
      rank: 4,
      name: "Diana Prince",
      score: 90,
      prize: "Certificate of Merit",
      photo: "https://randomuser.me/api/portraits/women/50.jpg",
    },
    {
      rank: 5,
      name: "Ethan Hunt",
      score: 88,
      prize: "Certificate of Participation",
      photo: "https://randomuser.me/api/portraits/men/7.jpg",
    },
    {
      rank: 6,
      name: "Fiona Gold",
      score: 85,
      prize: "Certificate of Participation",
      photo: "https://randomuser.me/api/portraits/women/60.jpg",
    },
    {
      rank: 7,
      name: "George Miller",
      score: 82,
      prize: "Certificate of Participation",
      photo: "https://randomuser.me/api/portraits/men/28.jpg",
    },
    // Add more if you want an even bigger table
  ];

  const defaultUserPhoto = "/images/default-avatar.png";

  // Splitting out the top 3 from the rest
  const [first, second, third, ...others] = leaderboardData;

  // Confetti control (optional)
  const [showConfetti, setShowConfetti] = useState(true);
  useEffect(() => {
    // Stop confetti after a few seconds
    const timer = setTimeout(() => setShowConfetti(false), 7000);
    return () => clearTimeout(timer);
  }, []);

  // For measuring page size to properly render confetti
  const pageRef = useRef(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

  useEffect(() => {
    if (pageRef.current) {
      setDimensions({
        width: pageRef.current.offsetWidth,
        height: pageRef.current.offsetHeight,
      });
    }
  }, [pageRef]);

  return (
    <div ref={pageRef} className="relative min-h-screen flex flex-col">

      {/* Confetti */}
      {showConfetti && (
        <Confetti
          width={dimensions.width}
          height={dimensions.height}
          numberOfPieces={200}
          recycle={false}
        />
      )}

      {/* Animated Gradient Text & Hero Banner */}
      <div className="relative overflow-hidden bg-gradient-to-tr from-lime-200 to-green-200 py-16 px-6 flex flex-col items-center text-center">
        {/* Floating wave shape divider (on top) */}
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0] rotate-180">
          <svg
            className="relative block w-[calc(200%+1.3px)] h-32"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M985.66 16.63c-73.32 0-135.54 31.48-186.52 61.91-51 30.43-99.29 59.21-166.8 
                 59.21-67.63 0-113.94-26.03-160.77-52.2-46.05-25.78-89.57-50.16-154.37-50.16-65.43 
                 0-115.72 24.38-163.71 51.8-48.53 27.77-95.16 54.45-167.69 54.45V120H1200V0c-64.35 
                 0-119.84 16.63-214.34 16.63z"
              fill="#ffffff"
            />
          </svg>
        </div>

        <h1 className="text-5xl md:text-6xl font-extrabold animate-gradientText">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-green-700 via-teal-600 to-green-700">
            Leaderboard
          </span>
        </h1>
        <p className="mt-4 text-xl text-gray-700 max-w-xl">
          Celebrating the top achievers on our platform with style
        </p>

        {/* Optional button to replay confetti */}
        <button
          onClick={() => setShowConfetti(true)}
          className="mt-6 bg-green-600 hover:bg-green-700 text-white px-6 py-2 font-semibold rounded-full transition-colors"
        >
          Celebrate Again
        </button>

        {/* Floating wave shape divider (bottom) */}
        <div className="absolute bottom-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-[calc(200%+1.3px)] h-40"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M985.66 16.63c-73.32 0-135.54 31.48-186.52 61.91-51 30.43-99.29 59.21-166.8 
                 59.21-67.63 0-113.94-26.03-160.77-52.2-46.05-25.78-89.57-50.16-154.37-50.16-65.43 
                 0-115.72 24.38-163.71 51.8-48.53 27.77-95.16 54.45-167.69 54.45V120H1200V0c-64.35 
                 0-119.84 16.63-214.34 16.63z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </div>

      {/* Podium Section */}
      <section className="bg-white py-10 px-4 md:px-10 -mt-20 z-10">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-center gap-6 mb-12">
          {/* 2nd Place */}
          <div className="w-44 h-72 perspective flex items-end justify-center">
            <div className="relative w-full h-full rounded-lg shadow-xl transform-style-3d transition-transform hover:rotate-y-12 podium-card bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col">
              <div className="absolute top-3 right-3 text-lg font-bold text-gray-500 z-20">
                #{second.rank}
              </div>
              <img
                className="mx-auto mt-6 w-20 h-20 rounded-full border-4 border-gray-400 object-cover z-10"
                src={second.photo || defaultUserPhoto}
                alt={`${second.name}'s profile`}
              />
              <h3 className="mt-4 text-center text-gray-800 font-semibold text-lg">
                {second.name}
              </h3>
              <p className="text-center text-sm text-gray-500 mt-1">
                Score: {second.score}
              </p>
              <p className="text-center text-gray-700 font-medium mt-2">
                {second.prize}
              </p>
              {/* Podium base */}
              <div className="bg-gray-400 w-full h-4 mt-auto rounded-t-md" />
            </div>
          </div>

          {/* 1st Place (center) */}
          <div className="w-44 h-80 perspective flex items-end justify-center">
            <div className="relative w-full h-full rounded-lg shadow-2xl transform-style-3d transition-transform hover:rotate-y-12 podium-card bg-gradient-to-b from-yellow-100 to-yellow-300 flex flex-col">
              <div className="absolute top-3 right-3 text-lg font-bold text-gray-500 z-20">
                #{first.rank}
              </div>
              <img
                className="mx-auto mt-6 w-24 h-24 rounded-full border-4 border-yellow-500 object-cover z-10"
                src={first.photo || defaultUserPhoto}
                alt={`${first.name}'s profile`}
              />
              <h3 className="mt-4 text-center text-gray-800 font-semibold text-lg">
                {first.name}
              </h3>
              <p className="text-center text-sm text-gray-500 mt-1">
                Score: {first.score}
              </p>
              <p className="text-center text-gray-700 font-medium mt-2">
                {first.prize}
              </p>
              {/* Podium base */}
              <div className="bg-yellow-400 w-full h-6 mt-auto rounded-t-md" />
            </div>
          </div>

          {/* 3rd Place */}
          <div className="w-44 h-64 perspective flex items-end justify-center">
            <div className="relative w-full h-full rounded-lg shadow-xl transform-style-3d transition-transform hover:rotate-y-12 podium-card bg-gradient-to-b from-orange-100 to-orange-200 flex flex-col">
              <div className="absolute top-3 right-3 text-lg font-bold text-gray-500 z-20">
                #{third.rank}
              </div>
              <img
                className="mx-auto mt-6 w-20 h-20 rounded-full border-4 border-orange-300 object-cover z-10"
                src={third.photo || defaultUserPhoto}
                alt={`${third.name}'s profile`}
              />
              <h3 className="mt-4 text-center text-gray-800 font-semibold text-lg">
                {third.name}
              </h3>
              <p className="text-center text-sm text-gray-500 mt-1">
                Score: {third.score}
              </p>
              <p className="text-center text-gray-700 font-medium mt-2">
                {third.prize}
              </p>
              {/* Podium base */}
              <div className="bg-orange-400 w-full h-2 mt-auto rounded-t-md" />
            </div>
          </div>
        </div>

        {/* Rest of the Leaderboard */}
        <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl overflow-hidden">
          <table className="w-full border-collapse">
            <thead className="bg-green-600 text-white">
              <tr>
                <th className="py-4 px-6 text-left text-lg font-semibold">Rank</th>
                <th className="py-4 px-6 text-left text-lg font-semibold">
                  Profile
                </th>
                <th className="py-4 px-6 text-left text-lg font-semibold">Name</th>
                <th className="py-4 px-6 text-left text-lg font-semibold">
                  Score
                </th>
                <th className="py-4 px-6 text-left text-lg font-semibold">
                  Prize
                </th>
              </tr>
            </thead>
            <tbody>
              {others.map((player, index) => (
                <tr
                  key={player.rank}
                  className={`${
                    index % 2 === 0 ? "bg-gray-50" : "bg-white"
                  } hover:bg-green-50 transition-colors`}
                >
                  <td className="py-4 px-6 text-gray-800 text-lg font-semibold">
                    {player.rank}
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
                      <img
                        src={player.photo || defaultUserPhoto}
                        alt={`${player.name}'s profile`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  </td>
                  <td className="py-4 px-6 text-gray-800 text-lg">{player.name}</td>
                  <td className="py-4 px-6 text-gray-800 text-lg">
                    {player.score}
                  </td>
                  <td className="py-4 px-6 text-gray-800 text-lg">
                    {player.prize}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Next Steps Section */}
      <section className="bg-green-50 py-12 px-4 md:px-10">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-green-700 mb-4">
            Ready to Join the Ranks?
          </h2>
          <p className="text-lg text-gray-600 mb-6">
            Whether you’re new or experienced, keep pushing to improve your score
            and see your name climb to the top of the leaderboard. Practice makes
            perfect—and we’re here to celebrate your achievements every step of
            the way!
          </p>
          <button className="bg-green-600 hover:bg-green-700 text-white py-3 px-8 rounded-full font-semibold transition-colors shadow-xl">
            Start Practicing
          </button>
        </div>
      </section>

      {/* Footer with wave divider */}
      <footer className="relative bg-white pt-16 pb-6">
        <div className="absolute top-0 left-0 w-full overflow-hidden leading-[0]">
          <svg
            className="relative block w-[calc(200%+1.3px)] h-16"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            viewBox="0 0 1200 120"
          >
            <path
              d="M985.66 16.63c-73.32 0-135.54 31.48-186.52 61.91-51 
                 30.43-99.29 59.21-166.8 59.21-67.63 0-113.94-26.03-160.77-52.2
                 C426.52 59.78 383 35.4 318.2 35.4c-65.43 0-115.72 24.38-163.71
                 51.8C106 114.97 59.37 141.66-13.16 141.66V120H1200V0c-64.35 
                 0-119.84 16.63-214.34 16.63z"
              fill="#F0FFF4"
            />
          </svg>
        </div>
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-sm text-gray-500">
            &copy; {new Date().getFullYear()} Your Awesome Company. All rights
            reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default LeaderboardPage;
