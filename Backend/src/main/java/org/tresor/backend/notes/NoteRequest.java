package org.tresor.backend.notes;

public class NoteRequest {

    private String title;

    public NoteRequest(String username, String title) {
        this.title = title;
    }


    public String getTitle() {
        return title;
    }
}
