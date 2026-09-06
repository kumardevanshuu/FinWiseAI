import React, { useState } from "react";

export default function AIChatInput({
  conversationId,
  onSend,
  setMessages,
  refreshConversations,
}) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function streamAssistantMessage(conversationId, message) {
    const token = localStorage.getItem("access_token"); 

    const apiBase = import.meta.env.VITE_API_URL || "";
    const res = await fetch(
      `${apiBase}/api/v1/assistant/stream_message`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, 
        },
        body: JSON.stringify({ conversation_id: conversationId, message }),
      }
    );

    if (!res.ok) {
      onSend({
        sender: "ai",
        text: "⚠️ AI failed to respond. Please try again.",
      });
      return;
    }

    const reader = res.body.getReader();
    const decoder = new TextDecoder();
    let assistantText = "";

    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      if (!value) continue;

      const chunk = decoder.decode(value, { stream: true });
      const frames = chunk.split("\n\n");

      for (const frame of frames) {
        if (!frame.trim()) continue;

        const line = frame.split("\n").find((l) => l.startsWith("data:"));
        if (!line) continue;

        let evt;
        try {
          evt = JSON.parse(line.replace("data:", "").trim());
        } catch {
          console.warn("Invalid stream JSON chunk", frame);
          continue;
        }

        if (evt.type === "partial") {
          assistantText += evt.text;
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { sender: "ai", text: assistantText },
          ]);
        } else if (evt.type === "done") {
          assistantText += evt.text;
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { sender: "ai", text: assistantText },
          ]);

          if (refreshConversations) refreshConversations();
        } else if (evt.type === "error") {
          setMessages((prev) => [
            ...prev.slice(0, -1),
            { sender: "ai", text: `⚠️ ${evt.message}` },
          ]);
        }
      }
    }
  }

  const sendMessage = async () => {
    if (!text.trim()) return;

    const userMsg = { sender: "user", text };
    onSend(userMsg);

    setMessages((prev) => [...prev, { sender: "ai", text: "" }]);

    setLoading(true);
    try {
      await streamAssistantMessage(conversationId, text);
    } catch (err) {
      console.error("Streaming error", err);
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { sender: "ai", text: "⚠️ Error streaming response." },
      ]);
    } finally {
      setLoading(false);
      setText("");
    }
  };

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        placeholder="Ask about budgets, goals, transactions…"
        className="min-w-0 flex-1 rounded-xl border border-white/[0.1] bg-bg/70 px-4 py-3 text-sm text-white placeholder:text-faint focus:border-violet outline-none transition-colors"
      />

      <button
        onClick={sendMessage}
        disabled={loading}
        className="rounded-xl bg-violet px-4 py-3 text-sm font-bold text-bg shadow-[0_12px_22px_-14px_rgba(167,139,250,0.9)] hover:bg-[#c4b5fd] disabled:opacity-60 sm:px-5"
      >
        {loading ? "…" : "Send"}
      </button>
    </div>
  );
}
