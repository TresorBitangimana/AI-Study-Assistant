package org.tresor.backend.aiModel;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.bson.Document;
import org.bson.types.ObjectId;
import org.tresor.backend.MongoDBClient;
import org.tresor.backend.account.User;
import org.tresor.backend.aiModel.ObjectClasses.Session;

import java.util.ArrayList;
import java.util.List;

import static com.mongodb.client.model.Filters.eq;

public class Sessions {

    private final MongoDBClient mongoDBClient = new MongoDBClient();

    MongoCollection<Document> usersCollection = getUsersCollection();
    MongoCollection<Document> sessionsCollection = getSessionsCollection();

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

    /**
     * checks the database if a session already exists with the same title
     * @param sessionTitle title to be checked
     * @return true if it exists,
     *          false otherwise
     */
    public boolean doesSessionTitleExist(String sessionTitle){
        boolean doesTitleExist = false;
        for(Document doc : sessionsCollection.find()){
            if(sessionTitle.equals(doc.getString("title"))){
                doesTitleExist = true;
            }
        }
        return doesTitleExist;
    }

    /**
     * creates a session ad adds it to the sessions collections
     * and add the session objects id to the user sessions id array.
     * @param user current user
     * @param title title of the session to be stored
     * @param sessionType session type of the session to be stored
     * @param content content of the session type ot be stored
     */
    public void createSession(User user, String title, String sessionType ,String content){
        //checks if a session with the same title already exists
        boolean doesTitleExist = doesSessionTitleExist(title);

        if(!doesTitleExist){

            //creates a new session document
            Document session = new Document()
                    .append("title", title)
                    .append("session_type", sessionType)
                    .append("content", content);

            //inserts the document to the
            sessionsCollection.insertOne(session);
            //get the document id to store in the users SessionsIdArray
            String sessionId = session.getObjectId("_id").toHexString();
            //updates the user document to add the new document's id to the users SessionsIdArray
            usersCollection.updateOne(
                    new Document("username", user.getUsername()),
                    new Document("$addToSet", new Document("SessionsIdArray", sessionId))
            );
        }
    }

    /**
     * get sessions, collect all the sessions in the user document's sessions id array.
     * @param user current user
     * @return return an arraylist of all the user sessions
     */
    public ArrayList<Session> getSessions(User user){

        //gets the current user document
        Document userDoc = usersCollection.find(
                eq("username", user.getUsername())
        ).first();

        //initializes the list that will store the session ids the user doc has
        ArrayList<?> userSessionsId;
        if(userDoc != null){ //if the user doc is not null
            //adds the list of user sessionsIdArray to the userSessionsId
            userSessionsId = (ArrayList<?>) userDoc.getList("SessionIdArray", ObjectId.class);

            //initializes the list tha will store all the user sessions
            ArrayList<Session> userSessionsList = new ArrayList<>();

            //iterates through the list of user sessions id and get the actual session and store it in the Session
            //object, and finally add it to the userSessionsList
            for(int i = 0; i < userSessionsId.size()-1; i++){
                //initialize a new session object on each iteration
                Session currSession = new Session();
                //find the session object in the database with the current session id from userSessionsId
                Document sessionDoc = sessionsCollection.find(
                        eq("_id", userSessionsId.get(i))
                ).first();
                //adds the userDoc information to the session object
                if(sessionDoc != null){
                    currSession.setTitle(sessionDoc.getString("title"));
                    currSession.setSessionType(sessionDoc.getString("session_type"));
                    currSession.setContent(sessionDoc.getString("content"));
                }
                //adds the session object to the userSessionsList
                userSessionsList.add(currSession);
            }
            //returns the final userSessionsList containing all the user sessions.
            return userSessionsList;
        }
        return null;
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
     * getSessionsCollection
     * @return the mongoDb Collection with all the users sessions data
     */
    private MongoCollection<Document> getSessionsCollection() {
        MongoClient client = mongoDBClient.get();
        MongoDatabase db = client.getDatabase("AiStudyApp");
        return db.getCollection("Sessions");
    }
}

