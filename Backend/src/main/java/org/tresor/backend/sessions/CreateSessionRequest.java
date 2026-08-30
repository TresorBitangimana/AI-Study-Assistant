package org.tresor.backend.sessions;

import java.util.ArrayList;
import java.util.ArrayList;

public class CreateSessionRequest {

    private final String username;
    private final String sessionType;
    private ArrayList<Object> files = new ArrayList<>();

    public CreateSessionRequest( String username, String sessionTypeType, ArrayList<Object> files){
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
    public ArrayList<Object> getFiles() {
        return files;
    }
}
