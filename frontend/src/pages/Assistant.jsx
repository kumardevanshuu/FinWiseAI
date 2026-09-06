import React, { useState, useEffect } from "react";
import Sidebar from "../components/assistant/Sidebar";
import AIChatWindow from "../components/assistant/AIChatWindow";
import AIChatInput from "../components/assistant/AIChatInput";
import API from "../services/api";

export default function Assistant() {
  const [conversations, setConversations] = useState([]);
  const [activeConvId, setActiveConvId] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);

  const loadConversations = async () => {
    try {
      const res = await API.get("/api/v1/assistant/conversations");
      const list = res.data || [];
      setConversations(list);
      return list;
    } catch (err) {
      console.error("Failed to load conversations", err);
      return [];
    }
  };

  useEffect(() => {
    // On page load (or when navigating back to /assistant), auto-open the
    // most recently active conversation instead of showing a blank chat
    // conversations are already saved permanently in the database, this
    // just restores which one you were looking at.
    (async () => {
      const list = await loadConversations();
      if (list.length > 0) {
        selectConversation(list[0].id);
      }
    })();
  }, []);

  const createNewConversation = async () => {
    try {
      const res = await API.post("/api/v1/assistant/start", { title: "New Conversation" });
      const convId = res.data.conversation_id;
      await loadConversations();
      selectConversation(convId);
    } catch (err) {
      console.error("Failed to create conversation", err);
    }
  };

  const selectConversation = async (convId) => {
    setActiveConvId(convId);
    setLoadingHistory(true);
    try {
      const res = await API.get(`/api/v1/assistant/history/${convId}`);
      const msgs = (res.data.messages || []).map((m) => ({
        sender: m.role === "user" ? "user" : "ai",
        text: m.content,
      }));
      setMessages(msgs.length ? msgs : [
        { sender: "ai", text: "Hello! I'm your FinWiseAI assistant. Ask me anything about your finances." }
      ]);
    } catch (err) {
      console.error("Failed to load history", err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleAddMessage = (msg) => {
    setMessages((prev) => [...prev, msg]);
  };

  const refreshConversations = async () => {
    await loadConversations();
  };

  const deleteConversation = async (convId) => {
    if (!window.confirm("Delete this conversation? This can't be undone.")) return;

    try {
      await API.delete(`/api/v1/assistant/conversations/${convId}`);
      const list = await loadConversations();

      if (activeConvId === convId) {
        if (list.length > 0) {
          selectConversation(list[0].id);
        } else {
          setActiveConvId(null);
          setMessages([]);
        }
      }
    } catch (err) {
      console.error("Failed to delete conversation", err);
    }
  };

  return (
    <div className="mx-auto flex h-[calc(100vh-4.5rem)] max-w-[1440px] bg-bg/20">
      <Sidebar
        conversations={conversations}
        onNewConversation={createNewConversation}
        onSelectConversation={selectConversation}
        onDeleteConversation={deleteConversation}
        activeConvId={activeConvId}
      />

      <div className="flex min-w-0 flex-1 flex-col px-4 py-5 sm:px-6 md:px-8 md:py-7">
        <header className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="page-kicker text-violet">FinWiseAI advisor</p>
            <h1 className="mt-2 flex items-center gap-2 text-2xl font-extrabold tracking-tight text-white">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-violet/15 text-sm text-violet">
                ✦
              </span>
              Ask with confidence
            </h1>
            <p className="mt-1 text-sm text-muted">A private thinking partner for your spending and goals.</p>
          </div>
          <div className="md:hidden">
            <select
              value={activeConvId || ""}
              onChange={(e) => e.target.value && selectConversation(e.target.value)}
              className="max-w-48 rounded-lg border border-white/[0.1] bg-surface px-3 py-2 text-xs text-white outline-none focus:border-violet"
              aria-label="Select a conversation"
            >
              <option value="">Your conversations</option>
              {conversations.map((c) => <option key={c.id} value={c.id}>{c.title || "New conversation"}</option>)}
            </select>
          </div>
        </header>

        <div className="soft-card flex min-h-0 flex-1 flex-col overflow-hidden rounded-2xl">
          {!activeConvId && !loadingHistory && (
            <div className="flex flex-1 flex-col items-center justify-center px-6 text-center">
              <span className="grid h-12 w-12 place-items-center rounded-2xl bg-violet/15 text-xl text-violet">✦</span>
              <h2 className="mt-4 text-lg font-bold text-white">What would you like to understand?</h2>
              <p className="mt-1 max-w-sm text-sm leading-6 text-muted">Start a conversation for ideas on budgeting, saving, or making sense of your spending.</p>
              <button onClick={createNewConversation} className="mt-5 rounded-xl bg-violet px-4 py-2.5 text-sm font-bold text-bg hover:bg-[#c4b5fd]">Start a conversation</button>
            </div>
          )}
          {activeConvId && <>
            <AIChatWindow messages={messages} loading={loadingHistory} />

            <div className="border-t border-white/[0.08] bg-bg/20 p-3 sm:p-4">
              <AIChatInput
                conversationId={activeConvId}
                onSend={handleAddMessage}
                setMessages={setMessages}
                refreshConversations={refreshConversations}
              />
            </div>
          </>}
          {loadingHistory && !activeConvId && (
            <div className="flex flex-1 items-center justify-center text-sm text-muted">Loading conversation…</div>
          )}
        </div>
      </div>
    </div>
  );
}
