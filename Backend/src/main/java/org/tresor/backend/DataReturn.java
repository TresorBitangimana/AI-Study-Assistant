package org.tresor.backend;

import org.tresor.backend.aiModel.ObjectClasses.Session;
import org.tresor.backend.notes.Note;

import java.util.ArrayList;

public class DataReturn {

    private ArrayList<Session> sessionsList = new ArrayList<>();
    private ArrayList<Note> notesList = new ArrayList<>();

    public DataReturn(){}

    public ArrayList<Session> getSessionsList() {
        return sessionsList;
    }

    public ArrayList<Note> getNotesList() {
        return notesList;
    }

    public void setSessionsList(ArrayList<Session> sessionsList) {
        this.sessionsList = sessionsList;
    }

    public void setNotesList(ArrayList<Note> notesList) {
        this.notesList = notesList;
    }
}
