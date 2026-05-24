function Sessions({ active, session }) {
    if (!active || !session) {
        return null;
    }

    return (
        <section className="block h-full">
            <div className="session-content-shell">
                <div className="session-content-meta">
                    <span className="section-label">Session Type</span>
                    <span className="session-content-type">{session.type}</span>
                </div>
                <div className="session-content-stage" />
            </div>
        </section>
    );
}

export default Sessions;
