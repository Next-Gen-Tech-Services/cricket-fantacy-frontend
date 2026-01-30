import { Link } from "react-router-dom";

const PrivacyPolicy = () => {
  const policyData = [
    {
      title: "Cricket Lover Fantasy Privacy Policy",
      description: "This policy explains how Cricket Lover Fantasy uses personal data when people access our website, use our official app, play fantasy cricket games, contact customer support, engage with us on social media platforms, and when they otherwise interact or communicate with us."
    },
    {
      title: "User Data and Personal Information Privacy Policy",
      description: "This policy explains how Cricket Lover Fantasy uses personal data provided by, or received in respect of, users including account information, gameplay statistics, payment details, and communications with customer support staff."
    },
    {
      title: "Cricket Lover Fantasy Safeguarding Privacy Policy",
      description: "This policy explains how Cricket Lover Fantasy uses personal data in relation to the safeguarding of children and adults at risk when using our fantasy sports platform."
    },
    {
      title: "Cricket Lover Fantasy Data Protection Privacy Policy",
      description: "This policy explains how Cricket Lover Fantasy collects and uses personal data as part of its efforts to protect and secure user information and maintain platform integrity."
    },
    {
      title: "Cricket Lover Fantasy - Child Friendly Privacy Policy - Under-18s Questions and Answers",
      description: "This policy explains, in the form of child-friendly Q&As, how Cricket Lover Fantasy protects your privacy and uses your personal data especially when you use our website, app, or play our fantasy games."
    },
    {
      title: "Cricket Lover Fantasy Data Processing Notice",
      description: "This Privacy Notice explains how we collect and use your personal data when you use Cricket Lover Fantasy platform, including our website, mobile app, and fantasy cricket services."
    }
  ];

  return (
    <main className="bg-gray-50 min-h-screen">
      <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
            Cricket Lover Fantasy Policies
          </h1>
          
          <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed mb-8">
            <p>
              Cricket Lover Fantasy respects and protects the data and privacy of the fans, players, suppliers, contractors and other individuals who we come into contact with in order to carry out our work. Cricket Lover Fantasy is committed to being open with individuals about how we use their information and who we give it to and will comply with all applicable data protection regulations.
            </p>
            <p className="mt-4">
              Further information on what data we collect, why we collect it and what we do with it can be found in our privacy policies below:
            </p>
          </div>
        </div>

        {/* Policy Sections */}
        <div className="space-y-8">
          {policyData.map((policy, index) => (
            <div key={index} className="bg-white rounded-lg p-6 sm:p-8 shadow-sm border border-gray-200">
              <h2 className="text-lg sm:text-xl font-semibold text-blue-600 hover:text-blue-700 transition-colors duration-200 mb-4">
                {policy.title}
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {policy.description}
              </p>
            </div>
          ))}
        </div>

        {/* Detailed Sections */}
        <div className="mt-12 bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 sm:px-8 py-6 border-b border-gray-200">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
              Detailed Privacy Information
            </h2>
          </div>
          
          <div className="px-6 sm:px-8 py-6 space-y-8">
            {/* Information Collection */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Information We Collect
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>We collect information you provide directly to us, including:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Personal information (name, email address, phone number)</li>
                  <li>Account credentials and preferences</li>
                  <li>Fantasy team data and gameplay statistics</li>
                  <li>Payment information (processed securely)</li>
                  <li>Communications with customer support</li>
                </ul>
              </div>
            </section>

            {/* How We Use Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                How We Use Your Information
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>We use collected information to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Provide and improve our fantasy cricket services</li>
                  <li>Process transactions and manage accounts</li>
                  <li>Send updates about matches and promotions</li>
                  <li>Provide customer support</li>
                  <li>Ensure fair play and prevent fraud</li>
                </ul>
              </div>
            </section>

            {/* Data Security */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Data Security
              </h3>
              <p className="text-gray-700 leading-relaxed">
                We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no internet transmission is completely secure.
              </p>
            </section>

            {/* Your Rights */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Your Rights
              </h3>
              <div className="text-gray-700 leading-relaxed space-y-3">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Access and update your personal information</li>
                  <li>Delete your account and associated data</li>
                  <li>Opt out of marketing communications</li>
                  <li>Request a copy of your data</li>
                </ul>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                Contact Us
              </h3>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 mb-3">
                  If you have any questions about this Privacy Policy, please contact us:
                </p>
                <div className="space-y-2 text-gray-600">
                  <div><span className="font-medium">Email:</span> privacy@cricketloverfantasy.com</div>
                  <div><span className="font-medium">Phone:</span> +91 98765 43210</div>
                  <div><span className="font-medium">Address:</span> Cricket Lover Fantasy Pvt. Ltd., 123 Sports Complex, Mumbai, Maharashtra 400001, India</div>
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
export default PrivacyPolicy;