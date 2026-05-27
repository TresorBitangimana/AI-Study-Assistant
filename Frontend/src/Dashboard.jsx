function Dashboard({
    active,
    activeSession,
    activeTab,
    dashboardTabs,
    handleDocumentUpload,
    onCancelPendingSession,
    onCreateSession,
    onOpenUserModal,
    onSelectSessionType,
    pendingSessionName,
    removeUploadedDocument,
    sessionTypeOptions,
    setActiveTab,
    uploadedDocuments,
}) {
    const hasPendingSession = pendingSessionName.trim().length > 0;

    return (
        <>
            {active ? (
                <div className="tabs-row">
                    <div className="tabs-group">
                        {activeSession ? (
                            <div className="tab-button tab-session-indicator">
                                {activeSession.name}
                            </div>
                        ) : null}
                        {dashboardTabs.map((tab) => (
                            <button
                                key={tab}
                                className={`tab-button ${
                                    activeTab === tab ? "tab-button-active" : ""
                                }`}
                                onClick={() => setActiveTab(tab)}
                                type="button"
                            >
                                {tab}
                            </button>
                        ))}
                    </div>
                </div>
            ) : null}

            <section className={active ? "block" : "hidden"}>
                {activeTab === "Overview" ? (
                    hasPendingSession ? (
                        <div className="dashboard-setup-shell">
                            <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 2xl:grid-cols-4 mt-5">
                                <div className="panel-card-file-upload lg:col-span-2">
                                    <div className="dashboard-setup-card-actions">
                                        <button
                                            className="btn-ghost"
                                            onClick={onCancelPendingSession}
                                            type="button"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                    <div className="dashboard-card-value">
                                        Upload Materials
                                    </div>
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
                                            <div className="document-upload-icon">
                                                ↑
                                            </div>
                                            <div className="document-upload-title">
                                                Upload text or PDF files
                                            </div>
                                            <div className="document-upload-copy">
                                                Drag and drop is optional. Click
                                                here to choose study documents.
                                            </div>
                                        </label>

                                        <div className="document-upload-list">
                                            {uploadedDocuments.length > 0 ? (
                                                uploadedDocuments.map(
                                                    (document) => (
                                                        <div
                                                            className="document-upload-item"
                                                            key={document.id}
                                                        >
                                                            <div className="document-upload-item-row">
                                                                <div>
                                                                    <div className="document-upload-name">
                                                                        {
                                                                            document.name
                                                                        }
                                                                    </div>
                                                                    <div className="document-upload-meta">
                                                                        {
                                                                            document.type
                                                                        }{" "}
                                                                        ·{" "}
                                                                        {
                                                                            document.size
                                                                        }
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
                                                    ),
                                                )
                                            ) : (
                                                <div className="document-upload-empty">
                                                    No files uploaded yet.
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                <div className="dashboard-session-setup lg:col-span-2">
                                    <div className="dashboard-card-value">
                                        {pendingSessionName}
                                    </div>
                                    <div className="dashboard-session-copy">
                                        Select the study workflow for this
                                        session. The session will be created as
                                        soon as you choose one option below.
                                    </div>

                                    <div className="dashboard-session-grid">
                                        {sessionTypeOptions.map((option) => (
                                            <button
                                                key={option.id}
                                                className="session-type-card"
                                                onClick={() =>
                                                    onSelectSessionType(option)
                                                }
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
                    ) : (
                        <div className="dashboard-instructions">
                            <h2 className="dashboard-instructions-title">
                                Start by creating a new study session
                            </h2>
                            <div className="dashboard-instructions-copy">
                                Use the <strong>New Session</strong> button to
                                name a session. After that, the dashboard will
                                briefly switch into setup mode so you can upload
                                materials and choose the session type.
                            </div>
                            <div className="dashboard-instructions-copy">
                                Once the session is created, selecting that
                                session will open its own section inside the app
                                and the dashboard will return to these
                                instructions.
                            </div>
                            <div className="dashboard-instructions-actions">
                                <button
                                    className="btn-ghost"
                                    onClick={onOpenUserModal}
                                    type="button"
                                >
                                    Log In / Sign Up
                                </button>
                                <button
                                    className="btn-primary"
                                    onClick={onCreateSession}
                                    type="button"
                                >
                                    New Session
                                </button>
                            </div>
                        </div>
                    )
                ) : null}

                {activeTab === "Progress" ? (
                    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.4fr_1fr] mt-5">
                        <div className="panel-card">
                            <div className="dashboard-card-value">
                                <h1>Hello World!!!</h1>
                            </div>
                        </div>
                        <div className="panel-card">
                            <div className="dashboard-card-label">Test101</div>
                        </div>
                    </div>
                ) : null}

                {activeTab === "Resources" ? (
                    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3 mt-5">
                        <div className="panel-card lg:col-span-3 py-15"></div>
                    </div>
                ) : null}
            </section>
        </>
    );
}

export default Dashboard;
