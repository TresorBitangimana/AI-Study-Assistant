package org.tresor.backend.notes;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.tresor.backend.MongoDBClient;
import org.tresor.backend.account.User;

import javax.swing.text.Document;
import java.util.ArrayList;
import java.util.List;

public class Notes {

    static List<Note> notesArray = new ArrayList<>();
    static MongoDBClient mongoDBClient = new MongoDBClient();
    static private MongoClient client;
    static private MongoDatabase database;
    private MongoCollection<Document> noteCollection;

    public Notes(){
        client = mongoDBClient.get();
        database = client.getDatabase("AiStudyApp");
    }

    public static void instantiate(){
        database.createCollection("notes");
    }

    /**
     * Creates a Documents linked to the user by id, that
     * contains an array of all the notes that the user will create.
     *
     * @param user  the current user creating the note
     * @param title title of the first note.
     */
    public void createNotes(User user, String title){
        Note note = new Note(title);
    }

    public void editNote(String title){}
}
