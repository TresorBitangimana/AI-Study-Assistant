function Flashcards({ active }) {
    return (
        <section className={active ? "block" : "hidden"}>
            <div className="flex flex-col items-center gap-5">
                <div className="w-full max-w-145 perspective-distant">
                    <div className="relative h-65 w-full">
                        <div className="flashcard-face flashcard-front">
                            <div className="flashcard-label">Question</div>
                            <div className="flashcard-text">
                                What is the formula for Integration by Parts?
                            </div>
                            <div className="flashcard-hint">
                                Click to reveal answer
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-4">
                    <button className="btn-compact" type="button">
                        ← Prev
                    </button>
                    <span className="min-w-15 text-center font-['IBM_Plex_Mono'] text-[13px] text-[--text-faint]">
                        1 / 3
                    </span>
                    <button className="btn-compact" type="button">
                        Next →
                    </button>
                </div>

                <div className="flex flex-wrap gap-2.5">
                    <button
                        className="rating-button rating-button-hard"
                        type="button"
                    >
                        Hard
                    </button>
                    <button
                        className="rating-button rating-button-warn"
                        type="button"
                    >
                        Got it
                    </button>
                    <button
                        className="rating-button rating-button-success"
                        type="button"
                    >
                        Easy
                    </button>
                </div>
            </div>
        </section>
    );
}

export default Flashcards;
