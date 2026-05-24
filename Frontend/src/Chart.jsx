import { useState } from "react";

const chatMessages = [
    {
        id: 1,
        role: "ai",
        text: "Hi! I'm your StudyAI assistant. I can help explain topics, create study plans, generate flashcards, and answer questions about your coursework.",
        time: "10:30 AM",
    },
    {
        id: 2,
        role: "user",
        text: "Help me review integration by parts before my quiz.",
        time: "10:32 AM",
    },
    {
        id: 3,
        role: "ai",
        text: "Start with the LIATE rule for choosing u. Then practice identifying which term becomes simpler after differentiation.",
        time: "10:32 AM",
    },
];

function Chart() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    return (
        <aside className={`chat-shell ${isChatOpen ? "chat-shell-open" : ""}`}>
            {isChatOpen ? (
                <>
                    <div className="chat-header">
                        <div className="chat-chip">✦</div>
                        <div className="flex-1">
                            <div className="font-['Syne'] text-[13.5px] font-semibold text-(--text)">
                                StudyAI Assistant
                            </div>
                            <div className="flex items-center gap-1 font-['IBM_Plex_Mono'] text-[10px] text-(--success)">
                                <div className="status-dot" />
                                Online · GPT-powered
                            </div>
                        </div>
                        <button
                            className="btn-compact px-2! py-1.25! text-[11px]!"
                            type="button"
                        >
                            Clear
                        </button>
                        <button
                            aria-label="Close assistant"
                            className="chat-close-button"
                            onClick={() => setIsChatOpen(false)}
                            type="button"
                        >
                            ×
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto p-4">
                        <div className="flex flex-col gap-3.5">
                            {chatMessages.map((message) => (
                                <div
                                    className={`message-row ${
                                        message.role === "user"
                                            ? "message-row-user"
                                            : ""
                                    }`}
                                    key={message.id}
                                >
                                    <div
                                        className={`message-avatar ${
                                            message.role === "ai"
                                                ? "message-avatar-ai"
                                                : "message-avatar-user"
                                        }`}
                                    >
                                        {message.role === "ai" ? "✦" : "AS"}
                                    </div>
                                    <div>
                                        <div
                                            className={`message-bubble ${
                                                message.role === "ai"
                                                    ? "message-bubble-ai"
                                                    : "message-bubble-user"
                                            }`}
                                        >
                                            {message.text}
                                        </div>
                                        <div className="mt-1 font-['IBM_Plex_Mono'] text-[10px] text-(--text-faint)">
                                            {message.time}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-wrap gap-1.5 border-t border-(--border) px-4 py-2.5">
                        <button className="quick-chip" type="button">
                            Explain simply
                        </button>
                        <button className="quick-chip" type="button">
                            Make flashcards
                        </button>
                        <button className="quick-chip" type="button">
                            Practice problems
                        </button>
                        <button className="quick-chip" type="button">
                            Summarize notes
                        </button>
                    </div>

                    <div className="flex gap-2 border-t border-(--border) px-4 py-3">
                        <textarea
                            className="chat-input"
                            placeholder="Ask anything about your studies…"
                            rows="1"
                        />
                        <button className="send-button" type="button">
                            ➤
                        </button>
                    </div>
                </>
            ) : (
                <button
                    aria-label="Open StudyAI Assistant"
                    className="chat-launcher"
                    onClick={() => setIsChatOpen(true)}
                    type="button"
                >
                    <svg
                        aria-hidden="true"
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.8"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="M8 10h8" />
                        <path d="M8 14h5" />
                        <path d="M6 5h12a3 3 0 0 1 3 3v8a3 3 0 0 1-3 3H9l-4 3v-3H6a3 3 0 0 1-3-3V8a3 3 0 0 1 3-3Z" />
                    </svg>
                </button>
            )}
        </aside>
    );
}

export default Chart;
