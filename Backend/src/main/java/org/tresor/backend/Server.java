package org.tresor.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tresor.backend.account.Account;
import org.tresor.backend.account.User;
import org.tresor.backend.aiModel.ChatBot;
import org.tresor.backend.aiModel.ObjectClasses.Session;
import org.tresor.backend.aiModel.SessionModel;
import org.tresor.backend.aiModel.Sessions;
import org.tresor.backend.notes.Note;
import org.tresor.backend.notes.NoteRequest;
import org.tresor.backend.notes.Notes;
import org.tresor.backend.sessions.CreateSessionRequest;

import java.io.IOException;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/study_assistant")
public class Server {

    private final ChatBot chatBot = new ChatBot();
    private final Account account = new Account();
    private final DataReturn dataReturn = new DataReturn();
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
    @GetMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody User inComingUser) {
        User user = new User(inComingUser.getFullName(), inComingUser.getUsername(), inComingUser.getPassword());

        // checks if user already exist
        boolean isAuthenticated = account.doesUserExists(user);
        if (!isAuthenticated) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
        } else {
            // user the current LoggedIn User to the user that just logged in
            currentLoggedInUser = user;

            //initializes the list that will store the notes and sessions
            ArrayList<Note> notesList;
            ArrayList<Session> sessionsList;

            //instantiates the Notes and Sessions class to use their methods that
            Sessions sessions = new Sessions();
            Notes notes = new Notes();

            // calls functions and returns userdata
            sessionsList = sessions.getSessions(currentLoggedInUser);
            notesList = notes.getNotes(currentLoggedInUser);

            //adds the sessionsList and notesList into the one DataReturn Object.
            dataReturn.setSessionsList(sessionsList);
            dataReturn.setNotesList(notesList);

            return ResponseEntity.status(HttpStatus.ACCEPTED).body(dataReturn);
        }
    }

    /**
     * logs out the user by setting the currentLoggedInUser to null and dataReturn to null.
     */
    @PostMapping("/logout")
    public ResponseEntity<?> logout(){
        currentLoggedInUser = null;
        dataReturn.setSessionsList(null);
        dataReturn.setNotesList(null);

        return ResponseEntity.status(HttpStatus.ACCEPTED).body("");
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
        String response;

        //if a user is loggedIn then save the response to the user in the  database
        if (currentLoggedInUser != null) {
            // session model that handles the resources and outputs with AI
            response = sessionModel.createSession(request);

            //sessions class initialization to access the create methods.
            Sessions sessions = new Sessions();
            //gets the session type from the incoming request object
            String sessionType = request.getSessionType();
            //gets the session title from the incoming request object
            String sessionTitle = request.getSessionTitle();
            sessions.createSession(currentLoggedInUser, sessionTitle, sessionType, response);
        } else { // creates a session but contents and materials are not saved.
            // session model that handles the resources and outputs with AI
            response = sessionModel.createSession(request);
        }

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
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
        Notes notes = new Notes();
        boolean isSuccessFull = notes.createNote(currentLoggedInUser, request.getTitle());

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
    @DeleteMapping("/delete_note")
    public ResponseEntity<?> deleteNote(@RequestBody NoteRequest request) {
        Notes notes = new Notes();
        boolean isSuccessFull = notes.deleteNote(currentLoggedInUser, request.getTitle());

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
    @PatchMapping("/edit_note_title")
    public ResponseEntity<?> editNoteTitle(@RequestBody NoteRequest request) {
        Notes notes = new Notes();
        boolean isSuccessFull = notes.editNoteTitle(currentLoggedInUser,request.getTitle(), request.getNewTitle());

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
    @PatchMapping("/edit_note_content")
    public ResponseEntity<?> editNoteContent(@RequestBody NoteRequest request) {
        Notes notes = new Notes();
        boolean isSuccessFull = notes.editNoteContent( currentLoggedInUser,request.getTitle(), request.getContent());

        if (isSuccessFull) {
            return ResponseEntity.status(HttpStatus.ACCEPTED).body("Successful");
        }
        // otherwise
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Not Successful");
    }
}
