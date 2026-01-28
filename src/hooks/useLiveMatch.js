import { useEffect, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { 
  initializeLiveTracking, 
  stopLiveTracking, 
  updateLiveScores,
  selectIsLiveTracking,
  selectTeamScores,
  selectTeamScoresLastUpdate,
  selectLiveMatchLoading,
  selectLiveMatchError
} from '../store/slices/liveMatchSlice';

/**
 * Hook for managing live match tracking and score updates
 */
export const useLiveMatch = (matchId, matchData) => {
  const dispatch = useDispatch();
  
  // Selectors
  const isTracking = useSelector(state => selectIsLiveTracking(state, matchId));
  const teamScores = useSelector(state => selectTeamScores(state, matchId));
  const lastScoreUpdate = useSelector(state => selectTeamScoresLastUpdate(state, matchId));
  const loading = useSelector(state => selectLiveMatchLoading(state, matchId));
  const error = useSelector(state => selectLiveMatchError(state, matchId));

  // Extract match key from external API data
  const getMatchKey = useCallback(() => {
    // Try to extract match key from various possible sources
    if (matchData?.externalMatchKey) return matchData.externalMatchKey;
    if (matchData?.roanuzKey) return matchData.roanuzKey;
    if (matchData?.apiKey) return matchData.apiKey;
    
    // Fallback: construct from match data if available
    if (matchData?.teams?.a?.key && matchData?.teams?.b?.key) {
      return `${matchData.teams.a.key}-vs-${matchData.teams.b.key}-${matchData.startedAt || Date.now()}`;
    }
    
    return null;
  }, [matchData]);

  // Check if match should start live tracking
  const shouldStartTracking = useCallback(() => {
    if (!matchData) return false;
    
    const now = Date.now();
    const matchStartTime = matchData.startedAt ? new Date(matchData.startedAt * 1000).getTime() : null;
    const status = matchData.status;
    
    // Start tracking if:
    // 1. Match has started OR is live
    // 2. Match is not completed
    // 3. Not already tracking
    const hasStarted = matchStartTime ? now >= matchStartTime : false;
    const isLive = status === 'live' || status === 'in_progress';
    const isNotCompleted = status !== 'completed' && status !== 'finished';
    
    return (hasStarted || isLive) && isNotCompleted && !isTracking;
  }, [matchData, isTracking]);

  // Start live tracking
  const startTracking = useCallback(async () => {
    const matchKey = getMatchKey();
    if (!matchKey) {
      console.warn(`Cannot start live tracking for match ${matchId}: No match key available`);
      return;
    }

    const startTime = matchData?.startedAt ? matchData.startedAt * 1000 : null;
    
    dispatch(initializeLiveTracking({
      matchId,
      matchKey,
      startTime
    }));
  }, [dispatch, matchId, matchData, getMatchKey]);

  // Stop live tracking
  const stopTracking = useCallback(() => {
    dispatch(stopLiveTracking({ matchId }));
  }, [dispatch, matchId]);

  // Manual score update
  const updateScores = useCallback(async () => {
    const matchKey = getMatchKey();
    if (!matchKey) {
      console.warn(`Cannot update scores for match ${matchId}: No match key available`);
      return;
    }

    dispatch(updateLiveScores({ matchId, matchKey }));
  }, [dispatch, matchId, getMatchKey]);

  // Auto-start tracking when conditions are met
  useEffect(() => {
    if (shouldStartTracking()) {
      startTracking();
    }
  }, [shouldStartTracking, startTracking]);

  // Cleanup on unmount or when match is completed
  useEffect(() => {
    return () => {
      if (isTracking) {
        stopTracking();
      }
    };
  }, [isTracking, stopTracking]);

  // Auto-stop tracking when match is completed
  useEffect(() => {
    if (matchData?.status === 'completed' && isTracking) {
      // Do final score update before stopping
      updateScores().then(() => {
        setTimeout(() => stopTracking(), 5000); // Wait 5 seconds before stopping
      });
    }
  }, [matchData?.status, isTracking, updateScores, stopTracking]);

  return {
    // State
    isTracking,
    teamScores,
    lastScoreUpdate,
    loading,
    error,
    
    // Actions
    startTracking,
    stopTracking,
    updateScores,
    
    // Computed
    canTrack: !!getMatchKey(),
    shouldStartTracking: shouldStartTracking()
  };
};