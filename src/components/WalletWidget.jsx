import React, { useState, useEffect } from 'react';
import { FiDollarSign, FiTrendingUp, FiEye } from 'react-icons/fi';
import { Link } from 'react-router-dom';

const WalletWidget = ({ isCompact = false }) => {
  const [walletData, setWalletData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWalletBalance();
  }, []);

  const fetchWalletBalance = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/wallet/balance', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setWalletData(data.data);
      } else {
        throw new Error('Failed to fetch wallet balance');
      }
    } catch (error) {
      console.error('Error fetching wallet balance:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number || 0);
  };

  if (loading) {
    return (
      <div className={`${isCompact ? 'p-2' : 'p-4'} bg-gradient-to-r from-green-50 to-blue-50 rounded-lg border border-green-200`}>
        <div className="animate-pulse">
          <div className="h-4 bg-gray-300 rounded w-20 mb-2"></div>
          <div className="h-6 bg-gray-300 rounded w-16"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`${isCompact ? 'p-2' : 'p-4'} bg-red-50 rounded-lg border border-red-200`}>
        <p className="text-red-600 text-xs">Error loading wallet</p>
      </div>
    );
  }

  if (isCompact) {
    return (
      <Link to="/vault" className="block">
        <div className="p-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg text-white hover:shadow-lg transition-all duration-300 transform hover:scale-105">
          <div className="flex items-center space-x-2">
            <FiDollarSign className="text-lg" />
            <div>
              <p className="text-xs opacity-90">Vault Balance</p>
              <p className="text-lg font-bold">{formatNumber(walletData?.balance)} pts</p>
            </div>
          </div>
        </div>
      </Link>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-4 border border-gray-200">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-green-100 rounded-full">
            <FiDollarSign className="text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">My Vault</h3>
        </div>
        <Link 
          to="/vault"
          className="text-blue-600 hover:text-blue-700 transition-colors flex items-center space-x-1"
        >
          <FiEye className="text-sm" />
          <span className="text-sm">View</span>
        </Link>
      </div>

      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <span className="text-gray-600 text-sm">Current Balance</span>
          <span className="text-2xl font-bold text-green-600">
            {formatNumber(walletData?.balance)} pts
          </span>
        </div>

        <div className="pt-3 border-t border-gray-100">
          <Link 
            to="/vault"
            className="w-full bg-gradient-to-r from-green-500 to-blue-500 text-white py-2 px-4 rounded-lg hover:shadow-lg transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <FiTrendingUp className="text-sm" />
            <span className="font-medium">View Vault Details</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WalletWidget;