import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";

const createEmptyNote = () => ({
    id: `note-${Date.now()}`,
    title: "Untitled Note",
    meta: "Start writing · Just now",
    content: "",
});

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

function Notes({ active }, ref) {
    const [notes, setNotes] = useState([createEmptyNote()]);
    const [activeNoteId, setActiveNoteId] = useState(notes[0].id);
    const [openNoteMenuId, setOpenNoteMenuId] = useState(null);
    const noteTextareaRef = useRef(null);

    const createNote = () => {
        const newNote = createEmptyNote();
        setNotes((current) => [newNote, ...current]);
        setActiveNoteId(newNote.id);
        setOpenNoteMenuId(null);
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
                const fallbackNote = createEmptyNote();
                setActiveNoteId(fallbackNote.id);
                return [fallbackNote];
            }

            if (activeNoteId === noteId) {
                setActiveNoteId(remaining[0].id);
            }

            return remaining;
        });
        setOpenNoteMenuId(null);
    };

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

    return (
        <section className={active ? "block" : "hidden"}>
            <div className="notes-shell">
                <div className="notes-list-shell">
                    <div className="notes-list-header">
                        <span>NOTES</span>
                        <button
                            className="btn-compact"
                            onClick={createNote}
                            type="button"
                        >
                            +
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
                                        <div className="note-meta">
                                            {note.meta}
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
                        <button className="btn-toolbar-accent" type="button">
                            ✦ Ask AI
                        </button>
                    </div>
                    <div className="editor-content">
                        <input
                            className="note-title-input"
                            onChange={(event) =>
                                updateActiveNote("title", event.target.value)
                            }
                            placeholder="Untitled Note"
                            type="text"
                            value={activeNote?.title ?? ""}
                        />
                        <textarea
                            className="note-textarea"
                            onChange={(event) =>
                                updateActiveNote("content", event.target.value)
                            }
                            placeholder="Start writing your notes here..."
                            ref={noteTextareaRef}
                            value={activeNote?.content ?? ""}
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export default forwardRef(Notes);
