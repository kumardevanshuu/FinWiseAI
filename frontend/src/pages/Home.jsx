// src/pages/Home.jsx
//
// NOTE: this file used to contain three different, conflicting versions
// of this component pasted one after another (two of them with their
// own "export default"), which is invalid JS — a file can only have one
// default export. Reduced to the intended final version.
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
