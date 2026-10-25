import Icon from "./Icon";

const studyTypes = [
    "Create Flashcards",
    "Generate Quiz",
    "Chat with AI",
    "Explain like I'm 5",
];

export default function CreateSessionPage({
    onSubmit,
    files,
    setFiles,
    error,
    busy,
    onCancel,
}) {
    return (
        <section className="create-session-page">
            <div className="create-session-heading">
                <div>
                    <h1>Upload materials</h1>
                </div>
                <button
                    className="outline-button"
                    type="button"
                    onClick={onCancel}
                >
                    Cancel
                </button>
            </div>
            <form className="session-builder glass-surface" onSubmit={onSubmit}>
                <label className="field-label session-name-field">
                    <input
                        name="name"
                        placeholder="Session Title"
                        autoComplete="off"
                        required
                        autoFocus
                    />
                </label>
                <div className="builder-section-title">
                    <div>
                        <h2>Study materials</h2>
                        <p>
                            Upload text, Markdown, or PDF files to build your
                            session.
                        </p>
                    </div>
                </div>
                <div className="builder-upload-layout">
                    <label
                        className="builder-upload-zone"
                        onDragOver={(event) => event.preventDefault()}
                        onDrop={(event) => {
                            event.preventDefault();
                            setFiles(
                                Array.from(event.dataTransfer.files || []),
                            );
                        }}
                    >
                        <input
                            name="files"
                            type="file"
                            accept=".txt,.md,.markdown,.pdf,text/plain,text/markdown,application/pdf"
                            multiple
                            onChange={(event) =>
                                setFiles(Array.from(event.target.files || []))
                            }
                        />
                        <span className="upload-icon">↑</span>
                        <b>Upload text or PDF files</b>
                        <span>
                            Drag and drop is optional. Click to choose study
                            documents.
                        </span>
                        <small>PDF, TXT, or Markdown</small>
                    </label>
                    <div className="builder-file-list">
                        {files.length ? (
                            <ul>
                                {files.map((file, index) => (
                                    <li key={`${file.name}-${index}`}>
                                        <Icon name="File" />
                                        <span>{file.name}</span>
                                        <small>
                                            {(file.size / 1024).toFixed(0)} KB
                                        </small>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p>No files uploaded yet.</p>
                        )}
                    </div>
                </div>
                <div className="builder-section-title workflow-heading">
                    <div>
                        <h2>Choose a study format</h2>
                        <p>
                            Your session will be created after you choose a
                            format and start.
                        </p>
                    </div>
                </div>
                <div className="workflow-options">
                    {studyTypes.map((type) => (
                        <label className="workflow-option" key={type}>
                            <input
                                type="radio"
                                name="type"
                                value={type}
                                required
                            />
                            <span>{type}</span>
                        </label>
                    ))}
                </div>
                {error && <div className="form-error">{error}</div>}
                <div className="builder-actions">
                    <button
                        className="outline-button"
                        type="button"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                    <button
                        className="primary-button"
                        type="submit"
                        disabled={busy}
                    >
                        {busy ? (
                            <>
                                <span className="spinner" /> Preparing your
                                session…
                            </>
                        ) : (
                            <>Create study session</>
                        )}
                    </button>
                </div>
            </form>
        </section>
    );
}
