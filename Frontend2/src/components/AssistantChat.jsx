import { ChatIcon, Icon } from "./Icon";

export default function AssistantChat({
    open,
    onToggle,
    messages,
    busy,
    input,
    setInput,
    onSend,
    endRef,
}) {
    return (
        <>
            <button
                className="assistant-fab"
                onClick={onToggle}
                aria-label={open ? "Close assistant" : "Open assistant"}
            >
                <span className="assistant-fab-core">
                    {open ? <Icon name="×" /> : <ChatIcon />}
                </span>
            </button>
            {open && (
                <aside className="chat-panel glass-surface">
                    <div className="chat-head">
                        <span className="assistant-mark">
                            <Icon name="Spark" />
                        </span>
                        <div>
                            <b>Study Assistant</b>
                        </div>
                        <button className="icon-button" onClick={onToggle}>
                            ×
                        </button>
                    </div>
                    <div className="chat-body">
                        {messages.length === 0 ? (
                            <div className="chat-welcome">
                                <h3>What are you working through?</h3>
                                <p>
                                    Ask a question or choose a starting point.
                                </p>
                                <div className="suggestions">
                                    {[
                                        "Explain something simply",
                                        "Help me study",
                                        "Summarize a topic",
                                    ].map((prompt) => (
                                        <button
                                            key={prompt}
                                            onClick={() => onSend(null, prompt)}
                                        >
                                            {prompt}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            messages.map((message, index) => (
                                <div
                                    key={index}
                                    className={`chat-message ${message.role}`}
                                >
                                    {message.text}
                                </div>
                            ))
                        )}
                        {busy && (
                            <div className="typing">
                                <i />
                                <i />
                                <i />
                            </div>
                        )}
                        <div ref={endRef} />
                    </div>
                    <form className="chat-compose" onSubmit={onSend}>
                        <input
                            value={input}
                            onChange={(event) => setInput(event.target.value)}
                            placeholder="Ask your study companion..."
                            aria-label="Message study companion"
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
                </aside>
            )}
        </>
    );
}
