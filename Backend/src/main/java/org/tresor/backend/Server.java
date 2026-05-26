package org.tresor.backend;

import jakarta.annotation.PostConstruct;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;

@RestController
@RequestMapping("/api/study_assistant")
@CrossOrigin("*")

public class Server {

    static MongoDBClient mongoDbClient = new MongoDBClient();
    static AiModelClient aiModelClient = new AiModelClient("llama3.2");
    ChatBot chatBot = new ChatBot();

    public Server() throws IOException {}


    @PostMapping("/chat")
    public ResponseEntity<?> chatBotApi(@RequestBody String input){
        String botResponse = chatBot.chatToBot(input);
        return ResponseEntity.ok(botResponse);
    }
}
