import { FaStar, FaTrophy, FaUsers, FaCrown, FaChartLine, FaGift } from "react-icons/fa";
import { GiCricketBat, GiBaseballBat } from "react-icons/gi";

const pointsData = [
  {
    category: "Batting Performance",
    icon: <GiCricketBat className="text-2xl" />,
    color: "bg-green-100 border-green-300 text-green-800",
    points: [
      { action: "Run scored", points: "+1 point" },
      { action: "Boundary hit (4s)", points: "+1 extra point" },
      { action: "Sixer hit (6s)", points: "+2 extra points" },
      { action: "Half Century (50 runs)", points: "+8 bonus points" },
      { action: "Century (100 runs)", points: "+16 bonus points" },
      { action: "Strike Rate (>140)", points: "+6 bonus points" },
      { action: "Strike Rate (120-140)", points: "+4 bonus points" },
      { action: "Strike Rate (60-80)", points: "-2 points" },
      { action: "Strike Rate (<60)", points: "-4 points" },
    ]
  },
  {
    category: "Bowling Performance",
    icon: <GiBaseballBat className="text-2xl" />,
    color: "bg-blue-100 border-blue-300 text-blue-800",
    points: [
      { action: "Wicket taken", points: "+25 points" },
      { action: "LBW/Bowled Bonus", points: "+8 bonus points" },
      { action: "3 Wicket Haul", points: "+4 bonus points" },
      { action: "4 Wicket Haul", points: "+8 bonus points" },
      { action: "5+ Wicket Haul", points: "+16 bonus points" },
      { action: "Economy Rate (<5)", points: "+6 bonus points" },
      { action: "Economy Rate (5-6.99)", points: "+4 bonus points" },
      { action: "Economy Rate (10-11)", points: "-2 points" },
      { action: "Economy Rate (>11)", points: "-4 points" },
    ]
  },
  {
    category: "Fielding Performance", 
    icon: <FaStar className="text-2xl" />,
    color: "bg-orange-100 border-orange-300 text-orange-800",
    points: [
      { action: "Catch taken", points: "+8 points" },
      { action: "Stumping", points: "+12 points" },
      { action: "Direct Hit Run Out", points: "+12 points" },
      { action: "Indirect Run Out", points: "+6 points" },
    ]
  },
  {
    category: "Captain & Vice-Captain",
    icon: <FaCrown className="text-2xl" />,
    color: "bg-purple-100 border-purple-300 text-purple-800",
    points: [
      { action: "Captain", points: "2x points" },
      { action: "Vice-Captain", points: "1.5x points" },
    ]
  },
  {
    category: "Other Bonuses",
    icon: <FaGift className="text-2xl" />,
    color: "bg-orange-100 border-orange-300 text-orange-800",
    points: [
      { action: "Playing XI", points: "+4 points" },
      { action: "Substitute", points: "+2 points" },
      { action: "Duck (Batsman)", points: "-2 points" },
      { action: "Maiden Over", points: "+12 points" },
    ]
  }
];

const tips = [
  {
    icon: <FaChartLine className="text-xl" />,
    title: "Study Player Form",
    description: "Check recent performances and stats before selecting players"
  },
  {
    icon: <FaUsers className="text-xl" />,
    title: "Team Balance",
    description: "Create a balanced team with batsmen, bowlers, all-rounders & wicket-keeper"
  },
  {
    icon: <FaTrophy className="text-xl" />,
    title: "Choose Captain Wisely",
    description: "Select players likely to perform well as Captain (2x) or Vice-Captain (1.5x)"
  },
  {
    icon: <GiCricketBat className="text-xl" />,
    title: "Track Conditions",
    description: "Consider pitch conditions, weather, and team news before finalizing"
  }
];

