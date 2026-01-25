/**
 * Example: How to integrate team creation link in your Match component
 * 
 * This example shows how to add a "Create Team" button that navigates
 * to the team creation page with the correct match key.
 */

import { useNavigate } from 'react-router-dom';
import { FiUsers } from 'react-icons/fi';

function MatchCard({ match }) {
  const navigate = useNavigate();

  const handleCreateTeam = () => {
    // Navigate to team creation with match key as URL parameter
    navigate(`/create-team?matchKey=${match.matchKey}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-bold text-gray-800">{match.name}</h3>
          <p className="text-sm text-gray-600">
            {match.tournament?.name}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {new Date(match.matchDate).toLocaleString()}
          </p>
        </div>
        <span className={`px-2 py-1 rounded-full text-xs font-bold ${
          match.status === 'upcoming' ? 'bg-blue-100 text-blue-700' :
          match.status === 'live' ? 'bg-green-100 text-green-700' :
          'bg-gray-100 text-gray-700'
        }`}>
          {match.status.toUpperCase()}
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={handleCreateTeam}
          disabled={match.status === 'completed'}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-[#273470] text-white rounded-lg hover:bg-[#1e2859] transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
        >
          <FiUsers size={16} />
          Create Team
        </button>
        
        <button
          onClick={() => navigate(`/matches/${match._id}`)}
          className="px-4 py-2 border border-[#273470] text-[#273470] rounded-lg hover:bg-gray-50 transition-colors"
        >
          Details
        </button>
      </div>
    </div>
  );
}

export default MatchCard;

/**
 * Example Usage in Matches List:
 * 
 * function MatchesList() {
 *   const [matches, setMatches] = useState([]);
 * 
 *   useEffect(() => {
 *     fetchMatches();
 *   }, []);
 * 
 *   const fetchMatches = async () => {
 *     const response = await matchesAPI.getAll();
 *     setMatches(response.data);
 *   };
 * 
 *   return (
 *     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
 *       {matches.map(match => (
 *         <MatchCard key={match._id} match={match} />
 *       ))}
 *     </div>
 *   );
 * }
 */
