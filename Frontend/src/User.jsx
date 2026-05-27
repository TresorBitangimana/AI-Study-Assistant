import { useMemo, useState } from "react";

const USERS_STORAGE_KEY = "study-ai-users";
const CURRENT_USER_STORAGE_KEY = "study-ai-current-user";

function readStoredUsers() {
    if (typeof window === "undefined") {
        return [];
    }

    try {
        const value = window.localStorage.getItem(USERS_STORAGE_KEY);
        return value ? JSON.parse(value) : [];
    } catch {
        return [];
    }
}

function persistUsers(users) {
    window.localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
}

function persistCurrentUser(user) {
    if (user) {
        window.localStorage.setItem(
            CURRENT_USER_STORAGE_KEY,
            JSON.stringify(user),
        );
        return;
    }

    window.localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
}

function User({ currentUser, onAuthChange, onClose }) {
    const [mode, setMode] = useState(currentUser ? "account" : "login");
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const title = useMemo(() => {
        if (mode === "signup") {
            return "Create your account";
        }

        if (mode === "account") {
            return "Your account";
        }

        return "Welcome back";
    }, [mode]);

    const subtitle = useMemo(() => {
        if (mode === "signup") {
            return "Sign up to start saving your study data across sessions.";
        }

        if (mode === "account") {
            return "You are signed in and ready to save your workspace.";
        }

        return "";
    }, [mode]);

    const resetForm = () => {
        setFullName("");
        setUsername("");
        setPassword("");
        setErrorMessage("");
    };

    const switchMode = (nextMode) => {
        setMode(nextMode);
        resetForm();
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        const normalizedUsername = username.trim().toLowerCase();
        const trimmedName = fullName.trim();

        if (!normalizedUsername || !password.trim()) {
            setErrorMessage("Username and password are required.");
            return;
        }

        const users = readStoredUsers();

        if (mode === "signup") {
            if (!trimmedName) {
                setErrorMessage("Full name is required.");
                return;
            }

            const userExists = users.some(
                (user) => user.username === normalizedUsername,
            );

            if (userExists) {
                setErrorMessage("That username is already taken.");
                return;
            }

            const nextUser = {
                id: `user-${Date.now()}`,
                name: trimmedName,
                username: normalizedUsername,
                password,
            };

            const nextUsers = [...users, nextUser];
            persistUsers(nextUsers);

            const sessionUser = {
                id: nextUser.id,
                name: nextUser.name,
                username: nextUser.username,
            };

            persistCurrentUser(sessionUser);
            onAuthChange(sessionUser);
            onClose();
            return;
        }

        const matchedUser = users.find(
            (user) =>
                user.username === normalizedUsername &&
                user.password === password,
        );

        if (!matchedUser) {
            setErrorMessage("Incorrect username or password.");
            return;
        }

        const sessionUser = {
            id: matchedUser.id,
            name: matchedUser.name,
            username: matchedUser.username,
        };

        persistCurrentUser(sessionUser);
        onAuthChange(sessionUser);
        onClose();
    };

    const handleSignOut = () => {
        persistCurrentUser(null);
        onAuthChange(null);
        onClose();
    };

    return (
        <div className="session-modal-overlay" role="presentation">
            <div
                aria-labelledby="user-auth-title"
                aria-modal="true"
                className="session-modal-card"
                role="dialog"
            >
                <div className="section-label">Account</div>
                <h2 className="session-modal-title" id="user-auth-title">
                    {title}
                </h2>
                <p className="session-modal-copy">{subtitle}</p>

                {mode === "account" && currentUser ? (
                    <div className="user-account-shell">
                        <div className="user-account-card">
                            <div className="user-account-name">
                                {currentUser.name}
                            </div>
                            <div className="user-account-email">
                                @{currentUser.username}
                            </div>
                        </div>
                        <div className="session-modal-actions">
                            <button
                                className="btn-ghost session-modal-button"
                                onClick={handleSignOut}
                                type="button"
                            >
                                Sign Out
                            </button>
                            <button
                                className="btn-primary session-modal-button"
                                onClick={onClose}
                                type="button"
                            >
                                Done
                            </button>
                        </div>
                    </div>
                ) : (
                    <form
                        className="session-modal-form"
                        onSubmit={handleSubmit}
                    >
                        <div className="user-auth-mode-row">
                            <button
                                className={`user-auth-mode-button ${
                                    mode === "login"
                                        ? "user-auth-mode-button-active"
                                        : ""
                                }`}
                                onClick={() => switchMode("login")}
                                type="button"
                            >
                                Log In
                            </button>
                            <button
                                className={`user-auth-mode-button ${
                                    mode === "signup"
                                        ? "user-auth-mode-button-active"
                                        : ""
                                }`}
                                onClick={() => switchMode("signup")}
                                type="button"
                            >
                                Sign Up
                            </button>
                        </div>

                        {mode === "signup" ? (
                            <input
                                autoFocus
                                className={`field-input ${
                                    errorMessage ? "field-input-error" : ""
                                }`}
                                onChange={(event) =>
                                    setFullName(event.target.value)
                                }
                                placeholder="Full name"
                                type="text"
                                value={fullName}
                            />
                        ) : null}

                        <input
                            autoFocus={mode === "login"}
                            className={`field-input ${
                                errorMessage ? "field-input-error" : ""
                            }`}
                            onChange={(event) =>
                                setUsername(event.target.value)
                            }
                            placeholder="Username"
                            type="text"
                            value={username}
                        />

                        <input
                            className={`field-input ${
                                errorMessage ? "field-input-error" : ""
                            }`}
                            onChange={(event) =>
                                setPassword(event.target.value)
                            }
                            placeholder="Password"
                            type="password"
                            value={password}
                        />

                        {errorMessage ? (
                            <div className="field-error-text">
                                {errorMessage}
                            </div>
                        ) : null}

                        <div className="session-modal-actions">
                            <button
                                className="btn-ghost session-modal-button"
                                onClick={onClose}
                                type="button"
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-primary session-modal-button"
                                type="submit"
                            >
                                {mode === "signup"
                                    ? "Create Account"
                                    : "Log In"}
                            </button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

export default User;
