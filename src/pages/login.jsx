import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { GiCricketBat } from "react-icons/gi";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { Link } from "react-router-dom";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  return (
    <main className="min-h-screen flex items-center justify-center px-4 bg-main">
      <div className="w-full max-w-md app-card p-6 relative">
        {/* ================= BACK TO HOME ================= */}
        <Link
          to="/"
          className="absolute left-4 top-4 text-xs font-medium
                     px-3 py-1.5 rounded-lg
                     border border-[var(--border)]
                     bg-white/5 text-secondary
                     hover:bg-black/10 hover:text-primary
                     transition"
        >
          ← Back to Home
        </Link>

        {/* ================= LOGO ================= */}
        <div className="flex flex-col items-center mb-4">
          <div className="h-11 w-11 rounded-xl bg-[var(--btn-primary)] flex items-center justify-center text-white">
            <GiCricketBat size={24} />
          </div>

          <h2 className="mt-1.5 text-lg font-bold text-primary">
            CricLeague
          </h2>
        </div>

        {/* ================= HEADER ================= */}
        <h1 className="text-xl font-bold text-primary text-center">
          Welcome Back
        </h1>
        <p className="mt-0.5 text-sm text-secondary text-center">
          Login to manage your fantasy teams
        </p>

        {/* ================= GOOGLE LOGIN ================= */}
        <button className="mt-4 w-full flex items-center justify-center gap-3 py-2.5 rounded-xl font-semibold btn-outline">
          <FcGoogle size={20} />
          Continue with Google
        </button>

        {/* ================= DIVIDER ================= */}
        <div className="flex items-center gap-3 my-4">
          <div className="h-px flex-1 bg-[var(--border)]" />
          <span className="text-xs text-muted">OR</span>
          <div className="h-px flex-1 bg-[var(--border)]" />
        </div>

        {/* ================= FORM ================= */}
        <form className="space-y-3">
          {/* Email */}
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

          {/* Password */}
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

              {/* Eye icon ONLY when password typed */}
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

          {/* CTA */}
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl font-semibold btn-primary"
          >
            Login
          </button>
        </form>

        {/* ================= FOOTER ================= */}
        <p className="mt-4 text-center text-sm text-secondary">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="font-semibold text-[var(--btn-primary)] hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </main>
  );
}
