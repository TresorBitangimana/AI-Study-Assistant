package org.tresor.backend;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.tresor.backend.account.Account;
import org.tresor.backend.account.User;

import java.io.IOException;

@RestController
@RequestMapping("/api/study_assistant")
//@CrossOrigin("*")
public class Server {

    ChatBot chatBot = new ChatBot();
    Account account = new Account();

    public Server() throws IOException {
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
        boolean doesUserExistCheck = account.doesUserExists(user);
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
        boolean doesUserExistCheck = account.doesUserExists(user);
        if(!doesUserExistCheck){
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User Not Found");
        }
        else{
            //returns user data
            return ResponseEntity.ok("");
        }
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
}
