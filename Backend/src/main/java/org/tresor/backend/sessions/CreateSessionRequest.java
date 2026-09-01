package org.tresor.backend.sessions;

import java.util.ArrayList;

public class CreateSessionRequest {

    private final String username;
    private final String sessionType;
    private ArrayList<FileObject> files = new ArrayList<>();

    public CreateSessionRequest( String username, String sessionTypeType, ArrayList<FileObject> files){
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
    public ArrayList<FileObject> getFiles() {
        return files;
    }
}
