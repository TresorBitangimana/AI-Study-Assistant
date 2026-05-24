import { useState } from "react";

function Flashcards({ active }) {
    const [isFlipped, setIsFlipped] = useState(false);

    return (
        <section className={active ? "block" : "hidden"}>
            <div className="flex flex-col items-center gap-7">
                <div className="flashcard-shell">
                    <button
                        className={`flashcard-stage ${isFlipped ? "flashcard-stage-flipped" : ""}`}
                        onClick={() => setIsFlipped((current) => !current)}
                        type="button"
                    >
                        <div className="flashcard-inner">
                            <div className="flashcard-face flashcard-front">
                                <div className="flashcard-content">
                                    <div className="flashcard-text">
                                        What is the formula for Integration by
                                        Parts?
                                    </div>
                                    <div className="flashcard-hint">
                                        Click to reveal answer
                                    </div>
                                </div>
                            </div>

                            <div className="flashcard-face flashcard-back">
                                <div className="flashcard-content">
                                    <div className="flashcard-label flashcard-label-answer">
                                        Answer
                                    </div>
                                    <div className="flashcard-text flashcard-text-answer">
                                        ∫u dv = uv - ∫v du
                                    </div>
                                </div>
                            </div>
                        </div>
                    </button>
                </div>

                <div className="flashcard-controls">
                    <button className="flashcard-control-button" type="button">
                        ← Prev
                    </button>
                    <span className="flashcard-progress">1 / 3</span>
                    <button className="flashcard-control-button" type="button">
                        Next →
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Flashcards;
