import { useRef, useState } from "react";
import Chart from "./Chart";
import Flashcards from "./Flashcards";
import FocusTimer from "./FocusTimer";
import Notes from "./Notes";
import Navation from "./Navation";
import "./App.css";

const navigationItems = [
    { id: "dashboard", label: "Dashboard", badge: "3" },
    { id: "notes", label: "Notes" },
    { id: "flashcards", label: "Flashcards" },
    { id: "timer", label: "Focus Timer" },
];

const sessions = [
    { name: "Calculus II", time: "Today" },
    { name: "Organic Chemistry", time: "Mon" },
    { name: "Data Structures", time: "Sun" },
    { name: "World History", time: "Fri" },
    { name: "Linear Algebra", time: "Thu" },
];

const stats = [
    {
        label: "Study Hours",
        value: "47.5",
        suffix: "h",
        sub: "↑ +8.2h this week",
        tone: "text-green",
    },
    {
        label: "Sessions",
        value: "23",
        sub: "↑ +4 this week",
        tone: "text-green",
    },
    {
        label: "Cards Reviewed",
        value: "312",
        sub: "↑ 84% accuracy",
        tone: "text-amber",
    },
    {
        label: "Streak",
        value: "14",
        suffix: "d",
        sub: "Keep it up!",
        tone: "text-green",
    },
];

function App() {
    const [activePanel, setActivePanel] = useState("dashboard");
    const notesSectionRef = useRef(null);

    return (
        <div className="app-shell">
            <div className="app-grid">
                <Navation
                    navigationItems={navigationItems}
                    activePanel={activePanel}
                    setActivePanel={setActivePanel}
                    sessions={sessions}
                />

                <main className="app-main">
                    <div className="app-header">
                        <div className="app-title">
                            {
                                navigationItems.find(
                                    (item) => item.id === activePanel,
                                )?.label
                            }
                        </div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            <button className="btn-ghost" type="button">
                                New Session
                            </button>
                            <button
                                className="btn-primary"
                                onClick={() => {
                                    setActivePanel("notes");
                                    notesSectionRef.current?.createNote();
                                }}
                                type="button"
                            >
                                Add Note
                            </button>
                        </div>
                    </div>

                    <div className="tabs-row">
                        <div className="tab-button tab-button-active">
                            Overview
                        </div>
                        <div className="tab-button">Progress</div>
                        <div className="tab-button">Resources</div>
                    </div>

                    <div className="content-scroll">
                        <section
                            className={
                                activePanel === "dashboard" ? "block" : "hidden"
                            }
                        >
                            <div className="mb-6 grid grid-cols-1 gap-3.5 md:grid-cols-2 2xl:grid-cols-4">
                                {stats.map((stat) => (
                                    <div
                                        className="panel-card !px-4 !py-4"
                                        key={stat.label}
                                    >
                                        <div className="metric-label">
                                            {stat.label}
                                        </div>
                                        <div className="metric-value">
                                            {stat.value}
                                            {stat.suffix ? (
                                                <span className="ml-0.5 text-lg text-[var(--text-faint)]">
                                                    {stat.suffix}
                                                </span>
                                            ) : null}
                                        </div>
                                        <div
                                            className={`text-[11px] ${stat.tone}`}
                                        >
                                            {stat.sub}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>

                        <Notes
                            active={activePanel === "notes"}
                            ref={notesSectionRef}
                        />

                        <Flashcards active={activePanel === "flashcards"} />

                        <FocusTimer active={activePanel === "timer"} />
                    </div>
                </main>

                <Chart />
            </div>
        </div>
    );
}

export default App;
