import { useSelector, useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { fetchMatchFantasyTeams } from '../store/slices/contestsSlice';

export const useMatchFantasyTeams = (matchId) => {
  const dispatch = useDispatch();
  
  const {
    matchFantasyTeams,
    loading,
    error
  } = useSelector((state) => state.contests);
  
  const teams = matchFantasyTeams[matchId] || [];
  
  useEffect(() => {
    if (matchId && !loading && !matchFantasyTeams[matchId]) {
      console.log('🔍 useMatchFantasyTeams: Fetching fantasy teams for match:', matchId);
      console.log('🔍 useMatchFantasyTeams: Loading state:', loading);
      dispatch(fetchMatchFantasyTeams({ matchId }));
    } else {
      console.log('🔍 useMatchFantasyTeams: Skipping fetch - matchId:', matchId, 'cached:', !!matchFantasyTeams[matchId], 'loading:', loading);
    }
  }, [dispatch, matchId, loading, matchFantasyTeams]);

  const refreshTeams = () => {
    if (matchId) {
      console.log('Refreshing fantasy teams for match:', matchId);
      dispatch(fetchMatchFantasyTeams({ matchId }));
    }
  };

  return {
    teams,
    loading,
    error,
    refreshTeams
  };
};

export default useMatchFantasyTeams;