import { Link } from "react-router-dom";

const TermsOfUse = () => {
  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Terms of Use
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
            <p>
              By accessing and using MatchPlay ("the Platform"), you accept and agree to be bound by the terms and provisions of this agreement. Please read these terms carefully before using our fantasy cricket services.
            </p>
          </div>
        </div>

        {/* Terms Sections */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Terms and Conditions
            </h2>
          </div>
          
          <div className="px-6 sm:px-8 py-6 space-y-8">
            {/* Eligibility */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                1. Eligibility Requirements
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>To use our services, you must:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Have the legal capacity to enter into agreements</li>
                  <li>Not be prohibited from using our services under applicable law</li>
                  <li>Reside in a jurisdiction where cricket sports are legal</li>
                  <li>Provide accurate and complete registration information</li>
                </ul>
              </div>
            </section>

            {/* Account Responsibilities */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                2. Account Responsibilities
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>You are responsible for:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Maintaining the confidentiality of your account credentials</li>
                  <li>All activities that occur under your account</li>
                  <li>Providing accurate and up-to-date information</li>
                  <li>Notifying us immediately of any unauthorized use</li>
                  <li>Ensuring your account information remains current</li>
                </ul>
              </div>
            </section>

            {/* Fantasy Sports Rules */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                3. MatchPlay Sports Rules
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>When participating in fantasy cricket contests:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Follow all contest rules and scoring systems</li>
                  <li>Submit your teams before the specified deadlines</li>
                  <li>Respect salary cap and player selection limitations</li>
                  <li>No use of automated tools or bots</li>
                  <li>One account per person</li>
                  <li>Fair play and sportsmanship expected</li>
                </ul>
              </div>
            </section>

            {/* Prohibited Conduct */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                4. Prohibited Conduct
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>You may not:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Use the platform for any illegal or unauthorized purpose</li>
                  <li>Create multiple accounts or share accounts</li>
                  <li>Use automated scripts, bots, or data mining tools</li>
                  <li>Attempt to manipulate contests or scoring</li>
                  <li>Harass, abuse, or harm other users</li>
                  <li>Violate any laws or regulations</li>
                  <li>Interfere with platform security or functionality</li>
                </ul>
              </div>
            </section>

            {/* Payment and Prizes */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                5. Payment and Prizes
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>Regarding payments and prizes:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Entry fees must be paid before contest participation</li>
                  <li>Prizes are awarded based on final leaderboard standings</li>
                  <li>Withdrawals subject to verification and processing time</li>
                  <li>Taxes on winnings are the responsibility of the user</li>
                  <li>We reserve the right to investigate suspicious activities</li>
                </ul>
              </div>
            </section>

            {/* Intellectual Property */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                6. Intellectual Property
              </h3>
              <p className="text-gray-700 leading-relaxed">
                All content, trademarks, and intellectual property on the platform are owned by MatchPlay or our licensors. You may not use, reproduce, or distribute any content without explicit permission.
              </p>
            </section>

            {/* Disclaimers */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                7. Disclaimers
              </h3>
              <p className="text-gray-700 leading-relaxed">
                Our services are provided "as is" without warranties of any kind. We do not guarantee uninterrupted service, accuracy of data, or freedom from errors. Your use of the platform is at your own risk.
              </p>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                8. Limitation of Liability
              </h3>
              <p className="text-gray-700 leading-relaxed">
                MatchPlay shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising out of your use of the platform.
              </p>
            </section>

            {/* Governing Law */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                9. Governing Law
              </h3>
              <p className="text-gray-700 leading-relaxed">
                These terms are governed by the laws of India. Any disputes will be resolved in the courts of Mumbai, Maharashtra.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-semibold text-blue-600 mb-3">
                10. Contact Information
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-3">
                  For questions about these Terms of Use, contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <div><span className="font-medium">Email:</span> info@cricketloversglobal.com</div>
                </div>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500 mb-4">
            Last updated: January 30, 2026
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
};


export default TermsOfUse;