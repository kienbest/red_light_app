package backend.dto;

public class TypingMessage {

    private String username;

    public TypingMessage() {
    }

    public TypingMessage(String username) {
        this.username = username;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}