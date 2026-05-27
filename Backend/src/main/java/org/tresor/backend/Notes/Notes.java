package org.tresor.backend.Notes;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.tresor.backend.MongoDBClient;

import javax.swing.text.Document;
import java.util.ArrayList;
import java.util.List;

public class Notes {

    static List<Note> notesCollection = new ArrayList<>();
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

    public void createNote(String title){
        Note note = new Note(title);
    }

    public void editNote(String title){


    }
}
