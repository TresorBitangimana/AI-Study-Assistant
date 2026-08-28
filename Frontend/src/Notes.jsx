import {
    forwardRef,
    useEffect,
    useImperativeHandle,
    useRef,
    useState,
} from "react";

const createNoteRecord = (title) => ({
    id: `note-${Date.now()}`,
    title,
    // This field stores the note body text for the active editor.
    content: "",
});

const GUEST_NOTES_STORAGE_KEY = "study-ai-guest-notes";

function readStoredGuestNotes() {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const value = window.localStorage.getItem(GUEST_NOTES_STORAGE_KEY);
        return value ? JSON.parse(value) : [];
    } catch {
        return [];
    }
}

function clearStoredGuestNotes() {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(GUEST_NOTES_STORAGE_KEY);
}

const toolbarTools = [
    "B",
    "I",
    "U",
    "H1",
    "H2",
    "• List",
    "# List",
    "</>",
    "❝",
];

function Notes({ active, currentUser }, ref) {
    const [notes, setNotes] = useState(() => readStoredGuestNotes());
    const [activeNoteId, setActiveNoteId] = useState(null);
    const [openNoteMenuId, setOpenNoteMenuId] = useState(null);
    const [isCreatingNote, setIsCreatingNote] = useState(false);
    const [noteTitleDraft, setNoteTitleDraft] = useState("");
    const noteTextareaRef = useRef(null);

    const createNote = () => {
        setOpenNoteMenuId(null);
        setNoteTitleDraft("");
        setIsCreatingNote(true);
    };

    const cancelCreateNote = () => {
        setNoteTitleDraft("");
        setIsCreatingNote(false);
    };

    const submitCreateNote = (event) => {
        event.preventDefault();

        const title = noteTitleDraft.trim();
        if (!title) {
            return;
        }

        if (hasNotes) {
            handleCreateNote(title);
            return;
        }

        handleCreateNotes(title);
    };

    const createNoteAndOpenEditor = (title) => {
        const newNote = createNoteRecord(title);
        setNotes((current) => [newNote, ...current]);
        setActiveNoteId(newNote.id);
        setNoteTitleDraft("");
        setIsCreatingNote(false);
    };

    const handleCreateNotes = async (titleInput = noteTitleDraft) => {
        const title = titleInput.trim();
        if (!title) {
            return;
        }

        if (!currentUser) {
            createNoteAndOpenEditor(title);
            return;
        }

        await fetch("http://localhost:8080/api/study_assistant/create_notes", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: title,
        });

        createNoteAndOpenEditor(title);
    };

    const handleCreateNote = async (titleInput = noteTitleDraft) => {
        const title = titleInput.trim();
        if (!title) {
            return;
        }

        if (!currentUser) {
            createNoteAndOpenEditor(title);
            return;
        }

        await fetch("http://localhost:8080/api/study_assistant/create_note", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: title,
        });

        createNoteAndOpenEditor(title);
    };

    const handleTitleChange = (event) => {
        // Keep the active note title in sync with the editor input.
        updateActiveNote("title", event.target.value);
    };

    const handleContentChange = (event) => {
        // Keep the active note body in sync with the editor textarea.
        updateActiveNote("content", event.target.value);
    };

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!openNoteMenuId) {
                return;
            }

            const target = event.target;
            if (
                target instanceof Element &&
                target.closest('[data-note-menu-root="true"]')
            ) {
                return;
            }

            setOpenNoteMenuId(null);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, [openNoteMenuId]);

    useImperativeHandle(ref, () => ({
        createNote,
    }));

    const activeNote =
        notes.find((note) => note.id === activeNoteId) ?? notes[0] ?? null;
    const hasNotes = notes.length > 0;

    const updateActiveNote = (field, value) => {
        if (!activeNoteId) {
            return;
        }

        setNotes((current) =>
            current.map((note) =>
                note.id === activeNoteId ? { ...note, [field]: value } : note,
            ),
        );
    };

    const deleteNote = (noteId) => {
        setNotes((current) => {
            const remaining = current.filter((note) => note.id !== noteId);
            if (remaining.length === 0) {
                setActiveNoteId(null);
                return [];
            }

            if (activeNoteId === noteId) {
                setActiveNoteId(remaining[0].id);
            }

            return remaining;
        });
        setOpenNoteMenuId(null);
    };

    useEffect(() => {
        if (currentUser) {
            return;
        }

        window.localStorage.setItem(
            GUEST_NOTES_STORAGE_KEY,
            JSON.stringify(notes),
        );
    }, [currentUser, notes]);

    useEffect(() => {
        if (currentUser) {
            return;
        }

        if (notes.length === 0) {
            clearStoredGuestNotes();
        }
    }, [currentUser, notes.length]);

    const applyNoteTransform = (transform) => {
        if (!activeNoteId || !noteTextareaRef.current || !activeNote) {
            return;
        }

        const textarea = noteTextareaRef.current;
        const selectionStart = textarea.selectionStart;
        const selectionEnd = textarea.selectionEnd;
        const result = transform(
            activeNote.content,
            selectionStart,
            selectionEnd,
        );

        updateActiveNote("content", result.value);

        requestAnimationFrame(() => {
            textarea.focus();
            textarea.setSelectionRange(
                result.selectionStart,
                result.selectionEnd,
            );
        });
    };

    const wrapSelection = (prefix, suffix = prefix, placeholder = "text") => {
        applyNoteTransform((value, start, end) => {
            const hasSelection = start !== end;
            const selectedText = hasSelection
                ? value.slice(start, end)
                : placeholder;
            const replacement = `${prefix}${selectedText}${suffix}`;

            return {
                value: `${value.slice(0, start)}${replacement}${value.slice(end)}`,
                selectionStart: start + prefix.length,
                selectionEnd: start + prefix.length + selectedText.length,
            };
        });
    };

    const prefixSelectedLines = (prefix) => {
        applyNoteTransform((value, start, end) => {
            const lineStart = value.lastIndexOf("\n", start - 1) + 1;
            const lineEndIndex = value.indexOf("\n", end);
            const lineEnd = lineEndIndex === -1 ? value.length : lineEndIndex;
            const block = value.slice(lineStart, lineEnd);
            const updatedBlock = block
                .split("\n")
                .map((line) => `${prefix}${line}`)
                .join("\n");

            return {
                value: `${value.slice(0, lineStart)}${updatedBlock}${value.slice(lineEnd)}`,
                selectionStart: lineStart,
                selectionEnd: lineStart + updatedBlock.length,
            };
        });
    };

    const toolbarActions = {
        B: () => wrapSelection("**"),
        I: () => wrapSelection("*"),
        U: () => wrapSelection("<u>", "</u>"),
        H1: () => prefixSelectedLines("# "),
        H2: () => prefixSelectedLines("## "),
        "• List": () => prefixSelectedLines("- "),
        "# List": () => prefixSelectedLines("1. "),
        "</>": () => wrapSelection("`"),
        "❝": () => prefixSelectedLines("> "),
    };

    const noteWorkspace = hasNotes ? (
        <div className="notes-shell">
            <div className="notes-list-shell">
                <div className="notes-list-actions">
                    <button
                        className="notes-create-note-button"
                        onClick={createNote}
                        type="button"
                    >
                        <span className="notes-create-note-icon">+</span>
                        <span>New Note</span>
                    </button>
                </div>
                <div className="min-h-0 flex-1 overflow-y-auto">
                    {notes.map((note) => {
                        const isSelected = note.id === activeNoteId;
                        const isMenuOpen = openNoteMenuId === note.id;

                        return (
                            <div
                                className={`note-row ${isSelected ? "note-row-active" : ""}`}
                                key={note.id}
                                data-note-menu-root="true"
                            >
                                <button
                                    className="note-row-body"
                                    onClick={() => {
                                        setActiveNoteId(note.id);
                                        setOpenNoteMenuId(null);
                                    }}
                                    type="button"
                                >
                                    <div
                                        className={`note-title ${isSelected ? "note-title-active" : ""}`}
                                    >
                                        {note.title || "Untitled Note"}
                                    </div>
                                </button>
                                <div className="note-row-actions">
                                    <button
                                        aria-label={`Note options for ${note.title || "Untitled Note"}`}
                                        className="note-row-menu"
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setOpenNoteMenuId((current) =>
                                                current === note.id
                                                    ? null
                                                    : note.id,
                                            );
                                        }}
                                        type="button"
                                    >
                                        ⋯
                                    </button>
                                    {isMenuOpen ? (
                                        <div className="note-row-menu-panel">
                                            <button
                                                className="note-row-menu-item note-row-menu-item-danger"
                                                onClick={(event) => {
                                                    event.stopPropagation();
                                                    deleteNote(note.id);
                                                }}
                                                type="button"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    ) : null}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div className="editor-shell">
                <div className="editor-toolbar">
                    {toolbarTools.map((tool) => (
                        <button
                            className="btn-toolbar"
                            key={tool}
                            onClick={() => toolbarActions[tool]()}
                            type="button"
                        >
                            {tool}
                        </button>
                    ))}
                </div>
                <div className="editor-content">
                    <input
                        className="note-title-input"
                        onChange={handleTitleChange}
                        placeholder="Untitled Note"
                        type="text"
                        value={activeNote?.title ?? ""}
                    />
                    <textarea
                        className="note-textarea"
                        onChange={handleContentChange}
                        placeholder="Start writing your notes here..."
                        ref={noteTextareaRef}
                        value={activeNote?.content ?? ""}
                    />
                </div>
            </div>
        </div>
    ) : (
        <div className="notes-shell">
            <div className="notes-list-shell notes-list-shell-placeholder">
                <div className="notes-list-actions">
                    <button
                        className="notes-create-note-button"
                        onClick={createNote}
                        type="button"
                    >
                        <span className="notes-create-note-icon">+</span>
                        <span>New Note</span>
                    </button>
                </div>
                <div className="notes-empty-list-body">
                    <div className="note-row note-row-placeholder">
                        <div className="note-row-body">
                            <div className="note-title">Your first note</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="editor-shell">
                <div className="editor-toolbar">
                    {toolbarTools.map((tool) => (
                        <button
                            className="btn-toolbar"
                            key={tool}
                            type="button"
                        >
                            {tool}
                        </button>
                    ))}
                </div>
                <div className="editor-content">
                    <input
                        className="note-title-input"
                        placeholder="Untitled Note"
                        readOnly
                        type="text"
                        value=""
                    />
                    <textarea
                        className="note-textarea"
                        placeholder="Start writing your notes here..."
                        readOnly
                        value=""
                    />
                </div>
            </div>
        </div>
    );

    return (
        <section className={active ? "block h-full" : "hidden"}>
            <div className="notes-stage">
                <div
                    className={`notes-stage-content ${
                        isCreatingNote || !hasNotes
                            ? "notes-stage-content-blurred"
                            : ""
                    }`}
                >
                    {noteWorkspace}
                </div>

                {isCreatingNote || !hasNotes ? (
                    <div className="notes-create-overlay">
                        <div className="notes-create-card">
                            <h2 className="notes-empty-title">
                                {hasNotes
                                    ? "Title your note"
                                    : "Create your first note"}
                            </h2>
                            <p className="notes-empty-copy">
                                {hasNotes
                                    ? "Give this note a clear name before opening the editor."
                                    : "Start a new note by giving it a title."}
                            </p>
                            <form
                                className="notes-create-form"
                                onSubmit={submitCreateNote}
                            >
                                <input
                                    autoFocus
                                    className="field-input"
                                    onChange={(event) =>
                                        setNoteTitleDraft(event.target.value)
                                    }
                                    placeholder="Midterm Review"
                                    type="text"
                                    value={noteTitleDraft}
                                />
                                <div className="notes-create-actions">
                                    <button
                                        className="btn-ghost"
                                        onClick={cancelCreateNote}
                                        type="button"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        className="btn-primary"
                                        disabled={!noteTitleDraft.trim()}
                                        type="submit"
                                    >
                                        Create Note
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                ) : null}
            </div>
        </section>
    );
}

export default forwardRef(Notes);
