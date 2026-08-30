package org.tresor.backend;

import com.mongodb.*;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import io.github.cdimascio.dotenv.Dotenv;

public class MongoDBClient {

    private static MongoClient client;
    private final String connectionString;

    /**
     * Constructor
     */
    public MongoDBClient() {
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        connectionString = dotenv.get("MONGODB_CONNECTION_STRING");
    }

    /**
     * getter method for the MongoDB Client, Returns a singleton MongoClient
     * instance.
     * 
     * @return a shared MongoClient instance
     */
    public MongoClient get() {

        // checks if a mongoDB instance already exists, if not creates a new instance.
        if (client == null) {
            try {
                ServerApi serverApi = ServerApi.builder()
                        .version(ServerApiVersion.V1)
                        .build();

                MongoClientSettings settings = MongoClientSettings.builder()
                        .applyConnectionString(new ConnectionString(connectionString))
                        .serverApi(serverApi)
                        .build();
                client = MongoClients.create(settings);
            } catch (MongoException e) {
                throw new RuntimeException("Failed to create a MongoDB client", e);
            }
        }
        return client;
    }

}
