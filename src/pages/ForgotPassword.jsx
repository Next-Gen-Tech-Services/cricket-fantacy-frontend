import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiCheckCircle, FiArrowLeft } from "react-icons/fi";
import { forgotPassword } from "../store/slices/authSlice";
import image1 from '../assets/img1-login.png';
import image2 from '../assets/img2-login.png';
import image3 from '../assets/img1-login.png';
import logo from "../assets/logo.svg";
import { useAppDispatch } from "../store/hooks";

const images = [image1, image2, image3];

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const dispatch = useAppDispatch();

  // Image auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(forgotPassword(email)).unwrap();
      setEmailSent(true);
    } catch {
      // Show generic message for security (don't reveal if email exists)
      setEmailSent(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (emailSent) {
    return (
      <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
        {/* Left Side - Success Message */}
        <div className="relative flex items-center justify-center px-6 py-8 lg:px-12 bg-white">
          <div className="relative w-full max-w-md">
            {/* Logo */}
            <div className="flex flex-col items-center mb-8">
              <Link to="/">
                <img
                  src={logo}
                  alt="Match Play"
                  className="h-16 w-auto object-contain mb-4"
                />
              </Link>
            </div>

            {/* Success Content */}
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <FiCheckCircle className="text-green-600" size={40} />
              </div>
              
              <h1 className="text-3xl font-bold text-gray-800 mb-2">
                Check Your Email
              </h1>
              
              <p className="text-gray-600 mb-6">
                If an account exists with <strong>{email}</strong>, you will receive a password reset link shortly.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-blue-800 font-semibold mb-2">
                  Next Steps:
                </p>
                <ul className="text-sm text-blue-700 space-y-1 list-disc list-inside">
                  <li>Check your email inbox</li>
                  <li>Click the reset link (valid for 10 minutes)</li>
                  <li>Create a new password</li>
                </ul>
              </div>

              <p className="text-xs text-gray-500 mb-6">
                Didn't receive the email? Check your spam folder or try again in a few minutes.
              </p>

              <div className="space-y-3">
                <button
                  onClick={() => {
                    setEmailSent(false);
                    setEmail("");
                    setError("");
                  }}
                  className="w-full py-3 rounded-xl font-semibold bg-yellow-400 text-[#273470] hover:bg-[#c4722a] transition shadow-lg"
                >
                  Send Another Email
                </button>
                
                <Link
                  to="/login"
                  className="block w-full py-3 rounded-xl font-medium bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 transition text-center"
                >
                  Back to Login
                </Link>
              </div>
            </div>

            {/* Help Text */}
            <p className="text-center text-sm text-gray-600 mt-8">
              Need help?{" "}
              <Link to="/contact" className="font-semibold text-yellow-600 hover:text-yellow-700 transition">
                Contact Support
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Image Slider */}
        <div className="hidden lg:block relative h-full w-full overflow-hidden bg-gradient-to-br from-[#273470] to-[#1e2859]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#273470]/80 to-[#1e2859]/80 z-10"></div>

          {images.map((img, index) => (
            <img
              key={img}
              src={img}
              alt="Illustration"
              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000
                ${index === currentImage ? "opacity-100" : "opacity-0"}`}
            />
          ))}

          {/* Content Overlay */}
          <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-12">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md">
              <h3 className="text-3xl font-bold text-white mb-4">
                Build. Play. Win.
              </h3>
              <p className="text-white/80 text-lg leading-relaxed">
                Create matchplay teams and compete with players worldwide.
              </p>

              {/* Dots indicator */}
              <div className="flex justify-center gap-2 mt-8">
                {images.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full transition-colors ${
                      index === currentImage ? 'bg-yellow-400' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2">
      {/* Left Side - Form */}
      <div className="relative flex items-center justify-center px-6 py-8 lg:px-12 bg-white">
        <div className="relative w-full max-w-md">
          {/* Back Button */}
          <Link
            to="/login"
            className="inline-flex items-center text-[#273470] hover:text-[#1e2859] mb-6 font-medium transition-colors"
          >
            <FiArrowLeft className="mr-2" size={18} />
            Back to Login
          </Link>

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/">
              <img
                src={logo}
                alt="Match Play"
                className="h-16 w-auto object-contain mb-4"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Forgot Password?
            </h1>
            <p className="text-gray-600">
              No worries! Enter your email address and we'll send you a link to reset your password.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError("");
                }}
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                disabled={isSubmitting}
                autoComplete="email"
                autoFocus
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl font-semibold bg-yellow-400 text-[#273470] hover:bg-[#c4722a] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              {isSubmitting ? "Sending..." : "Send Reset Link"}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-800">
              <strong>Note:</strong> The password reset link will be valid for 10 minutes only. 
              If you don't receive an email, please check your spam folder.
            </p>
          </div>

          {/* Sign Up Link */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Don't have an account?{" "}
            <Link to="/signup" className="font-semibold text-yellow-600 hover:text-yellow-700 transition">
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* Right Side - Image Slider */}
      <div className="hidden lg:block relative h-full w-full overflow-hidden bg-gradient-to-br from-[#273470] to-[#1e2859]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#273470]/80 to-[#1e2859]/80 z-10"></div>

        {images.map((img, index) => (
          <img
            key={img}
            src={img}
            alt="Illustration"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000
              ${index === currentImage ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        {/* Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col justify-center items-center text-center px-12">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 max-w-md">
            <h3 className="text-3xl font-bold text-white mb-4">
              Build. Play. Win.
            </h3>
            <p className="text-white/80 text-lg leading-relaxed">
              Create matchplay teams and compete with players worldwide.
            </p>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${
                    index === currentImage ? 'bg-yellow-400' : 'bg-white/40'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
