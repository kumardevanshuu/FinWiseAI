import React from "react";
import { formatDistanceToNow } from "date-fns";

export default function Sidebar({
  conversations,
  onNewConversation,
  onSelectConversation,
  onDeleteConversation,
  activeConvId,
}) {
  return (
    <aside className="w-72 shrink-0 border-r border-border flex flex-col py-6 px-5">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-white">Chats</h2>
        <button
          onClick={onNewConversation}
          className="text-xs px-3 py-1.5 rounded-full bg-violet/15 text-violet hover:bg-violet/25 transition-colors"
        >
          New chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto -mx-2 space-y-1">
        {conversations.length === 0 && (
          <p className="text-sm text-muted px-2">No conversations yet.</p>
        )}

        {conversations.map((c) => (
          <div
            key={c.id}
            className={`group relative rounded-xl transition-colors ${
              activeConvId === c.id ? "bg-violet/15" : "hover:bg-surfaceHover"
            }`}
          >
            <button
              onClick={() => onSelectConversation(c.id)}
              className="w-full text-left px-3 py-2.5 pr-9"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-white truncate">
                  {c.title || "New conversation"}
                </span>
                <span className="text-xs text-faint shrink-0">
                  {c.last_message_at
                    ? formatDistanceToNow(new Date(c.last_message_at), { addSuffix: true })
                    : ""}
                </span>
              </div>
              <p className="text-xs text-muted mt-0.5 truncate">
                {c.last_message || "No messages yet"}
              </p>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onDeleteConversation(c.id);
              }}
              title="Delete conversation"
              className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full flex items-center justify-center text-faint opacity-0 group-hover:opacity-100 hover:text-rose hover:bg-rose/10 transition-all"
            >
              ×
            </button>
          </div>
        ))}
      </div>

      <p className="text-xs text-faint mt-4">FinWiseAI · private to you</p>
    </aside>
  );
}