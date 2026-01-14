import { useEffect, useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GiCricketBat } from "react-icons/gi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";
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
  const [password, setPassword] = useState("");
  const [currentImage, setCurrentImage] = useState(0);

  /* ================= IMAGE AUTO SLIDER ================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <main className="h-screen w-screen grid grid-cols-1 md:grid-cols-[65%_35%] bg-main">
      {/* ================= LEFT : LOGIN ================= */}
      <div className="relative flex items-center justify-center px-6">
        <div className="w-full max-w-md">
          {/* Back */}
          <Link
            to="/"
            className="absolute left-6 top-6 text-xs font-medium
                       px-3 py-1.5 rounded-lg border border-[var(--border)]
                       bg-white/5 text-secondary hover:bg-black/10
                       hover:text-primary transition"
          >
            ← Back to Home
          </Link>

          {/* Logo */}
          <div className="flex flex-col items-center mb-5">
            <img
              src={logo}
              alt="CricLeague Logo"
              className="h-20 w-auto object-contain"
            />
           
          </div>


          <h1 className="text-xl font-bold text-primary text-center">
            Welcome Back
          </h1>
          <p className="mt-1 text-sm text-secondary text-center">
            Login to manage your fantasy teams
          </p>

          {/* Google */}
          <button className="mt-6 w-full flex items-center justify-center gap-3 py-2.5 rounded-xl font-semibold btn-outline">
            <FcGoogle size={20} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1 bg-[var(--border)]" />
            <span className="text-xs text-muted">OR</span>
            <div className="h-px flex-1 bg-[var(--border)]" />
          </div>

          {/* Form */}
          <form className="space-y-4">
            <div>
              <label className="text-sm font-medium text-secondary">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="mt-1 w-full px-4 py-2.5 rounded-xl border border-[var(--border)]
                           text-primary focus:outline-none focus:ring-2
                           focus:ring-[var(--btn-primary)]"
              />
            </div>

            <div>
              <label className="text-sm font-medium text-secondary">
                Password
              </label>
              <div className="relative mt-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-2.5 pr-11 rounded-xl border border-[var(--border)]
                             text-primary focus:outline-none focus:ring-2
                             focus:ring-[var(--btn-primary)]"
                />

                {password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword((prev) => !prev)}
                    className="absolute right-3 top-1/2 -translate-y-1/2
                               text-secondary hover:text-primary transition"
                  >
                    {showPassword ? (
                      <AiOutlineEyeInvisible size={18} />
                    ) : (
                      <AiOutlineEye size={18} />
                    )}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl font-semibold btn-primary"
            >
              Login
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-secondary">
            Don’t have an account?{" "}
            <Link
              to="/signup"
              className="font-semibold text-[var(--btn-primary)] hover:underline"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>

      {/* ================= RIGHT : IMAGE SLIDER ================= */}
      <div className="hidden md:block relative h-full w-full overflow-hidden">
        {images.map((img, index) => (
          <img
            key={img}
            src={img}
            alt="Login visual"
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-1000
              ${index === currentImage ? "opacity-100" : "opacity-0"}`}
          />
        ))}

        {/* Overlay */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Caption */}
        <div className="absolute bottom-10 left-10 right-10 text-white">
          <h3 className="text-2xl font-bold">
            Build. Play. Win.
          </h3>
          <p className="text-sm opacity-90 mt-1 max-w-sm">
            Create fantasy teams and compete with players worldwide.
          </p>
        </div>
      </div>
    </main>
  );
}
