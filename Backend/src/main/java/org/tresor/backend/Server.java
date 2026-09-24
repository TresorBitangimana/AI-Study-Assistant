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
import org.tresor.backend.sessions.SessionFiles;

import java.io.IOException;
import java.util.ArrayList;

@RestController
@RequestMapping("/api/study_assistant")
public class Server {

    private final ChatBot chatBot = new ChatBot();
    private final Account account = new Account();
    private final Notes notes = new Notes();
    private User current_loggedin_user;

    public Server() throws IOException {
    }

    /**
     * chatbot api
     * @param input user input from the frontend
     * @return Answer to the users input question
     */
    @PostMapping("/chat")
    public ResponseEntity<?> chatBotApi(@RequestBody String input){
        String botResponse = chatBot.chatToBot(input);
        return ResponseEntity.ok(botResponse);
    }

    /**
     * sign up api, creates a user if the user does not exist and
     * returns an error message if the user being created already exists
     * @param inComingUser user to be created
     * @return Successful message if the signup was successful and
     *         Unsuccessful message if the signup was unsuccessful.
     */
    @PostMapping("/signup")
    public ResponseEntity<?> createAccount(@RequestBody User inComingUser){
        User user = new User(inComingUser.getFullName(), inComingUser.getUsername(), inComingUser.getPassword());

        //checks if user already exist
        boolean doesUserExistCheck = account.doesUserNameExist(user.getUsername());
        if(doesUserExistCheck){
            //user already exist
            return ResponseEntity.ok(false);
        }else {
            account.createAccount(user);
            current_loggedin_user = user;
            return ResponseEntity.ok(true);
        }
    }

    /**
     * signs the user in and returns the necessary Data
     * @param inComingUser user to be signed in
     */
    @PostMapping("/login")
    public ResponseEntity<?> logIn(@RequestBody User inComingUser){
        User user = new User(inComingUser.getFullName(), inComingUser.getUsername(), inComingUser.getPassword());

        //checks if user already exist
        boolean isAuthenticated = account.doesUserExists(user);
        if(!isAuthenticated){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
        }
        else{
            //returns user data
            User authenticatedUser = account.findUserByUsername(user.getUsername());
            current_loggedin_user = user;
            //calls functions and returns userdata

            return ResponseEntity.ok("Hello World!!");
        }
    }

    /**
     * session model api call,receives user materials
     * @param request a CreateSessionRequest object
     * @return appropriate response based on user sessionType and materials provided.
     */
    @PostMapping("/create_session")
    public ResponseEntity<?> createSession(@RequestBody CreateSessionRequest request){

        //session model that handles the resources and outputs with AI
        SessionModel sessionModel = new SessionModel();
        String response = sessionModel.sessionChat(request);

        return ResponseEntity.ok(response);
    }

    /**
     * api call that creates and initializes the users first note
     * @param request received object from the frontend
     */
    @PostMapping("/create_notes")
    public void createNotes(@RequestBody NoteRequest request){
        User requestUser = new User(null, request.getUsername(), null);
        notes.initializeUserNotes(requestUser, request.getTitle());
    }

    /**
     * creates a single note after the initial initialisation from createNotes call
     * @param request NoteReqest object
     */
    @PostMapping("/create_note")
    public void createNote(@RequestBody NoteRequest request){
        User requestUser = new User(null, request.getUsername(), null);
        notes.createNote(requestUser, request.getTitle());
    }

}
