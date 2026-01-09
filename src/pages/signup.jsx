import { FcGoogle } from "react-icons/fc"
import { Link } from "react-router-dom"

export default function Signup() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-[rgb(var(--color-bg))] px-4">
      <div className="w-full max-w-md bg-[rgb(var(--color-surface))] rounded-3xl p-8 border border-white/10 shadow-xl">
        {/* Header */}
        <h1 className="text-3xl font-bold text-[rgb(var(--color-text))]">
          Create Account
        </h1>
        <p className="mt-1 text-sm text-[rgb(var(--color-text)/0.7)]">
          Start building your fantasy cricket team
        </p>

        {/* Google Signup */}
        <button
          className="
            mt-6 w-full flex items-center justify-center gap-3
            py-3 rounded-xl
            bg-white text-black font-semibold
            hover:opacity-90 transition
          "
        >
          <FcGoogle size={22} />
          Sign up with Google
        </button>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div className="h-px bg-white/20 flex-1" />
          <span className="text-xs text-white/50">OR</span>
          <div className="h-px bg-white/20 flex-1" />
        </div>

        {/* Form */}
        <form className="space-y-4">
          <div>
            <label className="text-sm text-white/80">Full Name</label>
            <input
              type="text"
              placeholder="Your name"
              className="
                mt-1 w-full px-4 py-3 rounded-xl
                bg-black/30 border border-white/10
                text-white placeholder:text-white/40
                focus:outline-none focus:ring-2
                focus:ring-[rgb(var(--color-primary))]
              "
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="
                mt-1 w-full px-4 py-3 rounded-xl
                bg-black/30 border border-white/10
                text-white placeholder:text-white/40
                focus:outline-none focus:ring-2
                focus:ring-[rgb(var(--color-primary))]
              "
            />
          </div>

          <div>
            <label className="text-sm text-white/80">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="
                mt-1 w-full px-4 py-3 rounded-xl
                bg-black/30 border border-white/10
                text-white placeholder:text-white/40
                focus:outline-none focus:ring-2
                focus:ring-[rgb(var(--color-primary))]
              "
            />
          </div>

          <button
            type="submit"
            className="
              w-full py-3 rounded-xl
              bg-gradient-to-r
              from-[rgb(var(--color-primary))]
              to-[rgb(var(--color-secondary))]
              font-semibold text-white
              hover:opacity-90 transition
            "
          >
            Create Account
          </button>
        </form>

        {/* Footer */}
        <p className="mt-6 text-center text-sm text-white/60">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-[rgb(var(--color-primary))] font-semibold hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </main>
  )
}
