import React from "react";
import TestFetch from "../components/TestFetch";

export default function Home() {
  return (
    <div className="p-6">
      <h2 className="text-3xl font-bold mb-4">Welcome to FinWiseAI</h2>

      {/* Test backend connection */}
      <TestFetch />
    </div>
  );
}
