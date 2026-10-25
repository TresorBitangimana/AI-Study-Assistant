import { useEffect, useMemo, useRef, useState } from "react";
import "./App.css";
import AssistantChat from "./components/AssistantChat";
import AuthModal from "./components/AuthModal";
import CreateSessionPage from "./components/CreateSessionPage";
import Dashboard from "./components/Dashboard";
import FocusTimer from "./components/FocusTimer";
import Sidebar from "./components/Sidebar";
import Topbar from "./components/Topbar";
import NotesView from "./views/NotesView";
import SessionView from "./views/SessionView";
import readFile from "./utils/readFile";

const API =
    import.meta.env.VITE_API_URL || "http://localhost:8080/api/study_assistant";

const userCacheKey = (username, name) =>
    `study.${encodeURIComponent(username)}.${name}`;

const readUserCache = (username, name, fallback) => {
    try {
        const cached = localStorage.getItem(userCacheKey(username, name));
        return cached ? JSON.parse(cached) : fallback;
    } catch {
        return fallback;
    }
};

const writeUserCache = (username, name, value) => {
    try {
        localStorage.setItem(
            userCacheKey(username, name),
            JSON.stringify(value),
        );
    } catch {
        // Keep the app usable if browser storage is unavailable or full.
    }
};

function App() {
    const [page, setPage] = useState("Dashboard");
    const [sessions, setSessions] = useState([]);
    const [notes, setNotes] = useState([]);
    const notesRef = useRef(notes);
    const [user, setUser] = useState(null);
    const [activeSession, setActiveSession] = useState(null);
    const [activeNote, setActiveNote] = useState(null);
    const [sessionFiles, setSessionFiles] = useState([]);
    const [authOpen, setAuthOpen] = useState(false);
    const [authMode, setAuthMode] = useState("login");
    const [chatOpen, setChatOpen] = useState(false);
    const [chatInput, setChatInput] = useState("");
    const [chatMessages, setChatMessages] = useState([]);
    const [sessionChatMessages, setSessionChatMessages] = useState({});
    const [sessionChatInput, setSessionChatInput] = useState("");
    const [sessionChatBusy, setSessionChatBusy] = useState({});
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState("");
    const [search, setSearch] = useState("");
    const [dark, setDark] = useState(false);
    const [error, setError] = useState("");
    const [timerMode, setTimerMode] = useState("Focus");
    const [seconds, setSeconds] = useState(25 * 60);
    const [timerRunning, setTimerRunning] = useState(false);
    const [customMinutes, setCustomMinutes] = useState(25);
    const [customSeconds, setCustomSeconds] = useState(0);
    const chatEnd = useRef(null);
    const noteSaveWarningShown = useRef(false);

    const persistNotes = (nextOrUpdater) => {
        const nextNotes =
            typeof nextOrUpdater === "function"
                ? nextOrUpdater(notesRef.current)
                : nextOrUpdater;
        notesRef.current = nextNotes;
        setNotes(nextNotes);
        if (user?.username) writeUserCache(user.username, "notes", nextNotes);
    };

    useEffect(() => {
        notesRef.current = notes;
    }, [notes]);
    useEffect(() => {
        if (!user?.username) return;
        writeUserCache(user.username, "sessions", sessions);
    }, [sessions, user]);
    useEffect(() => {
        if (!user?.username) return;
        writeUserCache(user.username, "notes", notes);
    }, [notes, user]);
    useEffect(() => {
        document.documentElement.dataset.theme = dark ? "dark" : "light";
    }, [dark]);
    useEffect(() => {
        if (!user?.username) return;
        writeUserCache(user.username, "theme", dark ? "dark" : "light");
    }, [dark, user]);
    useEffect(() => {
        if (!timerRunning) return undefined;
        const interval = setInterval(
            () =>
                setSeconds((remaining) => {
                    if (remaining <= 1) {
                        setTimerRunning(false);
                        return 0;
                    }
                    return remaining - 1;
                }),
            1000,
        );
        return () => clearInterval(interval);
    }, [timerRunning]);
    useEffect(() => {
        chatEnd.current?.scrollIntoView({ behavior: "smooth" });
    }, [chatMessages, chatOpen]);
    useEffect(() => {
        const openChat = () => setChatOpen(true);
        window.addEventListener("open-study-chat", openChat);
        return () => window.removeEventListener("open-study-chat", openChat);
    }, []);

    const greeting = user?.fullName?.trim()?.split(/\s+/)[0] || "there";
    const active =
        sessions.find((session) => session.id === activeSession?.id) ||
        activeSession;
    const filteredSessions = useMemo(
        () =>
            sessions.filter((session) =>
                session.name.toLowerCase().includes(search.toLowerCase()),
            ),
        [sessions, search],
    );
    const showToast = (message) => {
        setToast(message);
        window.setTimeout(() => setToast(""), 3200);
    };
    const go = (destination) => {
        setPage(destination);
        setActiveSession(null);
    };
    const openSessionCreator = () => {
        setError("");
        setSessionFiles([]);
        setPage("Create Session");
        setActiveSession(null);
    };
    const openSession = (session) => {
        setSessionChatInput("");
        setActiveSession(session);
        setPage("Session");
    };
    const addNote = async (title) => {
        const normalizedTitle = title.trim();
        if (!normalizedTitle)
            return { created: false, error: "Enter a title for this note." };
        if (!user?.username) {
            setAuthMode("login");
            setError("");
            setAuthOpen(true);
            return {
                created: false,
                error: "Sign in before creating a note.",
            };
        }
        if (notes.some((note) => note.title?.trim() === normalizedTitle)) {
            return {
                created: false,
                error: "A note with that title already exists. Choose another title.",
            };
        }
        if (user?.username) {
            try {
                const response = await fetch(`${API}/create_note`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username: user.username,
                        title: normalizedTitle,
                    }),
                });
                if (response.status === 409) {
                    return {
                        created: false,
                        error: "A note with that title already exists. Choose another title.",
                    };
                }
                if (!response.ok)
                    throw new Error("The note could not be created.");
            } catch {
                return {
                    created: false,
                    error: "The note could not be created. Check that the backend is running and try again.",
                };
            }
        }
        const note = {
            id: crypto.randomUUID(),
            title: normalizedTitle,
            content: "",
            updatedAt: Date.now(),
        };
        setNotes((current) => [note, ...current]);
        setActiveNote(note.id);
        setPage("Notes");
        return { created: true };
    };
    const deleteNoteFromBackend = async (note) => {
        if (!user?.username) return true;
        try {
            const response = await fetch(`${API}/delete_note`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: note.title }),
            });
            if (response.status === 404) {
                showToast(
                    "This note was not found on the server, so it was removed from this browser.",
                );
                return true;
            }
            if (!response.ok) throw new Error("The note could not be deleted.");
            return true;
        } catch {
            showToast(
                "The note could not be deleted. Check that the backend is running and try again.",
            );
            return false;
        }
    };
    const editNoteTitle = async (oldTitle, newTitle) => {
        if (oldTitle === newTitle) return true;
        try {
            const response = await fetch(`${API}/edit_note_title`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: oldTitle, newTitle }),
            });
            if (!response.ok) {
                showToast("The title could not be updated. It may already be in use.");
                return false;
            }
            return true;
        } catch {
            showToast("The title could not be updated. Check that the backend is running.");
            return false;
        }
    };
    const editNoteContent = async (title, content) => {
        try {
            const response = await fetch(`${API}/edit_note_content`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });
            if (!response.ok) throw new Error("The content was not saved.");
            noteSaveWarningShown.current = false;
            return true;
        } catch {
            if (!noteSaveWarningShown.current) {
                showToast("Note content could not be saved. Check that the backend is running.");
                noteSaveWarningShown.current = true;
            }
            return false;
        }
    };
    const authenticate = async (event) => {
        event.preventDefault();
        setBusy(true);
        setError("");
        const form = new FormData(event.currentTarget);
        const mode = form.get("mode");
        const payload = {
            fullName: String(form.get("fullName") || ""),
            username: String(form.get("username") || ""),
            password: String(form.get("password") || ""),
        };
        try {
            const response = await fetch(`${API}/${mode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!response.ok)
                throw new Error(
                    mode === "login"
                        ? "We couldn't find an account with those details."
                        : "Could not create your account. Please try again.",
                );
            const result = await response.text();
            if (mode === "signup" && result.trim() !== "true")
                throw new Error("That username is already in use.");
            const authenticatedUser = {
                fullName: payload.fullName || payload.username,
                username: payload.username,
            };
            setSessions(
                readUserCache(payload.username, "sessions", []),
            );
            setNotes(readUserCache(payload.username, "notes", []));
            setDark(readUserCache(payload.username, "theme", "light") === "dark");
            setUser(authenticatedUser);
            setAuthOpen(false);
            showToast(
                mode === "signup" ? "Your account is ready." : "Welcome back.",
            );
        } catch (requestError) {
            setError(
                requestError.message.includes("fetch")
                    ? "Can't connect to the study server. Check that the backend is running."
                    : requestError.message,
            );
        } finally {
            setBusy(false);
        }
    };
    const createSession = async (event) => {
        event.preventDefault();
        setError("");
        if (!user) {
            setAuthOpen(true);
            setAuthMode("login");
            return;
        }
        const form = new FormData(event.currentTarget);
        const name = String(form.get("name") || "").trim();
        const type = String(form.get("type") || "");
        const files = sessionFiles.filter(
            (file) => file instanceof File && file.size > 0,
        );
        if (!name || !type || files.length === 0) {
            setError(
                "Add a name, choose a study format, and upload at least one file.",
            );
            return;
        }
        setBusy(true);
        try {
            const payloadFiles = await Promise.all(files.map(readFile));
            const response = await fetch(`${API}/create_session`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: user.username,
                    sessionType: type,
                    files: payloadFiles,
                }),
            });
            if (!response.ok)
                throw new Error(
                    "The study session couldn't be generated. Please try again.",
                );
            const result = await response.text();
            const session = {
                id: crypto.randomUUID(),
                name,
                type,
                result,
                files: payloadFiles.map(({ name: fileName, size }) => ({
                    name: fileName,
                    size,
                })),
                createdAt: Date.now(),
            };
            setSessions((current) => [session, ...current]);
            setActiveSession(session);
            setPage("Session");
            showToast("Your study session is ready.");
        } catch (requestError) {
            setError(
                requestError.message.includes("fetch")
                    ? "Can't connect to the study server. Check that the backend is running."
                    : requestError.message,
            );
        } finally {
            setBusy(false);
        }
    };
    const sendChat = async (event, prompt = chatInput) => {
        event?.preventDefault();
        if (!prompt.trim()) return;
        const question = prompt.trim();
        setChatInput("");
        setChatMessages((current) => [
            ...current,
            { role: "user", text: question },
        ]);
        setBusy(true);
        try {
            const response = await fetch(`${API}/chat`, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: question,
            });
            if (!response.ok)
                throw new Error("The assistant couldn't respond.");
            const answer = await response.text();
            setChatMessages((current) => [
                ...current,
                { role: "assistant", text: answer.replace(/^\{|\}$/g, "") },
            ]);
        } catch {
            setChatMessages((current) => [
                ...current,
                {
                    role: "assistant",
                    text: "I can't reach the study assistant right now. Please check that the backend is running.",
                },
            ]);
        } finally {
            setBusy(false);
        }
    };
    const sendSessionChat = async (event) => {
        event?.preventDefault();
        const question = sessionChatInput.trim();
        if (!question || !active || sessionChatBusy[active.id]) return;
        const sessionId = active.id;
        setSessionChatInput("");
        setSessionChatMessages((current) => ({
            ...current,
            [sessionId]: [
                ...(current[sessionId] || []),
                { role: "user", text: question },
            ],
        }));
        setSessionChatBusy((current) => ({ ...current, [sessionId]: true }));
        try {
            const response = await fetch(`${API}/chat`, {
                method: "POST",
                headers: { "Content-Type": "text/plain" },
                body: question,
            });
            if (!response.ok)
                throw new Error("The assistant couldn't respond.");
            const answer = await response.text();
            setSessionChatMessages((current) => ({
                ...current,
                [sessionId]: [
                    ...(current[sessionId] || []),
                    {
                        role: "assistant",
                        text: answer.replace(/^\\{|\\}$/g, ""),
                    },
                ],
            }));
        } catch {
            setSessionChatMessages((current) => ({
                ...current,
                [sessionId]: [
                    ...(current[sessionId] || []),
                    {
                        role: "assistant",
                        text: "I can't reach the study assistant right now. Please check that the backend is running.",
                    },
                ],
            }));
        } finally {
            setSessionChatBusy((current) => ({
                ...current,
                [sessionId]: false,
            }));
        }
    };
    const chooseTimer = (mode) => {
        setTimerMode(mode);
        setTimerRunning(false);
        setSeconds(
            mode === "Custom"
                ? customMinutes * 60 + customSeconds
                : (mode === "Short break"
                      ? 5
                      : mode === "Long break"
                        ? 15
                        : 25) * 60,
        );
    };
    const setCustomTimer = (minutes, remainingSeconds) => {
        const duration = minutes * 60 + remainingSeconds;
        if (duration <= 0) return;
        setCustomMinutes(minutes);
        setCustomSeconds(remainingSeconds);
        setTimerMode("Custom");
        setTimerRunning(false);
        setSeconds(duration);
    };
    const openLogin = () => {
        setAuthMode("login");
        setError("");
        setAuthOpen(true);
    };
    const title = page === "Session" ? active?.name || "Study session" : page;

    return (
        <div className="app-shell" data-theme={dark ? "dark" : "light"}>
            <Sidebar
                page={page}
                go={go}
                sessions={filteredSessions}
                active={active}
                onOpenSession={openSession}
                onNewSession={openSessionCreator}
                dark={dark}
                setDark={setDark}
                user={user}
                greeting={greeting}
                onSignOut={() => {
                    setUser(null);
                    setSessions([]);
                    setNotes([]);
                    setActiveSession(null);
                    setActiveNote(null);
                    showToast("Signed out.");
                }}
                onLogin={openLogin}
            />
            <main className="main-area">
                <Topbar
                    title={title}
                    search={search}
                    setSearch={setSearch}
                    onToggleMobileNav={() =>
                        document
                            .querySelector(".sidebar")
                            ?.classList.toggle("mobile-open")
                    }
                />
                <section
                    className={`content-area ${page === "Dashboard" ? "dashboard-content" : page === "Notes" ? "notes-content" : ""}`}
                >
                    {page === "Dashboard" && (
                        <Dashboard
                            greeting={greeting}
                            onNewSession={openSessionCreator}
                        />
                    )}
                    {page === "Create Session" && (
                        <CreateSessionPage
                            onSubmit={createSession}
                            files={sessionFiles}
                            setFiles={setSessionFiles}
                            error={error}
                            busy={busy}
                            onCancel={() => go("Dashboard")}
                        />
                    )}
                    {page === "Session" && (
                        <SessionView
                            session={active}
                            onBack={() => go("Dashboard")}
                            chatMessages={sessionChatMessages[active?.id] || []}
                            chatBusy={!!sessionChatBusy[active?.id]}
                            chatInput={sessionChatInput}
                            setChatInput={setSessionChatInput}
                            onSendChat={sendSessionChat}
                        />
                    )}
                    {page === "Notes" && (
                        <NotesView
                            notes={notes}
                            activeNote={activeNote}
                            setActiveNote={setActiveNote}
                            setNotes={persistNotes}
                            addNote={addNote}
                            onDeleteNote={deleteNoteFromBackend}
                            onEditNoteTitle={editNoteTitle}
                            onEditNoteContent={editNoteContent}
                        />
                    )}
                    {page === "Focus Timer" && (
                        <FocusTimer
                            mode={timerMode}
                            seconds={seconds}
                            running={timerRunning}
                            onChooseMode={chooseTimer}
                            customMinutes={customMinutes}
                            customSeconds={customSeconds}
                            onSetCustom={setCustomTimer}
                            onToggle={() => setTimerRunning(!timerRunning)}
                            onReset={() => {
                                setTimerRunning(false);
                                chooseTimer(timerMode);
                            }}
                        />
                    )}
                </section>
            </main>
            <AssistantChat
                open={chatOpen}
                onToggle={() => setChatOpen(!chatOpen)}
                messages={chatMessages}
                busy={busy}
                input={chatInput}
                setInput={setChatInput}
                onSend={sendChat}
                endRef={chatEnd}
            />
            {authOpen && (
                <AuthModal
                    mode={authMode}
                    setMode={setAuthMode}
                    onSubmit={authenticate}
                    onClose={() => setAuthOpen(false)}
                    error={error}
                    busy={busy}
                    setError={setError}
                />
            )}
            {toast && (
                <div className="toast">
                    <span>✓</span>
                    {toast}
                </div>
            )}
        </div>
    );
}

export default App;
