import { useState } from "react";

export default function SessionFlashcards({ cards }) {
    const [index, setIndex] = useState(0);
    const [flipped, setFlipped] = useState(false);
    const card = cards[index];
    const moveTo = (nextIndex) => {
        setIndex(nextIndex);
        setFlipped(false);
    };

    return (
        <div className="session-flashcards">
            <div className="session-card-count"></div>
            <button
                className="session-flip-card"
                onClick={() => setFlipped((value) => !value)}
                aria-label={flipped ? "Show question" : "Reveal answer"}
            >
                <span
                    className={`session-flip-inner ${flipped ? "is-flipped" : ""}`}
                >
                    <span className="session-card-face session-card-front">
                        <small>QUESTION</small>
                        <strong>{card.q}</strong>
                    </span>
                    <span className="session-card-face session-card-back">
                        <small>ANSWER</small>
                        <strong>{card.a}</strong>
                    </span>
                </span>
            </button>
            <div className="session-card-controls">
                <button
                    className="outline-button"
                    onClick={() => moveTo(Math.max(0, index - 1))}
                    disabled={index === 0}
                >
                    Previous
                </button>
                <span>
                    {index + 1} of {cards.length}
                </span>
                <button
                    className="primary-button"
                    onClick={() =>
                        moveTo(Math.min(cards.length - 1, index + 1))
                    }
                    disabled={index === cards.length - 1}
                >
                    Next card
                </button>
            </div>
        </div>
    );
}
