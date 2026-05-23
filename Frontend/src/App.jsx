import { useRef, useState } from "react";
import Chart from "./Chart";
import CreateSessionModal from "./CreateSessionModal";
import Flashcards from "./Flashcards";
import FocusTimer from "./FocusTimer";
import Notes from "./Notes";
import Navation from "./Navation";
import "./App.css";

const navigationItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "notes", label: "Notes" },
    { id: "flashcards", label: "Flashcards" },
    { id: "timer", label: "Focus Timer" },
];

function App() {
    const [activePanel, setActivePanel] = useState("dashboard");
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [isSessionModalOpen, setIsSessionModalOpen] = useState(false);
    const [sessionDraftName, setSessionDraftName] = useState("");
    const notesSectionRef = useRef(null);
    const nextSessionNumber = sessions.length + 1;
    const fallbackSessionName = `New Session ${nextSessionNumber}`;

    const openSessionModal = () => {
        setSessionDraftName("");
        setIsSessionModalOpen(true);
    };

    const closeSessionModal = () => {
        setSessionDraftName("");
        setIsSessionModalOpen(false);
    };

    const createSession = (event) => {
        event?.preventDefault();
        const sessionName = sessionDraftName.trim() || fallbackSessionName;
        const newSession = {
            id: `session-${Date.now()}`,
            name: sessionName,
            time: "Just now",
        };

        setSessions((current) => [newSession, ...current]);
        setActiveSessionId(newSession.id);
        closeSessionModal();
    };

    return (
        <div className="app-shell">
            <div className="app-grid">
                <Navation
                    activeSessionId={activeSessionId}
                    navigationItems={navigationItems}
                    activePanel={activePanel}
                    onCreateSession={openSessionModal}
                    setActivePanel={setActivePanel}
                    setActiveSessionId={setActiveSessionId}
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
                            <button
                                className="btn-ghost"
                                onClick={openSessionModal}
                                type="button"
                            >
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
                                <div className="panel-card px-4! py-10!"></div>
                                <div className="panel-card px-4! py-10!"></div>
                                <div className="panel-card px-4! py-10!"></div>
                                <div className="panel-card px-4! py-10!"></div>
                            </div>
                        </section>

                        <Notes
                            active={activePanel === "notes"}
                            ref={notesSectionRef}
                        />

                        <Flashcards active={activePanel === "flashcards"} />

                        <FocusTimer active={activePanel === "timer"} />

                        {isSessionModalOpen ? (
                            <CreateSessionModal
                                fallbackName={fallbackSessionName}
                                onCancel={closeSessionModal}
                                onChange={setSessionDraftName}
                                onSubmit={createSession}
                                value={sessionDraftName}
                            />
                        ) : null}
                    </div>
                </main>

                <Chart />
            </div>
        </div>
    );
}

export default App;
