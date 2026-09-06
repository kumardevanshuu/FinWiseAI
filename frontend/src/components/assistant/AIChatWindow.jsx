// src/components/assistant/AIChatWindow.jsx
//
// NOTE: this used to be a self-contained component that fetched its own
// history and rendered its own <AIChatInput> — but never imported
// AIChatInput (ReferenceError crash on render), and expected a
// "conversationId" prop that the parent (pages/Assistant.jsx) never
// passed (it manages conversation state itself and passes "messages"
// + "loading" instead). Simplified to a plain presentational component
// that matches what Assistant.jsx actually gives it.
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
