package org.tresor.backend.aiModel;

import org.tresor.backend.sessions.SessionFile;

public class SessionModel {

    private AiModelClient aimodelClient = new AiModelClient("llama3.2");
    private String sessionType;
    private SessionFile resources;

    private final String sessionSystemPrompt = """
            
            you are an ai model xD; to be continued.
            
            """;
    public SessionModel(){}

    public SessionModel(String sessionType, SessionFile resources){
        this.sessionType = sessionType;
        this.resources = resources;
    }

}
