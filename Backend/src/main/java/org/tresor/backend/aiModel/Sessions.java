package org.tresor.backend.aiModel;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.tresor.backend.MongoDBClient;
import org.tresor.backend.account.User;

import java.util.ArrayList;
import java.util.List;

public class Sessions {

    private final MongoDBClient mongoDBClient = new MongoDBClient();

    MongoCollection<Document> usersCollection = getUsersCollection();
    MongoCollection<Document> notesCollection = getSessionsCollection();

    /**
     * Constructor, initializes the users sessions id array
     * @param user currently loggedIn user
     */
    public Sessions(User user) {
        //Instantiates the user list in the database that stoles all the users sessions ids.
        List<String> userSessionsIds = new ArrayList<>();
        usersCollection.updateOne(
                new Document("username", user.getUsername()),
                new Document("$set", new Document("SessionsIdArray", userSessionsIds))

        );
    }

    /**
     * Empty constructor
     */
    public Sessions(){}

    public void createFlashcardSession(User user, String content){}
    public void createQuizSession(User user, String content){}
    public void createChatSession(User user, String content){}
    public void createExplainSession(User user, String content){}



    /**
     *  getUsersCollection
     * @return the mongoDb Collection with all the users
     */
    private MongoCollection<Document> getUsersCollection() {
        MongoClient client = mongoDBClient.get();
        MongoDatabase db = client.getDatabase("AiStudyApp");
        return db.getCollection("Users");
    }

    /**
     * getSessionsCollection
     * @return the mongoDb Collection with all the users sessions data
     */
    private MongoCollection<Document> getSessionsCollection() {
        MongoClient client = mongoDBClient.get();
        MongoDatabase db = client.getDatabase("AiStudyApp");
        return db.getCollection("Sessions");
    }
}

