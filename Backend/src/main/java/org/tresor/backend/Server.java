package org.tresor.backend;

import com.mongodb.client.MongoClient;
import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/study_assistant")
@CrossOrigin("*")

public class Server {

    static MongoDBClient mongoDbClient = new MongoDBClient();
    static MongoClient client;
    ChatBot chatBot = new ChatBot();

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
}
