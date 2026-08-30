const CURRENT_USER_STORAGE_KEY = "study-ai-current-user";
const GUEST_NOTES_STORAGE_KEY = "study-ai-guest-notes";
const GUEST_SESSIONS_STORAGE_KEY = "study-ai-guest-sessions";
const GUEST_ACTIVE_SESSION_ID_STORAGE_KEY =
    "study-ai-guest-active-session-id";

function normalizeUsername(username) {
    return String(username ?? "").trim().toLowerCase();
}

function buildUserStorageKey(username, suffix) {
    return `study-ai-user-${normalizeUsername(username)}-${suffix}`;
}

function readJsonStorage(key, fallback) {
    if (typeof window === "undefined") {
        return fallback;
    }

    try {
        const value = window.localStorage.getItem(key);
        return value ? JSON.parse(value) : fallback;
    } catch {
        return fallback;
    }
}

function writeJsonStorage(key, value) {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.setItem(key, JSON.stringify(value));
}

function removeStorageKey(key) {
    if (typeof window === "undefined") {
        return;
    }

    window.localStorage.removeItem(key);
}

function readStoredCurrentUser() {
    return readJsonStorage(CURRENT_USER_STORAGE_KEY, null);
}

function readGuestNotes() {
    return readJsonStorage(GUEST_NOTES_STORAGE_KEY, []);
}

function readGuestSessions() {
    return readJsonStorage(GUEST_SESSIONS_STORAGE_KEY, []);
}

function readGuestActiveSessionId() {
    if (typeof window === "undefined") {
        return null;
    }

    try {
        return (
            window.localStorage.getItem(
                GUEST_ACTIVE_SESSION_ID_STORAGE_KEY,
            ) ?? null
        );
    } catch {
        return null;
    }
}

function writeGuestNotes(notes) {
    writeJsonStorage(GUEST_NOTES_STORAGE_KEY, notes);
}

function writeGuestSessions(sessions) {
    writeJsonStorage(GUEST_SESSIONS_STORAGE_KEY, sessions);
}

function writeGuestActiveSessionId(sessionId) {
    if (typeof window === "undefined") {
        return;
    }

    if (sessionId) {
        window.localStorage.setItem(
            GUEST_ACTIVE_SESSION_ID_STORAGE_KEY,
            sessionId,
        );
        return;
    }

    window.localStorage.removeItem(GUEST_ACTIVE_SESSION_ID_STORAGE_KEY);
}

function clearGuestStorage() {
    removeStorageKey(GUEST_NOTES_STORAGE_KEY);
    removeStorageKey(GUEST_SESSIONS_STORAGE_KEY);
    removeStorageKey(GUEST_ACTIVE_SESSION_ID_STORAGE_KEY);
}

function readUserNotes(username) {
    return readJsonStorage(buildUserStorageKey(username, "notes"), []);
}

function readUserSessions(username) {
    return readJsonStorage(buildUserStorageKey(username, "sessions"), []);
}

function readUserActiveSessionId(username) {
    return readJsonStorage(buildUserStorageKey(username, "active-session-id"), null);
}

function writeUserNotes(username, notes) {
    writeJsonStorage(buildUserStorageKey(username, "notes"), notes);
}

function writeUserSessions(username, sessions) {
    writeJsonStorage(buildUserStorageKey(username, "sessions"), sessions);
}

function writeUserActiveSessionId(username, sessionId) {
    const storageKey = buildUserStorageKey(username, "active-session-id");
    if (sessionId) {
        writeJsonStorage(storageKey, sessionId);
        return;
    }

    removeStorageKey(storageKey);
}

function dedupeById(records) {
    const seen = new Set();

    return records.filter((record) => {
        if (!record || !record.id || seen.has(record.id)) {
            return false;
        }

        seen.add(record.id);
        return true;
    });
}

function mergeRecords(primaryRecords, secondaryRecords) {
    return dedupeById([...secondaryRecords, ...primaryRecords]);
}

function migrateGuestStorageToUser(username) {
    const mergedNotes = mergeRecords(
        readUserNotes(username),
        readGuestNotes(),
    );
    const mergedSessions = mergeRecords(
        readUserSessions(username),
        readGuestSessions(),
    );
    const guestActiveSessionId = readGuestActiveSessionId();
    const storedActiveSessionId = readUserActiveSessionId(username);
    const nextActiveSessionId =
        guestActiveSessionId ??
        storedActiveSessionId ??
        mergedSessions[0]?.id ??
        null;

    writeUserNotes(username, mergedNotes);
    writeUserSessions(username, mergedSessions);
    writeUserActiveSessionId(username, nextActiveSessionId);
    clearGuestStorage();

    return {
        activeSessionId: nextActiveSessionId,
        notes: mergedNotes,
        sessions: mergedSessions,
    };
}

export {
    clearGuestStorage,
    migrateGuestStorageToUser,
    normalizeUsername,
    readGuestActiveSessionId,
    readGuestNotes,
    readGuestSessions,
    readStoredCurrentUser,
    readUserActiveSessionId,
    readUserNotes,
    readUserSessions,
    writeGuestActiveSessionId,
    writeGuestNotes,
    writeGuestSessions,
    writeUserActiveSessionId,
    writeUserNotes,
    writeUserSessions,
};
