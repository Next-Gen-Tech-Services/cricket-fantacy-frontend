import { useState, useEffect } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { FiCheckCircle, FiAlertCircle, FiEye, FiEyeOff, FiArrowLeft } from "react-icons/fi";
import { useAppDispatch } from "../store/hooks";
import { resetPassword } from "../store/slices/authSlice";
import image1 from '../assets/img1-login.png';
import image2 from '../assets/img2-login.png';
import image3 from '../assets/img1-login.png';
import logo from "../assets/logo.svg";

const images = [image1, image2, image3];

export default function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Image auto slider
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // Check if token exists
  useEffect(() => {
    if (!token) {
      setError("Invalid reset link. Please request a new password reset.");
    }
  }, [token]);

  const validatePassword = (pwd) => {
    if (pwd.length < 6) {
      return "Password must be at least 6 characters long";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!password.trim()) {
      setError("Please enter a new password");
      return;
    }

    const passwordError = validatePassword(password);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (!token) {
      setError("Invalid reset link");
      return;
    }

    setIsSubmitting(true);

    try {
      await dispatch(resetPassword({ token, password })).unwrap();
      setResetSuccess(true);
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
    } catch (err) {
      setError(err || "Failed to reset password. The link may have expired.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (resetSuccess) {
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
                Password Reset Successful!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Your password has been successfully reset. You can now login with your new password.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-sm text-blue-800">
                  Redirecting to login page in a few seconds...
                </p>
              </div>

              <Link
                to="/login"
                className="block w-full py-3 rounded-xl font-semibold bg-yellow-400 text-[#273470] hover:bg-[#c4722a] transition shadow-lg text-center"
              >
                Go to Login
              </Link>
            </div>
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
              Reset Password
            </h1>
            <p className="text-gray-600">
              Enter your new password below. Make sure it's at least 6 characters long.
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200 flex items-start gap-2">
              <FiAlertCircle className="text-red-600 shrink-0 mt-0.5" size={18} />
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* New Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Enter new password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                  autoFocus
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                )}
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <div className="relative">
                <input
                  id="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    setError("");
                  }}
                  placeholder="Confirm new password"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  disabled={isSubmitting}
                  autoComplete="new-password"
                />
                {confirmPassword.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showConfirmPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                  </button>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !token}
              className="w-full py-3 rounded-xl font-semibold bg-yellow-400 text-[#273470] hover:bg-[#c4722a] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              {isSubmitting ? "Resetting Password..." : "Reset Password"}
            </button>
          </form>

          {/* Security Info */}
          <div className="mt-6 bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-xs text-blue-800">
              <strong>🔒 Security Tip:</strong> Use a strong, unique password that you don't use for other accounts.
            </p>
          </div>

          {/* Back to Login */}
          <p className="text-center text-sm text-gray-600 mt-8">
            Remember your password?{" "}
            <Link to="/login" className="font-semibold text-yellow-600 hover:text-yellow-700 transition">
              Back to Login
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
