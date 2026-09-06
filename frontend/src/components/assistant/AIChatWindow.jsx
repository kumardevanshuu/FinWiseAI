import React, { useEffect, useRef } from "react";
import MessageBubble from "./AIMessageBubble";

export default function AIChatWindow({ messages = [], loading }) {
  const bottomRef = useRef();

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div className="subtle-scrollbar flex-1 space-y-4 overflow-y-auto p-4 sm:p-6">
      {messages.map((m, i) => (
        <MessageBubble key={i} sender={m.sender} text={m.text} />
      ))}

      {loading && (
        <div className="flex items-start">
          <div className="rounded-xl bg-violet/12 px-3 py-2 text-sm text-violet">
            Loading messages…
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
