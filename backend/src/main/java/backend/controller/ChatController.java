package backend.controller;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;

import backend.dto.ChatMessage;
import backend.dto.TypingMessage;
import backend.dto.UserStatusMessage;

@Controller
public class ChatController {

    @MessageMapping("/chat")

    @SendTo("/topic/messages")
    public ChatMessage sendMessage(
            ChatMessage message
    ) {

        return message;
    }

    @MessageMapping("/typing")

    @SendTo("/topic/typing")
    public TypingMessage typing(
            TypingMessage message
    ) {

        return message;
    }

    // STEP 7B — USER JOIN EVENT

    @MessageMapping("/join")

    @SendTo("/topic/online")
    public UserStatusMessage join(
            UserStatusMessage message
    ) {

        return message;
    }
}