package org.tresor.backend.aiModel;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;

public class ChatBot {

    //ai model client to access the ai
    static AiModelClient aiModelClient = new AiModelClient("llama3.2");

    //path to the .md file with frontend details to assist uses with navigation questions
    private String frontendMDPath;
    //system prompt to give the chatbot instructions
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
            - when you respond to the users greeting do you surround the response with {}
            
            DOCUMENTATION:
            %s
            """;

    /**
     * ChatBot Constructor
     * <p>boots the ai model before the first user prompt</p>
     * @throws IOException
     */
    public ChatBot() throws IOException {

        //paths to bot frontend resources to use to answer user questions
        frontendMDPath = Files.readString(Path.of("src/main/resources/frontend.md"));
        //boots the ai model by giving it a prompt with instructions and also the
        //MD file containing all the frontend information to be used to answer
        //user questions
        try {
            String systemMessage = systemPrompt.formatted(frontendMDPath);
            aiModelClient.chat(systemMessage);
        } catch (Exception ignored) {
            // Fall through and let the first real chat request try again.
        }
    }

    public String chatToBot(String input){
        try{
            return aiModelClient.chat(input);
        }catch(Exception e){
            return "Sorry, I can't help with that";
        }
    }
}
