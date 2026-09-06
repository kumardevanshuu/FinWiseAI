import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    if (!email || !password) {
      setError("Enter both your email and password.");
      return;
    }

    setLoading(true);
    const res = await login(email, password);
    setLoading(false);

    if (res.success) {
      navigate("/dashboard");
    } else {
      setError("That email or password doesn't match our records.");
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4.5rem)] items-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="glow-blob h-[450px] w-[450px] bg-emerald/20 -left-40 top-0" />
      <div className="glow-blob h-[400px] w-[400px] bg-violet/15 bottom-0 right-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-surface/80 shadow-[0_32px_100px_-42px_rgba(0,0,0,0.9)] backdrop-blur-sm lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden min-h-[590px] overflow-hidden border-r border-white/[0.08] bg-gradient-to-br from-emerald/20 via-[#142822] to-[#111315] p-10 lg:flex lg:flex-col">
          <div className="relative z-10">
            <p className="page-kicker text-emerald-light">Your money, in focus</p>
            <h1 className="mt-5 max-w-sm text-4xl font-extrabold leading-[1.05] text-white">
              See every move. <span className="text-emerald-light">Make the next one count.</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted">
              One calm place to understand your cash flow, build habits, and work toward the things that matter.
            </p>
          </div>

          <div className="relative z-10 mt-auto rounded-2xl border border-white/[0.11] bg-bg/35 p-5 backdrop-blur-md">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-muted">This month’s focus</span>
              <span className="rounded-full bg-emerald/15 px-2.5 py-1 text-[0.65rem] font-bold text-emerald-light">ON TRACK</span>
            </div>
            <p className="mt-3 text-2xl font-bold tracking-tight text-white">A clearer financial picture</p>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/[0.1]">
              <div className="h-full w-[72%] rounded-full bg-emerald shadow-[0_0_18px_rgba(16,185,129,0.8)]" />
            </div>
            <div className="mt-3 flex justify-between text-xs text-muted"><span>Steady progress</span><span>72%</span></div>
          </div>
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full border border-emerald/20" />
          <div className="absolute -bottom-10 -right-10 h-52 w-52 rounded-full border border-emerald/20" />
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-11">
          <div className="mb-8">
            <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-emerald text-lg font-black text-bg shadow-[0_0_26px_-7px_rgba(16,185,129,0.85)]">F</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-white">Welcome back</h2>
            <p className="mt-2 text-sm text-muted">Sign in to pick up where your plan left off.</p>
          </div>

        <div className="mb-7 flex rounded-xl border border-white/[0.09] bg-bg/65 p-1">
          <div className="flex-1 rounded-lg bg-white/[0.09] py-2 text-center text-xs font-bold text-white shadow-sm">
            Sign In
          </div>
          <a
            href="/signup"
            className="flex-1 py-2 text-center text-xs font-semibold text-muted hover:text-white"
          >
            Create Account
          </a>
        </div>

        {error && (
          <p className="mb-5 rounded-xl border border-rose/30 bg-rose/10 px-3 py-2.5 text-sm text-rose">
            {error}
          </p>
        )}

        <div className="space-y-4.5">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Email address</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/[0.1] bg-bg/70 px-3.5 py-3 text-sm text-white placeholder:text-faint focus:border-emerald focus:bg-bg outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLogin()}
            />
          </label>

          <label className="block">
            <div className="flex justify-between items-center mb-1.5">
              <span className="text-xs font-semibold text-muted">Password</span>
              <a href="#" className="text-xs font-semibold text-emerald hover:text-emerald-light">
                Forgot password?
              </a>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-white/[0.1] bg-bg/70 px-3.5 py-3 pr-12 text-sm text-white focus:border-emerald focus:bg-bg outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleLogin()}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-1.5 py-1 text-xs font-medium text-faint hover:text-white"
                tabIndex={-1}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
          </label>
        </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-emerald py-3 text-sm font-bold text-bg shadow-[0_14px_28px_-12px_rgba(16,185,129,0.9)] hover:bg-emerald-light disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Continue to FinWiseAI"}
          </button>
          <p className="mt-5 text-center text-xs text-faint">Your financial data stays private to your account.</p>
        </section>
      </div>
    </div>
  );
}
