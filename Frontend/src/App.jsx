import { useEffect, useRef, useState } from "react";
import Chart from "./Chart";
import CreateSessionModal from "./CreateSessionModal";
import Dashboard from "./Dashboard";
import Flashcards from "./Flashcards";
import FocusTimer from "./FocusTimer";
import Notes from "./Notes";
import Navation from "./Navation";
import Sessions from "./Sessions";
import User from "./User";
import "./App.css";

const navigationItems = [
    { id: "dashboard", label: "Dashboard" },
    { id: "notes", label: "Notes" },
    { id: "flashcards", label: "Flashcards" },
    { id: "timer", label: "Focus Timer" },
];

const sessionTypeOptions = [
    { id: "flashcards", label: "Create Flashcards" },
    { id: "quiz", label: "Generate Quiz" },
    { id: "chat", label: "Chat with AI" },
    { id: "explain", label: "Explain like I'm 5" },
];

const normalizeSessionName = (value) => value.trim().toLowerCase();
const THEME_STORAGE_KEY = "study-ai-theme";
const CURRENT_USER_STORAGE_KEY = "study-ai-current-user";
const GUEST_NOTES_STORAGE_KEY = "study-ai-guest-notes";
const GUEST_SESSIONS_STORAGE_KEY = "study-ai-guest-sessions";
const GUEST_ACTIVE_SESSION_ID_STORAGE_KEY =
    "study-ai-guest-active-session-id";

function createSessionId() {
    if (typeof crypto !== "undefined" && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `session-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function readStoredGuestSessions() {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const value = window.localStorage.getItem(GUEST_SESSIONS_STORAGE_KEY);
        return value ? JSON.parse(value) : [];
    } catch {
        return [];
    }
}

function readStoredGuestActiveSessionId() {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        return (
            window.localStorage.getItem(
                GUEST_ACTIVE_SESSION_ID_STORAGE_KEY,
            ) ?? null
        );
    } catch {
        return null;
    }
}

function clearGuestSessionStorage() {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(GUEST_SESSIONS_STORAGE_KEY);
    window.localStorage.removeItem(GUEST_ACTIVE_SESSION_ID_STORAGE_KEY);
}

function App() {
    const notesSectionRef = useRef(null);
    const [notesResetKey, setNotesResetKey] = useState(0);
    const [theme, setTheme] = useState(() => {
        if (typeof window === "undefined") {
            return "light";
        }

        return window.localStorage.getItem(THEME_STORAGE_KEY) ?? "light";
    });
    const [activePanel, setActivePanel] = useState("dashboard");
    const [sessions, setSessions] = useState(() => readStoredGuestSessions());
    const [activeSessionId, setActiveSessionId] = useState(() =>
        readStoredGuestActiveSessionId(),
    );
    const [uploadedDocuments, setUploadedDocuments] = useState([]);
    const [pendingSessionName, setPendingSessionName] = useState("");
    const [sessionModalMode, setSessionModalMode] = useState(null);
    const [editingSessionId, setEditingSessionId] = useState(null);
    const [sessionDraftName, setSessionDraftName] = useState("");
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(() => {
        if (typeof window === "undefined") {
            return null;
        }

        try {
            const value = window.localStorage.getItem(CURRENT_USER_STORAGE_KEY);
            return value ? JSON.parse(value) : null;
        } catch {
            return null;
        }
    });

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

    const handleLogout = () => {
        setCurrentUser(null);
        setSessions([]);
        setActiveSessionId(null);
        setUploadedDocuments([]);
        setPendingSessionName("");
        setSessionModalMode(null);
        setEditingSessionId(null);
        setSessionDraftName("");
        setIsUserModalOpen(false);
        setActivePanel("dashboard");
        setNotesResetKey((current) => current + 1);
        window.localStorage.removeItem(GUEST_NOTES_STORAGE_KEY);
        clearGuestSessionStorage();
    };

    const headerTitle =
        activePanel === "session" && activeSession
            ? activeSession.name
            : (navigationItems.find((item) => item.id === activePanel)?.label ??
              "Dashboard");

    useEffect(() => {
        window.localStorage.setItem(THEME_STORAGE_KEY, theme);
    }, [theme]);

    useEffect(() => {
        if (currentUser) {
            clearGuestSessionStorage();
            return;
        }

        window.localStorage.setItem(
            GUEST_SESSIONS_STORAGE_KEY,
            JSON.stringify(sessions),
        );
        if (activeSessionId) {
            window.localStorage.setItem(
                GUEST_ACTIVE_SESSION_ID_STORAGE_KEY,
                activeSessionId,
            );
        } else {
            window.localStorage.removeItem(
                GUEST_ACTIVE_SESSION_ID_STORAGE_KEY,
            );
        }
    }, [activeSessionId, currentUser, sessions]);

    useEffect(() => {
        if (currentUser) {
            window.localStorage.setItem(
                CURRENT_USER_STORAGE_KEY,
                JSON.stringify(currentUser),
            );
            return;
        }

        window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }, [currentUser]);

    return (
        <div className={`app-shell ${theme === "dark" ? "theme-dark" : ""}`}>
            <div className="app-grid">
                <Navation
                    currentUser={currentUser}
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
                    theme={theme}
                    onToggleTheme={() =>
                        setTheme((current) =>
                            current === "light" ? "dark" : "light",
                        )
                    }
                    onLogout={handleLogout}
                />

                <main className="app-main">
                    <div className="app-header">
                        <div className="app-title">{headerTitle}</div>
                        <div className="flex flex-wrap items-center gap-2.5">
                            {!currentUser ? (
                                <button
                                    className="btn-ghost"
                                    onClick={() => setIsUserModalOpen(true)}
                                    type="button"
                                >
                                    Log In / Sign Up
                                </button>
                            ) : null}
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
                            currentUser={currentUser}
                            onCancelPendingSession={() => {
                                setPendingSessionName("");
                                setUploadedDocuments([]);
                                setActivePanel("dashboard");
                            }}
                            handleDocumentUpload={handleDocumentUpload}
                            onOpenUserModal={() => setIsUserModalOpen(true)}
                            onCreateSession={openSessionModal}
                            onSelectSessionType={createSessionFromType}
                            pendingSessionName={pendingSessionName}
                            removeUploadedDocument={removeUploadedDocument}
                            sessionTypeOptions={sessionTypeOptions}
                            uploadedDocuments={uploadedDocuments}
                        />

                        <Notes
                            key={notesResetKey}
                            active={activePanel === "notes"}
                            currentUser={currentUser}
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

                        {isUserModalOpen ? (
                            <User
                                currentUser={currentUser}
                                onAuthChange={setCurrentUser}
                                onClose={() => setIsUserModalOpen(false)}
                                onLogout={handleLogout}
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
