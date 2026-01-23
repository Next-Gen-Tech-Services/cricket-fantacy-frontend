import { useState } from 'react';
import { FaLock, FaBell, FaEye, FaEyeSlash } from 'react-icons/fa';

export default function Settings() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        marketing: false
    });
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            setMessage('New passwords do not match');
            setIsSubmitting(false);
            return;
        }

        if (passwordForm.newPassword.length < 6) {
            setMessage('Password must be at least 6 characters long');
            setIsSubmitting(false);
            return;
        }

        try {
            // API call to change password would go here
            setMessage('Password updated successfully!');
            setPasswordForm({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        } catch (error) {
            console.log(`Error`, error);
            setMessage('Failed to update password. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleNotificationsSubmit = async (e) => {
        e.preventDefault();
        setMessage('');
        setIsSubmitting(true);

        try {
            // API call to update notification preferences would go here
            setMessage('Notification preferences updated successfully!');
        } catch (error) {
            console.log(`Error`, error);
            setMessage('Failed to update preferences. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-[1440px] mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
                    <p className="mt-2 text-gray-600">Manage your account preferences and security</p>
                </div>

                {/* Success/Error Message */}
                {message && (
                    <div className={`mb-6 p-4 rounded-lg ${message.includes('successfully')
                        ? 'bg-green-50 text-green-600 border border-green-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                        }`}>
                        {message}
                    </div>
                )}

                <div className="space-y-6">
                    {/* Password Change Section */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-[#273470]/10 rounded-lg flex items-center justify-center">
                                <FaLock className="text-[#273470]" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Change Password</h2>
                                <p className="text-sm text-gray-600">Update your password to keep your account secure</p>
                            </div>
                        </div>

                        <form onSubmit={handlePasswordSubmit} className="space-y-4">
                            {/* Current Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showCurrentPassword ? "text" : "password"}
                                        name="currentPassword"
                                        value={passwordForm.currentPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#273470] focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showCurrentPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showNewPassword ? "text" : "password"}
                                        name="newPassword"
                                        value={passwordForm.newPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#273470] focus:border-transparent"
                                        required
                                        minLength={6}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            {/* Confirm New Password */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Confirm New Password
                                </label>
                                <div className="relative">
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        name="confirmPassword"
                                        value={passwordForm.confirmPassword}
                                        onChange={handlePasswordChange}
                                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#273470] focus:border-transparent"
                                        required
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                    >
                                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                                    </button>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-[#273470] text-white rounded-lg hover:bg-[#1e2859] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                            >
                                {isSubmitting ? 'Updating...' : 'Update Password'}
                            </button>
                        </form>
                    </div>

                    {/* Notification Preferences */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaBell className="text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Notifications</h2>
                                <p className="text-sm text-gray-600">Manage how you receive notifications</p>
                            </div>
                        </div>

                        <form onSubmit={handleNotificationsSubmit} className="space-y-4">
                            {/* Email Notifications */}
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Email Notifications</h3>
                                    <p className="text-sm text-gray-600">Receive updates via email</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.email}
                                        onChange={() => handleNotificationChange('email')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#273470]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#273470]"></div>
                                </label>
                            </div>

                            {/* Push Notifications */}
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Push Notifications</h3>
                                    <p className="text-sm text-gray-600">Receive push notifications on your device</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.push}
                                        onChange={() => handleNotificationChange('push')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#273470]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#273470]"></div>
                                </label>
                            </div>

                            {/* Marketing Notifications */}
                            <div className="flex items-center justify-between py-3">
                                <div>
                                    <h3 className="text-sm font-medium text-gray-900">Marketing Communications</h3>
                                    <p className="text-sm text-gray-600">Receive promotional emails and updates</p>
                                </div>
                                <label className="relative inline-flex items-center cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={notifications.marketing}
                                        onChange={() => handleNotificationChange('marketing')}
                                        className="sr-only peer"
                                    />
                                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#273470]/30 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#273470]"></div>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium transition"
                            >
                                {isSubmitting ? 'Saving...' : 'Save Preferences'}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}