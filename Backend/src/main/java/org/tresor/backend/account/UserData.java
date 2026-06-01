package org.tresor.backend.account;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.tresor.backend.MongoDBClient;

import java.util.Map;


public class UserData {

    //mongoDB client and db set up
    MongoDBClient mongoDBClient = new MongoDBClient();
    MongoClient client = mongoDBClient.get();
    MongoDatabase db = client.getDatabase("AiStudyApp");
    MongoCollection<Document> usersCollection = db.getCollection("Users");

    private String[] notesIds;
    private String[] notes;
    private String[] flashCardsIds;
    private Map<String, String> flashCards;

    public UserData(){}

    public String[] getNotes() {
        return notes;
    }

    public Map<String, String> getFlashCards() {
        return flashCards;
    }

    public void addNote(){

    }

    public void addFlashCard(){

    }
}
