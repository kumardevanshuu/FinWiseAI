import React from "react";

export default function MessageBubble({ sender, text }) {
  if (sender === "user") {
    return (
      <div className="flex justify-end">
        <div className="max-w-[82%] rounded-2xl rounded-br-md bg-emerald px-4 py-2.5 font-medium text-bg shadow-[0_10px_22px_-15px_rgba(16,185,129,0.85)] sm:max-w-[70%]">
          <div className="whitespace-pre-wrap text-sm">{text}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex">
      <div className="max-w-[84%] rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.055] px-4 py-2.5 text-white sm:max-w-[75%]">
        <div className="whitespace-pre-wrap text-sm">{text}</div>
      </div>
    </div>
  );
}
