package org.tresor.backend.Notes;

public class Note {

    private String title;
    private String content;

    /**
     * Constuctor
     * @param title notes title
     */
    public Note(String title){
        this.title = title;
        this.content = "";
    }
    public Note(){}


    //getter methods
    public String getTitle() {
        return title;
    }
    public String getContent() {
        return content;
    }

    //setter methods
    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
