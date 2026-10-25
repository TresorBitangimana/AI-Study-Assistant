package org.tresor.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tresor.backend.account.Account;
import org.tresor.backend.account.User;
import org.tresor.backend.aiModel.ChatBot;
import org.tresor.backend.aiModel.SessionModel;
import org.tresor.backend.notes.NoteRequest;
import org.tresor.backend.notes.Notes;
import org.tresor.backend.sessions.CreateSessionRequest;

import java.io.IOException;

@RestController
@RequestMapping("/api/study_assistant")
public class Server {

    private final ChatBot chatBot = new ChatBot();
    private final Account account = new Account();
    private User currentLoggedInUser;

    public Server() throws IOException {
    }

    /**
     * chatbot api
     * 
     * @param input user input from the frontend
     * @return Answer to the users input question
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chatBotApi(@RequestBody String input) {
        String botResponse = chatBot.chatToBot(input);
        return ResponseEntity.ok(botResponse);
    }

    /**
     * sign up api, creates a user if the user does not exist and
     * returns an error message if the user being created already exists
     * 
     * @param inComingUser user to be created
     * @return Successful message if the signup was successful and
     *         Unsuccessful message if the signup was unsuccessful.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> createAccount(@RequestBody User inComingUser) {
        User user = new User(inComingUser.getFullName(), inComingUser.getUsername(), inComingUser.getPassword());
        // checks if user already exist
        boolean doesUserExistCheck = account.doesUserNameExist(user.getUsername());
        if (doesUserExistCheck) {
            // user already exist
            return ResponseEntity.ok(false);
        } else {
            account.createAccount(user);
            currentLoggedInUser = user;
            return ResponseEntity.ok(true);
        }
    }

    /**
     * signs the user in and returns the necessary Data
     * 
     * @param inComingUser user to be signed in
     */
    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody User inComingUser) {
        User user = new User(inComingUser.getFullName(), inComingUser.getUsername(), inComingUser.getPassword());

        // checks if user already exist
        boolean isAuthenticated = account.doesUserExists(user);
        if (!isAuthenticated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
        } else {
            // finds the user using their username
            User authenticatedUser = account.findUserByUsername(user.getUsername());
            // user the current LoggedIn User to the user that just logged in
            currentLoggedInUser = user;
            // calls functions and returns userdata

            return ResponseEntity.status(HttpStatus.ACCEPTED).body("");
        }
    }

    /**
     * session model api call,receives user materials
     * 
     * @param request a CreateSessionRequest object
     * @return appropriate response based on user sessionType and materials
     *         provided.
     */
    @PostMapping("/create_session")
    public ResponseEntity<?> createSession(@RequestBody CreateSessionRequest request) {

        SessionModel sessionModel = new SessionModel();
        String response = "";

        if (currentLoggedInUser != null) {

        } else { // creates a session but contents and materials are not saved.

            // session model that handles the resources and outputs with AI
            response = sessionModel.createSession(request);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body("Successful");
    }

    /**
     * Creates a note and add it to the database
     * 
     * @param request information from user: title, content;
     * @return accepted status is successful
     *         conflict status otherwise
     */
    @PostMapping("/create_note")
    public ResponseEntity<?> createNote(@RequestBody NoteRequest request) {
        User user = currentLoggedInUser;
        Notes notes = new Notes(user);
        boolean isSuccessFull = notes.createNote(user, request.getTitle());

        // if not was created successfully and not title was not taken then returns
        // ACCEPTED status
        if (isSuccessFull) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Successful");
        }
        // otherwise
        return ResponseEntity.status(HttpStatus.CONFLICT).body("Title Already Exists");
    }

    /**
     * Deletes a from a backend with the matching information
     * 
     * @param request information from user: title, content;
     * @return accepted status is successful
     *         conflict status otherwise
     */
    @PostMapping("/delete_note")
    public ResponseEntity<?> deleteNote(@RequestBody NoteRequest request) {
        User user = currentLoggedInUser;
        Notes notes = new Notes(user);
        boolean isSuccessFull = notes.deleteNote(user, request.getTitle());

        if (isSuccessFull) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Successful");
        }
        // otherwise
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("A note with that title does not exists");
    }

    /**
     * edits the note title when called
     * 
     * @param request information from user: title, content;
     * @return accepted status is successful
     *         conflict status otherwise
     */
    @PostMapping("/edit_note_title")
    public ResponseEntity<?> editNoteTitle(@RequestBody NoteRequest request) {
        User user = currentLoggedInUser;
        Notes notes = new Notes(user);
        boolean isSuccessFull = notes.editNoteTitle(request.getTitle(), request.getNewTitle());

        if (isSuccessFull) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Successful");
        }
        // otherwise
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Successful");
    }

    /**
     * edits the notes content when called
     * 
     * @param request information from user: title, content;
     * @return accepted status is successful
     *         conflict status otherwise
     */
    @PostMapping("/edit_note_content")
    public ResponseEntity<?> editNoteContent(@RequestBody NoteRequest request) {
        User user = currentLoggedInUser;
        Notes notes = new Notes(user);
        boolean isSuccessFull = notes.editNoteContent(request.getTitle(), request.getContent());

        if (isSuccessFull) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Successful");
        }
        // otherwise
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Successful");
    }
}
