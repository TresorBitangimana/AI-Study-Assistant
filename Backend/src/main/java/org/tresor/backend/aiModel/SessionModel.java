package org.tresor.backend.aiModel;

import org.tresor.backend.sessions.CreateSessionRequest;
import org.tresor.backend.sessions.SessionFiles;

import java.util.ArrayList;
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


    public SessionModel(){}

    public SessionModel(String sessionType, SessionFiles resources){
        this.sessionType = sessionType;
        this.resources = resources;
    }

    public String sessionChat(CreateSessionRequest userResources){

        String sessionType = userResources.getSessionType();

        if(sessionType.equals("Create Flashcards")){
            return sessionFlashCards(userResources);
        }
        else if(sessionType.equals("Generate Quiz")){
            sessionQuiz(userResources);
        }
        else if(sessionType.equals("Chat with AI")){
            sessionChatWithAi(userResources);
        }
        else if(sessionType.equals("Explain like I'm 5")){
            sessionExplain(userResources);
        }
        else{
        }
        return null;
    }

    public String sessionModelAi(String prompt){
        try {
            return aiModelClient.chat(prompt);
        } catch (Exception ignored) {
            return "Sorry, I can't help with that";
        }

    }

    /**
     * receives user resources and makes a call to the ai model to create flashcards
     * @param userResources user files
     * @return a formated string of question and answers to be used for flashcards
     */
    public String sessionFlashCards(CreateSessionRequest userResources){

        String response = "";

        HashMap<String, ArrayList<SessionFiles>> sortedResources = fileSort(userResources);

        if(sortedResources.size() == 1){
            if(sortedResources.containsKey("text")){
                String filesAsString = processText(sortedResources.get("text"));
                String finalPrompt = sessionFlashCardsPrompt.formatted(filesAsString);
                response = sessionModelAi(finalPrompt);
            }
            else if(sortedResources.containsKey("nonText")){
                //call the processPDF or other nontextFiles handler methods
            }
        }else if(sortedResources.size() == 2){
            //call methods that processBoth nonText and Text
        }
        return response;
    }
    public void sessionQuiz(CreateSessionRequest userResources){
        String finalPrompt = sessionQuizPrompt.formatted(userResources);
        HashMap<String, ArrayList<SessionFiles>> sortedResources = fileSort(userResources);

    }
    public void sessionChatWithAi(CreateSessionRequest userResources){
        String finalPrompt = sessionChatPrompt.formatted(userResources);
        HashMap<String, ArrayList<SessionFiles>> sortedResources = fileSort(userResources);

    }
    public void sessionExplain(CreateSessionRequest userResources){
        String finalPrompt = sessionExplainPrompt.formatted(userResources);
        HashMap<String, ArrayList<SessionFiles>> sortedResources = fileSort(userResources);

    }

    public String processText(ArrayList<SessionFiles> files){
        StringBuilder sb = new StringBuilder();
        for (SessionFiles file : files) {
            sb.append("--- ").append(file.getName()).append(" ---\n");
            sb.append(file.getContent()).append("\n\n");
        }
        return sb.toString();
    }

    public void processPDF(ArrayList<SessionFiles> file){}
    public void processAll(ArrayList<SessionFiles> files){}

    /**
     * Divides the Files from the user into two groups, text files and non text files
     * @param userResources CreateSessionRequest object contains all the user resources information
     * @return a HashMap of either textFiles, nonTextFiles, or both, or handles if no files are provided
     */
    public HashMap<String, ArrayList<SessionFiles>> fileSort(CreateSessionRequest userResources){

        ArrayList<SessionFiles> textUserFiles = new ArrayList<>();
        ArrayList<SessionFiles> nonTextUserFiles = new ArrayList<>();

        //checks and identify the resources
        for(int i = 0; i < userResources.getFiles().size()-1; i++){
            String resourceName = userResources.getFiles().get(i).name;
            //processes the files depending on file types.
            //if file is text based it is put into the textUserFiles arrayList
            //otherwise nonTextUserFiles
            if(resourceName.toLowerCase().endsWith(".pdf")){ //PDFs
                textUserFiles.add(userResources.getFiles().get(i));
            }
            else{ //All text files type
                nonTextUserFiles.add(userResources.getFiles().get(i));
            }
        }

        HashMap<String, ArrayList<SessionFiles>> sortedFiles = new HashMap<>();

        if(!textUserFiles.isEmpty() && nonTextUserFiles.isEmpty()){
            sortedFiles.put("text", textUserFiles);
        }else if(textUserFiles.isEmpty() && !nonTextUserFiles.isEmpty()){
            sortedFiles.put("nonText", nonTextUserFiles);
        }else if(!textUserFiles.isEmpty() && !nonTextUserFiles.isEmpty()){
            sortedFiles.put("text", textUserFiles);
            sortedFiles.put("nonText", nonTextUserFiles);
        }else{
            //user did not provide files, implement functions to handle that
            System.out.println("No resources provided");
        }
        return sortedFiles;
    }


}
