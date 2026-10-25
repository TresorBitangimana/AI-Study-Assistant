import { useState } from "react";
import appIcon from "../assets/App_icon.png";
import Icon from "./Icon";

const navItems = ["Dashboard", "Notes", "Focus Timer"];

export default function Sidebar({
    page,
    go,
    sessions,
    active,
    onOpenSession,
    onNewSession,
    dark,
    setDark,
    user,
    greeting,
    onSignOut,
    onLogin,
}) {
    const [profileMenuOpen, setProfileMenuOpen] = useState(false);
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <aside className="sidebar glass-surface">
            <a
                className="brand"
                href="#home"
                onClick={(event) => {
                    event.preventDefault();
                    go("Dashboard");
                }}
            >
                <img className="brand-mark" src={appIcon} alt="" />
                <span className="brand-name">
                    To<span>Study</span>
                </span>
            </a>
            <nav className="nav-list">
                {navItems.map((item) => (
                    <button
                        key={item}
                        className={`nav-item ${page === item ? "selected" : ""}`}
                        onClick={() => go(item)}
                    >
                        <Icon name={item} />
                        <span>{item}</span>
                    </button>
                ))}
            </nav>
            <div className="session-heading">
                <span className="sidebar-label">Sessions</span>
                <button
                    title="New session"
                    className="icon-button small"
                    onClick={onNewSession}
                >
                    <Icon name="Plus" />
                </button>
            </div>
            <div className="session-list">
                {sessions.length ? (
                    sessions.map((session) => (
                        <button
                            key={session.id}
                            className={`session-link ${active?.id === session.id ? "current" : ""}`}
                            onClick={() => onOpenSession(session)}
                        >
                            <span className="session-bullet" />
                            {session.name}
                        </button>
                    ))
                ) : (
                    <p className="sidebar-empty" />
                )}
            </div>
            <div className="sidebar-bottom">
                <div className="profile-menu-container">
                    <div className="profile-row">
                        <span className="avatar">
                            {user ? greeting.slice(0, 1).toUpperCase() : "S"}
                        </span>
                        <span className="profile-copy">
                            <b>{user ? greeting : "Your account"}</b>
                            <small>{user ? user.username : "Sign in to get started"}</small>
                        </span>
                        <button
                            className="profile-more"
                            aria-label="Open profile menu"
                            aria-haspopup="menu"
                            aria-expanded={profileMenuOpen}
                            onClick={() => {
                                setProfileMenuOpen((open) => !open);
                                setSettingsOpen(false);
                            }}
                        >
                            ···
                        </button>
                    </div>
                    {profileMenuOpen && (
                        <div className="profile-dropdown" role="menu">
                            <button
                                role="menuitem"
                                aria-expanded={settingsOpen}
                                onClick={() => setSettingsOpen((open) => !open)}
                            >
                                Settings <span>{settingsOpen ? "⌄" : "›"}</span>
                            </button>
                            {settingsOpen && (
                                <button
                                    className="profile-appearance"
                                    role="menuitem"
                                    onClick={() => setDark(!dark)}
                                >
                                    <span>{dark ? "Light appearance" : "Dark appearance"}</span>
                                    <span className="theme-icon">{dark ? "☼" : "◐"}</span>
                                </button>
                            )}
                            <div className="profile-menu-divider" />
                            {user ? (
                                <button
                                    className="profile-logout"
                                    role="menuitem"
                                    onClick={() => {
                                        onSignOut();
                                        setProfileMenuOpen(false);
                                    }}
                                >
                                    Log out
                                </button>
                            ) : (
                                <button
                                    role="menuitem"
                                    onClick={() => {
                                        onLogin();
                                        setProfileMenuOpen(false);
                                    }}
                                >
                                    Sign in
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </aside>
    );
}
