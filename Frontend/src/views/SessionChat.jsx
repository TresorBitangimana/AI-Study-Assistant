import { useEffect, useRef } from "react";
import { Icon } from "../components/Icon";

export default function SessionChat({
    session,
    messages,
    busy,
    input,
    setInput,
    onSend,
}) {
    const endRef = useRef(null);
    useEffect(() => {
        endRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, busy]);

    return (
        <section className="session-chat-panel glass-surface">
            <header className="session-chat-header">
                <span className="assistant-mark">
                    <Icon name="Spark" />
                </span>
                <div>
                    <b>Study chat</b>
                </div>
            </header>
            <div className="session-chat-body">
                <div className="chat-message assistant">
                    {session.result ||
                        "I'm ready to help you study these materials. What would you like to explore?"}
                </div>
                {messages.map((message, index) => (
                    <div
                        className={`chat-message ${message.role}`}
                        key={`${session.id}-${index}`}
                    >
                        {message.text}
                    </div>
                ))}
                {busy && (
                    <div className="typing">
                        <i />
                        <i />
                        <i />
                    </div>
                )}
                <div ref={endRef} />
            </div>
            <form
                className="chat-compose session-chat-compose"
                onSubmit={onSend}
            >
                <input
                    value={input}
                    onChange={(event) => setInput(event.target.value)}
                    placeholder="Ask a follow-up about your study material…"
                    aria-label="Message this study session"
                />
                <button
                    disabled={busy || !input.trim()}
                    aria-label="Send message"
                >
                    <Icon name="Send" />
                </button>
            </form>
            <div className="chat-footnote">
                AI can make mistakes. Check important details.
            </div>
        </section>
    );
}
