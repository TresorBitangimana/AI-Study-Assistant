import { useRef, useState } from "react";
import Chart from "./Chart";
import CreateSessionModal from "./CreateSessionModal";
import Dashboard from "./Dashboard";
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
const normalizeSessionName = (value) => value.trim().toLowerCase();

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

        const newSession = {
            id: `session-${Date.now()}`,
            name: sessionName,
        };

        setSessions((current) => [newSession, ...current]);
        setActiveSessionId(newSession.id);
        setActivePanel("dashboard");
        setActiveTab("Overview");
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

    const removeUploadedDocument = (documentId) => {
        setUploadedDocuments((current) =>
            current.filter((document) => document.id !== documentId),
        );
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

                    <div className="content-scroll">
                        <Dashboard
                            active={activePanel === "dashboard"}
                            activeSession={activeSession}
                            activeTab={activeTab}
                            dashboardTabs={dashboardTabs}
                            handleDocumentUpload={handleDocumentUpload}
                            removeUploadedDocument={removeUploadedDocument}
                            setActiveTab={setActiveTab}
                            uploadedDocuments={uploadedDocuments}
                        />

                        <Notes
                            active={activePanel === "notes"}
                            ref={notesSectionRef}
                        />

                        <Flashcards active={activePanel === "flashcards"} />

                        <FocusTimer active={activePanel === "timer"} />

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
                                type={sessionType === ""}
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
