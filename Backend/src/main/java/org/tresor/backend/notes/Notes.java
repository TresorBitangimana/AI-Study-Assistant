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

import static com.mongodb.client.model.Filters.eq;

public class Notes {

    private final MongoDBClient mongoDBClient = new MongoDBClient();

    MongoCollection<Document> usersCollection = getUsersCollection();
    MongoCollection<Document> notesCollection = getNotesCollection();

    /**
     * Constructor, initializes the users notes id array
     * @param user currently loggedIn user
     */
    public Notes(User user) {
        //instantiates the user list in the database that stoles all the users notes ids
        List<String> userNotesIds = new ArrayList<>();
        usersCollection.updateOne(
                new Document("username", user.getUsername()),
                new Document("$set", new Document("NotesIdArray", userNotesIds))
        );
    }

    /**
     * Empty array
     */
    public Notes(){}

    public ArrayList<Note> getNotes(User user){
        //gets the current user document
        Document userDoc = usersCollection.find(
                eq("username", user.getUsername())
        ).first();

        //initializes the list that will store the notes ids the user doc has
        ArrayList<?> userNotesId;
        if(userDoc != null){ //if the user doc is not null
            //adds the list of user NotesIdArray to the userNotesId
            userNotesId = (ArrayList<?>) userDoc.getList("NotesIdArray", Object.class);

            //initializes the list tha will store all the user notes
            ArrayList<Note> userNotesList = new ArrayList<>();


            //iterates through the list of user notes id and get the actual note and store it in the Note
            //object, and finally add it to the userNotesList
            for (Object rawId : userNotesId) {
                ObjectId id = (rawId instanceof ObjectId)
                        ? (ObjectId) rawId
                        : new ObjectId(rawId.toString());

                Document sessionDoc = notesCollection.find(eq("_id", id)).first();

                if (sessionDoc != null) {
                    Note currNote = new Note();
                    currNote.setTitle(sessionDoc.getString("title"));
                    currNote.setContent(sessionDoc.getString("content"));
                    userNotesList.add(currNote);
                }
            }


            //returns the final userNotesList containing all the user notes.
            return userNotesList;
        }
        return null;
    }

    /**
     * checks if a Note already exist by checking if there is a note
     * with the same title as the perimeter in the database.
     * @param noteTitle note title to check
     * @return true if it exists
     *          false, otherwise.
     */
    public boolean doesNoteTitleExist(User user ,String noteTitle){
        boolean doesTitleExist = false;
        //gets the user Document from database using the users username.
        Document userDoc = usersCollection.find(
                eq("username", user.getUsername())
        ).first();

        //if the user Document is not null
        if(userDoc != null){
            //gets the list of notes id in the user Document
            List<Object> userNotesIds = userDoc.getList("NotesIdArray", Object.class);
            //checks each note id and matches it with the noteTitle from perimeter to see if it exists already
            for(Object obj : userNotesIds){
                //the actual document of the note id that was stored in the NotesIdArray
                Document doc = notesCollection.find(
                        eq("_id", obj)
                ).first();
                //checks if the document title is equal to the title to be checked
                if(doc != null && doc.getString("title").equals(noteTitle)){
                    doesTitleExist = true;
                    break;
                }
            }
        }
        return doesTitleExist;
    }

    /**
     * creates a new note and adds it to the notesCollection
     * gets the note ID and adds it to the user Note ids stored in the user document
     * 
     * @param user  the user to update
     * @param noteTitle title of the note being created
     */
    public boolean createNote(User user, String noteTitle) {

        //checks if noteTitle already exists, and a note title in the database
        boolean doesTitleExist = doesNoteTitleExist(user, noteTitle);

        //if the newNoteTitle does not exist then add the note to the database collection.
        if(!doesTitleExist){
            // creates a new note
            Document note = new Document()
                    .append("title", noteTitle)
                    .append("content", "");
            // adds it to the note collection
            notesCollection.insertOne(note);
            // get the new note's id
            String id = note.getObjectId("_id").toHexString();
            // adds the note id to the list of notesIdArray stored in the user document
            // Fetch the user by username and Update the user's NotesIdArray in MongoDB
            usersCollection.updateOne(
                    new Document("username", user.getUsername()), // filter
                    new Document("$addToSet", new Document("NotesIdArray", id)) // update
            );
            return true;
        }
        //otherwise return false;
        return false;
    }

    /**
     *  deleteNote class, deletes the note with the provided title
     *  and is removed from the user array with notes ids
     * @param user the currently loggedIn user
     * @param noteTitle the notes title to be removed
     * @return true if deletion was successful
     *          false otherwise
     */
    public boolean deleteNote(User user, String noteTitle){
        ObjectId noteId = null;
        //checks if noteTitle already exists, and a note title in the database
        boolean doesTitleExist = false;
        for (Document doc : notesCollection.find()) {
            if (noteTitle.equals(doc.getString("title"))) {
                doesTitleExist = true;
                //gets the object id of note
                noteId  = doc.getObjectId("_id");
                break;
            }
        }
        //gets the currently loggedIn user document
        Document userDoc = usersCollection.find(
                eq("username", user.getUsername())
        ).first();

        //if deletion was successful then it returns true.
        if(doesTitleExist){
            //checks if the user has the note to be deleted using the noteId
            boolean userHasNote = false;
            if (userDoc != null) {
                List<String> userNotesIdArray = userDoc.getList("NotesIdArray", String.class);
                userHasNote = userNotesIdArray != null && userNotesIdArray.contains(noteId.toHexString());
            }

            //if user has the note
            if(userHasNote){
                try{
                    //first delete it from the notesCollection
                    notesCollection.deleteOne(eq("_id", noteId));
                    //then delete it from the currently loggedIn users NotesIdArray
                    usersCollection.updateOne(
                            new Document("username", user.getUsername()),
                            new Document("$pull", new Document("NotesIdArray", noteId.toHexString()))
                    );
                    //deletion was successful
                    return true;
                }catch(Exception e){
                    System.out.println("user may not have that note id: " + e);
                }
            }
        }
        //otherwise return false.
        return false;
    }

    public boolean editNoteTitle(User user, String oldTitle, String newTitle) {

        //checks if the both the old title and new title already exists.
        boolean doesOldTitleExist = doesNoteTitleExist(user, oldTitle);
        boolean doesNewTitleExist = doesNoteTitleExist(user, newTitle);

        //if the old title exists and the new title does not exist then
        if(doesOldTitleExist && !doesNewTitleExist){
            notesCollection.updateOne(
                    new Document("title", oldTitle),
                    new Document("$set", new Document("title", newTitle))
            );
            return true;
        }
        return false;
    }

    public boolean editNoteContent(User user, String title, String content) {
        //checks if noteTitle already exists, and a note title in the database
        boolean doesNoteTitleExist = doesNoteTitleExist(user, title);
        //if note title exists then
        if (doesNoteTitleExist) {
            notesCollection.updateOne(
                    new Document("title", title),
                    new Document("$set", new Document("content", content))
            );
            return true;
        }
        return false;
    }

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
     * getNotesCollection
     * @return the mongoDb Collection with all the users notes
     */
    private MongoCollection<Document> getNotesCollection() {
        MongoClient client = mongoDBClient.get();
        MongoDatabase db = client.getDatabase("AiStudyApp");
        return db.getCollection("Notes");
    }
}
