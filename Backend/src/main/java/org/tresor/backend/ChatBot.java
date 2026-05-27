package org.tresor.backend;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ChatBot {

    static AiModelClient aiModelClient = new AiModelClient("llama3.2");
    private String frontendMDPath;
    private final String systemPrompt = """
            You are an AI Assistant that helps users navigate through the AI study app.
            Your job is to answer user questions and use the provided .md file to assist
            with navigation or questions about the app.
            
            RULES:
            
            - Keep the responses very short
            - If a user asks an off topic question simply reply to the question as short at possible
            - You can Answer other user questions that are not related to navigation as well
            - use information from the provided documentation
            - If you don't know the answer, reply: "Sorry, I can't help with that"
            - Do not make up answers
            - If a user greet you, replay with {greeting of your choice or 
                that's appropriate to the users greeting} + "how may I assist you?"
            -  
            
            DOCUMENTATION:
            %s
            """;

    public ChatBot() throws IOException {

        frontendMDPath = Files.readString(Path.of("src/main/resources/frontend.md"));
        try{
            // Send system prompt silently on init
            String systemMessage = systemPrompt.formatted(frontendMDPath);
            aiModelClient.chat(systemMessage);

        }catch (IOException e){
            throw new RuntimeException(e);
        }
        catch(Exception e){
            throw new RuntimeException("Error while running Ai model", e);
        }
    }

    public String chatToBot(String input){
        try{
            return aiModelClient.chat(input);
        }catch(Exception e){
            throw new RuntimeException(e);
        }
    }
}
