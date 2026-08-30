package org.tresor.backend.notes;

public class NoteRequest {

    private String username;
    private String title;

    public NoteRequest(String username, String title) {
        this.username = username;
        this.title = title;
    }

    public String getUsername() {
        return username;
    }

    public String getTitle() {
        return title;
    }
}
