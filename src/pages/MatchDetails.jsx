import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiChevronLeft, FiAward, FiUsers, FiClock, FiMapPin, FiShield } from "react-icons/fi";

const MATCH_DETAILS = {
  101: {
    team1: { name: "India", flag: "🇮🇳", score: "325/8 (50)", color: "#FF9933" },
    team2: { name: "Australia", flag: "🇦🇺", score: "298/10 (48.3)", color: "#FFD700" },
    status: "completed",
    date: "2026-02-14",
    time: "14:00",
    venue: "Wankhede Stadium, Mumbai",
    format: "ODI",
    result: "India won by 27 runs",
    tossResult: "India won the toss and chose to bat",
    playerOfMatch: "Virat Kohli (115 runs off 102 balls)"
  },
  102: {
    team1: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: "178/4 (18.4)", color: "#012169" },
    team2: { name: "Pakistan", flag: "🇵🇰", score: "174/10 (19.5)", color: "#01411C" },
    status: "live",
    date: "2026-02-15",
    time: "10:30",
    venue: "Eden Gardens, Kolkata",
    format: "ODI",
    result: null,
    tossResult: "England won the toss and chose to bowl",
    playerOfMatch: null
  },
  103: {
    team1: { name: "South Africa", flag: "🇿🇦", score: "-", color: "#007749" },
    team2: { name: "New Zealand", flag: "🇳🇿", score: "-", color: "#000000" },
    status: "upcoming",
    date: "2026-02-18",
    time: "14:30",
    venue: "M Chinnaswamy Stadium, Bangalore",
    format: "ODI",
    result: null,
    tossResult: null,
    playerOfMatch: null
  },
  201: {
    team1: { name: "Mumbai Indians", flag: "🔵", score: "195/5 (20)", color: "#004BA0" },
    team2: { name: "Chennai Super Kings", flag: "🟡", score: "192/7 (20)", color: "#F7C50C" },
    status: "completed",
    date: "2026-03-22",
    time: "20:00",
    venue: "Wankhede Stadium, Mumbai",
    format: "T20",
    result: "Mumbai Indians won by 3 runs",
    tossResult: "CSK won the toss and chose to bowl",
    playerOfMatch: "Rohit Sharma (85 runs off 52 balls)"
  },
  202: {
    team1: { name: "Royal Challengers", flag: "🔴", score: "156/3 (18.4)", color: "#EC1C24" },
    team2: { name: "Kolkata Knight Riders", flag: "🟣", score: "158/2 (17.3)", color: "#3A225D" },
    status: "live",
    date: "2026-03-23",
    time: "19:30",
    venue: "M Chinnaswamy Stadium, Bangalore",
    format: "T20",
    result: null,
    tossResult: "KKR won the toss and chose to bowl",
    playerOfMatch: null
  }
};

