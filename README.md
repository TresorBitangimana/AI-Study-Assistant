# Study Assistant

Study Assistant is a web app for turning course materials into interactive study sessions. It includes a React frontend and a Spring Boot backend that stores accounts, notes, and generated sessions in MongoDB and connects to a local Ollama model for AI features.

## Features

- Create study sessions from TXT, Markdown, and PDF files.
- Generate flashcards, quizzes, chat sessions, and simplified explanations.
- Save and edit notes, with automatic content updates.
- Chat with the study assistant and ask follow-up questions about study material.
- Use the focus timer and switch between light and dark appearance.
- Sign in to load notes and sessions from the backend. The frontend also keeps per-user browser cache for reloads and recent updates.

## Project layout

```text
AIStudyAssistant/
├── Backend/    Spring Boot API and MongoDB integration
├── Frontend/   React and Vite web app
└── README.md
```

## Requirements

- Java 17
- Node.js 20 or newer and npm
- MongoDB connection string
- Ollama running a `llama3.2` model for AI chat and generation

## Configure the backend

The backend reads its configuration from environment variables and `Backend/.env`.

1. Create the environment file:

    ```sh
    cd Backend
    cp .env.example .env
    ```

2. Edit `Backend/.env` with your MongoDB connection string and Ollama base URL:

    ```dotenv
    MONGODB_CONNECTION_STRING=mongodb+srv://<username>:<password>@<cluster>/<database>
    LOCAL_AI_BASE_URL=http://localhost:11434
    ```

    The MongoDB connection should point to a deployment where the app can use the `AiStudyApp` database. The backend uses its `Users`, `Notes`, and `Sessions` collections.

3. Ensure Ollama is running and the model is available:

    ```sh
    ollama pull llama3.2
    ```

    `LOCAL_AI_BASE_URL` is the Ollama server base URL; the backend appends `/api/chat` when making requests.

4. Make `MONGODB_CONNECTION_STRING` available to Spring Boot in the shell environment, then start the API from the `Backend` directory:

    ```sh
    export MONGODB_CONNECTION_STRING='mongodb+srv://<username>:<password>@<cluster>/<database>'
    ./mvnw spring-boot:run
    ```

    The API runs at `http://localhost:8080`. On Windows, use `mvnw.cmd spring-boot:run` and set the environment variable with the appropriate shell syntax.

## Run the frontend

In another terminal:

```sh
cd Frontend
npm install
npm run dev
```

Open the Vite URL printed in the terminal, usually `http://localhost:5173`.

The frontend uses this API base URL by default:

```text
http://localhost:8080/api/study_assistant
```

To use another backend, create `Frontend/.env.local` and set:

```dotenv
VITE_API_URL=https://your-host/api/study_assistant
```

Restart Vite after changing environment variables.

## API overview

All endpoints use the `/api/study_assistant` base path. The frontend uses these HTTP methods:

| Method   | Endpoint             | Purpose                                                                                                          |
| -------- | -------------------- | ---------------------------------------------------------------------------------------------------------------- |
| `POST`   | `/signup`            | Create an account. Returns a boolean result.                                                                     |
| `GET`    | `/login`             | Sign in and return `notesList` and `sessionsList`; credentials are sent as query parameters.                     |
| `POST`   | `/logout`            | Clear the backend's current user and in-memory response lists.                                                   |
| `POST`   | `/create_session`    | Generate a study session from uploaded materials and a selected study type. The request includes `sessionTitle`. |
| `POST`   | `/chat`              | Send a prompt to the study assistant.                                                                            |
| `POST`   | `/create_note`       | Create a note with a unique title.                                                                               |
| `PATCH`  | `/edit_note_title`   | Rename a note using its old and new titles.                                                                      |
| `PATCH`  | `/edit_note_content` | Save note content by title.                                                                                      |
| `DELETE` | `/delete_note`       | Delete a note by title.                                                                                          |

Successful login returns note objects with `title` and `content`, and session objects with `title`, `sessionType`, and `content`. The frontend maps these into the UI model. The generated session title is required by `/create_session`.

**Login request binding note:** the backend maps `/login` as `GET` but accepts credentials with `@RequestBody`. Browser `fetch` cannot send a body with `GET`, so the frontend sends credentials in the query string. The backend handler must bind those values from query parameters for login to work; alternatively, keep login as `POST` and accept a JSON body.

## Frontend commands

Run these from `Frontend/`:

```sh
npm run dev      # Start the development server
npm run build    # Create the production build in dist/
npm run preview  # Preview the production build
npm run lint     # Run Oxlint
```

## Login and cached data

After login, the frontend uses the notes and sessions returned by the backend and updates its per-user browser cache as data changes. It remembers the signed-in user for page reloads in the same tab without storing the password. Explicit sign-out calls `/logout`, clears the active frontend data, and removes the remembered user. Because the backend currently keeps its active user in memory, restarting the backend requires signing in again.

## Docker

Dockerfiles are provided in `Backend/` and `Frontend/`. Configure the backend environment variables and MongoDB/Ollama connectivity when building or running containers. The local development instructions above are the recommended setup for this repository.
