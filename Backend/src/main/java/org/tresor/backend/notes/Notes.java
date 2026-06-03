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

    private final List<String> userNotesIds = new ArrayList<>();

    // mongoDB client and db set up
    private final MongoDBClient mongoDBClient = new MongoDBClient();
    private final MongoClient client = mongoDBClient.get();
    private final MongoDatabase db = client.getDatabase("AiStudyApp");
    private final MongoCollection<Document> usersCollection = db.getCollection("Users");
    private final MongoCollection<Document> notesCollection = db.getCollection("Notes");

    public Notes() {
    }

    public static void instantiate() {
    }

    /**
     * creates the first note and
     * Initializes the ArrayList that stores all the id that belong to the
     * notes that a user creates
     *
     * @param title the title of the first note being created
     * @param user  the current user creating the note
     */
    public void createNotes(User user, String title) {

        // creates the first note and adds it to the notesArray
        Document note = createFirstNote(title);

        // gets the object id
        ObjectId objectId = note.getObjectId("_id");
        String id = objectId.toHexString();

        // adds the note id to the list of notesArray in the stored in the user document
        userNotesIds.add(id);

        // Update the user's NotesArray in MongoDB
        usersCollection.updateOne(
                new Document("username", user.getUsername()),
                new Document("$set", new Document("NotesArray", note)));
    }

    /**
     * create note method for the first time a user creates a note
     * and append it to the notesCollection
     *
     * @param title title of the first note being created
     * @return the note created
     */
    public Document createFirstNote(String title) {
        // creates a new note
        Document note = new Document()
                .append("title", title)
                .append("content", "");
        // adds it to the note collection
        notesCollection.insertOne(note);
        // returns the note
        return note;
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
        userNotesIds.add(id);


        // Fetch the user by username and Update the user's NotesArray in MongoDB
        usersCollection.updateOne(
                new Document("username", user.getUsername()), // filter
                new Document("$set", new Document("NotesArray", userNotesIds)) // update
        );
    }

    public void editNoteTitle(User user, String newTitle) {

//        notesCollection.updateOne(
//
//        )

    }

    public void editNoteContent(User user, String newContent) {

    }
}
