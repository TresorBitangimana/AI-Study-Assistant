package org.tresor.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tresor.backend.account.Account;
import org.tresor.backend.account.User;
import org.tresor.backend.notes.NoteRequest;
import org.tresor.backend.notes.Notes;
import org.tresor.backend.sessions.CreateSessionRequest;

import java.io.IOException;
import java.util.Arrays;
import java.util.Map;

@RestController
@RequestMapping("/api/study_assistant")
public class Server {

    private final ChatBot chatBot = new ChatBot();
    private final Account account = new Account();
    private final Notes notes = new Notes();

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

            //calls functions and returns userdata

            return ResponseEntity.ok("Hello World!!");
        }
    }

    @PostMapping("/create_session")
    public ResponseEntity<?> createSession(@RequestBody CreateSessionRequest request){

        System.out.println(request.getFiles().get(0).getContent());

        return ResponseEntity.ok(request.getFiles().toString());
    }

    /**
     * api call that creates the users first note
     * @param request received object from the frontend
     */
    @PostMapping("/create_notes")
    public void createNotes(@RequestBody NoteRequest request){
        User requestUser = new User(null, request.getUsername(), null);
        notes.initializeUserNotes(requestUser, request.getTitle());
    }

    @PostMapping("/create_note")
    public void createNote(@RequestBody NoteRequest request){
        User requestUser = new User(null, request.getUsername(), null);
        notes.createNote(requestUser, request.getTitle());
    }

}
