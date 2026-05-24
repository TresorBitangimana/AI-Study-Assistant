import { useEffect, useState } from "react";

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
    onDeleteSession,
    onRenameSession,
}) {
    const [mobileSessionsOpen, setMobileSessionsOpen] = useState(false);
    const [openSessionMenuId, setOpenSessionMenuId] = useState(null);
    const hasSessions = sessions.length > 0;

    useEffect(() => {
        const handleOutsideClick = (event) => {
            if (!openSessionMenuId) {
                return;
            }

            const target = event.target;
            if (
                target instanceof Element &&
                target.closest('[data-session-menu-root="true"]')
            ) {
                return;
            }

            setOpenSessionMenuId(null);
        };

        document.addEventListener("mousedown", handleOutsideClick);
        return () =>
            document.removeEventListener("mousedown", handleOutsideClick);
    }, [openSessionMenuId]);

    const renderSessionRow = (session) => {
        const isActive = session.id === activeSessionId;
        const isMenuOpen = session.id === openSessionMenuId;

        return (
            <div
                key={session.id}
                className={`session-button ${isActive ? "session-button-active" : ""}`}
                data-session-menu-root="true"
            >
                <button
                    className="session-row-body"
                    onClick={() => {
                        setActiveSessionId(session.id);
                        setOpenSessionMenuId(null);
                    }}
                    type="button"
                >
                    <div
                        className={`h-1.75 w-1.75 shrink-0 rounded-full ${
                            isActive ? "bg-(--success)" : "bg-(--text-faint)"
                        }`}
                    />
                    <span className="flex-1 overflow-hidden text-ellipsis whitespace-nowrap">
                        {session.name}
                    </span>
                    <span className="font-['IBM_Plex_Mono'] text-[10px] text-(--text-faint)">
                        {session.time}
                    </span>
                </button>
                <div className="session-row-actions">
                    <button
                        aria-label={`Session options for ${session.name}`}
                        className="session-row-menu"
                        onClick={(event) => {
                            event.stopPropagation();
                            setOpenSessionMenuId((current) =>
                                current === session.id ? null : session.id,
                            );
                        }}
                        type="button"
                    >
                        ⋯
                    </button>
                    {isMenuOpen ? (
                        <div className="session-row-menu-panel">
                            <button
                                className="session-row-menu-item"
                                onClick={() => {
                                    onRenameSession(session.id);
                                    setOpenSessionMenuId(null);
                                }}
                                type="button"
                            >
                                Rename
                            </button>
                            <button
                                className="session-row-menu-item session-row-menu-item-danger"
                                onClick={() => {
                                    onDeleteSession(session.id);
                                    setOpenSessionMenuId(null);
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
    };

    return (
        <aside className="sidebar-shell">
            <div className="flex items-center justify-center gap-2.5 px-2 py-5 lg:justify-start lg:px-4.5 lg:pb-4 lg:pt-5">
                <div className="brand-chip">S</div>
                <div className="sidebar-mobile-hide">
                    <span className="font-['Syne'] text-base font-bold tracking-[-0.3px] text-(--text)">
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

            <div className="relative flex-1 overflow-auto scrollbar-none pb-3">
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
                        <div
                            className="sidebar-mobile-hide lg:flex"
                            key={session.id}
                        >
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
                    className="h-3.5 w-3.5"
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

            <div className="sidebar-mobile-hide border-t border-(--border) p-2.5">
                <div className="profile-pill">
                    <div className="avatar-pill">U</div>
                    <div className="min-w-0 flex-1">
                        <div className="text-[12.5px] font-medium text-(--text)">
                            User 101
                        </div>
                    </div>
                    <svg
                        aria-hidden="true"
                        className="h-3.5 w-3.5 shrink-0 text-(--text-faint)"
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
