import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiCalendar, FiMapPin, FiClock, FiChevronLeft, FiAward, FiUsers, FiArrowRight } from "react-icons/fi";

// Mock matches data
const MATCHES_DATA = {
  1: [ // ICC World Cup matches
    {
      id: 101,
      team1: { name: "India", flag: "🇮🇳", score: "325/8", color: "#FF9933" },
      team2: { name: "Australia", flag: "🇦🇺", score: "298/10", color: "#FFD700" },
      status: "completed",
      date: "2026-02-14",
      time: "14:00",
      venue: "Wankhede Stadium, Mumbai",
      format: "ODI",
      result: "India won by 27 runs"
    },
    {
      id: 102,
      team1: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: "178/4", color: "#012169" },
      team2: { name: "Pakistan", flag: "🇵🇰", score: "174/10", color: "#01411C" },
      status: "live",
      date: "2026-02-15",
      time: "10:30",
      venue: "Eden Gardens, Kolkata",
      format: "ODI",
      result: null,
      currentOver: "48.2"
    },
    {
      id: 103,
      team1: { name: "South Africa", flag: "🇿🇦", score: "-", color: "#007749" },
      team2: { name: "New Zealand", flag: "🇳🇿", score: "-", color: "#000000" },
      status: "upcoming",
      date: "2026-02-18",
      time: "14:30",
      venue: "M Chinnaswamy Stadium, Bangalore",
      format: "ODI",
      result: null
    },
    {
      id: 104,
      team1: { name: "India", flag: "🇮🇳", score: "-", color: "#FF9933" },
      team2: { name: "England", flag: "🏴󠁧󠁢󠁥󠁮󠁧󠁿", score: "-", color: "#012169" },
      status: "upcoming",
      date: "2026-02-20",
      time: "19:30",
      venue: "Narendra Modi Stadium, Ahmedabad",
      format: "ODI",
      result: null
    },
    {
      id: 105,
      team1: { name: "Australia", flag: "🇦🇺", score: "-", color: "#FFD700" },
      team2: { name: "Pakistan", flag: "🇵🇰", score: "-", color: "#01411C" },
      status: "upcoming",
      date: "2026-02-22",
      time: "14:00",
      venue: "M.A. Chidambaram Stadium, Chennai",
      format: "ODI",
      result: null
    }
  ],
  2: [ // IPL matches
    {
      id: 201,
      team1: { name: "Mumbai Indians", flag: "🔵", score: "195/5", color: "#004BA0" },
      team2: { name: "Chennai Super Kings", flag: "🟡", score: "192/7", color: "#F7C50C" },
      status: "completed",
      date: "2026-03-22",
      time: "20:00",
      venue: "Wankhede Stadium, Mumbai",
      format: "T20",
      result: "MI won by 3 runs"
    },
    {
      id: 202,
      team1: { name: "Royal Challengers", flag: "🔴", score: "156/3", color: "#EC1C24" },
      team2: { name: "Kolkata Knight Riders", flag: "🟣", score: "158/2", color: "#3A225D" },
      status: "live",
      date: "2026-03-23",
      time: "19:30",
      venue: "M Chinnaswamy Stadium, Bangalore",
      format: "T20",
      result: null,
      currentOver: "18.4"
    },
    {
      id: 203,
      team1: { name: "Delhi Capitals", flag: "🔵", score: "-", color: "#00008B" },
      team2: { name: "Punjab Kings", flag: "🔴", score: "-", color: "#DD1F2D" },
      status: "upcoming",
      date: "2026-03-24",
      time: "15:30",
      venue: "Arun Jaitley Stadium, Delhi",
      format: "T20",
      result: null
    }
  ]
};

const TOURNAMENT_INFO = {
  1: {
    name: "ICC Cricket World Cup 2026",
    description: "The biggest cricket tournament in the world featuring top international teams",
    type: "International ODI",
    totalMatches: 48,
    startDate: "2026-02-10",
    endDate: "2026-03-29"
  },
  2: {
    name: "Indian Premier League 2026",
    description: "India's premier T20 cricket league featuring world's best players",
    type: "T20 League",
    totalMatches: 74,
    startDate: "2026-03-20",
    endDate: "2026-05-26"
  }
};

