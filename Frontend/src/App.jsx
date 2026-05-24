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

const dashboardTabs = ["Overview", "Progress", "Resources"];

function App() {
    const [activePanel, setActivePanel] = useState("dashboard");
    const [activeTab, setActiveTab] = useState("Overview");
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [sessionModalMode, setSessionModalMode] = useState(null);
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [sessionDraftName, setSessionDraftName] = useState("");
    const notesSectionRef = useRef(null);
    const nextSessionNumber = sessions.length + 1;
    const fallbackSessionName = `New Session ${nextSessionNumber}`;
    const editingSession = sessions.find(
        (session) => session.id === editingSessionId,
    );
    const isSessionModalOpen = sessionModalMode !== null;
    const activeSession =
        sessions.find((session) => session.id === activeSessionId) ?? null;

    const openSessionModal = () => {
        setSessionDraftName("");
        setEditingSessionId(null);
        setSessionModalMode("create");
    };

    const openRenameSessionModal = (sessionId) => {
        const session = sessions.find((item) => item.id === sessionId);
        if (!session) {
            return;
        }

        setSessionDraftName(session.name);
        setEditingSessionId(sessionId);
        setSessionModalMode("rename");
    };

    const closeSessionModal = () => {
        setSessionDraftName("");
        setEditingSessionId(null);
        setSessionModalMode(null);
    };

    const saveSession = (event) => {
        event?.preventDefault();
        const sessionName =
            sessionDraftName.trim() ||
            (sessionModalMode === "rename" && editingSession
                ? editingSession.name
                : fallbackSessionName);

        if (sessionModalMode === "rename" && editingSessionId) {
            setSessions((current) =>
                current.map((session) =>
                    session.id === editingSessionId
                        ? { ...session, name: sessionName }
                        : session,
                ),
            );
            closeSessionModal();
            return;
        }

        const newSession = {
            id: `session-${Date.now()}`,
            name: sessionName,
            time: "Just now",
        };

        setSessions((current) => [newSession, ...current]);
        setActiveSessionId(newSession.id);
        closeSessionModal();
    };

    const deleteSession = (sessionId) => {
        setSessions((current) => {
            const remaining = current.filter(
                (session) => session.id !== sessionId,
            );
            if (activeSessionId === sessionId) {
                setActiveSessionId(remaining[0]?.id ?? null);
            }
            return remaining;
        });
    };

    const handleDocumentUpload = (event) => {
        const files = Array.from(event.target.files ?? []);
        setUploadedDocuments((current) => [
            ...current,
            ...files.map((file) => ({
                id: `${file.name}-${file.lastModified}`,
                name: file.name,
                size: `${(file.size / 1024).toFixed(1)} KB`,
                type: file.type === "application/pdf" ? "PDF" : "Text Document",
            })),
        ]);
        event.target.value = "";
    };

    return (
        <div className="app-shell">
            <div className="app-grid">
                <Navation
                    activeSessionId={activeSessionId}
                    navigationItems={navigationItems}
                    activePanel={activePanel}
                    onCreateSession={openSessionModal}
                    onDeleteSession={deleteSession}
                    onRenameSession={openRenameSessionModal}
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

                    {activePanel === "dashboard" ? (
                        <div className="tabs-row">
                            <div className="tabs-group">
                                {activeSession ? (
                                    <div className="tab-button tab-session-indicator">
                                        {activeSession.name}
                                    </div>
                                ) : null}
                                {dashboardTabs.map((tab) => (
                                    <button
                                        key={tab}
                                        className={`tab-button ${
                                            activeTab === tab
                                                ? "tab-button-active"
                                                : ""
                                        }`}
                                        onClick={() => setActiveTab(tab)}
                                        type="button"
                                    >
                                        {tab}
                                    </button>
                                ))}
                            </div>
                        </div>
                    ) : null}

                    <div className="content-scroll">
                        <section
                            className={
                                activePanel === "dashboard" ? "block" : "hidden"
                            }
                        >
                            {activeTab === "Overview" ? (
                                <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 2xl:grid-cols-4">
                                    {/* add file option  */}
                                    <div className="panel-card-file-upload lg:col-span-2">
                                        <div className="dashboard-card-label">
                                            Document Uploads
                                        </div>
                                        <div className="dashboard-card-value">
                                            Study Materials
                                        </div>
                                        <div className="document-upload-shell">
                                            <label
                                                className="document-upload-dropzone"
                                                htmlFor="resource-upload"
                                            >
                                                <input
                                                    accept=".txt,.md,.pdf,text/plain,application/pdf"
                                                    className="document-upload-input"
                                                    id="resource-upload"
                                                    multiple
                                                    onChange={
                                                        handleDocumentUpload
                                                    }
                                                    type="file"
                                                />
                                                <div className="document-upload-icon">
                                                    ↑
                                                </div>
                                                <div className="document-upload-title">
                                                    Upload text or PDF files
                                                </div>
                                                <div className="document-upload-copy">
                                                    Drag and drop is optional.
                                                    Click here to choose study
                                                    documents.
                                                </div>
                                            </label>

                                            <div className="document-upload-list">
                                                {uploadedDocuments.length >
                                                0 ? (
                                                    uploadedDocuments.map(
                                                        (document) => (
                                                            <div
                                                                className="document-upload-item"
                                                                key={
                                                                    document.id
                                                                }
                                                            >
                                                                <div>
                                                                    <div className="document-upload-name">
                                                                        {
                                                                            document.name
                                                                        }
                                                                    </div>
                                                                    <div className="document-upload-meta">
                                                                        {
                                                                            document.type
                                                                        }{" "}
                                                                        ·{" "}
                                                                        {
                                                                            document.size
                                                                        }
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        ),
                                                    )
                                                ) : (
                                                    <div className="document-upload-empty">
                                                        No files uploaded yet.
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* User menu options */}
                                    <div className="panel-card">
                                        Create Flashcards
                                    </div>
                                    <div className="panel-card">
                                        Generate Quiz
                                    </div>
                                    <div className="panel-card">
                                        Chat with AI
                                    </div>
                                    <div className="panel-card">
                                        Expain like I'm 5
                                    </div>
                                </div>
                            ) : null}

                            {activeTab === "Progress" ? (
                                <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.4fr_1fr]">
                                    <div className="panel-card">
                                        <div className="dashboard-card-label">
                                            Progress Snapshot
                                        </div>
                                        <div className="dashboard-card-value">
                                            <h1>Hello World!!!</h1>
                                        </div>
                                    </div>
                                    <div className="panel-card">
                                        <div className="dashboard-card-label">
                                            Current Status
                                        </div>
                                    </div>
                                </div>
                            ) : null}

                            {activeTab === "Resources" ? (
                                <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
                                    <div className="panel-card lg:col-span-3 py-15"></div>
                                </div>
                            ) : null}
                        </section>

                        <Notes
                            active={activePanel === "notes"}
                            ref={notesSectionRef}
                        />

                        <Flashcards active={activePanel === "flashcards"} />

                        <FocusTimer active={activePanel === "timer"} />

                        {isSessionModalOpen ? (
                            <CreateSessionModal
                                fallbackName={
                                    sessionModalMode === "rename" &&
                                    editingSession
                                        ? editingSession.name
                                        : fallbackSessionName
                                }
                                onCancel={closeSessionModal}
                                onChange={setSessionDraftName}
                                onSubmit={saveSession}
                                submitLabel={
                                    sessionModalMode === "rename"
                                        ? "Save Changes"
                                        : "Create Session"
                                }
                                subtitle={
                                    sessionModalMode === "rename"
                                        ? "Update the session name without changing the rest of your study setup."
                                        : "Give this session a label so it is easier to organize your work later."
                                }
                                title={
                                    sessionModalMode === "rename"
                                        ? "Rename this study session"
                                        : "Name your study session"
                                }
                                toneLabel={
                                    sessionModalMode === "rename"
                                        ? "Rename Session"
                                        : "New Session"
                                }
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
