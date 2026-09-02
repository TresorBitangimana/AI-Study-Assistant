package org.tresor.backend.aiModel;

import org.tresor.backend.sessions.FileObject;

public class SessionModel {

    AiModelClient aimodelClient = new AiModelClient("llama3.2");

    private final String sessionSystemPrompt = """
            
            you are an ai model xD; to be continued.
            
            """;
    public SessionModel(){}

    public SessionModel(String sessionType, FileObject resources){
        
    }

}
