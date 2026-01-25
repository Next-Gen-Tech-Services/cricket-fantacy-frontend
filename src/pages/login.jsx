import { useEffect, useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link, useNavigate } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { loginUser, clearError } from "../store/slices/authSlice";
import image1 from '../assets/img1-login.png';
import image2 from '../assets/img2-login.png';
import image3 from '../assets/img1-login.png';
import logo from "../assets/Logo.webp"

const images = [
  image1,
  image2,
  image3,
];

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [currentImage, setCurrentImage] = useState(0);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const dispatch = useAppDispatch();
  const { isAuthenticated, isLoading, error: authError } = useAppSelector(state => state.auth);
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear errors when component unmounts
  useEffect(() => {
    return () => {
      if (authError) {
        dispatch(clearError());
      }
    };
  }, [dispatch, authError]);

  /* ================= IMAGE AUTO SLIDER ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  /* ================= FORM HANDLERS ================= */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) {
      setError("");
    }
    if (authError) {
      dispatch(clearError());
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    dispatch(clearError());
    setIsSubmitting(true);

    try {
      await dispatch(loginUser(formData)).unwrap();
      // Navigation will be handled by the useEffect above
    } catch (err) {
      setError(err || "Login failed. Please check your credentials.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen w-screen grid grid-cols-1 lg:grid-cols-2">
      {/* ================= LEFT : LOGIN ================= */}
      <div className="relative flex items-center justify-center px-6 py-8 lg:px-12 bg-white">
        <div className="relative w-full max-w-md">
          {/* Back */}

          {/* Logo */}
          <div className="flex flex-col items-center mb-8">
            <Link to="/">
              <img
                src={logo}
                alt="CricLeague Logo"
                className="h-16 w-auto object-contain mb-4"
              />
            </Link>
          </div>

          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Welcome Back
            </h1>
            <p className="text-gray-600">
              Login to manage your fantasy teams
            </p>
          </div>

          {/* Error Message */}
          {(error || authError) && (
            <div className="mb-6 p-4 rounded-xl bg-red-50 border border-red-200">
              <p className="text-sm text-red-600">{error || authError}</p>
            </div>
          )}

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="you@example.com"
                className="w-full px-4 py-3 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="••••••••"
                  className="w-full px-4 py-3 pr-12 rounded-xl bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent transition"
                  required
                />

                {formData.password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={20} />
                    ) : (
                      <AiOutlineEye size={20} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting || isLoading}
              className="w-full py-3 rounded-xl font-semibold bg-yellow-400 text-[#273470] hover:bg-[#c4722a] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-lg"
            >
              {(isSubmitting || isLoading) ? "Signing in..." : "Login"}
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-yellow-600 hover:text-yellow-700 transition"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* ================= RIGHT : IMAGE SLIDER ================= */}
      <div className="hidden lg:block relative h-full w-full overflow-hidden bg-gradient-to-br from-[#273470] to-[#1e2859]">
        <div className="absolute inset-0 bg-gradient-to-br from-[#273470]/80 to-[#1e2859]/80 z-10"></div>

        {images.map((img, index) => (
          <img
            key={img}
            src={img}
            alt="Login visual"
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
              Create fantasy teams and compete with players worldwide.
            </p>

            {/* Dots indicator */}
            <div className="flex justify-center gap-2 mt-8">
              {images.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-colors ${index === currentImage ? 'bg-yellow-400' : 'bg-white/40'
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