import React, { useState } from "react";
import api from "../services/api";

export default function TestFetch() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const handleClick = async () => {
    setData(null);
    setError(null);
    try {
      const res = await api.get("/");
      setData(res.data);
    } catch (err) {
      setError(err.message);
      console.error(err);
    }
  };

  return (
    <div className="p-6 text-center">
      <button
        onClick={handleClick}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Test Backend Connection
      </button>

      <div className="mt-4">
        <p className="font-semibold">Response:</p>
        <pre className="bg-gray-100 p-2 rounded">{data ? JSON.stringify(data, null, 2) : "—"}</pre>

        <p className="font-semibold mt-3">Error:</p>
        <pre className="bg-gray-100 p-2 rounded text-red-600">{error || "—"}</pre>
      </div>
    </div>
  );
}
