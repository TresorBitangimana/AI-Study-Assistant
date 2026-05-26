package org.tresor.backend;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/study_assistant")
@CrossOrigin("*")

public class Server {

    static MongoDBClient mongoDbClient = new MongoDBClient();
    static AiModelClient aiModelClient = new AiModelClient("llama3.2");

    public static void main(String[] args) {

        try{
            System.out.println(aiModelClient.chat("Hi, my name is Treasure"));
            System.out.println(aiModelClient.chat("Hi, What is my name"));
            System.out.println(aiModelClient.chat("What was the Question I asked you?"));

        }catch(Exception e){
            throw new RuntimeException("Error while running Ai model", e);
        }


          //gets the client
//        MongoClient clientInstance = mongoDbClient.get();
//        //creates a db
//        mongoDbClient.createDatabase(clientInstance,"Hello_World", "Hello_Collection");
//        //gets the db
//        MongoDatabase db = mongoDbClient.getDatabase("Hello_World");

    }
}
