import React, { useState, useEffect } from 'react';
import {
  FiTrendingUp,
  FiDollarSign,
  FiAward,
  FiActivity,
  FiClock,
  FiEye,
  FiFilter,
  FiDownload
} from 'react-icons/fi';
import LoadingSpinner from './LoadingSpinner';
import { walletAPI } from '../services/api';
import { getWalletSummary, getWalletTransactions } from '../services/api';

const Vault = () => {
  const [walletData, setWalletData] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [transactionType, setTransactionType] = useState('all');
  const [showTransactions, setShowTransactions] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Fetch wallet data
  useEffect(() => {
    fetchWalletData();
  }, []);

  const fetchWalletData = async () => {
    try {
      setLoading(true);

      // Fetch wallet summary
      const summaryData = await walletAPI.getSummary();
      setWalletData(summaryData.data);

      // Fetch recent transactions
      const transactionsData = await walletAPI.getTransactions({ limit: 10 });
      setTransactions(transactionsData.data.transactions || []);

    } catch (error) {
      console.error('Error fetching wallet data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchTransactions = async (page = 1, filters = {}) => {
    try {
      const params = {
        page: page.toString(),
        limit: '20',
        ...filters
      };

      const data = await walletAPI.getTransactions(params);
      setTransactions(data.data.transactions || []);
      setCurrentPage(page);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  const formatNumber = (number) => {
    return new Intl.NumberFormat('en-US').format(number || 0);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTransactionIcon = (type) => {
    const iconMap = {
      'FANTASY_POINTS_EARNED': <FiAward className="text-green-500" />,
      'CONTEST_WINNINGS': <FiTrendingUp className="text-purple-500" />,
      'BONUS_POINTS': <FiDollarSign className="text-blue-500" />,
      'CONTEST_ENTRY_FEE': <FiActivity className="text-red-500" />,
      'DEPOSIT': <FiDollarSign className="text-green-500" />,
      'WITHDRAWAL': <FiActivity className="text-orange-500" />
    };
    return iconMap[type] || <FiActivity className="text-gray-500" />;
  };

  const getTransactionColor = (type) => {
    const colorMap = {
      'FANTASY_POINTS_EARNED': 'text-green-600',
      'CONTEST_WINNINGS': 'text-purple-600',
      'BONUS_POINTS': 'text-blue-600',
      'CONTEST_ENTRY_FEE': 'text-red-600',
      'DEPOSIT': 'text-green-600',
      'WITHDRAWAL': 'text-orange-600'
    };
    return colorMap[type] || 'text-gray-600';
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Error Loading Vault</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={fetchWalletData}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 via-blue-600 to-purple-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center">
            <div className="text-6xl mb-4">🏆</div>
            <h1 className="text-4xl font-bold mb-2">My Vault</h1>
            <p className="text-xl opacity-90">Track your matchplay cricket earnings</p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Main Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {/* Current Balance */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-green-500 text-3xl mb-2">
              <FiDollarSign className="mx-auto" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Current Balance</h3>
            <p className="text-3xl font-bold text-green-600">
              {formatNumber(walletData?.balance)} CLG pts
            </p>
          </div>

          {/* Total Earned */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-blue-500 text-3xl mb-2">
              <FiTrendingUp className="mx-auto" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Earned</h3>
            <p className="text-3xl font-bold text-blue-600">
              {formatNumber(walletData?.totalEarned)} CLG pts
            </p>
          </div>

          {/* Total Matches */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-purple-500 text-3xl mb-2">
              <FiActivity className="mx-auto" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Total Matches</h3>
            <p className="text-3xl font-bold text-purple-600">
              {formatNumber(walletData?.totalMatches)}
            </p>
          </div>

          {/* Average Points */}
          <div className="bg-white rounded-xl shadow-lg p-6 text-center">
            <div className="text-orange-500 text-3xl mb-2">
              <FiAward className="mx-auto" />
            </div>
            <h3 className="text-sm font-medium text-gray-600 mb-1">Avg per Match</h3>
            <p className="text-3xl font-bold text-orange-600">
              {formatNumber(Math.round(walletData?.averagePointsPerMatch || 0))} CLG pts
            </p>
          </div>
        </div>

        {/* Detailed Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Performance Overview */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Performance Overview</h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-4 bg-green-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiAward className="text-green-500 text-xl" />
                  <span className="font-medium text-gray-700">MatchPlay Points</span>
                </div>
                <span className="text-lg font-bold text-green-600">
                  {formatNumber(walletData?.breakdown?.totalFantasyPoints || 0)} CLG pts
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-purple-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiTrendingUp className="text-purple-500 text-xl" />
                  <span className="font-medium text-gray-700">Contest Winnings</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {formatNumber(walletData?.breakdown?.totalContestWinnings || 0)} CLG pts
                </span>
              </div>

              <div className="flex justify-between items-center p-4 bg-blue-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <FiDollarSign className="text-blue-500 text-xl" />
                  <span className="font-medium text-gray-700">Bonus Points</span>
                </div>
                <span className="text-lg font-bold text-blue-600">
                  {formatNumber(walletData?.breakdown?.totalBonusPoints || 0)} CLG pts
                </span>
              </div>
            </div>

            {walletData?.bestMatchPoints && (
              <div className="mt-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
                <h3 className="text-sm font-medium text-gray-700 mb-1">🏆 Best Match Performance</h3>
                <p className="text-2xl font-bold text-orange-600">
                  {formatNumber(walletData.bestMatchPoints)} points
                </p>
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Recent Activity</h2>
              <button
                onClick={() => setShowTransactions(!showTransactions)}
                className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 transition-colors"
              >
                <FiEye />
                <span>View All</span>
              </button>
            </div>

            <div className="space-y-4">
              {transactions.slice(0, 5).map((transaction, index) => (
                <div key={transaction._id} className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg transition-colors">
                  <div className="flex items-center space-x-3">
                    <div className="text-xl">
                      {getTransactionIcon(transaction.type)}
                    </div>
                    <div>
                      <p className="font-medium text-gray-800 text-sm">
                        {transaction.description}
                      </p>
                      <p className="text-xs text-gray-500">
                        {formatDate(transaction.createdAt)}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className={`font-bold ${transaction.amount > 0 ? 'text-green-600' : 'text-red-600'}`}>
                      {transaction.amount > 0 ? '+' : ''}{formatNumber(transaction.amount)}
                    </p>
                    <p className="text-xs text-gray-500">
                      Balance: {formatNumber(transaction.balanceAfter)}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {walletData?.lastEarningDate && (
              <div className="mt-4 p-3 bg-gray-50 rounded-lg text-center">
                <p className="text-sm text-gray-600">
                  <FiClock className="inline mr-1" />
                  Last earning: {formatDate(walletData.lastEarningDate)}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl text-white p-8 text-center">
          <h2 className="text-3xl font-bold mb-4">Start Earning More Points!</h2>
          <p className="text-xl mb-6 opacity-90">
            Join upcoming matches and climb the leaderboard
          </p>
          <div className="space-x-4">
            <button className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors">
              Browse Matches
            </button>
            <button className="bg-transparent border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors">
              View Leaderboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Vault;