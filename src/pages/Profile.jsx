import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import { FaUser, FaEnvelope, FaEdit, FaSave, FaTimes } from 'react-icons/fa';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        name: user?.name || '',
        email: user?.email || ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [message, setMessage] = useState('');

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
            // Here you would make an API call to update the user profile
            // For now, we'll just update the local state
            updateUser({ ...user, ...formData });
            setMessage('Profile updated successfully!');
            setIsEditing(false);
        } catch (error) {
            console.log(`Error`, error);
            setMessage('Failed to update profile. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        setFormData({
            name: user?.name || '',
            email: user?.email || ''
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
            <div className="max-w-[1440px] mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">My Profile</h1>
                    <p className="mt-2 text-gray-600">Manage your account information</p>
                </div>

                {/* Profile Card */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Header Section */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
                        <div className="flex items-center gap-6">
                            {/* Avatar */}
                            <div className="w-20 h-20 bg-white/20 text-white rounded-full flex items-center justify-center text-2xl font-bold">
                                {getUserInitials(user?.name)}
                            </div>

                            {/* User Info */}
                            <div className="text-white">
                                <h2 className="text-2xl font-bold">{user?.name}</h2>
                                <p className="text-blue-100">{user?.email}</p>
                                <p className="text-sm text-blue-200 mt-1">
                                    Member since {new Date().getFullYear()}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-6">
                        {/* Success/Error Message */}
                        {message && (
                            <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully')
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
                                    className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition"
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
                                    <FaUser className="inline mr-2" />
                                    Full Name
                                </label>
                                {isEditing ? (
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        required
                                    />
                                ) : (
                                    <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-900">
                                        {user?.name}
                                    </div>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    <FaEnvelope className="inline mr-2" />
                                    Email Address
                                </label>
                                <div className="px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-gray-500">
                                    {user?.email}
                                    <span className="block text-xs text-gray-400 mt-1">
                                        Email cannot be changed
                                    </span>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            {isEditing && (
                                <div className="flex gap-3 pt-4">
                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
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
                    </div>
                </div>
            </div>
        </div>
    );
}