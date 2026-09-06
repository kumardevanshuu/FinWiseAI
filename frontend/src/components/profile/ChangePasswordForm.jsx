// src/components/profile/ChangePasswordForm.jsx
import React, { useState } from "react";
import API from "../../services/api";

const fieldClass =
  "w-full bg-bg border border-border rounded-lg px-3 py-2.5 text-sm text-white focus:border-emerald outline-none transition-colors";

export default function ChangePasswordForm() {
  const [oldPass, setOldPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState(null);

  const updatePassword = () => {
    setStatus(null);
    if (!oldPass || !newPass) {
      setStatus({ type: "error", text: "Both fields are required." });
      return;
    }

    setLoading(true);

    API.put("/api/v1/profile/password", {
      old_password: oldPass,
      new_password: newPass,
    })
      .then(() => {
        setStatus({ type: "success", text: "Password updated." });
        setOldPass("");
        setNewPass("");
      })
      .catch((err) => {
        if (err.response && err.response.status === 400) {
          setStatus({ type: "error", text: "Old password is incorrect." });
        } else {
          setStatus({ type: "error", text: "Failed to update password." });
        }
      })
      .finally(() => setLoading(false));
  };

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4">Change password</h2>

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
          <span className="block text-xs text-muted mb-1.5">Old password</span>
          <input
            type="password"
            className={fieldClass}
            value={oldPass}
            onChange={(e) => setOldPass(e.target.value)}
          />
        </label>

        <label className="block">
          <span className="block text-xs text-muted mb-1.5">New password</span>
          <input
            type="password"
            className={fieldClass}
            value={newPass}
            onChange={(e) => setNewPass(e.target.value)}
          />
        </label>
      </div>

      <button
        onClick={updatePassword}
        className="mt-5 bg-white text-bg px-5 py-2.5 rounded-full text-sm font-semibold hover:bg-white/90 transition-colors disabled:opacity-60"
        disabled={loading}
      >
        {loading ? "Updating…" : "Update password"}
      </button>
    </div>
  );
}
