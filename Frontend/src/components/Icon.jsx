const icons = {
    Dashboard: "▦",
    Notes: "▤",
    "Focus Timer": "◷",
    Search: "⌕",
    Plus: "+",
    Spark: "✳",
    Book: "▣",
    File: "▧",
    Menu: "☰",
};

export function Icon({ name, className = "" }) {
    if (name === "Send") {
        return (
            <svg
                aria-hidden="true"
                className={`icon icon-send ${className}`}
                viewBox="0 0 24 24"
                fill="none"
            >
                <path
                    d="M21.5 2.5 14 21.5l-3.8-8.1L2 9.5l19.5-7Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="m21.5 2.5-11.3 11"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
            </svg>
        );
    }
    return (
        <span aria-hidden="true" className={`icon ${className}`}>
            {icons[name] || name}
        </span>
    );
}

export function ChatIcon() {
    return (
        <svg
            className="chat-icon"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
        >
            <path
                d="M7.25 5.25h9.5a3.5 3.5 0 0 1 3.5 3.5v5.5a3.5 3.5 0 0 1-3.5 3.5h-5.1L5.5 21v-4.1a3.5 3.5 0 0 1-1.75-3.03V8.75a3.5 3.5 0 0 1 3.5-3.5Z"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinejoin="round"
            />
            <path
                d="M8 9.5h8M8 13h5.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default Icon;
