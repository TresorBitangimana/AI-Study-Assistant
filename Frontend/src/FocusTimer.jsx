import { useEffect, useMemo, useState } from "react";

const TIMER_MODES = [
    { id: "timer", label: "Timer", minutes: 25, tone: "focus" },
    { id: "shortBreak", label: "Short Break", minutes: 5, tone: "break" },
    { id: "longBreak", label: "Long Break", minutes: 15, tone: "break" },
    { id: "custom", label: "Custom", minutes: 45, tone: "focus" },
];

const TIMER_CYCLE_TARGET = 4;

function getDurationSeconds(mode, customMinutes) {
    const modeConfig =
        TIMER_MODES.find((item) => item.id === mode) ?? TIMER_MODES[0];

    if (mode === "custom") {
        return Math.max(1, customMinutes) * 60;
    }

    return modeConfig.minutes * 60;
}

function formatTime(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function FocusTimer({ active }) {
    const [mode, setMode] = useState("timer");
    const [isRunning, setIsRunning] = useState(false);
    const [completedTimerCycles, setCompletedTimerCycles] = useState(0);
    const [customMinutes, setCustomMinutes] = useState(45);
    const [timeLeft, setTimeLeft] = useState(() =>
        getDurationSeconds("timer", 45),
    );
    const modeConfig = useMemo(
        () => TIMER_MODES.find((item) => item.id === mode) ?? TIMER_MODES[0],
        [mode],
    );
    const durationSeconds = getDurationSeconds(mode, customMinutes);

    useEffect(() => {
        if (!isRunning) {
            return undefined;
        }

        const timerId = window.setInterval(() => {
            setTimeLeft((current) => {
                if (current <= 1) {
                    window.clearInterval(timerId);
                    setIsRunning(false);

                    if (mode === "timer") {
                        const nextCompleted = Math.min(
                            completedTimerCycles + 1,
                            TIMER_CYCLE_TARGET,
                        );
                        setCompletedTimerCycles(nextCompleted);
                        const nextMode =
                            nextCompleted === TIMER_CYCLE_TARGET
                                ? "longBreak"
                                : "shortBreak";
                        setMode(nextMode);
                        setTimeLeft(
                            getDurationSeconds(nextMode, customMinutes),
                        );
                    } else if (mode === "longBreak") {
                        setCompletedTimerCycles(0);
                        setMode("timer");
                        setTimeLeft(getDurationSeconds("timer", customMinutes));
                    } else {
                        setMode("timer");
                        setTimeLeft(getDurationSeconds("timer", customMinutes));
                    }

                    return 0;
                }

                return current - 1;
            });
        }, 1000);

        return () => window.clearInterval(timerId);
    }, [completedTimerCycles, customMinutes, isRunning, mode]);

    const cycleDots = Array.from({ length: TIMER_CYCLE_TARGET }, (_, index) => (
        <div
            className={`timer-dot ${
                index < completedTimerCycles ? "timer-dot-filled" : ""
            }`}
            key={index}
        />
    ));

    const handleModeChange = (nextMode) => {
        setIsRunning(false);
        setMode(nextMode);
        setTimeLeft(getDurationSeconds(nextMode, customMinutes));
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(durationSeconds);
    };

    const handleSkip = () => {
        setIsRunning(false);

        if (mode === "timer") {
            const nextCompleted = Math.min(
                completedTimerCycles + 1,
                TIMER_CYCLE_TARGET,
            );
            setCompletedTimerCycles(nextCompleted);
            const nextMode =
                nextCompleted === TIMER_CYCLE_TARGET
                    ? "longBreak"
                    : "shortBreak";
            setMode(nextMode);
            setTimeLeft(getDurationSeconds(nextMode, customMinutes));
            return;
        }

        if (mode === "longBreak") {
            setCompletedTimerCycles(0);
        }

        setMode("timer");
        setTimeLeft(getDurationSeconds("timer", customMinutes));
    };

    const timerToneClass =
        modeConfig.tone === "break"
            ? "timer-display-break"
            : "timer-display-focus";

    return (
        <section className={active ? "block" : "hidden"}>
            <div className="timer-shell">
                <div className="timer-main-card">
                    <div className="timer-mode-group">
                        {TIMER_MODES.map((item) => (
                            <button
                                className={`timer-mode-button ${
                                    mode === item.id
                                        ? "timer-mode-button-active"
                                        : ""
                                }`}
                                key={item.id}
                                onClick={() => handleModeChange(item.id)}
                                type="button"
                            >
                                {item.label}
                            </button>
                        ))}
                    </div>

                    <div className={`timer-display ${timerToneClass}`}>
                        {formatTime(timeLeft)}
                    </div>

                    <div className="flex gap-2">{cycleDots}</div>

                    <div className="flex items-center gap-3">
                        <button
                            className="timer-icon-button"
                            onClick={handleReset}
                            type="button"
                        >
                            ↺
                        </button>
                        <button
                            className="timer-play-button"
                            onClick={() => setIsRunning((current) => !current)}
                            type="button"
                        >
                            {isRunning ? "❚❚" : "▶"}
                        </button>
                        <button
                            className="timer-icon-button"
                            onClick={handleSkip}
                            type="button"
                        >
                            ⏭
                        </button>
                    </div>

                    {mode === "custom" ? (
                        <div className="timer-config-row">
                            <input
                                className="field-input-compact"
                                min="1"
                                onChange={(event) => {
                                    const nextMinutes = Math.max(
                                        1,
                                        Number(event.target.value) || 1,
                                    );
                                    setIsRunning(false);
                                    setCustomMinutes(nextMinutes);
                                    setTimeLeft(
                                        getDurationSeconds(
                                            "custom",
                                            nextMinutes,
                                        ),
                                    );
                                }}
                                type="number"
                                value={customMinutes}
                            />
                        </div>
                    ) : null}
                </div>
            </div>
        </section>
    );
}

export default FocusTimer;
