package org.tresor.backend.aiModel.ObjectClasses;

public class Session {

    private String title;
    private String sessionType;
    private String content;

    public Session(){}
    public Session(String title, String sessionType, String content){
        this.title = title;
        this.sessionType = sessionType;
        this.content = content;
    }

    public String getTitle() {
        return title;
    }

    public String getSessionType() {
        return sessionType;
    }

    public String getContent() {
        return content;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setSessionType(String sessionType) {
        this.sessionType = sessionType;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
