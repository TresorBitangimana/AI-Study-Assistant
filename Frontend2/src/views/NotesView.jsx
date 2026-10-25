import { useEffect, useRef, useState } from "react";
import Icon from "../components/Icon";

function NotesView({
    notes,
    activeNote,
    setActiveNote,
    setNotes,
    addNote,
    onDeleteNote,
    onEditNoteTitle,
    onEditNoteContent,
}) {
    const [openMenu, setOpenMenu] = useState(null);
    const [renamingNote, setRenamingNote] = useState(null);
    const [renameTitle, setRenameTitle] = useState("");
    const [newNoteOpen, setNewNoteOpen] = useState(false);
    const [newNoteTitle, setNewNoteTitle] = useState("");
    const [creatingNote, setCreatingNote] = useState(false);
    const [newNoteError, setNewNoteError] = useState("");
    const note = notes.find((item) => item.id === activeNote) || notes[0];
    const titleEditOrigin = useRef(null);
    const pendingContent = useRef(null);
    const contentRevision = useRef(0);
    const savedContentRevision = useRef(0);
    const contentSaveInFlight = useRef(null);
    const contentInterval = useRef(null);
    const contentDebounce = useRef(null);
    const contentSaveHandler = useRef(onEditNoteContent);
    contentSaveHandler.current = onEditNoteContent;
    const flushContentSave = async () => {
        if (contentSaveInFlight.current) {
            const previousSaveSucceeded = await contentSaveInFlight.current;
            if (!previousSaveSucceeded) return false;
            return flushContentSave();
        }
        const latest = pendingContent.current;
        if (!latest || latest.revision <= savedContentRevision.current)
            return true;
        const request = Promise.resolve(
            contentSaveHandler.current(latest.title, latest.content),
        );
        contentSaveInFlight.current = request;
        let succeeded = false;
        try {
            succeeded = await request;
            if (succeeded) savedContentRevision.current = latest.revision;
            return succeeded;
        } finally {
            contentSaveInFlight.current = null;
        }
    };
    const queueContentSave = (title, content, noteId) => {
        const revision = ++contentRevision.current;
        pendingContent.current = { title, content, noteId, revision };
        if (!contentInterval.current) {
            contentInterval.current = window.setInterval(
                () => void flushContentSave(),
                3000,
            );
        }
        window.clearTimeout(contentDebounce.current);
        contentDebounce.current = window.setTimeout(async () => {
            await flushContentSave();
            window.clearInterval(contentInterval.current);
            contentInterval.current = null;
            contentDebounce.current = null;
        }, 1200);
    };
    const commitTitle = async (id, oldTitle, proposedTitle) => {
        const newTitle = proposedTitle.trim();
        if (!newTitle) {
            setNotes((current) =>
                current.map((item) =>
                    item.id === id ? { ...item, title: oldTitle } : item,
                ),
            );
            return false;
        }
        if (newTitle === oldTitle) return true;
        if (pendingContent.current?.noteId === id) {
            const saved = await flushContentSave();
            if (!saved) return false;
        }
        const saved = await onEditNoteTitle(oldTitle, newTitle);
        setNotes((current) =>
            current.map((item) =>
                item.id === id
                    ? { ...item, title: saved ? newTitle : oldTitle }
                    : item,
            ),
        );
        return saved;
    };
    useEffect(() => {
        if (!activeNote && notes[0]) setActiveNote(notes[0].id);
    }, [activeNote, notes, setActiveNote]);
    useEffect(() => {
        return () => {
            window.clearTimeout(contentDebounce.current);
            window.clearInterval(contentInterval.current);
            void flushContentSave();
        };
    }, [note?.id]);
    useEffect(() => {
        if (!openMenu) return undefined;
        const closeMenuOutside = (event) => {
            if (!event.target.closest?.(".note-menu-wrap")) {
                setOpenMenu(null);
            }
        };
        document.addEventListener("pointerdown", closeMenuOutside);
        return () =>
            document.removeEventListener("pointerdown", closeMenuOutside);
    }, [openMenu]);
    const update = (key, value) =>
        setNotes((current) =>
            current.map((item) =>
                item.id === note?.id
                    ? { ...item, [key]: value, updatedAt: Date.now() }
                    : item,
            ),
        );
    const deleteNote = async (id) => {
        const selectedNote = notes.find((item) => item.id === id);
        if (!selectedNote) return;
        if (note?.id === id) await flushContentSave();
        const deleted = await onDeleteNote(selectedNote);
        if (!deleted) return;
        const remaining = notes.filter((item) => item.id !== id);
        setNotes(remaining);
        if (note?.id === id) setActiveNote(remaining[0]?.id || null);
        setOpenMenu(null);
    };
    const beginRename = (item) => {
        setRenamingNote(item.id);
        setRenameTitle(item.title || "Untitled note");
        setOpenMenu(null);
    };
    const saveRename = async (event, id) => {
        event.preventDefault();
        const title = renameTitle.trim();
        const item = notes.find((candidate) => candidate.id === id);
        if (!title || !item) return;
        const saved = await commitTitle(id, item.title, title);
        if (saved) setRenamingNote(null);
    };
    const beginAddNote = () => {
        setNewNoteTitle("");
        setNewNoteError("");
        setNewNoteOpen(true);
    };
    const saveNewNote = async (event) => {
        event.preventDefault();
        const title = newNoteTitle.trim();
        if (!title || creatingNote) return;
        setCreatingNote(true);
        try {
            const result = await addNote(title);
            if (result?.created) setNewNoteOpen(false);
            else
                setNewNoteError(
                    result?.error || "The note could not be created.",
                );
        } finally {
            setCreatingNote(false);
        }
    };
    const togglePin = (id) => {
        setNotes((current) => {
            const updated = current.map((item) =>
                item.id === id ? { ...item, pinned: !item.pinned } : item,
            );
            return updated.sort(
                (left, right) =>
                    Number(Boolean(right.pinned)) -
                    Number(Boolean(left.pinned)),
            );
        });
        setOpenMenu(null);
    };
    const orderedNotes = [...notes].sort(
        (left, right) =>
            Number(Boolean(right.pinned)) - Number(Boolean(left.pinned)),
    );
    return (
        <section className="tool-page">
            <div className="tool-header">
                <h1>Notes</h1>
            </div>
            <div className="notes-workspace glass-surface">
                <aside className="notes-list">
                    <div className="notes-list-head">
                        <b>
                            All notes <span>{notes.length}</span>
                        </b>
                        <button
                            className="icon-button small"
                            onClick={beginAddNote}
                        >
                            +
                        </button>
                    </div>
                    {notes.length ? (
                        orderedNotes.map((item) => (
                            <div className="note-row-wrap" key={item.id}>
                                {renamingNote === item.id ? (
                                    <form
                                        className="note-rename-form"
                                        onSubmit={(event) =>
                                            saveRename(event, item.id)
                                        }
                                    >
                                        <input
                                            autoFocus
                                            value={renameTitle}
                                            onChange={(event) =>
                                                setRenameTitle(
                                                    event.target.value,
                                                )
                                            }
                                            aria-label="New note title"
                                        />
                                        <button
                                            type="submit"
                                            aria-label="Save note title"
                                        >
                                            ✓
                                        </button>
                                        <button
                                            type="button"
                                            aria-label="Cancel rename"
                                            onClick={() =>
                                                setRenamingNote(null)
                                            }
                                        >
                                            ×
                                        </button>
                                    </form>
                                ) : (
                                    <>
                                        <button
                                            className={`note-row ${item.id === note?.id ? "active" : ""}`}
                                            onClick={() =>
                                                setActiveNote(item.id)
                                            }
                                        >
                                            <b className="note-row-title">
                                                {item.title || "Untitled note"}
                                                {item.pinned && (
                                                    <span className="note-pinned-badge">
                                                        PINNED
                                                    </span>
                                                )}
                                            </b>
                                            <small>
                                                {item.content?.slice(0, 50) ||
                                                    "No content yet"}
                                            </small>
                                        </button>
                                        <div className="note-menu-wrap">
                                            <button
                                                className="note-menu-toggle"
                                                aria-label={`Options for ${item.title || "Untitled note"}`}
                                                aria-expanded={
                                                    openMenu === item.id
                                                }
                                                onClick={() =>
                                                    setOpenMenu(
                                                        openMenu === item.id
                                                            ? null
                                                            : item.id,
                                                    )
                                                }
                                            >
                                                ···
                                            </button>
                                            {openMenu === item.id && (
                                                <div className="note-actions-menu">
                                                    <button
                                                        onClick={() =>
                                                            beginRename(item)
                                                        }
                                                    >
                                                        Rename
                                                    </button>
                                                    <button
                                                        onClick={() =>
                                                            togglePin(item.id)
                                                        }
                                                    >
                                                        {item.pinned
                                                            ? "Unpin note"
                                                            : "Pin note"}
                                                    </button>
                                                    <button
                                                        className="delete-action"
                                                        onClick={() =>
                                                            deleteNote(item.id)
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <p className="sidebar-empty">
                            {/* Your notes will live here. */}
                        </p>
                    )}
                </aside>
                {note ? (
                    <div className="note-editor">
                        <div className="editor-toolbar">
                            <span>LAST EDITED JUST NOW</span>
                            <button
                                className="text-link"
                                onClick={() => {
                                    setNotes((current) =>
                                        current.filter(
                                            (item) => item.id !== note.id,
                                        ),
                                    );
                                    setActiveNote(null);
                                }}
                            ></button>
                        </div>
                        <input
                            className="note-title"
                            value={note.title}
                            onFocus={(event) => {
                                titleEditOrigin.current = {
                                    id: note.id,
                                    title: event.target.value,
                                };
                            }}
                            onChange={(event) =>
                                update("title", event.target.value)
                            }
                            onBlur={() => {
                                const origin = titleEditOrigin.current;
                                if (origin?.id === note.id)
                                    void commitTitle(
                                        note.id,
                                        origin.title,
                                        note.title,
                                    );
                                titleEditOrigin.current = null;
                            }}
                            aria-label="Note title"
                        />
                        <textarea
                            value={note.content}
                            onChange={(event) => {
                                update("content", event.target.value);
                                queueContentSave(
                                    note.title,
                                    event.target.value,
                                    note.id,
                                );
                            }}
                            placeholder="Start writing…"
                            aria-label="Note content"
                        />
                        <div className="editor-foot">
                            Changes save automatically
                        </div>
                    </div>
                ) : (
                    <div className="notes-empty">
                        <div className="empty-icon">
                            <Icon name="Notes" />
                        </div>
                        <h3>Leave a note for yourself</h3>

                        <button
                            className="primary-button"
                            onClick={beginAddNote}
                        >
                            Create a note
                        </button>
                    </div>
                )}
            </div>
            {newNoteOpen && (
                <div
                    className="modal-backdrop"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget)
                            setNewNoteOpen(false);
                    }}
                >
                    <form
                        className="modal glass-surface new-note-modal"
                        onSubmit={saveNewNote}
                    >
                        <button
                            type="button"
                            className="modal-close"
                            aria-label="Close"
                            onClick={() => !creatingNote && setNewNoteOpen(false)}
                            disabled={creatingNote}
                        >
                            ×
                        </button>
                        <h2>Name your note</h2>

                        <label className="field-label">
                            NOTE TITLE
                            <input
                                autoFocus
                                value={newNoteTitle}
                                onChange={(event) => {
                                    setNewNoteTitle(event.target.value)
                                    setNewNoteError("");
                                }}
                                placeholder="Title"
                                maxLength={100}
                                required
                            />
                        </label>
                        {newNoteError && (
                            <div className="form-error" role="alert">
                                {newNoteError}
                            </div>
                        )}
                        <div className="modal-actions">
                            <button
                                type="button"
                                className="outline-button"
                                onClick={() => setNewNoteOpen(false)}
                                disabled={creatingNote}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="primary-button"
                                disabled={creatingNote}
                            >
                                {creatingNote ? "Creating…" : "Create note"}
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </section>
    );
}

export default NotesView;
