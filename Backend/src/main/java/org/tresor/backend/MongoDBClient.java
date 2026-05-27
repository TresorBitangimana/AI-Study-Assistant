package org.tresor.backend;

import com.mongodb.*;
import com.mongodb.client.MongoClient;
import com.mongodb.client.MongoClients;
import com.mongodb.client.MongoDatabase;
import io.github.cdimascio.dotenv.Dotenv;

public class MongoDBClient {

    private static MongoClient client;
    private final MongoClientSettings settings;

    /**
     * Constructor
     */
    public MongoDBClient(){
        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        String connectionString = dotenv.get("MONGODB_CONNECTION_STRING");

        ServerApi serverApi = ServerApi.builder()
                .version(ServerApiVersion.V1)
                .build();

        settings = MongoClientSettings.builder()
                .applyConnectionString(new ConnectionString(connectionString))
                .serverApi(serverApi)
                .build();
    }

    /**
     * getter method for the MongoDB Client, Returns a singleton MongoClient instance.
     * @return a shared MongoClient instance
     */
    public MongoClient get(){

        //checks if a mongoDB instance already exists, if not creates a new instance.
        if(client == null){
            try{
                client = MongoClients.create(settings);
            }catch(MongoException e){
                throw new RuntimeException("Failed to create a MongoDB client", e);
            }
        }
        return client;
    }

    /**
     * creates a new database
     * @param databaseName name of the database to create
     * @param collectionName name of the collection to add
     */
    public void createDatabase(MongoClient clientInstance,String databaseName, String collectionName){
        //checks and throws an error if the database being created already exists.
        for(String name: clientInstance.listDatabaseNames()){
            if(name.equals(databaseName));
            throw new RuntimeException("Attempted to create a database that already exists");
        }
        clientInstance.getDatabase(databaseName).createCollection(collectionName);
    }

//    /**
//     * database getter method, gets and returns a database form client provided a name;
//     * @param name name of the client to get
//     * @return a MongoDb database
//     */
//    public MongoDatabase getDatabase(String name){
//        return client.getDatabase(name);
//    }

}
