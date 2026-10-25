import Icon from "./Icon";

export default function Topbar({
    title,
    search,
    setSearch,
    onToggleMobileNav,
}) {
    return (
        <header className="topbar glass-surface">
            <button
                className="mobile-menu icon-button"
                onClick={onToggleMobileNav}
            >
                <Icon name="Menu" />
            </button>
            <div className="breadcrumb">
                <span>Workspace</span>
                <span className="crumb-slash">/</span>
                <strong>{title}</strong>
            </div>
            <label className="search-box">
                <Icon name="Search" />
                <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search sessions"
                    aria-label="Search sessions"
                />
                <kbd>⌘ K</kbd>
            </label>
        </header>
    );
}
