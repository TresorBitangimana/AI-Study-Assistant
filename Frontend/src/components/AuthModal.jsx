export default function AuthModal({
    mode,
    setMode,
    onSubmit,
    onClose,
    error,
    busy,
    setError,
}) {
    return (
        <div
            className="modal-backdrop"
            onMouseDown={(event) => {
                if (event.target === event.currentTarget && !busy) onClose();
            }}
        >
            <form
                className="modal auth-modal glass-surface"
                onSubmit={onSubmit}
            >
                <button type="button" className="modal-close" onClick={onClose}>
                    ×
                </button>
                <h2>
                    {mode === "login" ? "Welcome back" : "Create your account"}
                </h2>
                <p className="modal-intro">
                    {mode === "login"
                        ? "Sign in to create AI study sessions."
                        : "Save your place and start learning."}
                </p>
                <input type="hidden" name="mode" value={mode} />
                {mode === "signup" && (
                    <label className="field-label">
                        YOUR NAME
                        <input
                            name="fullName"
                            placeholder="Full name"
                            required
                        />
                    </label>
                )}
                <label className="field-label">
                    USERNAME
                    <input
                        name="username"
                        placeholder="Your username"
                        autoComplete="username"
                        required
                    />
                </label>
                <label className="field-label">
                    PASSWORD
                    <input
                        name="password"
                        type="password"
                        placeholder="Your password"
                        autoComplete={
                            mode === "login"
                                ? "current-password"
                                : "new-password"
                        }
                        required
                    />
                </label>
                {error && <div className="form-error">{error}</div>}
                <button className="primary-button modal-submit" disabled={busy}>
                    {busy
                        ? "Connecting…"
                        : mode === "login"
                          ? "Sign in"
                          : "Create account"}
                </button>
                <p className="auth-switch">
                    {mode === "login"
                        ? "New to StudyAI?"
                        : "Already have an account?"}{" "}
                    <button
                        type="button"
                        onClick={() => {
                            setError("");
                            setMode(mode === "login" ? "signup" : "login");
                        }}
                    >
                        {mode === "login" ? "Create an account" : "Sign in"}
                    </button>
                </p>
            </form>
        </div>
    );
}
