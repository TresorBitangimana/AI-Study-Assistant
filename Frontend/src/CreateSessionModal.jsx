function CreateSessionModal({
    errorMessage = "",
    fallbackName,
    onCancel,
    onChange,
    onSubmit,
    submitLabel = "Create Session",
    submitDisabled = false,
    subtitle = "Give this session a label so it is easier to organize your work later.",
    title = "Name your study session",
    toneLabel = "New Session",
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
                <div className="section-label">{toneLabel}</div>
                <h2 className="session-modal-title" id="create-session-title">
                    {title}
                </h2>
                <p className="session-modal-copy">{subtitle}</p>

                <form className="session-modal-form" onSubmit={onSubmit}>
                    <input
                        autoFocus
                        className={`field-input ${errorMessage ? "field-input-error" : ""}`}
                        onChange={(event) => onChange(event.target.value)}
                        placeholder={fallbackName}
                        type="text"
                        value={value}
                    />
                    {errorMessage ? (
                        <div className="field-error-text">{errorMessage}</div>
                    ) : null}
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
                            disabled={submitDisabled}
                            type="submit"
                        >
                            {submitLabel}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default CreateSessionModal;
