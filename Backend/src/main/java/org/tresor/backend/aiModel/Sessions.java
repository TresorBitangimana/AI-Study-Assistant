package org.tresor.backend.aiModel;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.tresor.backend.MongoDBClient;
import org.tresor.backend.account.User;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Sessions {

    private final List<String> userSessionsIds = new ArrayList<>();
    private final MongoDBClient mongoDBClient = new MongoDBClient();

    public Sessions() {
    }

    /**
     * creates a new note and adds it to the notesCollection
     * gets the note ID and adds it to the user Note ids stored in the user document
     *
     * @param user  the user to update
     * @param title title of the note being created
     */
    public void createNote(User user, String title, String sessionType) {
        MongoCollection<Document> usersCollection = getUsersCollection();
        MongoCollection<Document> sessionsCollection = getSessionsCollection();

        // creates a new session
        Document session = new Document()
                .append("title", title)
                .append("content", "");
        // adds it to the sessions collection
        sessionsCollection.insertOne(session);
        // get the new note's id
        String id = session.getObjectId("_id").toHexString();

        // adds the note id to the list of notesArray stored in the user document
        userSessionsIds.add(id);
        // Fetch the user by username and Update the user's NotesArray in MongoDB
        usersCollection.updateOne(
                new Document("username", user.getUsername()), // filter
                new Document("$set", new Document("NotesArray", userSessionsIds)) // update
        );
    }

    public void editSessionTitle(User user, String newTitle) {}

    private MongoCollection<Document> getUsersCollection() {
        MongoClient client = mongoDBClient.get();
        MongoDatabase db = client.getDatabase("AiStudyApp");
        return db.getCollection("Users");
    }

    private MongoCollection<Document> getSessionsCollection() {
        MongoClient client = mongoDBClient.get();
        MongoDatabase db = client.getDatabase("AiStudyApp");
        return db.getCollection("Sessions");
    }
}

/**
 * flashcards object class
 */
class Flashcards{
    Map<String, String> flashcards = new HashMap<>();
    public Flashcards(){}
    public void addCard(String question, String answer){
        flashcards.put(question, answer);
    }
    public Map<String, String> getFlashcards(){
        return flashcards;
    }
}

class Explain{
    String explain = "";
    public Explain(){}
    public void addExplain(String ex){
        explain = ex;
    }
    public String getExplain(){
        return explain;
    }
}

class Quiz{}

class Test{}
