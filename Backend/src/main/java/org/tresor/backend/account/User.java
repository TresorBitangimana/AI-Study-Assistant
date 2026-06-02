package org.tresor.backend.account;

public class User {

    private String username;
    private String password;
    private String fullName;

    public User(String fullName, String username, String password) {
        this.username = username;
        this.password = password;
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public String getPassword() {
        return password;
    }

    public String getFullName() {
        return fullName;
    }
}
