package backend.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class NotificationController {

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @GetMapping("/api/notify")
    public String notifyUser(
            @RequestParam String message
    ) {

        messagingTemplate.convertAndSend(
                "/topic/notifications",
                message
        );

        return "Notification sent!";
    }
}