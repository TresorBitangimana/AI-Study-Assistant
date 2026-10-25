package org.tresor.backend.notes;

public class NoteRequest {

    private String title;
    private String newTitle;
    private String content;

    public NoteRequest(String title, String content) {
        this.title = title;
        this.content = content;
        newTitle = "";
    }


    public String getTitle() {
        return title;
    }
    public String getNewTitle(){
        return newTitle;
    }
    public String getContent(){
        return content;
    }
}
