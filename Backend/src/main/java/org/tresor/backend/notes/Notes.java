package org.tresor.backend.notes;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.types.ObjectId;
import org.tresor.backend.MongoDBClient;
import org.tresor.backend.account.User;

import org.bson.Document;
import java.util.ArrayList;
import java.util.List;

public class Notes {

    private final MongoDBClient mongoDBClient = new MongoDBClient();

    MongoCollection<Document> usersCollection = getUsersCollection();
    MongoCollection<Document> notesCollection = getNotesCollection();

    public Notes(User user) {
        //instantiates the user arraylist in the backend that stoles all the users notes ids
        List<String> userNotesIds = new ArrayList<>();
        usersCollection.updateOne(
                new Document("username", user.getFullName()),
                new Document("$set", new Document("NotesArray", userNotesIds))
        );
    }

    /**
     * creates a new note and adds it to the notesCollection
     * gets the note ID and adds it to the user Note ids stored in the user document
     * 
     * @param user  the user to update
     * @param title title of the note being created
     */
    public void createNote(User user, String title) {

        // creates a new note
        Document note = new Document()
                .append("title", title)
                .append("content", "");
        // adds it to the note collection
        notesCollection.insertOne(note);
        // get the new note's id
        String id = note.getObjectId("_id").toHexString();

        // adds the note id to the list of notesArray stored in the user document
        // Fetch the user by username and Update the user's NotesArray in MongoDB
        usersCollection.updateOne(
                new Document("username", user.getUsername()), // filter
                new Document("$addToSet", new Document("NotesArray", id)) // update
        );
    }

    public void editNoteTitle(User user, String newTitle) {}
    public void editNoteContent(User user, String newContent) {

    }


    private MongoCollection<Document> getUsersCollection() {
        MongoClient client = mongoDBClient.get();
        MongoDatabase db = client.getDatabase("AiStudyApp");
        return db.getCollection("Users");
    }

    private MongoCollection<Document> getNotesCollection() {
        MongoClient client = mongoDBClient.get();
        MongoDatabase db = client.getDatabase("AiStudyApp");
        return db.getCollection("Notes");
    }
}
