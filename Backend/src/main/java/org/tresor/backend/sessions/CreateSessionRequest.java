package org.tresor.backend.sessions;

import java.util.ArrayList;

public class CreateSessionRequest {

    private String username;
    private String sessionType;
    private String sessionTitle;
    private final ArrayList<SessionFiles> files;

    public CreateSessionRequest( String username, String sessionType, String sessionTitle, ArrayList<SessionFiles> files){
        this.username = username;
        this.sessionType = sessionType;
        this.sessionTitle = sessionTitle;
        this.files = files;
    }

    public String getUsername() {
        return username;
    }
    public String getSessionType() {
        return sessionType;
    }
    public String getSessionTitle() {
        return sessionTitle;
    }
    public ArrayList<SessionFiles> getFiles() {
        return files;
    }
}
