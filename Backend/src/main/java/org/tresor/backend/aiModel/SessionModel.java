package org.tresor.backend.aiModel;

import org.apache.pdfbox.Loader;
import org.apache.pdfbox.pdmodel.PDDocument;
import org.apache.pdfbox.text.PDFTextStripper;
import org.tresor.backend.sessions.CreateSessionRequest;
import org.tresor.backend.sessions.SessionFiles;

import java.util.ArrayList;
import java.util.Base64;
import java.util.HashMap;

import static org.tresor.backend.aiModel.ChatBot.aiModelClient;

public class SessionModel {

    private String sessionType;
    private SessionFiles resources;

    private final String sessionFlashCardsPrompt = """
        You are an AI study assistant that creates flashcards from a student's study material.

        Your job is to read the study material provided below and generate flashcards
        that cover every important concept, definition, fact, and idea in the material.

        RULES:

        - Output ONLY the flashcards, nothing else (no intro, no summary, no closing remarks)
        - Format every flashcard EXACTLY like this, with no extra formatting or numbering:
          Q: <question>
          A: <answer>
        - Put one blank line between each flashcard
        - Keep questions clear and specific enough to have one correct answer
        - Keep answers concise but complete
        - Base every question and answer strictly on the provided study material —
          do not add outside information or make anything up
        - Generate as many flashcards as needed to cover the material thoroughly

        STUDY MATERIAL:
        %s
        """;
    private final String sessionQuizPrompt = """
        You are an AI study assistant that creates multiple-choice quizzes from a student's study material.

        Your job is to read the study material provided below and generate multiple-choice
        questions that test understanding of the key concepts, facts, and ideas in the material.

        RULES:

        - Output ONLY the quiz, nothing else (no intro, no summary, no closing remarks)
        - Format every question EXACTLY like this, with no extra formatting or numbering scheme:
          Q: <question>
          A) <option 1>
          B) <option 2>
          C) <option 3>
          D) <option 4>
          Answer: <correct letter>
        - Each question must have exactly 4 answer choices
        - Only one choice should be correct
        - Make incorrect choices plausible, not obviously wrong
        - Put one blank line between each question
        - Base every question strictly on the provided study material —
          do not add outside information or make anything up
        - Generate as many questions as needed to cover the material thoroughly

        STUDY MATERIAL:
        %s
        """;
    private final String sessionChatPrompt = """
        You are an AI study assistant helping a student understand their own study material
        through conversation.

        Your job is to answer the student's questions using ONLY the study material provided
        below as your source of truth.

        RULES:

        - Base your answers strictly on the provided study material
        - If the answer isn't in the material, say so honestly instead of making something up
        - Keep answers clear, direct, and appropriately detailed for the question asked
        - You may explain, clarify, summarize, or quiz the student on the material if they ask
        - Do not invent facts that aren't supported by the study material

        STUDY MATERIAL:
        %s
        """;
    private final String sessionExplainPrompt = """
        You are an AI study assistant that explains study material in a way that is both
        thorough and easy to understand.

        Your job is to read the study material provided below and explain its contents
        in as much detail as possible, while keeping every explanation as simple as possible.

        RULES:

        - Cover every concept, term, and idea found in the study material — don't skip anything important
        - Break down complex ideas into simple, plain language
        - Use short sentences, everyday words, and analogies or examples where they help understanding
        - Organize the explanation logically (e.g. by topic or in the order concepts appear)
        - Do not oversimplify to the point of losing important detail — be thorough AND simple
        - Do not add outside information or make anything up beyond the provided material

        STUDY MATERIAL:
        %s
        """;

    /**
     * Empty Constructor
     */
    public SessionModel(){}

    /**
     * Constructor
     * @param sessionType Session Type
     * @param resources User resources
     */
    public SessionModel(String sessionType, SessionFiles resources){
        this.sessionType = sessionType;
        this.resources = resources;
    }

    /**
     * Session Model AI, receives a prompt and responds
     * @param prompt prompt
     * @return a response from the current AI model
     */
    public String sessionModelAi(String prompt){
        try {
            return aiModelClient.chat(prompt);
        } catch (Exception ignored) {
            return "Sorry, I can't help with that";
        }
    }

    /**
     * receives user resources and makes a call to the AI model to create flashcards
     * @param userResources user files
     * @return a formated string of question and answers to be used for flashcards
     */
    public String createSession(CreateSessionRequest userResources){
        String response = "";
        HashMap<String, ArrayList<SessionFiles>> sortedResources = fileSort(userResources);
        //calls a method to combine all the files with the system prompt to create to final prompt
        //that include both the prompt and the files from the user as a string
        String finalPrompt = combinePromptAndFiles(sortedResources, userResources.getSessionType());
        //call the AI using the final prompt
        response = sessionModelAi(finalPrompt); //calls the AI
        return response; //returns the response form the Ai
    }

