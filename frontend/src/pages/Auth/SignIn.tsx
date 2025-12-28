import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function SignIn() {
  const navigate = useNavigate();
  const { signIn, error, loading, clearError } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();

    try {
      await signIn(email, password);
      navigate("/");
    } catch (error) {
      // Error is handled by the store
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column: Sign In Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32">
        <div className="max-w-[420px] w-full mx-auto animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="mb-10">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Sign in
            </h1>
            <p className="text-slate-500 font-medium">
              Enter your credentials to access your account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="text-sm font-bold text-slate-700"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                placeholder="m@example.com"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="text-sm font-bold text-slate-700"
                >
                  Password
                </label>
                <Link
                  to="#"
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700"
                >
                  Forgot Password?
                </Link>
              </div>
              <input
                id="password"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <footer className="mt-10 text-center">
            <p className="text-sm font-bold text-slate-500">
              Don't have an account yet?{" "}
              <Link
                to="/signup"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Sign up
              </Link>
            </p>
          </footer>
        </div>
      </div>

      <div className="hidden lg:flex w-1/2 bg-slate-50 items-center justify-center p-12">
        <div className="max-w-[80%] animate-in fade-in slide-in-from-right-4 duration-700">
          <img
            src="/auth-illustration.svg"
            alt="Authentication Illustration"
            className="w-full h-auto drop-shadow-2xl"
          />
        </div>
      </div>
    </div>
  );
}
