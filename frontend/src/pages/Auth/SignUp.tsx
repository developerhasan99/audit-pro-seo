import { useState, FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";

export default function SignUp() {
  const navigate = useNavigate();
  const { signUp, error, loading, clearError } = useAuthStore();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [localError, setLocalError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    clearError();
    setLocalError("");

    if (password !== confirmPassword) {
      setLocalError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setLocalError("Password must be at least 6 characters");
      return;
    }

    try {
      await signUp(email, password, firstName, lastName);
      navigate("/");
    } catch (error) {
      // Error is handled by the store
    }
  };

  const displayError = error || localError;

  return (
    <div className="min-h-screen flex bg-white">
      {/* Left Column: Sign Up Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center px-8 sm:px-12 md:px-24 lg:px-32 py-12">
        <div className="max-w-[420px] w-full mx-auto animate-in fade-in slide-in-from-left-4 duration-700">
          <div className="mb-10 text-center lg:text-left">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">
              Create an account
            </h1>
            <p className="text-slate-500 font-medium">
              Enter your details to create an account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {displayError && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm font-bold animate-in fade-in slide-in-from-top-2">
                {displayError}
              </div>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label
                  htmlFor="firstName"
                  className="text-sm font-bold text-slate-700"
                >
                  First name
                </label>
                <input
                  id="firstName"
                  type="text"
                  placeholder="John"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="lastName"
                  className="text-sm font-bold text-slate-700"
                >
                  Last name
                </label>
                <input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

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
              <label
                htmlFor="password"
                title="Password must be at least 6 characters"
                className="text-sm font-bold text-slate-700"
              >
                Password
              </label>
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

            <div className="space-y-2">
              <label
                htmlFor="confirmPassword"
                className="text-sm font-bold text-slate-700"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-4 focus:ring-indigo-100 focus:border-indigo-600 outline-none transition-all text-sm font-medium"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-black text-sm transition-all shadow-lg shadow-indigo-100 active:scale-[0.98] disabled:opacity-50 mt-4"
            >
              {loading ? "Creating account..." : "Create account"}
            </button>
          </form>

          <footer className="mt-8 text-center">
            <p className="text-sm font-bold text-slate-500">
              Already have an account?{" "}
              <Link
                to="/signin"
                className="text-indigo-600 hover:text-indigo-700"
              >
                Sign in
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