const TournamentDetails = () => {
  const { tournamentId } = useParams();
  const navigate = useNavigate();
  const [filterStatus, setFilterStatus] = useState("all");

  const tournament = TOURNAMENT_INFO[tournamentId];
  const allMatches = MATCHES_DATA[tournamentId] || [];

  const filteredMatches = allMatches.filter((match) => {
    if (filterStatus === "all") return true;
    return match.status === filterStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "bg-red-500 text-white animate-pulse";
      case "upcoming":
        return "bg-yellow-500 text-white";
      case "completed":
        return "bg-amber-600 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "live":
        return "LIVE";
      case "upcoming":
        return "UPCOMING";
      case "completed":
        return "COMPLETED";
      default:
        return status.toUpperCase();
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { 
      weekday: "short",
      month: "short", 
      day: "numeric", 
      year: "numeric" 
    });
  };

  if (!tournament) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-yellow-800 to-amber-800 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Tournament Not Found</h2>
          <button
            onClick={() => navigate("/tournaments")}
            className="px-6 py-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors"
          >
            Back to Tournaments
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-amber-50 to-yellow-50">
      <section className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-600 to-amber-600 rounded-xl p-6 mb-8 text-white shadow-lg">
          <button
            onClick={() => navigate("/tournaments")}
            className="flex items-center text-white/80 hover:text-white transition-colors mb-4"
          >
            <FiChevronLeft size={20} className="mr-1" />
            Back to Tournaments
          </button>

          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-yellow-400 rounded-lg flex items-center justify-center">
                  <FiAward className="text-white" size={24} />
                </div>
                <h1 className="text-3xl md:text-4xl font-bold">{tournament.name}</h1>
              </div>
              <p className="text-yellow-100 text-lg max-w-3xl mb-4">{tournament.description}</p>
              
              <div className="flex flex-wrap gap-3">
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FiCalendar className="mr-2 text-yellow-400" size={16} />
                  <span className="text-sm font-medium">
                    {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
                  </span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <FiUsers className="mr-2 text-yellow-400" size={16} />
                  <span className="text-sm font-medium">{tournament.type}</span>
                </div>
                <div className="flex items-center bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg">
                  <span className="text-sm font-semibold">{tournament.totalMatches} Matches</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">
            Matches ({filteredMatches.length})
          </h2>
          
          <div className="flex flex-wrap gap-2">
            {["all", "live", "upcoming", "completed"].map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-4 py-2 rounded-lg font-semibold text-sm transition-all ${
                  filterStatus === status
                    ? "bg-yellow-400 text-white shadow-md"
                    : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                }`}
              >
                {status.charAt(0).toUpperCase() + status.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Matches List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMatches.map((match) => (
            <div
              key={match.id}
              className="bg-white rounded-2xl overflow-hidden shadow-lg border border-gray-100 hover:shadow-xl hover:border-gray-200 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
              onClick={() => navigate(`/tournaments/${tournamentId}/matches/${match.id}`)}
            >
              <div className="p-5">
                {/* Match Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(match.status)}`}>
                      {getStatusText(match.status)}
                    </span>
                    {match.status === "live" && match.currentOver && (
                      <span className="text-red-600 text-xs font-semibold">Over {match.currentOver}</span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-gray-500 text-xs">
                    <span className="bg-yellow-600 text-white px-2 py-1 rounded font-medium">{match.format}</span>
                  </div>
                </div>

                {/* Date and Time */}
                <div className="flex items-center justify-center gap-4 text-gray-500 text-sm mb-4">
                  <div className="flex items-center">
                    <FiCalendar className="mr-1" size={14} />
                    <span className="font-medium">{formatDate(match.date)}</span>
                  </div>
                  <div className="flex items-center">
                    <FiClock className="mr-1" size={14} />
                    <span className="font-medium">{match.time}</span>
                  </div>
                </div>

                {/* Teams - Compact Design */}
                <div className="flex items-center justify-between mb-4">
                  {/* Team 1 */}
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl">{match.team1.flag}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1 truncate">{match.team1.name}</h3>
                    {match.team1.score !== "-" && (
                      <p className="text-xl font-bold text-gray-900">{match.team1.score}</p>
                    )}
                  </div>

                  {/* VS */}
                  <div className="mx-3">
                    <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center shadow-md">
                      <span className="text-white font-bold text-sm">VS</span>
                    </div>
                  </div>

                  {/* Team 2 */}
                  <div className="flex-1 text-center">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <span className="text-2xl">{match.team2.flag}</span>
                    </div>
                    <h3 className="text-base font-bold text-gray-800 mb-1 truncate">{match.team2.name}</h3>
                    {match.team2.score !== "-" && (
                      <p className="text-xl font-bold text-gray-900">{match.team2.score}</p>
                    )}
                  </div>
                </div>

                {/* Venue */}
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <FiMapPin className="mr-2 text-gray-400" size={14} />
                  <span className="text-sm font-medium text-center truncate">{match.venue}</span>
                </div>

                {/* Match Result or Action */}
                <div className="flex justify-center">
                  {match.result ? (
                    <div className="text-green-600 font-semibold text-center bg-green-50 px-3 py-2 rounded-lg w-full text-sm">
                      {match.result}
                    </div>
                  ) : (
                      <button className="flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-400 text-white font-bold px-4 py-2 rounded-xl transition-all transform hover:scale-105 shadow-md w-full">
                      <span className="text-sm">View Details</span>
                      <FiArrowRight size={14} />
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredMatches.length === 0 && (
          <div className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm">
            <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <FiCalendar className="text-gray-400" size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-800 mb-2">No Matches Found</h3>
            <p className="text-gray-600">Try selecting a different filter or check back later</p>
          </div>
        )}
      </section>
    </main>
  );
};

export default TournamentDetails;
