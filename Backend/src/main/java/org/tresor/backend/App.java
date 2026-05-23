package org.tresor.backend;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/study_assistant")
@CrossOrigin("*")

public class App {

    Dotenv dotenv = Dotenv.configure()
            .ignoreIfMissing()
            .load();

    String LocalAiBaseUrl = dotenv.get("LOCAL_AI_BASE_URL");

    public static void main(String[] args) {
        

    }

}
