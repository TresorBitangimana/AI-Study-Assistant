import { useState } from "react";
import Icon from "../components/Icon";
import SessionFlashcards from "./SessionFlashcards";
import SessionChat from "./SessionChat";

function SessionView({
    session,
    onBack,
    chatMessages,
    chatBusy,
    chatInput,
    setChatInput,
    onSendChat,
}) {
    const [showAnswer, setShowAnswer] = useState({});
    if (!session)
        return (
            <div className="empty-tool glass-surface">
                <Icon name="Book" />
                <h2>No session selected</h2>
                <p>Choose a session from your sidebar or create a new one.</p>
                <button className="outline-button" onClick={onBack}>
                    Back to dashboard
                </button>
            </div>
        );
    const content =
        session.result || "Your generated study material will appear here.";
    const flashcards = content
        .split(/\n\s*\n/)
        .map((block) => ({
            q: block.match(/Q:\s*(.*)/)?.[1],
            a: block.match(/A:\s*([\s\S]*)/)?.[1]?.trim(),
        }))
        .filter((card) => card.q && card.a);
    const quiz = content
        .split(/\n\s*\n/)
        .map((block) => ({
            q: block.match(/Q:\s*(.*)/)?.[1],
            options: [...block.matchAll(/[A-D]\)\s*(.*)/g)].map(
                (match) => match[1],
            ),
            answer: block.match(/Answer:\s*([A-D])/i)?.[1],
        }))
        .filter((item) => item.q);
    return (
        <section className="session-page">
            <button className="back-link" onClick={onBack}>
                Dashboard
            </button>
            <div className="session-title-row">
                <div>
                    <h1>{session.name}</h1>
                </div>
            </div>
            <div className="session-layout">
                {session.type === "Chat with AI" ? (
                    <SessionChat
                        session={session}
                        messages={chatMessages}
                        busy={chatBusy}
                        input={chatInput}
                        setInput={setChatInput}
                        onSend={onSendChat}
                    />
                ) : (
                    <div className="generated-content glass-surface">
                        <div className="generated-head">
                            <div>
                                <h2>
                                    {session.type === "Create Flashcards"
                                        ? "Flashcards"
                                        : session.type === "Generate Quiz"
                                          ? "Practice quiz"
                                          : "A simpler explanation"}
                                </h2>
                            </div>
                        </div>
                        {session.type === "Create Flashcards" &&
                        flashcards.length ? (
                            <SessionFlashcards cards={flashcards} />
                        ) : session.type === "Generate Quiz" && quiz.length ? (
                            <div className="generated-list">
                                {quiz.map((item, i) => (
                                    <article
                                        className="generated-item quiz-item"
                                        key={i}
                                    >
                                        <b>
                                            {i + 1}. {item.q}
                                        </b>
                                        {item.options.map((option, j) => (
                                            <span key={j}>
                                                {String.fromCharCode(65 + j)}. {" "}
                                                {option}
                                            </span>
                                        ))}
                                        <button
                                            className="text-link"
                                            onClick={() =>
                                                setShowAnswer({
                                                    ...showAnswer,
                                                    [i]: !showAnswer[i],
                                                })
                                            }
                                        >
                                            {showAnswer[i]
                                                ? `Answer: ${item.answer || "See source"}`
                                                : "Reveal answer"}
                                        </button>
                                    </article>
                                ))}
                            </div>
                        ) : (
                            <div className="response-text">{content}</div>
                        )}
                    </div>
                )}
                <aside className="source-card glass-surface">
                    <h3>Materials in this session</h3>
                    {(session.files || []).map((file) => (
                        <div className="source-file" key={file.name}>
                            <span className="source-pdf">PDF</span>
                            <span>
                                <b>{file.name}</b>
                                <small>
                                    {(Number(file.size) / 1024).toFixed(0)} KB
                                </small>
                            </span>
                        </div>
                    ))}

                    {session.type !== "Chat with AI" && (
                        <button
                            className="outline-button source-chat"
                            onClick={() =>
                                window.dispatchEvent(
                                    new CustomEvent("open-study-chat"),
                                )
                            }
                        >
                            Ask a follow-up
                        </button>
                    )}
                </aside>
            </div>
        </section>
    );
}

export default SessionView;
