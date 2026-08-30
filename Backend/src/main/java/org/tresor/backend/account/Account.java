package org.tresor.backend.account;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.mindrot.jbcrypt.BCrypt;
import org.tresor.backend.MongoDBClient;
import org.bson.Document;

public class Account {

    private final MongoDBClient mongoDBClient = new MongoDBClient();

    public Account(){}

    public void logIn(){}

    /**
     * creates a new user and stole the user in the userCollection (users)
     * @param user the user to be created
     */
    public void createAccount(User user){
        MongoCollection<Document> usersCollection = getUsersCollection();
        // Hash the password with BCrypt (10 = work factor/salt rounds)
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(10));

        // Build and insert the user document
        Document newUser = new Document("username", user.getUsername())
                .append("password", hashedPassword)
                .append("full_name", user.getFullName());

        usersCollection.insertOne(newUser);
    }

    /**
     * Seachers the database to check if the user exists
     * @param username Username to be searched
     * @return True is the username exists
     *          False if the username does not exist
     */
    public boolean doesUserNameExist(String username) {
        MongoCollection<Document> usersCollection = getUsersCollection();
        Document result = usersCollection.find(new Document("username", username)).first();
        return result != null;
    }

    /**
     * checks if a user exists in the database
     * @param user user to be compared
     * @return true if a user already exists
     *         false if a user does not exist
     */
    public boolean doesUserExists(User user) {
        MongoCollection<Document> usersCollection = getUsersCollection();
        Document result = usersCollection.find(new Document("username", user.getUsername())).first();

        if (result == null) {
            return false;
        }
        String storedHash = result.getString("password");
        String rawPassword = user.getPassword();

        if (storedHash == null || rawPassword == null) {
            return false;
        }
        return BCrypt.checkpw(rawPassword, storedHash);
    }

    public User findUserByUsername(String username) {
        MongoCollection<Document> usersCollection = getUsersCollection();
        Document result = usersCollection.find(new Document("username", username)).first();

        if (result == null) {
            return null;
        }

        return new User(
                result.getString("full_name"),
                result.getString("username"),
                null
        );
    }

    private MongoCollection<Document> getUsersCollection() {
        MongoClient client = mongoDBClient.get();
        MongoDatabase db = client.getDatabase("AiStudyApp");
        return db.getCollection("Users");
    }
}
