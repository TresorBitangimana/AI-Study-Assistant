import { useState } from "react";

function NavIcon({ id }) {
    const commonProps = {
        className: "h-4 w-4 shrink-0",
        viewBox: "0 0 20 20",
        "aria-hidden": "true",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: "1.5",
        strokeLinecap: "round",
        strokeLinejoin: "round",
    };

    if (id === "dashboard") {
        return (
            <svg {...commonProps}>
                <rect x="2" y="2" width="7" height="7" rx="1.5" />
                <rect x="11" y="2" width="7" height="7" rx="1.5" />
                <rect x="2" y="11" width="7" height="7" rx="1.5" />
                <rect x="11" y="11" width="7" height="7" rx="1.5" />
            </svg>
        );
    }

    if (id === "notes") {
        return (
            <svg {...commonProps}>
                <path d="M4 2h9l5 5v11a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V3a1 1 0 0 1 1-1zm8 0v5h5M7 9h6M7 12h6M7 15h4" />
            </svg>
        );
    }

    if (id === "flashcards") {
        return (
            <svg {...commonProps}>
                <rect x="2" y="5" width="16" height="11" rx="1.5" />
                <path d="M6 9h8M6 12h5" />
            </svg>
        );
    }

    return (
        <svg {...commonProps}>
            <circle cx="10" cy="11" r="7" />
            <path d="M10 7v4l3 2M8 2h4" />
        </svg>
    );
}

function Navation({
    navigationItems,
    activePanel,
    setActivePanel,
    sessions,
    activeSessionId,
    setActiveSessionId,
    onCreateSession,
}) {
    const [mobileSessionsOpen, setMobileSessionsOpen] = useState(false);
    const hasSessions = sessions.length > 0;

    const renderSessionRow = (session) => {
        const isActive = session.id === activeSessionId;

        return (
            <button
                key={session.id}
                className={`session-button ${isActive ? "session-button-active" : ""}`}
                onClick={() => setActiveSessionId(session.id)}
                type="button"
            >
                <div
                    className={`h-[7px] w-[7px] shrink-0 rounded-full ${
                        isActive ? "bg-[var(--success)]" : "bg-[var(--text-faint)]"
                    }`}
                />
                <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                    {session.name}
                </span>
                <span className="font-['IBM_Plex_Mono'] text-[10px] text-[var(--text-faint)]">
                    {session.time}
                </span>
            </button>
        );
    };

    return (
        <aside className="sidebar-shell">
            <div className="flex items-center justify-center gap-2.5 border-b border-[var(--border)] px-2 py-5 lg:justify-start lg:px-[18px] lg:pb-4 lg:pt-5">
                <div className="brand-chip">S</div>
                <div className="sidebar-mobile-hide">
                    <span className="font-['Syne'] text-base font-bold tracking-[-0.3px] text-[var(--text)]">
                        StudyAI
                    </span>
                </div>
            </div>

            <div className="section-label px-2.5 pb-1.5 pt-3.5 sidebar-mobile-hide">
                Navigation
            </div>

            <nav>
                {navigationItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-button ${
                            activePanel === item.id ? "nav-button-active" : ""
                        } nav-button-collapsed`}
                        onClick={() => setActivePanel(item.id)}
                        type="button"
                    >
                        <NavIcon id={item.id} />
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="section-label px-2.5 pb-1.5 pt-3.5 sidebar-mobile-hide">
                Sessions
            </div>

            <div className="relative flex-1 overflow-visible pb-3">
                <button
                    className="session-button session-button-mobile-trigger lg:hidden"
                    onClick={() => setMobileSessionsOpen((current) => !current)}
                    type="button"
                >
                    <svg
                        aria-hidden="true"
                        className="h-4 w-4 shrink-0"
                        viewBox="0 0 20 20"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <rect x="3" y="4" width="14" height="3" rx="1" />
                        <rect x="3" y="9" width="14" height="3" rx="1" />
                        <rect x="3" y="14" width="14" height="3" rx="1" />
                    </svg>
                    <span className="session-expanded-label">Sessions</span>
                </button>

                {mobileSessionsOpen ? (
                    <div className="session-popover">
                        <div className="session-popover-list">
                            {hasSessions ? (
                                sessions.map(renderSessionRow)
                            ) : (
                                <div className="session-empty-state">
                                    No sessions yet
                                </div>
                            )}
                        </div>
                    </div>
                ) : null}

                {hasSessions ? (
                    sessions.map((session) => (
                        <div className="sidebar-mobile-hide lg:flex" key={session.id}>
                            {renderSessionRow(session)}
                        </div>
                    ))
                ) : (
                    <div className="session-empty-state sidebar-mobile-hide">
                        No sessions yet
                    </div>
                )}
            </div>

            <button
                className="sidebar-ghost-button sidebar-mobile-hide"
                onClick={onCreateSession}
                type="button"
            >
                <svg
                    aria-hidden="true"
                    className="h-[14px] w-[14px]"
                    viewBox="0 0 14 14"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                >
                    <path d="M7 1v12M1 7h12" />
                </svg>
                New Session
            </button>

            <div className="sidebar-mobile-hide border-t border-[var(--border)] p-2.5">
                <div className="profile-pill">
                    <div className="avatar-pill">AS</div>
                    <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-medium text-[var(--text)]">
                            Alex S.
                        </div>
                        <div className="font-['IBM_Plex_Mono'] text-[10px] text-[var(--text-faint)]">
                            Pro Plan · 14 days
                        </div>
                    </div>
                    <svg
                        aria-hidden="true"
                        className="h-[14px] w-[14px] shrink-0 text-[var(--text-faint)]"
                        viewBox="0 0 14 14"
                        fill="currentColor"
                    >
                        <circle cx="7" cy="4" r="1.2" />
                        <circle cx="7" cy="7" r="1.2" />
                        <circle cx="7" cy="10" r="1.2" />
                    </svg>
                </div>
            </div>
        </aside>
    );
}

export default Navation;
