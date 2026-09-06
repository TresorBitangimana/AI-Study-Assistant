package org.tresor.backend.sessions;

import java.util.ArrayList;

public class CreateSessionRequest {

    private final String username;
    private final String sessionType;
    private ArrayList<SessionFile> files = new ArrayList<>();

    public CreateSessionRequest( String username, String sessionTypeType, ArrayList<SessionFile> files){
        this.username = username;
        this.sessionType = sessionTypeType;
        this.files = files;
    }

    public String getUsername() {
        return username;
    }

    public String getSessionType() {
        return sessionType;
    }
    public ArrayList<SessionFile> getFiles() {
        return files;
    }
}
