import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useLocation } from "react-router-dom";

const NAV_LINKS = [
  { to: "/dashboard", label: "Overview" },
  { to: "/goals", label: "Goals" },
  { to: "/analytics", label: "Insights" },
  { to: "/assistant", label: "AI advisor" },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-bg/75 backdrop-blur-xl">
      <div className="max-w-[1184px] mx-auto px-6 flex items-center justify-between h-[4.5rem]">
        <Link
          to={user ? "/dashboard" : "/login"}
          className="group flex items-center gap-2.5 font-bold text-[1.05rem] tracking-tight text-white"
        >
          <span className="relative grid h-8 w-8 place-items-center overflow-hidden rounded-xl bg-emerald text-sm font-black text-bg shadow-[0_0_24px_-5px_rgba(16,185,129,0.8)] transition-transform group-hover:scale-105">
            <span className="relative z-10">F</span>
            <span className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-white/35" />
          </span>
          <span>FinWise<span className="text-emerald-light">AI</span></span>
        </Link>

        {user && (
          <nav className="hidden md:flex items-center gap-1 rounded-full border border-white/[0.07] bg-white/[0.025] p-1">
            {NAV_LINKS.map((link) => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={
                    "rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors " +
                    (active
                      ? "bg-white/[0.1] text-white shadow-sm"
                      : "text-muted hover:text-white")
                  }
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        )}

        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <Link to="/profile" className="group flex items-center gap-2 text-sm text-muted hover:text-white">
                <span className="grid h-7 w-7 place-items-center rounded-full bg-violet/20 text-[0.65rem] font-bold text-violet transition-colors group-hover:bg-violet/30">
                  {(user.name ?? user.email ?? "U").slice(0, 1).toUpperCase()}
                </span>
                <span className="max-w-28 truncate">{user.name ?? user.email}</span>
              </Link>
              <button
                onClick={logout}
                className="rounded-full border border-white/[0.11] px-3.5 py-1.5 text-xs font-medium text-muted hover:border-white/[0.23] hover:text-white"
              >
                Log out
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="rounded-full bg-emerald px-4 py-2 text-xs font-bold text-bg shadow-[0_8px_20px_-8px_rgba(16,185,129,0.9)] hover:bg-emerald-light"
            >
              Sign up / Login
            </Link>
          )}
        </div>

        {user && (
          <button
            className="grid h-9 w-9 place-items-center rounded-lg border border-white/[0.1] text-xl leading-none text-white md:hidden"
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {menuOpen ? "×" : "≡"}
          </button>
        )}
      </div>

      {user && menuOpen && (
        <nav className="md:hidden border-t border-white/[0.08] bg-bg/95 px-5 py-4 flex flex-col gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              onClick={() => setMenuOpen(false)}
              className={"rounded-lg px-3 py-2.5 text-sm " + (location.pathname === link.to ? "bg-white/[0.08] text-white" : "text-muted")}
            >
              {link.label}
            </Link>
          ))}
          <Link to="/profile" onClick={() => setMenuOpen(false)} className="rounded-lg px-3 py-2.5 text-sm text-muted">
            Account · {user.name ?? user.email}
          </Link>
          <button onClick={logout} className="px-3 py-2.5 text-left text-sm text-rose">
            Log out
          </button>
        </nav>
      )}
    </header>
  );
}
