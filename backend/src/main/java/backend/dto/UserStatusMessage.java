package backend.dto;

public class UserStatusMessage {

    private String username;

    public UserStatusMessage() {
    }

    public UserStatusMessage(String username) {

        this.username = username;
    }

    public String getUsername() {

        return username;
    }

    public void setUsername(String username) {

        this.username = username;
    }
}