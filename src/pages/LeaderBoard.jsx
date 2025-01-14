import React from "react";

const LeaderboardPage = () => {
  // Sample leaderboard data
  const leaderboardData = [
    { rank: 1, name: "Alice Johnson", score: 98, prize: "Gold Trophy 🏆", photo: null },
    { rank: 2, name: "Bob Smith", score: 95, prize: "Silver Medal 🥈", photo: null },
    { rank: 3, name: "Charlie Brown", score: 93, prize: "Bronze Medal 🥉", photo: null },
    { rank: 4, name: "Diana Prince", score: 90, prize: "Certificate of Merit 📜", photo: null },
    { rank: 5, name: "Ethan Hunt", score: 88, prize: "Certificate of Participation 🎖️", photo: null },
  ];

  const defaultUserPhoto = "/images/default-avatar.png"; // Path to your default avatar image

  return (
    <div className="bg-gradient-to-b from-green-50 to-green-100 min-h-screen p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-5xl font-extrabold text-green-700 mb-3">
          🎉 Leaderboard 🎉
        </h1>
        <p className="text-lg text-gray-700">
          Celebrating the top achievers on the platform!
        </p>
      </div>

      {/* Leaderboard Table */}
      <div className="bg-white shadow-2xl rounded-lg overflow-hidden max-w-6xl mx-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-yellow-400 to-green-600 text-white">
            <tr>
              <th className="py-4 px-6 text-left text-lg">Rank</th>
              <th className="py-4 px-6 text-left text-lg">Profile</th>
              <th className="py-4 px-6 text-left text-lg">Name</th>
              <th className="py-4 px-6 text-left text-lg">Score</th>
              <th className="py-4 px-6 text-left text-lg">Prize</th>
            </tr>
          </thead>
          <tbody>
            {leaderboardData.map((student, index) => (
              <tr
                key={index}
                className={`${
                  index % 2 === 0 ? "bg-gray-50" : "bg-white"
                } hover:bg-green-50 transition-colors`}
              >
                {/* Rank */}
                <td className="py-4 px-6 text-gray-700 text-lg font-semibold flex items-center gap-2">
                  {student.rank === 1 && <span>🏆</span>}
                  {student.rank === 2 && <span>🥈</span>}
                  {student.rank === 3 && <span>🥉</span>}
                  {student.rank > 3 && <span>{student.rank}</span>}
                </td>

                {/* Profile Image */}
                <td className="py-4 px-6">
                  <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-green-500">
                    <img
                      src={student.photo || defaultUserPhoto}
                      alt={`${student.name}'s profile`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </td>

                {/* Name */}
                <td className="py-4 px-6 text-gray-700 text-lg">{student.name}</td>

                {/* Score */}
                <td className="py-4 px-6 text-gray-700 text-lg">{student.score}</td>

                {/* Prize */}
                <td className="py-4 px-6 text-gray-700 text-lg">{student.prize}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Prizes Section */}
      <div className="mt-12 text-center">
        <h2 className="text-3xl font-bold text-green-700 mb-4">🏆 Prizes 🏆</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {leaderboardData.slice(0, 3).map((student, index) => (
            <div
              key={index}
              className="bg-white shadow-lg p-6 rounded-lg hover:shadow-xl transition-transform transform hover:scale-105"
            >
              <h3 className="text-2xl font-semibold text-green-700 mb-2">
                {student.prize}
              </h3>
              <p className="text-gray-600">{student.name}</p>
              <p className="text-green-500 font-bold mt-2">
                Rank {student.rank} - Score: {student.score}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default LeaderboardPage;
