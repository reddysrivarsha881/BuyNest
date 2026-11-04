package Online.Shopping.Management.System.controller;

import java.util.Locale;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import Online.Shopping.Management.System.dto.AIShoppingRequest;
import Online.Shopping.Management.System.service.AIShoppingService;

@RestController
@CrossOrigin(origins = {
        "http://127.0.0.1:5500",
        "http://localhost:5500",
        "https://buynest-frontend-jqys.onrender.com"
})
public class AIShoppingController {

    private final AIShoppingService aiShoppingService;

    public AIShoppingController(AIShoppingService aiShoppingService) {
        this.aiShoppingService = aiShoppingService;
    }

    @PostMapping("/ai-shopping/chat")
    public ResponseEntity<Map<String, Object>> chat(
            @RequestBody AIShoppingRequest request) {

        if (request == null
                || request.getMessage() == null
                || request.getMessage().isBlank()) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            "Please enter a shopping request."
                    ));
        }

        String language = request.getLanguage();

        if (language == null || language.isBlank()) {
            language = "en";
        }

        language = language.trim().toLowerCase(Locale.ROOT);

        if (!language.equals("en")
                && !language.equals("hi")
                && !language.equals("te")) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            "Supported languages are English, Hindi and Telugu."
                    ));
        }

        try {
            Map<String, Object> result =
                    aiShoppingService.searchProducts(
                            request.getMessage(),
                            language
                    );

            return ResponseEntity.ok(result);

        } catch (IllegalArgumentException e) {

            return ResponseEntity.badRequest()
                    .body(Map.of(
                            "error",
                            e.getMessage() == null
                                    ? "Invalid shopping request."
                                    : e.getMessage()
                    ));

        } catch (Exception e) {

            e.printStackTrace();

            return ResponseEntity.status(
                    HttpStatus.INTERNAL_SERVER_ERROR
            ).body(Map.of(
                    "error",
                    "Unable to search products. Please try again."
            ));
        }
    }
}