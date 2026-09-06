import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function Signup() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async () => {
    setError("");
    if (!email || !password) {
      setError("Enter both your email and a password.");
      return;
    }

    setLoading(true);
    try {
      await API.post("/api/v1/users/", { name, email, password });
      const res = await login(email, password);
      if (res.success) {
        navigate("/dashboard");
      } else {
        navigate("/login");
      }
    } catch (err) {
      setError(
        err?.response?.data?.detail || "Couldn't create that account. Try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-4.5rem)] items-center overflow-hidden px-4 py-10 sm:px-6">
      <div className="glow-blob h-[450px] w-[450px] bg-emerald/20 -right-40 top-0" />
      <div className="glow-blob h-[380px] w-[380px] bg-amber/15 bottom-0 left-0" />

      <div className="relative z-10 mx-auto grid w-full max-w-5xl overflow-hidden rounded-[1.75rem] border border-white/[0.1] bg-surface/80 shadow-[0_32px_100px_-42px_rgba(0,0,0,0.9)] backdrop-blur-sm lg:grid-cols-[0.92fr_1.08fr]">
        <section className="relative hidden min-h-[650px] overflow-hidden border-r border-white/[0.08] bg-gradient-to-br from-emerald/20 via-[#142822] to-[#111315] p-10 lg:flex lg:flex-col">
          <div className="relative z-10">
            <p className="page-kicker text-emerald-light">Built for the long view</p>
            <h1 className="mt-5 max-w-sm text-4xl font-extrabold leading-[1.05] text-white">
              Better money habits start with <span className="text-emerald-light">one clear view.</span>
            </h1>
            <p className="mt-5 max-w-sm text-sm leading-6 text-muted">
              Track your everyday decisions, turn them into progress, and get practical perspective whenever you need it.
            </p>
          </div>

          <div className="relative z-10 mt-auto grid grid-cols-2 gap-3">
            {[['Track', 'Every rupee'], ['Plan', 'With intent'], ['Grow', 'Your goals'], ['Ask', 'AI advisor']].map(([label, detail]) => (
              <div key={label} className="rounded-2xl border border-white/[0.1] bg-bg/30 p-4 backdrop-blur-md">
                <p className="text-xs font-bold text-emerald-light">{label}</p>
                <p className="mt-1 text-sm font-semibold text-white">{detail}</p>
              </div>
            ))}
          </div>
          <div className="absolute -bottom-24 -right-24 h-72 w-72 rounded-full border border-emerald/20" />
          <div className="absolute -bottom-10 -right-10 h-52 w-52 rounded-full border border-emerald/20" />
        </section>

        <section className="px-6 py-8 sm:px-10 sm:py-10">
          <div className="mb-7">
            <span className="mb-5 grid h-11 w-11 place-items-center rounded-2xl bg-emerald text-lg font-black text-bg shadow-[0_0_26px_-7px_rgba(16,185,129,0.85)]">F</span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">Start your clear view</h1>
            <p className="mt-2 text-sm text-muted">Create your account in less than a minute.</p>
          </div>

        <div className="mb-7 flex rounded-xl border border-white/[0.09] bg-bg/65 p-1">
          <a
            href="/login"
            className="flex-1 py-2 text-center text-xs font-semibold text-muted hover:text-white"
          >
            Sign In
          </a>
          <div className="flex-1 rounded-lg bg-white/[0.09] py-2 text-center text-xs font-bold text-white shadow-sm">
            Create Account
          </div>
        </div>

        {error && (
          <p className="mb-5 rounded-xl border border-rose/30 bg-rose/10 px-3 py-2.5 text-sm text-rose">
            {error}
          </p>
        )}

        <div className="space-y-4">
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Full name</span>
            <input
              type="text"
              placeholder="Your name"
              className="w-full rounded-xl border border-white/[0.1] bg-bg/70 px-3.5 py-3 text-sm text-white placeholder:text-faint focus:border-emerald focus:bg-bg outline-none transition-colors"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Email address</span>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full rounded-xl border border-white/[0.1] bg-bg/70 px-3.5 py-3 text-sm text-white placeholder:text-faint focus:border-emerald focus:bg-bg outline-none transition-colors"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-muted">Password</span>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full rounded-xl border border-white/[0.1] bg-bg/70 px-3.5 py-3 pr-12 text-sm text-white focus:border-emerald focus:bg-bg outline-none transition-colors"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSignup()}
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
            onClick={handleSignup}
            disabled={loading}
            className="mt-7 w-full rounded-xl bg-emerald py-3 text-sm font-bold text-bg shadow-[0_14px_28px_-12px_rgba(16,185,129,0.9)] hover:bg-emerald-light disabled:opacity-60"
          >
            {loading ? "Creating account…" : "Create my account"}
          </button>
          <p className="mt-5 text-center text-xs leading-5 text-faint">By continuing, you agree to keep your account details secure.</p>
        </section>
      </div>
    </div>
  );
}
