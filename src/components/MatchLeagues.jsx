import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiShare2, FiEye, FiUserPlus, FiStar, FiLock, FiGlobe, FiAward, FiCheck, FiX, FiCopy, FiMail } from 'react-icons/fi';
import { leaguesAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '../store/hooks';

const MatchLeagues = ({ match }) => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningLeague, setJoiningLeague] = useState(null);
  const [shareModal, setShareModal] = useState({ isOpen: false, league: null, shareLink: null });

  useEffect(() => {
    if (match?._id) {
      loadMatchLeagues();
    } else {
      console.warn('No match ID available for loading leagues');
    }
  }, [match?._id]);

  const loadMatchLeagues = async () => {
    if (!match?._id) {
      console.error('Cannot load leagues: Match ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const response = await leaguesAPI.getMatchLeagues(match._id, {
        includePrivate: true,
        limit: 20
      });
      if (response.success) {
        setLeagues(response.data.leagues);
      }
    } catch (error) {
      console.error('Load match leagues error:', error);
      toast.error('Failed to load match leagues');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinLeague = async (league) => {
    try {
      setJoiningLeague(league._id);
      const response = await leaguesAPI.join(league._id);
      if (response.success) {
        toast.success('Successfully joined league!');
        loadMatchLeagues();
      } else {
        throw new Error(response.message || 'Failed to join league');
      }
    } catch (error) {
      console.error('Join league error:', error);
      toast.error(error.message || 'Failed to join league');
    } finally {
      setJoiningLeague(null);
    }
  };

  const handleViewLeague = (league) => {
    navigate(`/leagues/${league._id}`);
  };

  const handleShareLeague = async (league, e) => {
    e.stopPropagation();
    try {
      const response = await leaguesAPI.generateShareLink(league._id);
      if (response.success) {
        const shareLink = response.data?.shareLink || response.shareLink;
        if (shareLink) {
          setShareModal({ isOpen: true, league, shareLink });
        } else {
          toast.error('Share link not available in response');
        }
      } else {
        toast.error(response.message || 'Failed to generate share link');
      }
    } catch (error) {
      console.error('Share league error:', error);
      if (error.message?.includes('Access denied')) {
        toast.error('You must be a league member to share');
      } else if (error.message?.includes('Network')) {
        toast.error('Network error. Please check your connection.');
      } else {
        toast.error(error.message || 'Failed to generate share link');
      }
    }
  };

  const handleCopyLink = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(shareModal.shareLink);
        toast.success('Link copied to clipboard!');
      } else {
        const textArea = document.createElement('textarea');
        textArea.value = shareModal.shareLink;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.prepend(textArea);
        textArea.select();
        try { document.execCommand('copy'); toast.success('Link copied to clipboard!'); } catch (fallbackError) { toast.error('Unable to copy to clipboard', fallbackError); } finally { textArea.remove(); }
      }
      setShareModal({ isOpen: false, league: null, shareLink: null });
    } catch (error) {
      toast.error('Failed to copy link', error);
    }
  };

  const shareOnPlatform = (platform) => {
    const { shareLink, league } = shareModal;
    const text = `Join my match league "${league.name}" on MatchPlay!`;
    switch (platform) {
      case 'whatsapp': window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${shareLink}`)}`, '_blank'); break;
      case 'gmail': window.open(`mailto:?subject=${encodeURIComponent(`Join ${league.name} League`)}&body=${encodeURIComponent(`${text}\n\n${shareLink}`)}`, '_blank'); break;
      case 'twitter': window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${shareLink}`)}`, '_blank'); break;
      case 'facebook': window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, '_blank'); break;
      case 'reddit': window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(text)}`, '_blank'); break;
      default: break;
    }
    setShareModal({ isOpen: false, league: null, shareLink: null });
  };

  const getLeagueTypeIcon = (type) => {
    switch (type) {
      case 'PRIVATE': return <FiLock size={16} className="text-gray-500" />;
      case 'PUBLIC': return <FiGlobe size={16} className="text-green-500" />;
      default: return <FiUsers size={16} className="text-blue-500" />;
    }
  };

  const getFillPercentage = (current, max) => Math.round((current / max) * 100);

  const ShareModal = () => {
    if (!shareModal.isOpen) return null;
    return (
      <div className="fixed inset-0 bg-[#98a2b3] bg-opacity-80 flex items-end sm:items-center justify-center z-50 p-4" onClick={() => setShareModal({ isOpen: false, league: null, shareLink: null })}>
        <div className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full p-4 sm:p-8 relative shadow-xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
          <button onClick={() => setShareModal({ isOpen: false, league: null, shareLink: null })} className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors touch-manipulation"><FiX size={16} className="text-gray-600" /></button>
          <div className="mb-6 sm:mb-8 pr-12"><h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Share</h3></div>
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Share this link via</h4>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <button onClick={() => shareOnPlatform('whatsapp')} className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors touch-manipulation"><div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center"><span className="text-green-600">WA</span></div><span className="text-xs text-gray-600 text-center font-medium">WhatsApp</span></button>
              <button onClick={() => shareOnPlatform('twitter')} className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors touch-manipulation"><div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center"><span className="text-gray-700">X</span></div><span className="text-xs text-gray-600 text-center font-medium">X</span></button>
              <button onClick={() => shareOnPlatform('facebook')} className="flex flex-col items-center space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors touch-manipulation"><div className="w-12 h-12 rounded-xl border border-gray-200 flex items-center justify-center"><span className="text-blue-600">f</span></div><span className="text-xs text-gray-600 text-center font-medium">Facebook</span></button>
            </div>
          </div>
          <hr className="border-gray-200 my-6" />
          <div>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Page link</h4>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border"><div className="flex-1 text-xs sm:text-sm text-gray-600 font-mono truncate">{shareModal.shareLink}</div><button onClick={handleCopyLink} className="p-2 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0 min-h-[40px] min-w-[40px] touch-manipulation" title="Copy link"><FiCopy size={16} className="text-gray-600" /></button></div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-gray-100 p-4 sm:p-6 animate-pulse shadow-sm">
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="h-5 sm:h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="flex flex-wrap items-center gap-3 sm:gap-6">
                  <div className="h-4 bg-gray-200 rounded w-20 sm:w-24"></div>
                  <div className="h-4 bg-gray-200 rounded w-16 sm:w-20"></div>
                </div>
              </div>
              <div className="h-10 bg-gray-200 rounded-lg w-full sm:w-24 lg:w-24"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (!leagues || leagues.length === 0) {
    return (
      <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <FiAward className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No match leagues yet</h3>
        <p className="text-gray-600">Be the first to create a league for this match!</p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {leagues.map((league) => (
          <div key={league._id} className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-200" onClick={() => handleViewLeague(league)}>
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">{getLeagueTypeIcon(league.type)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">{league.name}</h3>
                    {league.createdBy && (
                      <div className="flex items-center space-x-2 text-xs sm:text-sm text-gray-500 mt-1">
                        <FiStar size={12} className="text-yellow-500" />
                        <span className="truncate">{league.createdBy.name}</span>
                      </div>
                    )}
                  </div>
                </div>
                {league.description && (<p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2 leading-relaxed">{league.description}</p>)}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm mb-4">
                  <div className="flex items-center space-x-2 text-gray-600"><FiUsers size={14} className="text-blue-600" /><span className="font-medium">{league.currentMembers}/{league.maxMembers} members</span></div>
                  <div className="flex items-center space-x-2 text-gray-600">{league.settings?.isPublic ? (<><FiGlobe size={14} className="text-green-600" /><span className="font-medium text-green-600">Public</span></>) : (<><FiLock size={14} className="text-orange-600" /><span className="font-medium text-orange-600">Private</span></>)}</div>
                </div>
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2"><span>League filled</span><span className="font-medium">{getFillPercentage(league.currentMembers, league.maxMembers)}%</span></div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5"><div className="bg-gradient-to-r from-blue-600 to-blue-700 h-2.5 rounded-full transition-all duration-300 shadow-sm" style={{ width: `${getFillPercentage(league.currentMembers, league.maxMembers)}%` }}></div></div>
                </div>
              </div>
              <div className="flex items-center gap-3 w-full lg:w-auto lg:ml-6">
                {league.isUserMember ? (
                  <div className={`px-4 py-3 sm:px-6 sm:py-2 text-sm rounded-lg flex items-center justify-center space-x-2 flex-1 lg:flex-none min-h-[44px] ${league.userRole === 'OWNER' ? 'bg-purple-100 text-purple-700' : league.userRole === 'ADMIN' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}`}>
                    <FiCheck size={16} />
                    <span>{league.userRole === 'OWNER' ? 'Owner' : league.userRole === 'ADMIN' ? 'Admin' : 'Joined'}</span>
                  </div>
                ) : (
                  <button onClick={(e) => { e.stopPropagation(); handleJoinLeague(league); }} className="px-4 py-3 sm:px-6 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-1 lg:flex-none min-h-[44px] touch-manipulation" disabled={!user || joiningLeague === league._id || league.currentMembers >= league.maxMembers}>
                    {joiningLeague === league._id ? (<><div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" /><span>Joining...</span></>) : (<><FiUserPlus size={16} /><span>Join</span></>)}
                  </button>
                )}
                {league.isUserMember && (
                  <button onClick={(e) => handleShareLeague(league, e)} className="px-4 py-3 sm:px-4 sm:py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2 min-h-[44px] touch-manipulation flex-shrink-0">
                    <FiShare2 size={16} /><span className="lg:inline">Share</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <ShareModal />
      </div>
    </>
  );
};

export default MatchLeagues;
