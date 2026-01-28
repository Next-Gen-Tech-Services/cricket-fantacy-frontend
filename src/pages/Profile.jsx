import { useAppSelector, useAppDispatch } from '../store/hooks';
import { useState, useEffect } from 'react';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes, FaCalendar, FaPhone, FaMapMarkerAlt } from 'react-icons/fa';
import { userService } from '../services/userService';

export default function Profile() {
    const { user, isAuthenticated } = useAppSelector(state => state.auth);
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || '',
        phone: user?.phone || '',
        location: user?.location || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [userStats, setUserStats] = useState({
        teamsCreated: 0,
        tournamentsJoined: 0,
        totalPoints: 0
    });

    // If not authenticated, show message
    if (!isAuthenticated || !user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile Not Available</h1>
                    <p className="text-gray-600">Please log in to view your profile.</p>
                </div>
            </div>
        );
    }

    // Fetch user profile and stats on component mount
    useEffect(() => {
        const fetchUserData = async () => {
            setIsLoading(true);
            try {
                // Fetch current user profile
                const profileResponse = await userService.getCurrentUser();
                if (profileResponse.success && profileResponse.data) {
                    setFormData({
                        name: profileResponse.data.name || '',
                        email: profileResponse.data.email || '',
                        phone: profileResponse.data.phone || '',
                        location: profileResponse.data.location || ''
                    });
                }

                // Fetch user statistics
                const statsResponse = await userService.getUserStats();
                if (statsResponse.success && statsResponse.data) {
                    setUserStats(statsResponse.data);
                }
            } catch (error) {
                console.error('Error fetching user data:', error);
                setMessage('Failed to load profile data.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setMessage('');

        try {
            const response = await userService.updateProfile({
                name: formData.name,
                phone: formData.phone,
                location: formData.location
            });

            if (response.success) {
                setMessage('Profile updated successfully!');
                setIsEditing(false);

                // Update user stats after profile update
                const statsResponse = await userService.getUserStats();
                if (statsResponse.success && statsResponse.data) {
                    setUserStats(statsResponse.data);
                }
            } else {
                setMessage(response.message || 'Failed to update profile.');
            }
        } catch (error) {
            console.error('Update profile error:', error);
            setMessage('Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || '',
            phone: user?.phone || '',
            location: user?.location || ''
        });
        setIsEditing(false);
        setMessage('');
    };

    const getUserInitials = (name) => {
        if (!name) return 'U';
        return name.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="mt-2 text-gray-600">Manage your account information</p>
                </div>

                {/* Loading State */}
                {isLoading ? (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                        <div className="flex items-center justify-center">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#273470]"></div>
                            <span className="ml-2 text-gray-600">Loading profile...</span>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        {/* Header Section */}
                        <div className="bg-gradient-to-r from-[#273470] to-[#1e2859] px-6 py-8">
                            <div className="flex items-center gap-6">
                                {/* Avatar */}
                                <div className="w-20 h-20 bg-white/20 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                    {getUserInitials(formData.name)}
                                </div>

                                {/* User Info */}
                                <div className="text-white">
                                    <h2 className="text-2xl font-bold">{formData.name || 'User'}</h2>
                                    <p className="text-white/80">{formData.email}</p>
                                    <p className="text-sm text-white/60 mt-1">
                                        Cricket Lover since {new Date(user?.createdAt || new Date()).getFullYear()}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-6">
                            {/* Success/Error Message */}
                            {message && (
                                <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully') || message.includes('Profile updated')
                                    ? 'bg-green-50 text-green-600 border border-green-200'
                                    : 'bg-red-50 text-red-600 border border-red-200'
                                    }`}>
                                    {message}
                                </div>
                            )}

                            {/* Edit Toggle */}
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                                {!isEditing && (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-yellow-600 hover:bg-yellow-50 rounded-lg transition border border-yellow-200"
                                    >
                                        <FaEdit />
                                        Edit Profile
                                    </button>
                                )}
                            </div>

                            {/* Profile Form */}
                            <form onSubmit={handleSubmit} className="space-y-6">
                                {/* Name Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaUser className="inline mr-2 text-gray-400" />
                                        Full Name
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#273470] focus:border-transparent transition-all"
                                            placeholder="Enter your full name"
                                            required
                                        />

                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                            {formData.name || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Email Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaEnvelope className="inline mr-2 text-gray-400" />
                                        Email Address
                                    </label>
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                                        {formData.email}
                                        <span className="block text-xs text-gray-400 mt-1">
                                            Email cannot be changed
                                        </span>
                                    </div>
                                </div>

                                {/* Phone Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaPhone className="inline mr-2 text-gray-400" />
                                        Phone Number
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            placeholder="Enter your phone number"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#273470] focus:border-transparent transition-all"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                            {formData.phone || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Location Field */}
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        <FaMapMarkerAlt className="inline mr-2 text-gray-400" />
                                        Location
                                    </label>
                                    {isEditing ? (
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            placeholder="Enter your location"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#273470] focus:border-transparent transition-all"
                                        />
                                    ) : (
                                        <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                            {formData.location || 'Not provided'}
                                        </div>
                                    )}
                                </div>

                                {/* Action Buttons */}
                                {isEditing && (
                                    <div className="flex gap-3 pt-4">
                                        <button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex items-center gap-2 px-6 py-3 bg-[#273470] text-white rounded-lg hover:bg-[#1e2859] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                                        >
                                            <FaSave />
                                            {isSubmitting ? 'Saving...' : 'Save Changes'}
                                        </button>

                                        <button
                                            type="button"
                                            onClick={handleCancel}
                                            className="flex items-center gap-2 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition"
                                        >
                                            <FaTimes />
                                            Cancel
                                        </button>
                                    </div>
                                )}
                            </form>

                            {/* Stats Section */}
                            <div className="mt-8 pt-8 border-t border-gray-200">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Statistics</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-[#273470]">{userStats.teamsCreated}</div>
                                        <div className="text-sm text-gray-600">Teams Created</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-[#273470]">{userStats.tournamentsJoined}</div>
                                        <div className="text-sm text-gray-600">Tournaments Joined</div>
                                    </div>
                                    <div className="bg-gray-50 p-4 rounded-lg">
                                        <div className="text-2xl font-bold text-[#273470]">{userStats.totalPoints}</div>
                                        <div className="text-sm text-gray-600">Total Points</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}