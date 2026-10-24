package org.tresor.backend.account;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.tresor.backend.MongoDBClient;

import java.util.ArrayList;
import java.util.Map;

public class UserData {

    //mongoDB client and db set up
    MongoDBClient mongoDBClient = new MongoDBClient();
    MongoClient client = mongoDBClient.get();
    MongoDatabase db = client.getDatabase("AiStudyApp");
    MongoCollection<Document> usersCollection = db.getCollection("Users");

    //user data
    ArrayList<String> userNotes = new ArrayList<>();
    ArrayList<Map<String,String>> userSessions = new ArrayList<>();

    public UserData() {
    }

    public ArrayList<String> getNotes(User user) {
        return userNotes;
    }

    public void addNoteToUser(User user,String note){}

    public ArrayList<Map<String, String>> getUserSessions(User user){
        return userSessions;
    }

    public void addSessionToUser(User user,String title, String content){}

}
