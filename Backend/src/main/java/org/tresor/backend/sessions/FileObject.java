package org.tresor.backend.sessions;

public class FileObject {

    public String name;
    public String type;
    public String size;
    public String lastModified;
    public String content;

    public FileObject(){}

    public FileObject(String name, String type, String size, String lastModified, String content){

        this.name = name;
        this.type = type;
        this.size = size;
        this.lastModified = lastModified;
        this.content = content;

    }

    public String getName() {
        return name;
    }
    public String getType() {
        return type;
    }
    public String getSize() {
        return size;
    }
    public String getLastModified() {
        return lastModified;
    }
    public String getContent() {
        return content;
    }
}