export default function HowToEarnPoints() {
  return (
    <main className="px-4 py-12 space-y-20 bg-main">
      <section className="max-w-[1440px] mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-primary text-white rounded-2xl p-8 shadow-lg relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative">
              <FaChartLine className="text-4xl mx-auto mb-4 text-yellow-400" />
              <h1 className="text-4xl font-bold mb-4">How to Score</h1>
              <p className="text-lg text-white/90 max-w-3xl mx-auto">
                Master the art of matchplay cricket by understanding our comprehensive point system. 
                Every run, wicket, and catch counts towards your victory!
              </p>
            </div>
          </div>
        </div>

        {/* Format Points Section */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-primary mb-6 text-center">CLG Points by Match Format</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
              <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">T20</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">T20 Matches</h3>
              <p className="text-slate-600 mb-4">Fast-paced format with bonus multipliers</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Strike Rate Bonus</span>
                  <span className="font-semibold text-green-600">1.5x</span>
                </div>
                <div className="flex justify-between">
                  <span>Boundary Bonus</span>
                  <span className="font-semibold text-green-600">1.2x</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
              <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">ODI</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">ODI Matches</h3>
              <p className="text-slate-600 mb-4">Balanced format with standard points</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Standard Points</span>
                  <span className="font-semibold text-blue-600">1x</span>
                </div>
                <div className="flex justify-between">
                  <span>Century Bonus</span>
                  <span className="font-semibold text-green-600">1.2x</span>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 text-center">
              <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-white font-bold text-lg">TEST</span>
              </div>
              <h3 className="text-xl font-semibold text-slate-800 mb-2">Test Matches</h3>
              <p className="text-slate-600 mb-4">Premium format with enhanced rewards</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span>Wicket Bonus</span>
                  <span className="font-semibold text-green-600">1.5x</span>
                </div>
                <div className="flex justify-between">
                  <span>Century Bonus</span>
                  <span className="font-semibold text-green-600">2x</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Points System */}
        <div className="space-y-8 mb-12">
          {pointsData.map((category, index) => (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
              <div className={`${category.color} p-6 border-l-4`}>
                <div className="flex items-center gap-4">
                  {category.icon}
                  <h2 className="text-2xl font-bold">{category.category}</h2>
                </div>
              </div>
              
              <div className="p-6">
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {category.points.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-4 bg-slate-50 rounded-xl border border-slate-100">
                      <span className="font-medium text-slate-700">{item.action}</span>
                      <span className={`font-bold px-3 py-1 rounded-full text-sm ${
                        item.points.includes('+') 
                          ? 'bg-green-100 text-green-800' 
                          : item.points.includes('-')
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.points}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Pro Tips */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
          <div className="text-center mb-8">
            <FaTrophy className="text-4xl text-primary mx-auto mb-4" />
            <h2 className="text-3xl font-bold text-primary mb-4">Pro Tips to Maximize Points</h2>
            <p className="text-secondary max-w-2xl mx-auto">
              Follow these expert strategies to build winning teams and climb the leaderboard
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tips.map((tip, index) => (
              <div key={index} className="flex gap-4 p-6 bg-slate-50 rounded-xl border border-slate-100">
                <div className="flex-shrink-0 w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center">
                  {tip.icon}
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-primary mb-2">{tip.title}</h3>
                  <p className="text-secondary">{tip.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center mt-10">
          <div className="bg-gradient-primary text-white rounded-xl p-8 relative overflow-hidden">
            <div className="absolute inset-0 bg-black/20" />
            <div className="relative">
              <h3 className="text-2xl font-bold mb-4">Ready to Build Your Winning Team?</h3>
              <p className="text-white/90 mb-6">
                Put your knowledge to the test and start earning points in upcoming tournaments!
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button className="px-8 py-3 bg-yellow-400 text-primary rounded-xl font-semibold hover:bg-[#c4722a] transition">
                  Join Tournament
                </button>
                <button className="px-8 py-3 border border-white text-white rounded-xl font-semibold hover:bg-white/10 transition">
                  View Tournaments
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}