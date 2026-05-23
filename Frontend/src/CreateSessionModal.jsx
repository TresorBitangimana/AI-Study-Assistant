function CreateSessionModal({
    fallbackName,
    onCancel,
    onChange,
    onSubmit,
    value,
}) {
    return (
        <div className="session-modal-overlay" role="presentation">
            <div
                aria-labelledby="create-session-title"
                aria-modal="true"
                className="session-modal-card"
                role="dialog"
            >
                <div className="section-label">New Session</div>
                <h2 className="session-modal-title" id="create-session-title">
                    Name your study session
                </h2>
                <p className="session-modal-copy">
                    Give this session a label so it is easier to organize your
                    work later.
                </p>

                <form className="session-modal-form" onSubmit={onSubmit}>
                    <input
                        autoFocus
                        className="field-input"
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={fallbackName}
                        type="text"
                        value={value}
                    />
                    <div className="session-modal-actions">
                        <button
                            className="btn-ghost session-modal-button"
                            onClick={onCancel}
                            type="button"
                        >
                            Cancel
                        </button>
                        <button
                            className="btn-primary session-modal-button"
                            type="submit"
                        >
                            Create Session
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSessionModal;
