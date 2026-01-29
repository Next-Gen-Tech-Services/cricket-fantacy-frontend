import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUsers, FiShare2, FiX, FiCheck, FiLock, FiGlobe } from 'react-icons/fi';
import { leaguesAPI } from '../services/api';
import { toast } from 'react-hot-toast';

const CreateTournamentLeague = ({ tournament, isOpen, onClose, onSuccess }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'PRIVATE',
    maxMembers: 20,
    entryFee: 0,
    isPublic: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await leaguesAPI.createTournamentLeague(tournament._id, formData);
      
      if (response.success) {
        toast.success('League created successfully!');
        onSuccess?.(response.data.league);
        onClose();
      } else {
        throw new Error(response.message || 'Failed to create league');
      }
    } catch (error) {
      console.error('Create league error:', error);
      toast.error(error.message || 'Failed to create league');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 bg-gray-200 bg-opacity-60 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl max-w-lg w-lg max-h-[90vh] overflow-y-auto p-8 relative shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
        >
          <FiX size={16} className="text-gray-600" />
        </button>
        
        {/* Header */}
        <div className="mb-8 pr-12">
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Create League</h2>
          <p className="text-sm text-gray-600">
            For {tournament?.name}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* League Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              League Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter league name"
              required
              maxLength={100}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Describe your league (optional)"
              rows={3}
              maxLength={500}
            />
          </div>

          {/* League Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              League Type
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleInputChange('type', 'PRIVATE')}
                className={`p-3 border rounded-lg flex items-center space-x-2 transition-colors ${
                  formData.type === 'PRIVATE'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FiLock size={16} />
                <span className="text-sm font-medium">Private</span>
              </button>
              <button
                type="button"
                onClick={() => handleInputChange('type', 'PUBLIC')}
                className={`p-3 border rounded-lg flex items-center space-x-2 transition-colors ${
                  formData.type === 'PUBLIC'
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <FiGlobe size={16} />
                <span className="text-sm font-medium">Public</span>
              </button>
            </div>
          </div>

          {/* Max Members */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Maximum Members
            </label>
            <select
              value={formData.maxMembers}
              onChange={(e) => handleInputChange('maxMembers', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={10}>10 members</option>
              <option value={20}>20 members</option>
              <option value={50}>50 members</option>
              <option value={100}>100 members</option>
            </select>
          </div>

          {/* Entry Fee */}
          {/* <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Entry Fee (₹)
            </label>
            <select
              value={formData.entryFee}
              onChange={(e) => handleInputChange('entryFee', parseInt(e.target.value))}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value={0}>Free</option>
              <option value={10}>₹10</option>
              <option value={25}>₹25</option>
              <option value={50}>₹50</option>
              <option value={100}>₹100</option>
              <option value={250}>₹250</option>
              <option value={500}>₹500</option>
            </select>
          </div> */}

          {/* Public Visibility */}
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              id="isPublic"
              checked={formData.isPublic}
              onChange={(e) => handleInputChange('isPublic', e.target.checked)}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label htmlFor="isPublic" className="text-sm text-gray-700">
              Show in public league listings
            </label>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 flex space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
              disabled={loading || !formData.name.trim()}
            >
              {loading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
              ) : (
                <>
                  <FiCheck size={16} />
                  <span>Create League</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateTournamentLeague;