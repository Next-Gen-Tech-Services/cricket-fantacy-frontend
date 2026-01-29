import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FiCalendar, FiTrendingUp, FiUsers, FiChevronRight, FiSearch, FiFilter, FiAward, FiLoader, FiAlertCircle } from "react-icons/fi";
import { fetchTournaments } from "../store/slices/tournamentsSlice";

const Tournaments = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Redux state
  const { 
    tournaments, 
    isLoading, 
    error 
  } = useSelector((state) => state.tournaments);

  // Fetch tournaments on component mount
  useEffect(() => {
    dispatch(fetchTournaments());
  }, [dispatch]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "live":
        return "bg-red-500";
      case "upcoming":
      case "scheduled":
        return "bg-blue-500";
      case "completed":
      case "finished":
        return "bg-slate-400";
      default:
        return "bg-slate-400";
    }
  };

  const getStatusText = (status) => {
    switch (status?.toLowerCase()) {
      case "active":
      case "live":
        return "LIVE NOW";
      case "upcoming":
      case "scheduled":
        return "UPCOMING";
      case "completed":
      case "finished":
        return "COMPLETED";
      default:
        return status?.toUpperCase() || "UNKNOWN";
    }
  };

  const filteredTournaments = tournaments.filter((tournament) => {
    const matchesSearch = tournament.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.alternateName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         tournament.shortName?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === "all" || tournament.status?.toLowerCase() === filterStatus;
    const matchesType = filterType === "all" || tournament.format?.type === filterType;
    return matchesSearch && matchesStatus && matchesType;
  });

  const formatDate = (dateString) => {
    if (!dateString) return "TBD";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const getImageUrl = (tournament) => {
    // Array of random cricket tournament images
    const tournamentImages = [
      
      "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      // "https://images.unsplash.com/photo-1531415074968-036ba1b575da?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
      // "https://images.unsplash.com/photo-1578662996442-48f60103fc96?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
    ];
    
    // Select image based on tournament ID for consistency
    const index = Math.abs(tournament.id?.charCodeAt(0) || 0) % tournamentImages.length;
    return tournamentImages[index];
  };

  if (isLoading) {
    return (
      <main className="px-4 py-12 space-y-20 bg-main">
        <section className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FiLoader className="animate-spin mx-auto text-slate-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Loading Tournaments...</h3>
              <p className="text-slate-500">Please wait while we fetch the latest tournaments</p>
            </div>
          </div>
        </section>
      </main>
    );
  }

  if (error) {
    return (
      <main className="px-4 py-12 space-y-20 bg-main">
        <section className="max-w-[1440px] mx-auto">
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <FiAlertCircle className="mx-auto text-red-400 mb-4" size={48} />
              <h3 className="text-xl font-semibold text-slate-700 mb-2">Failed to Load Tournaments</h3>
              <p className="text-slate-500 mb-4">{error}</p>
              <button
                onClick={() => dispatch(fetchTournaments())}
                className="px-6 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          </div>
        </section>
      </main>
    );
  }

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
              Join the ultimate matchplay cricket experience. Pick your tournament, select your team, and compete for glory!
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
                  src={getImageUrl(tournament)}
                  alt={tournament.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  onError={(e) => {
                    e.target.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='240' viewBox='0 0 400 240'%3E%3Crect width='400' height='240' fill='%23f1f5f9'/%3E%3Ctext x='200' y='120' font-family='Arial' font-size='16' fill='%23475569' text-anchor='middle' dy='0.3em'%3ECricket Tournament%3C/text%3E%3C/svg%3E";
                  }}
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
                    {tournament.format?.type || "Cricket"}
                  </span>
                </div>
              </div>

              {/* Tournament Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold text-slate-800 mb-2 group-hover:text-slate-600 transition-colors">
                  {tournament.name}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {tournament.alternateName && tournament.alternateName !== tournament.name 
                    ? tournament.alternateName 
                    : "Join this exciting cricket tournament and compete with players worldwide!"}
                </p>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex items-center text-slate-600">
                    <FiCalendar className="mr-2 text-slate-500" size={16} />
                    <span className="text-sm">{formatDate(tournament.createdAt)}</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <FiUsers className="mr-2 text-slate-500" size={16} />
                    <span className="text-sm">{tournament.participatingTeams?.length || "TBD"} Teams</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <FiTrendingUp className="mr-2 text-slate-500" size={16} />
                    <span className="text-sm">{tournament.totalMatches || "TBD"} Matches</span>
                  </div>
                  <div className="flex items-center text-slate-600">
                    <FiAward className="mr-2 text-slate-500" size={16} />
                    <span className="text-sm">₹{tournament.contestSettings?.featuredContest?.prizePool || tournament.prizeStructure?.totalPrizePool || "TBD"}</span>
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
                {["all", "upcoming", "active", "completed"].map((status) => (
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
              <p className="text-sm font-medium text-slate-700 mb-3">Format</p>
              <div className="flex flex-wrap gap-2">
                {["all", "T20", "ODI", "Test", "T10"].map((type) => (
                  <button
                    key={type}
                    onClick={() => setFilterType(type)}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${
                      filterType === type
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                    }`}
                  >
                    {type === "all" ? "All Formats" : type}
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
