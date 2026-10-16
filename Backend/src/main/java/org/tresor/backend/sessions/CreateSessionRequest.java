package org.tresor.backend.sessions;

import java.util.ArrayList;

public class CreateSessionRequest {

    private String username;
    private String sessionType;
    private ArrayList<SessionFiles> files = new ArrayList<>();

    public CreateSessionRequest( String username, String sessionType, ArrayList<SessionFiles> files){
        this.username = username;
        this.sessionType = sessionType;
        this.files = files;
    }

    public String getUsername() {
        return username;
    }

    public String getSessionType() {
        return sessionType;
    }
    public ArrayList<SessionFiles> getFiles() {
        return files;
    }
}
