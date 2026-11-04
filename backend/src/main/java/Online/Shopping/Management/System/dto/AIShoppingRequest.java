package Online.Shopping.Management.System.dto;

public class AIShoppingRequest {

    private String message;
    private String language;

    public AIShoppingRequest() {
    }

    public AIShoppingRequest(String message) {
        this.message = message;
        this.language = "en";
    }

    public AIShoppingRequest(String message, String language) {
        this.message = message;
        this.language = language;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getLanguage() {
        return language;
    }

    public void setLanguage(String language) {
        this.language = language;
    }
}