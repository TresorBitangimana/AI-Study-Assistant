const sessionTypeOptions = [
    { id: "flashcards", label: "Create Flashcards" },
    { id: "quiz", label: "Generate Quiz" },
    { id: "chat", label: "Chat with AI" },
    { id: "explain", label: "Explain like I'm 5" },
];

function DashboardUpload({
    handleDocumentUpload,
    onCancelPendingSession,
    onSelectSessionType,
    pendingSessionName,
    removeUploadedDocument,
    uploadedDocuments,
}) {
    return (
        <div className="dashboard-setup-shell dashboard-bleed">
            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 2xl:grid-cols-4 mt-5">
                <div className="dashboard-panel dashboard-panel-large lg:col-span-2">
                    <div className="dashboard-setup-card-actions">
                        <button
                            className="btn-ghost"
                            onClick={onCancelPendingSession}
                            type="button"
                        >
                            Cancel
                        </button>
                    </div>
                    <div className="dashboard-card-value">Upload Materials</div>
                    <div className="pt-2 text-sm text-(--text-dim)">
                        and select a session type
                    </div>
                    <div className="document-upload-shell">
                        <label
                            className="document-upload-dropzone"
                            htmlFor="resource-upload"
                        >
                            <input
                                accept=".txt,.md,.pdf,text/plain,application/pdf"
                                className="document-upload-input"
                                id="resource-upload"
                                multiple
                                onChange={handleDocumentUpload}
                                type="file"
                            />
                            <div className="document-upload-icon">↑</div>
                            <div className="document-upload-title">
                                Upload text or PDF files
                            </div>
                            <div className="document-upload-copy">
                                Drag and drop is optional. Click here to choose
                                study documents.
                            </div>
                        </label>

                        <div className="document-upload-list">
                            {uploadedDocuments.length > 0 ? (
                                uploadedDocuments.map((document) => (
                                    <div
                                        className="document-upload-item"
                                        key={document.id}
                                    >
                                        <div className="document-upload-item-row">
                                            <div>
                                                <div className="document-upload-name">
                                                    {document.name}
                                                </div>
                                                <div className="document-upload-meta">
                                                    {document.type} ·{" "}
                                                    {document.size}
                                                </div>
                                            </div>
                                            <button
                                                className="document-upload-remove"
                                                onClick={() =>
                                                    removeUploadedDocument(
                                                        document.id,
                                                    )
                                                }
                                                type="button"
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="document-upload-empty">
                                    No files uploaded yet.
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="dashboard-panel dashboard-panel-large lg:col-span-2">
                    <div className="dashboard-card-value">
                        {pendingSessionName}
                    </div>
                    <div className="dashboard-session-copy">
                        Select the study workflow for this session. The session
                        will be created as soon as you choose one option below.
                    </div>

                    <div className="dashboard-session-grid">
                        {sessionTypeOptions.map((option) => (
                            <button
                                key={option.id}
                                className="session-type-card"
                                onClick={() => onSelectSessionType(option)}
                                type="button"
                            >
                                <div className="session-type-card-title">
                                    {option.label}
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default DashboardUpload;
