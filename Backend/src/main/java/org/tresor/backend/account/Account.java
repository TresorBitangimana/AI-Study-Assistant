package org.tresor.backend.account;

import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoCollection;
import com.mongodb.client.MongoDatabase;
import org.mindrot.jbcrypt.BCrypt;
import org.tresor.backend.MongoDBClient;
import org.bson.Document;

public class Account {

    MongoDBClient mongoDBClient = new MongoDBClient();
    MongoClient client = mongoDBClient.get();
    MongoDatabase db = client.getDatabase("AiStudyApp");
    MongoCollection<Document> usersCollection = db.getCollection("Users");

    public Account(){}

    public void logIn(){}

    /**
     * creates a new user and stole the user in the userCollection (users)
     * @param user the user to be created
     */
    public void createAccount(User user){
        // Hash the password with BCrypt (10 = work factor/salt rounds)
        String hashedPassword = BCrypt.hashpw(user.getPassword(), BCrypt.gensalt(10));

        // Build and insert the user document
        Document newUser = new Document("username", user.getUsername())
                .append("password", hashedPassword);
        usersCollection.insertOne(newUser);
    }

    /**
     * checks if a user exists in the database
     * @param user user to be compared
     * @return true if a user already exists
     *         false if a user does not exist
     */
    public boolean doesUserExists(User user){
        // Fetch the user by username only
        Document result = usersCollection.find(new Document("username", user.getUsername())).first();

        if (result == null) return false; // No user with that username

        // Compare the raw password against the stored hash
        String storedHash = result.getString("password");
        return BCrypt.checkpw(user.getPassword(), storedHash);
    }
}
