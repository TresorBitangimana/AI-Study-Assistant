import { useState } from "react";

export default function FocusTimer({
    mode,
    seconds,
    running,
    onChooseMode,
    customMinutes,
    customSeconds,
    onSetCustom,
    onToggle,
    onReset,
}) {
    const [minutesInput, setMinutesInput] = useState(customMinutes);
    const [secondsInput, setSecondsInput] = useState(customSeconds);
    return (
        <section className="tool-page">
            <div className="tool-header">
                <h1>Focus Timer</h1>
            </div>
            <div className="timer-card glass-surface">
                <div className="timer-modes">
                    {["Focus", "Short break", "Long break", "Custom"].map(
                        (item) => (
                            <button
                                className={mode === item ? "active" : ""}
                                onClick={() => onChooseMode(item)}
                                key={item}
                            >
                                {item}
                            </button>
                        ),
                    )}
                </div>
                {mode === "Custom" && (
                    <form
                        className="custom-timer-settings"
                        onSubmit={(event) => {
                            event.preventDefault();
                            const minutes = Math.min(
                                240,
                                Math.max(0, Number(minutesInput) || 0),
                            );
                            const remainingSeconds = Math.min(
                                59,
                                Math.max(0, Number(secondsInput) || 0),
                            );
                            if (minutes * 60 + remainingSeconds > 0) {
                                setMinutesInput(minutes);
                                setSecondsInput(remainingSeconds);
                                onSetCustom(minutes, remainingSeconds);
                            }
                        }}
                    >
                        <label>
                            <span>Minutes</span>
                            <input
                                name="minutes"
                                type="number"
                                min="0"
                                max="240"
                                value={minutesInput}
                                onChange={(event) =>
                                    setMinutesInput(event.target.value)
                                }
                            />
                        </label>
                        <span className="custom-timer-colon">:</span>
                        <label>
                            <span>Seconds</span>
                            <input
                                name="seconds"
                                type="number"
                                min="0"
                                max="59"
                                value={secondsInput}
                                onChange={(event) =>
                                    setSecondsInput(event.target.value)
                                }
                            />
                        </label>
                        <button type="submit" className="outline-button">
                            Set timer
                        </button>
                    </form>
                )}
                <div className="timer-ring">
                    <div>
                        <span>
                            {String(Math.floor(seconds / 60)).padStart(2, "0")}:
                            {String(seconds % 60).padStart(2, "0")}
                        </span>
                        <small>{mode.toUpperCase()} TIME</small>
                    </div>
                </div>
                <div className="timer-actions">
                    <button className="primary-button" onClick={onToggle}>
                        {running
                            ? "Pause"
                            : seconds === 0
                              ? "Start again"
                              : mode === "Custom"
                                ? "Start custom timer"
                                : "Start focus"}
                    </button>
                    <button className="outline-button" onClick={onReset}>
                        Reset
                    </button>
                </div>
            </div>
        </section>
    );
}
