import { useRef, useState } from "react";
import Chart from "./Chart";
import CreateSessionModal from "./CreateSessionModal";
import Dashboard from "./Dashboard";
import Flashcards from "./Flashcards";
import FocusTimer from "./FocusTimer";
import Notes from "./Notes";
import Navation from "./Navation";
import Sessions from "./Sessions";
import "./App.css";

const navigationItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "notes", label: "Notes" },
    { id: "flashcards", label: "Flashcards" },
    { id: "timer", label: "Focus Timer" },
];

const dashboardTabs = ["Overview", "Progress", "Resources"];
const sessionTypeOptions = [
    { id: "flashcards", label: "Create Flashcards" },
    { id: "quiz", label: "Generate Quiz" },
    { id: "chat", label: "Chat with AI" },
    { id: "explain", label: "Explain like I'm 5" },
];

const normalizeSessionName = (value) => value.trim().toLowerCase();

function createSessionId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function App() {
    const notesSectionRef = useRef(null);
    const [activePanel, setActivePanel] = useState("dashboard");
    const [activeTab, setActiveTab] = useState("Overview");
    const [sessions, setSessions] = useState([]);
    const [activeSessionId, setActiveSessionId] = useState(null);
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [pendingSessionName, setPendingSessionName] = useState("");
    const [sessionModalMode, setSessionModalMode] = useState(null);
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [sessionDraftName, setSessionDraftName] = useState("");

    const nextSessionNumber = sessions.length + 1;
    const fallbackSessionName = `New Session ${nextSessionNumber}`;
    const editingSession = sessions.find(
        (session) => session.id === editingSessionId,
    );
    const isSessionModalOpen = sessionModalMode !== null;
    const activeSession =
        sessions.find((session) => session.id === activeSessionId) ?? null;
    const proposedSessionName =
        sessionDraftName.trim() ||
        (sessionModalMode === "rename" && editingSession
            ? editingSession.name
            : fallbackSessionName);
    const hasDuplicateSessionName = sessions.some((session) => {
        if (session.id === editingSessionId) {
            return false;
        }

        return (
            normalizeSessionName(session.name) ===
            normalizeSessionName(proposedSessionName)
        );
    });

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
        const sessionName = proposedSessionName;

        if (hasDuplicateSessionName) {
            return;
        }

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

        setPendingSessionName(sessionName);
        setActivePanel("dashboard");
        setActiveTab("Overview");
        closeSessionModal();
    };

    const createSessionFromType = (sessionType) => {
        if (!pendingSessionName) {
            return;
        }

        const newSession = {
            id: createSessionId(),
            name: pendingSessionName,
            type: sessionType.label,
            time: "Just now",
        };

        setSessions((current) => [newSession, ...current]);
        setActiveSessionId(newSession.id);
        setActivePanel("session");
        setPendingSessionName("");
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

    const removeUploadedDocument = (documentId) => {
        setUploadedDocuments((current) =>
            current.filter((document) => document.id !== documentId),
        );
    };

    const headerTitle =
        activePanel === "session" && activeSession
            ? activeSession.name
            : navigationItems.find((item) => item.id === activePanel)?.label ??
              "Dashboard";

    return (
        <div className="app-shell">
            <div className="app-grid">
                <Navation
                    activePanel={activePanel}
                    activeSessionId={activeSessionId}
                    navigationItems={navigationItems}
                    onCreateSession={openSessionModal}
                    onDeleteSession={deleteSession}
                    onRenameSession={openRenameSessionModal}
                    onSelectSession={(sessionId) => {
                        setActiveSessionId(sessionId);
                        setActivePanel("session");
                    }}
                    setActivePanel={setActivePanel}
                    sessions={sessions}
                />

                <main className="app-main">
                    <div className="app-header">
                        <div className="app-title">{headerTitle}</div>
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

                    <div className="content-scroll">
                        <Dashboard
                            active={activePanel === "dashboard"}
                            activeSession={activeSession}
                            activeTab={activeTab}
                            onCancelPendingSession={() => {
                                setPendingSessionName("");
                                setUploadedDocuments([]);
                                setActivePanel("dashboard");
                                setActiveTab("Overview");
                            }}
                            dashboardTabs={dashboardTabs}
                            handleDocumentUpload={handleDocumentUpload}
                            onCreateSession={openSessionModal}
                            onSelectSessionType={createSessionFromType}
                            pendingSessionName={pendingSessionName}
                            removeUploadedDocument={removeUploadedDocument}
                            sessionTypeOptions={sessionTypeOptions}
                            setActiveTab={setActiveTab}
                            uploadedDocuments={uploadedDocuments}
                        />

                        <Notes
                            active={activePanel === "notes"}
                            ref={notesSectionRef}
                        />

                        <Flashcards active={activePanel === "flashcards"} />

                        <FocusTimer active={activePanel === "timer"} />

                        <Sessions
                            active={activePanel === "session"}
                            session={activeSession}
                        />

                        {isSessionModalOpen ? (
                            <CreateSessionModal
                                errorMessage={
                                    hasDuplicateSessionName
                                        ? "A session with this name already exists."
                                        : ""
                                }
                                fallbackName={
                                    sessionModalMode === "rename" &&
                                    editingSession
                                        ? editingSession.name
                                        : fallbackSessionName
                                }
                                onCancel={closeSessionModal}
                                onChange={setSessionDraftName}
                                onSubmit={saveSession}
                                submitDisabled={hasDuplicateSessionName}
                                submitLabel={
                                    sessionModalMode === "rename"
                                        ? "Save Changes"
                                        : "Continue"
                                }
                                subtitle={
                                    sessionModalMode === "rename"
                                        ? "Update the session name without changing the rest of your study setup."
                                        : "Name the session first, then choose the study workflow from the dashboard."
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
