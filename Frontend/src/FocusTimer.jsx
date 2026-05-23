function FocusTimer({ active }) {
    return (
        <section className={active ? "block" : "hidden"}>
            <div className="timer-shell">
                <div className="timer-main-card">
                    <div className="timer-mode-group">
                        <div className="timer-mode-button timer-mode-button-active">
                            Pomodoro
                        </div>
                        <div className="timer-mode-button">Short Break</div>
                        <div className="timer-mode-button">Long Break</div>
                        <div className="timer-mode-button">Custom</div>
                    </div>

                    <div className="timer-display timer-display-focus">
                        25:00
                    </div>

                    <div className="flex gap-2">
                        <div className="timer-dot timer-dot-filled" />
                        <div className="timer-dot timer-dot-filled" />
                        <div className="timer-dot" />
                        <div className="timer-dot" />
                    </div>

                    <div className="flex items-center gap-3">
                        <button className="timer-icon-button" type="button">
                            ↺
                        </button>
                        <button className="timer-play-button" type="button">
                            ▶
                        </button>
                        <button className="timer-icon-button" type="button">
                            ⏭
                        </button>
                    </div>

                    <select
                        className="field-input-compact"
                        defaultValue="Calculus II"
                    >
                        <option>Calculus II</option>
                        <option>Organic Chemistry</option>
                        <option>Data Structures</option>
                        <option>World History</option>
                    </select>
                </div>
            </div>
        </section>
    );
}

export default FocusTimer;
