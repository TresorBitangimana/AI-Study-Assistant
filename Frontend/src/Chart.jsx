import { useEffect, useRef, useState } from "react";

const baseUrl = "http://localhost:8080/api/study_assistant";

const initialChatMessages = [
    {
        id: 1,
        role: "ai",
        text: "Hi! I'm your StudyAI assistant. How can I help today?",
        time: formatMessageTime(new Date()),
    },
];

function formatMessageTime(date) {
    return new Intl.DateTimeFormat("en-US", {
        hour: "numeric",
        minute: "2-digit",
    }).format(date);
}

function createChatMessage(role, text) {
    return {
        id: `${role}-${Date.now()}-${Math.random().toString(16).slice(2)}`,
        role,
        text,
        time: formatMessageTime(new Date()),
    };
}

function Chart() {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [chatMessages, setChatMessages] = useState(initialChatMessages);
    const [draftMessage, setDraftMessage] = useState("");
    const [isSending, setIsSending] = useState(false);
    const chatMessagesRef = useRef(null);

    useEffect(() => {
        if (!isChatOpen || !chatMessagesRef.current) {
            return;
        }

        chatMessagesRef.current.scrollTop =
            chatMessagesRef.current.scrollHeight;
    }, [chatMessages, isChatOpen]);

    async function handleSendMessage() {
        const message = draftMessage.trim();
        if (!message || isSending) {
            return;
        }

        const userMessage = createChatMessage("user", message);
        setChatMessages((current) => [...current, userMessage]);
        setDraftMessage("");
        setIsSending(true);

        try {
            const response = await fetch(`${baseUrl}/chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(message),
            });

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const aiResponseText = await response.text();
            const aiMessage = createChatMessage(
                "ai",
                aiResponseText.trim() ||
                    "Sorry, I couldn't generate a response.",
            );

            setChatMessages((current) => [...current, aiMessage]);
        } catch {
            setChatMessages((current) => [
                ...current,
                createChatMessage(
                    "ai",
                    "Sorry, I couldn't reach the assistant right now.",
                ),
            ]);
        } finally {
            setIsSending(false);
        }
    }

    const resetChat = () => {
        setChatMessages(initialChatMessages);
        setDraftMessage("");
        setIsSending(false);
    };

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
                        </div>
                        <button
                            className="btn-compact px-2! py-1.25! text-[11px]!"
                            onClick={resetChat}
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

                    <div
                        className="flex-1 overflow-y-auto p-4"
                        ref={chatMessagesRef}
                    >
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

                    <div className="flex gap-2 border-t border-(--border) px-4 py-3">
                        <textarea
                            className="chat-input"
                            disabled={isSending}
                            onChange={(event) =>
                                setDraftMessage(event.target.value)
                            }
                            onKeyDown={(event) => {
                                if (event.key === "Enter" && !event.shiftKey) {
                                    event.preventDefault();
                                    handleSendMessage();
                                }
                            }}
                            placeholder="Write a question"
                            rows="1"
                            value={draftMessage}
                        />
                        <button
                            className="send-button"
                            disabled={isSending || !draftMessage.trim()}
                            onClick={handleSendMessage}
                            type="button"
                        >
                            {isSending ? "..." : "➤"}
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
