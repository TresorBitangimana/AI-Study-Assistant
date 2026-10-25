# StudyAI frontend

StudyAI is a React and Vite study workspace. It connects to the Spring backend in `../AIStudyAssistant/Backend` for account access, AI chat, AI study-session generation, and note creation.

## Run locally

1. Start the Spring backend on `http://localhost:8080` and make sure its MongoDB and model configuration is available.
2. From this directory, run `npm install` if needed, then `npm run dev`.
3. Open the local URL printed by Vite.

The frontend uses `http://localhost:8080/api/study_assistant` by default. Set `VITE_API_URL` to another API base URL when needed, for example `VITE_API_URL=https://your-host/api/study_assistant`.

## Backend connections

- `POST /login` and `POST /signup` provide account access.
- `POST /create_session` receives the username, selected study format, and uploaded TXT, Markdown, or PDF materials. The returned AI output is shown in the new session.
- `POST /chat` sends a text prompt to the assistant.
- `POST /create_note` records note creation for the signed-in user.

The current backend does not expose endpoints for reading or updating saved sessions and notes. Session results and note text therefore remain in this browser's local storage; note creation is also sent to the backend when signed in. Flashcards are parsed from generated session output for review.
