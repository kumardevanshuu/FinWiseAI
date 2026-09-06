import React, { useState } from "react";
import API from "../../services/api";

const fieldClass =
  "w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:border-emerald outline-none transition-colors";

export default function EditProfileForm({ user, onUpdated }) {
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [email, setEmail] = useState(user.email || "");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const updateProfile = () => {
    setStatus(null);
    if (!email) {
      setStatus({ type: "error", text: "Email cannot be empty." });
      return;
    }

    setLoading(true);

    API.put("/api/v1/profile/", { name, username, email })
      .then(() => {
        setStatus({ type: "success", text: "Profile updated." });
        onUpdated();
      })
      .catch(() => setStatus({ type: "error", text: "Failed to update profile." }))
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4">Edit profile</h2>

      {status && (
        <p
          className={`text-sm rounded-lg px-3 py-2 mb-4 border ${
            status.type === "error"
              ? "text-rose bg-rose/10 border-rose/30"
              : "text-emerald-light bg-emerald/10 border-emerald/30"
          }`}
        >
          {status.text}
        </p>
      )}

      <div className="space-y-4">
        <label className="block">
          <span className="block text-xs text-muted mb-1.5">Name</span>
          <input className={fieldClass} value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="block">
          <span className="block text-xs text-muted mb-1.5">Username</span>
          <input className={fieldClass} value={username} onChange={(e) => setUsername(e.target.value)} />
        </label>

        <label className="block">
          <span className="block text-xs text-muted mb-1.5">Email</span>
          <input className={fieldClass} value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
      </div>

      <button
        className="mt-5 bg-emerald text-bg px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-emerald-light transition-colors disabled:opacity-60"
        onClick={updateProfile}
        disabled={loading}
      >
        {loading ? "Saving…" : "Save changes"}
      </button>
    </div>
  );
}
