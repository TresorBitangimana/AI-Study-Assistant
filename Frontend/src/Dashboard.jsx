import DashboardUpload from "./DashboardUpload";

function Dashboard({
    active,
    currentUser,
    handleDocumentUpload,
    onCancelPendingSession,
    onCreateSession,
    onOpenUserModal,
    onSelectSessionType,
    pendingSessionName,
    removeUploadedDocument,
    uploadedDocuments,
}) {
    const hasPendingSession = pendingSessionName.trim().length > 0;

    return (
        <>
            <section className={active ? "block h-full" : "hidden"}>
                {hasPendingSession ? (
                    <DashboardUpload
                        handleDocumentUpload={handleDocumentUpload}
                        onCancelPendingSession={onCancelPendingSession}
                        onSelectSessionType={onSelectSessionType}
                        pendingSessionName={pendingSessionName}
                        removeUploadedDocument={removeUploadedDocument}
                        uploadedDocuments={uploadedDocuments}
                    />
                ) : (
                    <div className="dashboard-panel dashboard-bleed dashboard-instructions">
                        <h2 className="dashboard-instructions-title">
                            Start by creating a new study session
                        </h2>
                        <div className="dashboard-instructions-copy">
                            Use the <strong>New Session</strong> button to name
                            a session. After that, the dashboard will briefly
                            switch into setup mode so you can upload materials
                            and choose the session type.
                        </div>
                        <div className="dashboard-instructions-copy">
                            Once the session is created, selecting that session
                            will open its own section inside the app.
                        </div>
                        <div className="dashboard-instructions-actions">
                            {!currentUser ? (
                                <button
                                    className="btn-ghost"
                                    onClick={onOpenUserModal}
                                    type="button"
                                >
                                    Log In / Sign Up
                                </button>
                            ) : null}
                            <button
                                className="btn-primary"
                                onClick={onCreateSession}
                                type="button"
                            >
                                New Session
                            </button>
                        </div>
                    </div>
                )}
            </section>
        </>
    );
}

export default Dashboard;
