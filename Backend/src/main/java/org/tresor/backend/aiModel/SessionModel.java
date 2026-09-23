package org.tresor.backend.aiModel;

import org.tresor.backend.sessions.CreateSessionRequest;
import org.tresor.backend.sessions.SessionFiles;

public class SessionModel {

    private AiModelClient aimodelClient = new AiModelClient("llama3.2");
    private String sessionType;
    private SessionFiles resources;

    private final String sessionFlashCardsPrompt = """
            
            you are an ai model xD; to be continued.
            
            """;
    private final String sessionQuizPrompt = """
            
            you are an ai model xD; to be continued.
            
            """;
    private final String sessionChatPrompt = """
            
            you are an ai model xD; to be continued.
            
            """;
    private final String sessionExplainPrompt = """
            
            you are an ai model xD; to be continued.
            
            """;


    public SessionModel(){}

    public SessionModel(String sessionType, SessionFiles resources){
        this.sessionType = sessionType;
        this.resources = resources;
    }

    public void sessionChat(CreateSessionRequest userResources){

        String sessionType = userResources.getSessionType();


        if(sessionType.equals("Create Flashcards")){
            sessionFlashCards(userResources, "");
        }
        else if(sessionType.equals("Generate Quiz")){
            sessionQuiz(userResources, "");
        }
        else if(sessionType.equals("Chat with AI")){
            sessionChat(userResources, "");
        }
        else if(sessionType.equals("Explain like I'm 5")){
            sessionExplain(userResources, "");
        }
        else{

        }
    }

    public void sessionFlashCards(CreateSessionRequest userResources,String prompt){}
    public void sessionQuiz(CreateSessionRequest userResources,String prompt){}
    public void sessionChat(CreateSessionRequest userResources,String prompt){}
    public void sessionExplain(CreateSessionRequest userResources,String prompt){}



    public void processPDF(SessionFiles file){

    }

    public void processText(SessionFiles file){

    }

}