const MatchDetails = () => {
  const { tournamentId, matchId } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("overview");

  const match = MATCH_DETAILS[matchId];

  if (!match) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 to-purple-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Match Not Found</h2>
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}`)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
          >
            Back to Tournament
          </button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      weekday: "long",
      month: "long", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#001f3f' }}>
      {/* Header */}
      <div style={{ backgroundColor: '#002a54' }} className="border-b border-white/10">
        <div className="max-w-[1440px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate(`/tournaments/${tournamentId}`)}
            className="flex items-center text-white hover:text-yellow-400 transition-colors mb-4"
          >
            <FiChevronLeft size={20} className="mr-1" />
            Back to Tournament
          </button>

          {/* Match Status Badge */}
          <div className="mb-4">
            {match.status === "live" && (
              <span className="px-4 py-2 bg-red-500 text-white rounded-full text-sm font-bold animate-pulse inline-flex items-center">
                <span className="w-2 h-2 bg-white rounded-full mr-2 animate-ping"></span>
                LIVE MATCH
              </span>
            )}
            {match.status === "upcoming" && (
              <span className="px-4 py-2 bg-blue-500 text-white rounded-full text-sm font-bold">
                UPCOMING MATCH
              </span>
            )}
            {match.status === "completed" && (
              <span className="px-4 py-2 bg-gray-500 text-white rounded-full text-sm font-bold">
                MATCH COMPLETED
              </span>
            )}
          </div>

          {/* Teams Display */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Team 1 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-6xl mb-3">{match.team1.flag}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{match.team1.name}</h2>
              {match.team1.score !== "-" && (
                <p className="text-3xl font-bold text-purple-400">{match.team1.score}</p>
              )}
            </div>

            {/* VS Circle */}
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 rounded-full bg-yellow-400 flex items-center justify-center shadow-2xl mb-4">
                <span className="text-gray-900 font-bold text-3xl">VS</span>
              </div>
              <div className="text-center">
                <p className="text-white text-sm mb-1">{match.format} Match</p>
                <div className="flex items-center justify-center text-gray-300 text-sm">
                  <FiClock className="mr-1" size={14} />
                  {formatDate(match.date)} • {match.time}
                </div>
              </div>
            </div>

            {/* Team 2 */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-center border border-white/20">
              <div className="text-6xl mb-3">{match.team2.flag}</div>
              <h2 className="text-2xl font-bold text-white mb-2">{match.team2.name}</h2>
              {match.team2.score !== "-" && (
                <p className="text-3xl font-bold text-blue-400">{match.team2.score}</p>
              )}
            </div>
          </div>

          {/* Match Result */}
          {match.result && (
            <div className="mt-6 bg-green-500/20 border border-green-500/50 rounded-xl p-4 text-center">
              <p className="text-green-400 font-bold text-lg">{match.result}</p>
            </div>
          )}

          {/* Venue */}
          <div className="mt-6 flex items-center justify-center text-gray-300">
            <FiMapPin className="mr-2 text-green-400" size={20} />
            <span className="text-lg">{match.venue}</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="max-w-[1440px] mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {["overview", "create-team", "leaderboard"].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                if (tab === "create-team") {
                  navigate(`/tournaments/${tournamentId}/matches/${matchId}/create-team`);
                } else if (tab === "leaderboard") {
                  navigate(`/tournaments/${tournamentId}/matches/${matchId}/leaderboard`);
                } else {
                  setActiveTab(tab);
                }
              }}
              className={`px-6 py-3 rounded-lg font-semibold transition-all whitespace-nowrap ${
                activeTab === tab
                  ? "bg-yellow-400 text-white"
                  : "bg-white/10 text-white hover:bg-white/20 border border-white/20"
              }`}
            >
              {tab === "create-team" && <FiShield className="inline mr-2" />}
              {tab === "leaderboard" && <FiAward className="inline mr-2" />}
              {tab.split("-").map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(" ")}
            </button>
          ))}
        </div>

        {/* Overview Tab Content */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Match Info Card */}
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FiShield className="mr-2 text-yellow-400" />
                Match Information
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Format</span>
                  <span className="text-white font-semibold">{match.format}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Date</span>
                  <span className="text-white font-semibold">{formatDate(match.date)}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Time</span>
                  <span className="text-white font-semibold">{match.time}</span>
                </div>
                <div className="flex justify-between items-center py-2 border-b border-white/10">
                  <span className="text-gray-400">Venue</span>
                  <span className="text-white font-semibold text-right">{match.venue}</span>
                </div>
                {match.tossResult && (
                  <div className="flex justify-between items-center py-2 border-b border-white/10">
                    <span className="text-gray-400">Toss</span>
                    <span className="text-white font-semibold text-right">{match.tossResult}</span>
                  </div>
                )}
                {match.playerOfMatch && (
                  <div className="flex justify-between items-center py-2">
                    <span className="text-gray-400">Player of the Match</span>
                    <span className="text-yellow-400 font-semibold text-right">{match.playerOfMatch}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Action Card */}
            <div className="bg-gradient-to-br from-purple-600/20 to-blue-600/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-500/50">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                <FiAward className="mr-2 text-yellow-400" />
                Fantasy Actions
              </h3>
              
              {match.status === "upcoming" && (
                <div className="space-y-4">
                  <p className="text-gray-300 mb-4">
                    Create your fantasy team for this match and compete with others!
                  </p>
                  <button
                    onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/create-team`)}
                    className="w-full bg-yellow-400 hover:bg-[#c4722a] text-white font-bold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FiShield size={20} />
                    Create Your Team
                  </button>
                  <button
                    onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/leaderboard`)}
                    className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-4 px-6 rounded-xl transition-all flex items-center justify-center gap-2"
                  >
                    <FiAward size={20} />
                    View Leaderboard
                  </button>
                </div>
              )}

              {match.status === "live" && (
                <div className="space-y-4">
                  <p className="text-gray-300 mb-4">
                    Match is live! Check the leaderboard to see your ranking.
                  </p>
                  <button
                    onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/leaderboard`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FiAward size={20} />
                    View Live Leaderboard
                  </button>
                </div>
              )}

              {match.status === "completed" && (
                <div className="space-y-4">
                  <p className="text-gray-300 mb-4">
                    Match completed! Check final rankings and results.
                  </p>
                  <button
                    onClick={() => navigate(`/tournaments/${tournamentId}/matches/${matchId}/leaderboard`)}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-bold py-4 px-6 rounded-xl transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                  >
                    <FiAward size={20} />
                    View Final Leaderboard
                  </button>
                </div>
              )}

              {/* Stats */}
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <FiUsers className="mx-auto text-blue-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">1,234</p>
                    <p className="text-sm text-gray-400">Teams Created</p>
                  </div>
                  <div className="text-center">
                    <FiAward className="mx-auto text-yellow-400 mb-2" size={24} />
                    <p className="text-2xl font-bold text-white">$5,000</p>
                    <p className="text-sm text-gray-400">Prize Pool</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MatchDetails;
