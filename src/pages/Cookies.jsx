import { Link } from "react-router-dom";
import { useState } from "react";

const Cookies = () => {
  const [cookieSettings, setCookieSettings] = useState({
    essential: true,
    analytics: true,
    marketing: false,
    preferences: true
  });

  const handleCookieChange = (type) => {
    if (type === 'essential') return; // Essential cookies can't be disabled
    
    setCookieSettings(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  const saveSettings = () => {
    // Save cookie preferences to localStorage
    localStorage.setItem('cookieSettings', JSON.stringify(cookieSettings));
    alert('Cookie preferences saved successfully!');
  };

  return (
    <main className="min-h-screen bg-main">
      <div className="max-w-[1440px] mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-800 mb-4">
            Cookie Policy
          </h1>
          <p className="text-lg text-slate-600">
            Last updated: January 30, 2026
          </p>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-lg">
          <div className="prose prose-lg max-w-none">
            <h2 className="text-2xl font-bold text-slate-800 mb-4">What Are Cookies?</h2>
            <p className="text-slate-600 mb-6">
              Cookies are small text files that are stored on your device when you visit our website. 
              They help us provide you with a better experience by remembering your preferences and 
              analyzing how you use our platform.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">How We Use Cookies</h2>
            <p className="text-slate-600 mb-6">
              Cricket Lover Fantasy uses cookies for various purposes:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-600">
              <li>To keep you logged in during your session</li>
              <li>To remember your preferences and settings</li>
              <li>To analyze website traffic and usage patterns</li>
              <li>To improve our services and user experience</li>
              <li>To provide personalized content and recommendations</li>
              <li>To ensure platform security and prevent fraud</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Types of Cookies We Use</h2>
            
            {/* Cookie Settings */}
            <div className="space-y-6 mb-8">
              {/* Essential Cookies */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Essential Cookies</h3>
                    <p className="text-sm text-slate-600">Required for the website to function properly</p>
                  </div>
                  <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    Always Active
                  </div>
                </div>
                <p className="text-slate-600 text-sm">
                  These cookies are necessary for the website to function and cannot be switched off. 
                  They include authentication, security, and accessibility features.
                </p>
              </div>

              {/* Analytics Cookies */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Analytics Cookies</h3>
                    <p className="text-sm text-slate-600">Help us understand how you use our website</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookieSettings.analytics}
                      onChange={() => handleCookieChange('analytics')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <p className="text-slate-600 text-sm">
                  These cookies help us analyze traffic patterns, popular features, and user behavior 
                  to improve our platform.
                </p>
              </div>

              {/* Marketing Cookies */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Marketing Cookies</h3>
                    <p className="text-sm text-slate-600">Used to personalize ads and marketing content</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookieSettings.marketing}
                      onChange={() => handleCookieChange('marketing')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <p className="text-slate-600 text-sm">
                  These cookies track your activity to show you relevant advertisements and promotions 
                  across our platform and partner sites.
                </p>
              </div>

              {/* Preference Cookies */}
              <div className="border border-slate-200 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800">Preference Cookies</h3>
                    <p className="text-sm text-slate-600">Remember your settings and preferences</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={cookieSettings.preferences}
                      onChange={() => handleCookieChange('preferences')}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/25 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                  </label>
                </div>
                <p className="text-slate-600 text-sm">
                  These cookies remember your language, region, and other preferences to provide 
                  a personalized experience.
                </p>
              </div>
            </div>

            {/* Save Settings Button */}
            <div className="mb-8">
              <button
                onClick={saveSettings}
                className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors duration-200"
              >
                Save Cookie Preferences
              </button>
            </div>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Managing Cookies</h2>
            <p className="text-slate-600 mb-6">
              You can control and manage cookies in several ways:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-600">
              <li>Use the cookie preference settings above</li>
              <li>Adjust your browser settings to block or delete cookies</li>
              <li>Use browser extensions for cookie management</li>
              <li>Clear your browser data regularly</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Third-Party Cookies</h2>
            <p className="text-slate-600 mb-6">
              We may use third-party services that set their own cookies, including:
            </p>
            <ul className="list-disc pl-6 mb-6 text-slate-600">
              <li>Google Analytics for website analytics</li>
              <li>Payment processors for secure transactions</li>
              <li>Social media platforms for sharing features</li>
              <li>Advertising networks for relevant ads</li>
            </ul>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Updates to This Policy</h2>
            <p className="text-slate-600 mb-6">
              We may update this Cookie Policy from time to time to reflect changes in our practices 
              or for other operational, legal, or regulatory reasons. Please check this page 
              periodically for updates.
            </p>

            <h2 className="text-2xl font-bold text-slate-800 mb-4">Contact Us</h2>
            <p className="text-slate-600 mb-4">
              If you have any questions about our use of cookies, please contact us:
            </p>
            <ul className="list-none mb-6 text-slate-600">
              <li>Email: privacy@cricketloverfantasy.com</li>
              <li>Phone: +91 98765 43210</li>
              <li>
                Address: Cricket Lover Fantasy Pvt. Ltd., 123 Sports Complex, Mumbai, Maharashtra 400001, India
              </li>
            </ul>
          </div>

          <div className="border-t border-slate-200 pt-8 mt-8">
            <Link 
              to="/" 
              className="inline-flex items-center text-primary hover:text-primary/80 font-medium"
            >
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Cookies;