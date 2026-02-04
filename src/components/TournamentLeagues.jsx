import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiShare2, FiEye, FiUserPlus, FiStar, FiLock, FiGlobe, FiAward, FiCheck, FiX, FiCopy, FiMail } from 'react-icons/fi';
import { leaguesAPI } from '../services/api';
import { toast } from 'react-hot-toast';
import { useAppSelector } from '../store/hooks';

const TournamentLeagues = ({ tournament }) => {
  const navigate = useNavigate();
  const { user } = useAppSelector(state => state.auth);
  const [leagues, setLeagues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [joiningLeague, setJoiningLeague] = useState(null);
  const [shareModal, setShareModal] = useState({ isOpen: false, league: null, shareLink: null });

  useEffect(() => {
    if (tournament?._id) {
      loadTournamentLeagues();
    } else {
      console.warn('No tournament ID available for loading leagues');
    }
  }, [tournament?._id]);

  const loadTournamentLeagues = async () => {
    if (!tournament?._id) {
      console.error('Cannot load leagues: Tournament ID is missing');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      console.log('Loading leagues for tournament:', tournament?._id); // Debug log
      const response = await leaguesAPI.getTournamentLeagues(tournament._id, {
        includePrivate: true,
        limit: 20
      });

      console.log('Leagues API response:', response); // Debug log
      if (response.success) {
        setLeagues(response.data.leagues);
        console.log('Loaded leagues:', response.data.leagues.length); // Debug log
      }
    } catch (error) {
      console.error('Load leagues error:', error);
      toast.error('Failed to load leagues');
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
        loadTournamentLeagues(); // Refresh the list
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
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = shareModal.shareLink;
        textArea.style.position = 'absolute';
        textArea.style.left = '-999999px';
        document.body.prepend(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          toast.success('Link copied to clipboard!');
        } catch (fallbackError) {
          toast.error('Unable to copy to clipboard',fallbackError);
        } finally {
          textArea.remove();
        }
      }
      setShareModal({ isOpen: false, league: null, shareLink: null });
    } catch (error) {
      toast.error('Failed to copy link',error);
    }
  };

  const shareOnPlatform = (platform) => {
    const { shareLink, league } = shareModal;
    const text = `Join my fantasy league "${league.name}" on Cricket Lover!`;

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(`${text} ${shareLink}`)}`, '_blank');
        break;
      case 'gmail':
        window.open(`mailto:?subject=${encodeURIComponent(`Join ${league.name} League`)}&body=${encodeURIComponent(`${text}\\n\\n${shareLink}`)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`${text} ${shareLink}`)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareLink)}`, '_blank');
        break;
      case 'reddit':
        window.open(`https://reddit.com/submit?url=${encodeURIComponent(shareLink)}&title=${encodeURIComponent(text)}`, '_blank');
        break;
      case 'instagram':
        // Instagram doesn't support direct link sharing, so copy to clipboard with instruction
        handleCopyLink();
        toast.info('Link copied! You can now paste it in Instagram');
        return;
      default:
        break;
    }
    setShareModal({ isOpen: false, league: null, shareLink: null });
  };

  const getLeagueTypeIcon = (type) => {
    switch (type) {
      case 'PRIVATE':
        return <FiLock size={16} className="text-gray-500" />;
      case 'PUBLIC':
        return <FiGlobe size={16} className="text-green-500" />;
      default:
        return <FiUsers size={16} className="text-blue-500" />;
    }
  };

  const getFillPercentage = (current, max) => {
    return Math.round((current / max) * 100);
  };

  // Share Modal Component
  const ShareModal = () => {
    if (!shareModal.isOpen) return null;

    return (
      <div
        className="fixed inset-0 bg-[#98a2b3] bg-opacity-80 flex items-end sm:items-center justify-center z-50 p-4"
        onClick={() => setShareModal({ isOpen: false, league: null, shareLink: null })}
      >
        <div
          className="bg-white rounded-t-2xl sm:rounded-2xl max-w-lg w-full p-4 sm:p-8 relative shadow-xl max-h-[90vh] overflow-y-auto"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Close Button */}
          <button
            onClick={() => setShareModal({ isOpen: false, league: null, shareLink: null })}
            className="absolute top-4 right-4 sm:top-6 sm:right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors touch-manipulation"
          >
            <FiX size={16} className="text-gray-600" />
          </button>

          {/* Header */}
          <div className="mb-6 sm:mb-8 pr-12">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-2">Share</h3>
          </div>

          {/* Share this link via */}
          <div className="mb-6">
            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Share this link via</h4>

            {/* Platform Icons - Responsive Grid Layout */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:flex lg:space-x-2 gap-3 sm:gap-2 lg:gap-0">
              {/* WhatsApp */}
              <button
                onClick={() => shareOnPlatform('whatsapp')}
                className="flex flex-col items-center space-y-2 p-3 sm:p-2 lg:p-3 rounded-xl hover:bg-gray-50 transition-colors touch-manipulation min-h-[80px] sm:min-h-[70px]"
              >
                <div className="w-12 h-12 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl border border-gray-200 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-green-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.890-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center font-medium">WhatsApp</span>
              </button>

              {/* Facebook */}
              <button
                onClick={() => shareOnPlatform('facebook')}
                className="flex flex-col items-center space-y-2 p-3 sm:p-2 lg:p-3 rounded-xl hover:bg-gray-50 transition-colors touch-manipulation min-h-[80px] sm:min-h-[70px]"
              >
                <div className="w-12 h-12 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl border border-gray-200 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-blue-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center font-medium">Facebook</span>
              </button>

              {/* X (Twitter) */}
              <button
                onClick={() => shareOnPlatform('twitter')}
                className="flex flex-col items-center space-y-2 p-3 sm:p-2 lg:p-3 rounded-xl hover:bg-gray-50 transition-colors touch-manipulation min-h-[80px] sm:min-h-[70px]"
              >
                <div className="w-12 h-12 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl border border-gray-200 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-700" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center font-medium">X</span>
              </button>

              {/* Reddit */}
              <button
                onClick={() => shareOnPlatform('reddit')}
                className="flex flex-col items-center space-y-2 p-3 sm:p-2 lg:p-3 rounded-xl hover:bg-gray-50 transition-colors touch-manipulation min-h-[80px] sm:min-h-[70px]"
              >
                <div className="w-12 h-12 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl border border-gray-200 flex items-center justify-center">
                  <svg className="w-5 h-5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-orange-600" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249zm-5.466 3.99a.327.327 0 0 0-.231.094.33.33 0 0 0 0 .463c.842.842 2.484.913 2.961.913.477 0 2.105-.056 2.961-.913a.361.361 0 0 0 .029-.463.33.33 0 0 0-.464 0c-.547.533-1.684.73-2.512.73-.828 0-1.979-.196-2.512-.73a.326.326 0 0 0-.232-.095z" />
                  </svg>
                </div>
                <span className="text-xs text-gray-600 text-center font-medium">Reddit</span>
              </button>

              {/* Email */}
              <button
                onClick={() => shareOnPlatform('gmail')}
                className="flex flex-col items-center space-y-2 p-3 sm:p-2 lg:p-3 rounded-xl hover:bg-gray-50 transition-colors touch-manipulation min-h-[80px] sm:min-h-[70px]"
              >
                <div className="w-12 h-12 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-xl border border-gray-200 flex items-center justify-center">
                  <FiMail className="w-5 h-5 sm:w-4 sm:h-4 lg:w-5 lg:h-5 text-gray-700" />
                </div>
                <span className="text-xs text-gray-600 text-center font-medium">Email</span>
              </button>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-gray-200 my-6" />

          {/* Page Link Section */}
          <div>
            <h4 className="text-base sm:text-lg font-medium text-gray-900 mb-4">Page link</h4>
            <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg border">
              <div className="flex-1 text-xs sm:text-sm text-gray-600 font-mono truncate">
                {shareModal.shareLink}
              </div>
              <button
                onClick={handleCopyLink}
                className="p-2 hover:bg-gray-200 rounded-md transition-colors flex-shrink-0 min-h-[40px] min-w-[40px] touch-manipulation"
                title="Copy link"
              >
                <FiCopy size={16} className="text-gray-600" />
              </button>
            </div>
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
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No leagues yet</h3>
        <p className="text-gray-600">
          Be the first to create a league for this tournament!
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-4 sm:space-y-6">
        {leagues.map((league) => (
          <div
            key={league._id}
            className="bg-white rounded-xl border border-gray-100 p-5 sm:p-6 hover:shadow-lg transition-all duration-200 cursor-pointer hover:border-blue-200"
            onClick={() => handleViewLeague(league)}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
              <div className="flex-1">
                {/* League Name and Type */}
                <div className="flex items-center space-x-3 mb-3">
                  <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                    {getLeagueTypeIcon(league.type)}
                  </div>
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

                {/* Description */}
                {league.description && (
                  <p className="text-sm sm:text-base text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                    {league.description}
                  </p>
                )}

                {/* League Stats */}
                <div className="flex flex-wrap items-center gap-3 sm:gap-6 text-xs sm:text-sm mb-4">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <FiUsers size={14} className="text-blue-600" />
                    <span className="font-medium">
                      {league.currentMembers}/{league.maxMembers} members
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-gray-600">
                    {league.settings?.isPublic ? (
                      <><FiGlobe size={14} className="text-green-600" /><span className="font-medium text-green-600">Public</span></>
                    ) : (
                      <><FiLock size={14} className="text-orange-600" /><span className="font-medium text-orange-600">Private</span></>
                    )}
                  </div>

                  {league.rules?.entryFee > 0 && (
                    <div className="text-green-600 font-semibold">
                      ₹{league.rules.entryFee}
                    </div>
                  )}

                  {league.rules?.entryFee === 0 && (
                    <div className="text-blue-600 font-semibold">
                      Free
                    </div>
                  )}
                </div>

                {/* Progress Bar */}
                <div className="mt-4">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>League filled</span>
                    <span className="font-medium">{getFillPercentage(league.currentMembers, league.maxMembers)}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div
                      className="bg-gradient-to-r from-blue-600 to-blue-700 h-2.5 rounded-full transition-all duration-300 shadow-sm"
                      style={{
                        width: `${getFillPercentage(league.currentMembers, league.maxMembers)}%`,
                      }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 w-full lg:w-auto lg:ml-6">
                {/* Conditional Join/Joined Button */}
                {league.isUserMember ? (
                  <div className={`px-4 py-3 sm:px-6 sm:py-2 text-sm rounded-lg flex items-center justify-center space-x-2 flex-1 lg:flex-none min-h-[44px] ${league.userRole === 'OWNER' ? 'bg-purple-100 text-purple-700' :
                    league.userRole === 'ADMIN' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                    }`}>
                    <FiCheck size={16} />
                    <span>
                      {league.userRole === 'OWNER' ? 'Owner' :
                        league.userRole === 'ADMIN' ? 'Admin' :
                          'Joined'}
                    </span>
                  </div>
                ) : (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleJoinLeague(league);
                    }}
                    className="px-4 py-3 sm:px-6 sm:py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-all duration-200 flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm flex-1 lg:flex-none min-h-[44px] touch-manipulation"
                    disabled={
                      !user ||
                      joiningLeague === league._id ||
                      league.currentMembers >= league.maxMembers
                    }
                  >
                    {joiningLeague === league._id ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                        <span>Joining...</span>
                      </>
                    ) : (
                      <>
                        <FiUserPlus size={16} />
                        <span>Join</span>
                      </>
                    )}
                  </button>
                )}

                {/* Share Button - Only show for members */}
                {league.isUserMember && (
                  <button
                    onClick={(e) => handleShareLeague(league, e)}
                    className="px-4 py-3 sm:px-4 sm:py-2 border border-gray-200 text-gray-700 text-sm rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center space-x-2 min-h-[44px] touch-manipulation flex-shrink-0"
                  >
                    <FiShare2 size={16} />
                    <span className="lg:inline">Share</span>
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

export default TournamentLeagues;