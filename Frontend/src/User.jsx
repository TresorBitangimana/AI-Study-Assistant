import { useMemo, useState } from "react";

function User({ currentUser, onAuthChange, onClose, onLogout }) {
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

    const handleCreateAccount = async () => {
        const normalizedUsername = username.trim().toLowerCase();
        const trimmedName = fullName.trim();

        if (!trimmedName || !normalizedUsername || !password.trim()) {
            setErrorMessage("Full name, username, and password are required.");
            return;
        }

        try {
            const response = await fetch(
                "http://localhost:8080/api/study_assistant/signup",
                {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        fullName: trimmedName,
                        username: normalizedUsername,
                        password,
                    }),
                },
            );

            if (!response.ok) {
                throw new Error("Request failed");
            }

            const responseText = (await response.text()).trim();
            const isSuccessful = responseText === "true";

            if (!isSuccessful) {
                setErrorMessage(
                    "That username already exists. Please try again.",
                );
                return;
            }

            const sessionUser = {
                name: trimmedName,
                username: normalizedUsername,
            };

            onAuthChange(sessionUser);
            handleUserLoggedIn();
            resetForm();
            onClose();
        } catch {
            setErrorMessage(
                "Could not create your account. Please try again.",
            );
        }
    };

    const handleUserLoggedIn = () => {
        // Placeholder for any post-login setup after a successful account creation.
    };

    const handleLogin = () => {
        // Placeholder for the login flow. Backend login integration can be wired here later.
    };

    const handleSignOut = () => {
        onLogout();
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
                    <div className="session-modal-form">
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
                            {mode === "signup" ? (
                                <button
                                    className="btn-primary session-modal-button"
                                    onClick={handleCreateAccount}
                                    type="button"
                                >
                                    Create Account
                                </button>
                            ) : (
                                <button
                                    className="btn-primary session-modal-button"
                                    onClick={handleLogin}
                                    type="button"
                                >
                                    Log In
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default User;