    /**
     * combines all the user resources with the appropriate prompt based on session type.
     * @param sortedResources sorted resources.
     * @param sessionType session type
     * @return final prompt containing the system prompt and user uploaded files as a string
     */
    public String combinePromptAndFiles(HashMap<String, ArrayList<SessionFiles>> sortedResources, String sessionType){

        String finalPrompt = "";

        //sortedResources contains only one type of files text Files or PDFs
        if(sortedResources.size() == 1){
            if(sortedResources.containsKey("text")){ //call the processText handler methods

                String filesAsString = processText(sortedResources.get("text"));
                //adds the PDFs string to the prompt
                finalPrompt  = combineAppropriatePrompt(filesAsString, sessionType);
            }
            else if(sortedResources.containsKey("nonText")){
                //call the processPDF or other nontextFiles handler methods
                String filesAsString = processPDF(sortedResources.get("nonText")); //creates a string containing
                //adds the PDFs string to the prompt
                finalPrompt = combineAppropriatePrompt(filesAsString, sessionType);
            }
        }else if(sortedResources.size() == 2){ //sorted Resources Contains both Text and PDF files
            //call methods that processBoth nonText and Text
            String textFilesAsString = processText(sortedResources.get("text")); //call the processText handler methods
            String nonTextFileAsString = processPDF(sortedResources.get("nonText")); //creates a string containing all the PDF files uploaded.
            //combines all into one string
            String combinedFilesString = textFilesAsString.concat(nonTextFileAsString);
            //adds the PDFs string to the prompt
            finalPrompt = combineAppropriatePrompt(combinedFilesString, sessionType);
        }
        return finalPrompt;
    }
    public String combineAppropriatePrompt(String filesAsString, String sessionType){

        return switch (sessionType) {
            case "Create Flashcards" -> sessionFlashCardsPrompt.formatted(filesAsString);
            case "Generate Quiz" -> sessionQuizPrompt.formatted(filesAsString);
            case "Chat with AI" -> sessionChatPrompt.formatted(filesAsString);
            case "Explain like I'm 5" -> sessionExplainPrompt.formatted(filesAsString);
            default -> null;
        };
    }
    /**
     * takes in an array list of text files and combine their content into a single string output
     * @param files An arraylist of user files
     * @return a string containing the content of all text files provided
     */
    public String processText(ArrayList<SessionFiles> files){
        StringBuilder sb = new StringBuilder();
        for (SessionFiles file : files) {
            sb.append("--- ").append(file.getName()).append(" ---\n");
            sb.append(file.getContent()).append("\n\n");
        }
        return sb.toString();
    }

    /**
     *  takes in an array of PDF files and turn them into text and combines them
     * @param files An array of user files
     * @return a string containing content of all PDF files provided
     */
    public String processPDF(ArrayList<SessionFiles> files){
        StringBuilder sb = new StringBuilder();

        for (SessionFiles file : files){
            // Decode the Base64 PDF content sent by the frontend and extract its text.
            byte[] pdfBytes = Base64.getDecoder().decode(file.getContent());
            try(PDDocument doc = Loader.loadPDF(pdfBytes)){
                sb.append("--- ").append(file.getName()).append(" ---\n");
                sb.append(new PDFTextStripper().getText(doc)).append("\n\n");
            } catch (java.io.IOException e) {
                throw new RuntimeException(e);
            }

        }
        return sb.toString();
    }

    /**
     * Divides the Files from the user into two groups, text files and non text files
     * @param userResources CreateSessionRequest object contains all the user resources information
     * @return a HashMap of either textFiles, nonTextFiles, or both, or handles if no files are provided
     */
    public HashMap<String, ArrayList<SessionFiles>> fileSort(CreateSessionRequest userResources){

        ArrayList<SessionFiles> textUserFiles = new ArrayList<>();
        ArrayList<SessionFiles> nonTextUserFiles = new ArrayList<>();

        //checks and identify the resources
        for(int i = 0; i < userResources.getFiles().size(); i++){
            String resourceName = userResources.getFiles().get(i).name;
            //processes the files depending on file types.
            //if file is text based it is put into the textUserFiles arrayList
            //otherwise nonTextUserFiles
            if(resourceName.toLowerCase().endsWith(".pdf")){ //PDFs
                nonTextUserFiles.add(userResources.getFiles().get(i));
            }
            else{ //All text files type
                textUserFiles.add(userResources.getFiles().get(i));
            }
        }
        HashMap<String, ArrayList<SessionFiles>> sortedFiles = new HashMap<>();
        //checks if the ArrayLists, textUserFiles or nonTextUserFiles are empty or not and
        //sort them accordingly

        if(!textUserFiles.isEmpty() && nonTextUserFiles.isEmpty()){ // if textUserFiles is not empty
            sortedFiles.put("text", textUserFiles);
        }else if(textUserFiles.isEmpty() && !nonTextUserFiles.isEmpty()){ // if nonTextUserFiles is not empty
            sortedFiles.put("nonText", nonTextUserFiles);
        }else if(!textUserFiles.isEmpty() && !nonTextUserFiles.isEmpty()){ // if both textUserFiles and nonTextUserFiles are not empty
            sortedFiles.put("text", textUserFiles);
            sortedFiles.put("nonText", nonTextUserFiles);
        }else{ // both textUserFiles and nonTextUserFiles are empty
            //user did not provide files, implement functions to handle that
            throw new IllegalArgumentException("No files were uploaded for this session");
        }
        return sortedFiles;
    }
}
