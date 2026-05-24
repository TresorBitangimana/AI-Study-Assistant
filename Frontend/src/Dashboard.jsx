function Dashboard({
    active,
    activeSession,
    activeTab,
    dashboardTabs,
    handleDocumentUpload,
    removeUploadedDocument,
    setActiveTab,
    uploadedDocuments,
}) {
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
                    <div className="grid grid-cols-1 gap-3.5 md:grid-cols-2 2xl:grid-cols-4 mt-5">
                        <div className="panel-card-file-upload lg:col-span-2">
                            <div className="dashboard-card-label">
                                Document Uploads
                            </div>
                            <div className="dashboard-card-value">
                                Study Materials
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
                                        Drag and drop is optional. Click here to
                                        choose study documents.
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

                        <div className="panel-card">Create Flashcards</div>
                        <div className="panel-card">Generate Quiz</div>
                        <div className="panel-card">Chat with AI</div>
                        <div className="panel-card">
                            Explain like I&apos;m 5
                        </div>
                    </div>
                ) : null}

                {activeTab === "Progress" ? (
                    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-[1.4fr_1fr]">
                        <div className="panel-card">
                            <div className="dashboard-card-label">
                                Progress Snapshot
                            </div>
                            <div className="dashboard-card-value">
                                <h1>Hello World!!!</h1>
                            </div>
                        </div>
                        <div className="panel-card">
                            <div className="dashboard-card-label">
                                Current Status
                            </div>
                        </div>
                    </div>
                ) : null}

                {activeTab === "Resources" ? (
                    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-3">
                        <div className="panel-card lg:col-span-3 py-15"></div>
                    </div>
                ) : null}
            </section>
        </>
    );
}

export default Dashboard;
