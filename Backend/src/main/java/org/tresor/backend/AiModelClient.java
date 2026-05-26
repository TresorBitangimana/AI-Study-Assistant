package org.tresor.backend;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.databind.ObjectMapper;
import io.github.cdimascio.dotenv.Dotenv;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.ArrayList;
import java.util.List;

public class AiModelClient {

    // Serialize requests and parse responses without building JSON by hand.
    private static final ObjectMapper MAPPER = new ObjectMapper();
    private static final HttpClient CLIENT = HttpClient.newHttpClient();

    private final String baseUrl;
    // Conversation history is sent back on each call to preserve context.
    private final List<ChatMessage> history = new ArrayList<>();
    private final String currentModel;

    /**
     * Constructor
     * @param currentModel current ai model being used
     */
    AiModelClient(String currentModel) {
        this.currentModel = currentModel;

        Dotenv dotenv = Dotenv.configure()
                .ignoreIfMissing()
                .load();

        this.baseUrl = dotenv.get("LOCAL_AI_BASE_URL");
    }

    /**
     * creates the chat model with all the logic
     * @param userMessage the user input
     * @return A String response of the Ai to the userMessage input
     * @throws Exception if the AI request cannot be serialized, sent, or parsed from the response body
     */
    public String chat(String userMessage) throws Exception {
        // Append the user's latest message before sending the full conversation.
        history.add(new ChatMessage("user", userMessage));

        ChatRequest requestBody = new ChatRequest(currentModel, history, false);

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(baseUrl + "/api/chat"))
                .header("Content-Type", "application/json")
                .POST(HttpRequest.BodyPublishers.ofString(MAPPER.writeValueAsString(requestBody)))
                .build();

        HttpResponse<String> response = CLIENT.send(request, HttpResponse.BodyHandlers.ofString());
        // Ollama chat responses place the assistant text under message.content.
        ChatResponse chatResponse = MAPPER.readValue(response.body(), ChatResponse.class);

        String reply = chatResponse.message != null && chatResponse.message.content != null
                ? chatResponse.message.content
                : "";

        // Store the assistant reply so later calls keep the running chat context.
        history.add(new ChatMessage("assistant", reply));
        return reply;
    }

    public static class ChatRequest {
        public String model;
        public List<ChatMessage> messages;
        public boolean stream;

        public ChatRequest(String model, List<ChatMessage> messages, boolean stream) {
            this.model = model;
            this.messages = messages;
            this.stream = stream;
        }
    }

    public static class ChatMessage {
        public String role;
        public String content;

        public ChatMessage() {
        }

        public ChatMessage(String role, String content) {
            this.role = role;
            this.content = content;
        }
    }

    @JsonIgnoreProperties(ignoreUnknown = true)
    public static class ChatResponse {
        public ChatMessage message;
    }
}
