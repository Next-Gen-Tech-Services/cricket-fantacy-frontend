import React, { useState } from 'react';
import MatchStatsService from '../services/matchStatsService';

const DebugMatchStats = ({ matchId = '69765d6998f5301141c43bd2' }) => {
  const [testResult, setTestResult] = useState('');

  const testAPI = async () => {
    try {
      console.log('Testing API with matchId:', matchId);
      setTestResult('Loading...');
      
      const response = await MatchStatsService.getMatchStats(matchId);
      console.log('API Response:', response);
      setTestResult(JSON.stringify(response, null, 2));
    } catch (error) {
      console.error('API Error:', error);
      setTestResult('Error: ' + error.message);
    }
  };

  return (
    <div style={{ padding: '20px', background: '#f5f5f5', margin: '20px' }}>
      <h3>Debug Match Stats API</h3>
      <p>Testing with matchId: {matchId}</p>
      <button onClick={testAPI}>Test API</button>
      <pre style={{ marginTop: '10px', background: 'white', padding: '10px', overflow: 'auto', maxHeight: '400px' }}>
        {testResult}
      </pre>
    </div>
  );
};

export default DebugMatchStats;