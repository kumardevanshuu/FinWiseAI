import React, { useEffect, useState } from "react";
import API from "../services/api";
import ProfileCard from "../components/profile/ProfileCard";
import EditProfileForm from "../components/profile/EditProfileForm";
import ChangePasswordForm from "../components/profile/ChangePasswordForm";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = () => {
    API.get("/api/v1/profile/")
      .then((res) => setUser(res.data))
      .catch((err) => console.error("Error loading profile:", err))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (loading) {
    return <div className="page-shell max-w-2xl text-lg text-muted">Loading profile…</div>;
  }
  if (!user) {
    return <div className="page-shell max-w-2xl text-rose">Failed to load profile.</div>;
  }

  return (
    <div className="page-shell max-w-2xl">
      <div className="mb-10">
        <p className="page-kicker text-violet">Account settings</p>
        <h1 className="mt-3 text-3xl font-extrabold tracking-tight text-white">Your profile</h1>
        <p className="mt-2 text-sm text-muted">Your account details and security preferences, all in one place.</p>
      </div>

      <div className="space-y-6">
        <div className="soft-card rounded-2xl p-6">
          <ProfileCard user={user} />
        </div>

        <div className="soft-card rounded-2xl p-6">
          <EditProfileForm user={user} onUpdated={loadUser} />
        </div>

        <div className="soft-card rounded-2xl p-6">
          <ChangePasswordForm />
        </div>
      </div>
    </div>
  );
}
