import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCalendar, FiTrendingUp, FiUsers, FiChevronRight, FiSearch, FiFilter, FiAward, FiLoader, FiAlertCircle } from "react-icons/fi";

const Tournaments = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const getStatusColor = (status) => {
    switch (status) {
      case "live":
        return "bg-red-500";
      case "upcoming":
        return "bg-blue-500";
      case "completed":
        return "bg-slate-400";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "live":
        return "LIVE NOW";
      case "upcoming":
        return "UPCOMING";
      case "completed":
        return "COMPLETED";
      default:
        return status.toUpperCase();
    }
  };

  const filteredTournaments = TOURNAMENTS.filter((tournament) => {
    const matchesSearch = tournament.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || tournament.status === filterStatus;
    const matchesType = filterType === "all" || tournament.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <main className="px-4 py-12 space-y-20 bg-main">
      {/* Single Unified Section */}
      <section className="max-w-[1440px] mx-auto">
        {/* Header and Search/Filter Row */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 mb-12">
          {/* Left: Title and Description */}
          <div className="flex-1">
            <div className="flex items-center mb-4">
              <FiAward className="text-slate-600 mr-3" size={40} />
              <h1 className="text-4xl font-bold text-slate-800">
                Cricket Tournaments
              </h1>
            </div>
            <p className="text-lg text-slate-600 max-w-2xl">
              Join the ultimate fantasy cricket experience. Pick your tournament, select your team, and compete for glory!
            </p>
          </div>

          {/* Right: Search and Filter */}
          <div className="flex items-center gap-4 lg:min-w-[400px]">
            <div className="relative flex-1">
              <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search tournaments..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 bg-white border border-slate-200 rounded-full text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm transition-all"
              />
            </div>
            
            {/* Filter Toggle Button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-4 bg-white border border-slate-200 rounded-full text-slate-600 hover:text-slate-800 hover:bg-slate-50 transition-all shadow-sm"
            >
              <FiFilter size={20} />
            </button>
          </div>
        </div>
        {/* Tournaments Section */}
        <div className="relative">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-slate-800">
              {filterStatus === "all" ? "All Tournaments" : getStatusText(filterStatus) + " Tournaments"}
              <span className="ml-3 text-lg text-slate-500">({filteredTournaments.length})</span>
            </h2>
          </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTournaments.map((tournament) => (
            <div
              key={tournament.id}
              onClick={() => navigate(`/tournaments/${tournament.id}`)}
              className="group bg-white rounded-xl overflow-hidden shadow-sm border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all duration-300 cursor-pointer"
            >
              {/* Tournament Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={tournament.image}
                  alt={tournament.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent"></div>
                
                {/* Status Badge */}
                <div className="absolute top-4 right-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold text-white ${getStatusColor(tournament.status)}`}>
                    {getStatusText(tournament.status)}
                  </span>
                </div>

                {/* Tournament Type */}
                <div className="absolute top-4 left-4">
                  <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-medium text-slate-700">
                    {tournament.type}
                  </span>
                </div>
              </div>

              {/* Tournament Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-600 transition-colors">
                  {tournament.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {tournament.description}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-slate-600">
                    <FiCalendar className="mr-2 text-slate-500" size={16} />
                    <span className="text-sm">{formatDate(tournament.startDate)}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <FiUsers className="mr-2 text-slate-500" size={16} />
                    <span className="text-sm">{tournament.teams} Teams</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <FiTrendingUp className="mr-2 text-slate-500" size={16} />
                    <span className="text-sm">{tournament.matches} Matches</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <FiAward className="mr-2 text-slate-500" size={16} />
                    <span className="text-sm">{tournament.prize}</span>
                  </div>
                </div>

                {/* View Button */}
                <button className="w-full mt-2 flex items-center justify-center bg-slate-800 hover:bg-slate-700 text-white font-medium py-3 px-4 rounded-lg transition-all duration-300">
                  View Matches
                  <FiChevronRight className="ml-2" size={20} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* No Results */}
        {filteredTournaments.length === 0 && (
          <div className="text-center py-20">
            <FiFilter className="mx-auto text-slate-400 mb-4" size={64} />
            <h3 className="text-2xl font-semibold text-slate-700 mb-2">No Tournaments Found</h3>
            <p className="text-slate-500">Try adjusting your filters or search query</p>
          </div>
        )}

        {/* Filter Sidebar */}
        <div className={`fixed top-0 right-0 h-full w-80 bg-white shadow-xl transform transition-transform duration-300 z-50 ${
          sidebarOpen ? 'translate-x-0' : 'translate-x-full'
        }`}>
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-800">Filters</h3>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="p-6 space-y-6">
            {/* Status Filter */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Status</p>
              <div className="flex flex-wrap gap-2">
                {["all", "live", "upcoming", "completed"].map((status) => (
                  <button
                    key={status}
                    onClick={() => setFilterStatus(status)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filterStatus === status
                        ? "bg-blue-500 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {status === "all" ? "All Status" : getStatusText(status)}
                  </button>
                ))}
              </div>
            </div>

            {/* Type Filter */}
            <div>
              <p className="text-sm font-medium text-slate-700 mb-3">Type</p>
              <div className="flex flex-wrap gap-2">
                {["all", "International", "T20 League", "Test Series"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filterType === type
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type === "all" ? "All Types" : type}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            <div className="pt-4 border-t border-slate-200">
              <button
                onClick={() => {
                  setFilterStatus("all");
                  setFilterType("all");
                }}
                className="w-full px-4 py-2 border border-slate-300 text-slate-600 rounded-lg hover:bg-slate-50 transition-colors"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </div>

        {/* Overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/50 z-40"
            onClick={() => setSidebarOpen(false)}
          />
        )}
        </div>
      </section>
    </main>
  );
};

export default Tournaments;
