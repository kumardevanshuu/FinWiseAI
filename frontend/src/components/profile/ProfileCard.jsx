import React from "react";

export default function ProfileCard({ user }) {
  if (!user) return null;

  const rows = [
    ["Name", user.name || "Not set"],
    ["Username", user.username || "Not set"],
    ["Email", user.email],
    ["Currency", user.currency || "INR"],
    ["Theme", user.theme || "dark"],
    ["Language", user.language || "en"],
  ];

  return (
    <div>
      <h2 className="text-lg font-bold text-white mb-4">Account</h2>
      <div className="space-y-2.5">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between text-sm">
            <span className="text-muted">{label}</span>
            <span className="text-white">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
