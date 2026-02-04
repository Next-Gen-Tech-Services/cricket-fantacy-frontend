import React, { useEffect, useState } from 'react';
import notificationService from '../services/notificationService';

/**
 * Test component for notification functionality
 * Can be added to any page for testing
 */
const NotificationTester = () => {
  const [status, setStatus] = useState({
    permission: 'default',
    isAuthenticated: false,
    hasToken: false,
    isListening: false
  });

  const [logs, setLogs] = useState([]);

  const addLog = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `${timestamp}: ${message}`]);
    console.log(`🧪 Notification Test: ${message}`);
  };

  useEffect(() => {
    // Check initial status
    updateStatus();

    // Listen for notification events
    const handleNotification = (event) => {
      addLog(`Received custom event: ${JSON.stringify(event.detail)}`);
    };

    window.addEventListener('fcm-notification', handleNotification);

    return () => {
      window.removeEventListener('fcm-notification', handleNotification);
    };
  }, []);

  const updateStatus = () => {
    setStatus({
      permission: notificationService.getPermissionStatus(),
      isAuthenticated: notificationService.isUserAuthenticated(),
      hasToken: !!notificationService.fcmToken,
      isListening: notificationService.isListening()
    });
  };

  const handleTestInit = async () => {
    addLog('Initializing notification service...');
    const result = await notificationService.initialize();
    addLog(`Initialization result: ${result}`);
    updateStatus();
  };

  const handleRequestPermission = async () => {
    addLog('Requesting notification permission...');
    const result = await notificationService.requestPermission();
    addLog(`Permission result: ${JSON.stringify(result)}`);
    updateStatus();
  };

  const handleSendTest = async () => {
    addLog('Sending test notification...');
    try {
      await notificationService.sendTestNotification();
      addLog('Test notification sent successfully');
    } catch (error) {
      addLog(`Test failed: ${error.message}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="bg-gray-100 p-4 rounded-lg shadow-md max-w-2xl">
      <h3 className="text-lg font-bold mb-4">🧪 Notification Service Tester</h3>
      
      {/* Status Display */}
      <div className="grid grid-cols-2 gap-2 mb-4 text-sm">
        <div className={`p-2 rounded ${status.permission === 'granted' ? 'bg-green-200' : status.permission === 'denied' ? 'bg-red-200' : 'bg-yellow-200'}`}>
          Permission: {status.permission}
        </div>
        <div className={`p-2 rounded ${status.isAuthenticated ? 'bg-green-200' : 'bg-red-200'}`}>
          Authenticated: {status.isAuthenticated ? 'Yes' : 'No'}
        </div>
        <div className={`p-2 rounded ${status.hasToken ? 'bg-green-200' : 'bg-red-200'}`}>
          Has Token: {status.hasToken ? 'Yes' : 'No'}
        </div>
        <div className={`p-2 rounded ${status.isListening ? 'bg-green-200' : 'bg-red-200'}`}>
          Listening: {status.isListening ? 'Yes' : 'No'}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <button 
          onClick={handleTestInit}
          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
        >
          Initialize Service
        </button>
        <button 
          onClick={handleRequestPermission}
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
        >
          Request Permission
        </button>
        <button 
          onClick={handleSendTest}
          className="px-3 py-1 bg-purple-500 text-white rounded hover:bg-purple-600 text-sm"
        >
          Send Test
        </button>
        <button 
          onClick={updateStatus}
          className="px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 text-sm"
        >
          Refresh Status
        </button>
        <button 
          onClick={clearLogs}
          className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-sm"
        >
          Clear Logs
        </button>
      </div>

      {/* Logs Display */}
      <div className="bg-black text-green-400 p-3 rounded text-xs font-mono h-48 overflow-y-auto">
        <div className="mb-2 text-gray-500">📋 Notification Service Logs:</div>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
        {logs.length === 0 && (
          <div className="text-gray-500">No logs yet...</div>
        )}
      </div>

      <div className="mt-2 text-xs text-gray-600">
        Add this component to any page to test notifications. Check browser console for detailed logs.
      </div>
    </div>
  );
};

export default NotificationTester;