package Online.Shopping.Management.System.service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import org.springframework.stereotype.Service;

import Online.Shopping.Management.System.entity.Product;
import Online.Shopping.Management.System.repository.ProductRepository;

@Service
public class AIShoppingService {

    private final ProductRepository productRepository;

    public AIShoppingService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public Map<String, Object> searchProducts(
            String userMessage,
            String language) {

        if (userMessage == null || userMessage.isBlank()) {
            throw new IllegalArgumentException(
                    "Please enter a shopping request.");
        }

        String selectedLanguage = normalizeLanguage(language);

        String message = normalizeShoppingMessage(userMessage.trim());
        String lowerMessage = message.toLowerCase(Locale.ROOT);

        String requestedCategory = detectCategory(lowerMessage);

        Double maximumPrice = extractMaximumPrice(lowerMessage);
        Double minimumPrice = extractMinimumPrice(lowerMessage);

        String productKeyword = extractProductTerm(
                lowerMessage,
                requestedCategory,
                maximumPrice,
                minimumPrice);

        List<Product> allProducts = productRepository.findAll();

        List<Map<String, Object>> matchingProducts = new ArrayList<>();

        for (Product product : allProducts) {

            if (product == null) {
                continue;
            }

            String productName = safeLower(product.getName());
            String description = safeLower(product.getDescription());

            String categoryName = "";

            if (product.getCategory() != null) {
                categoryName = safeLower(
                        product.getCategory().getName());
            }

            double price = product.getPrice() == null
                    ? 0.0
                    : product.getPrice();

            boolean categoryMatches =
                    requestedCategory == null
                    || categoryMatches(categoryName, requestedCategory);

            boolean maximumPriceMatches =
                    maximumPrice == null || price < maximumPrice;

            boolean minimumPriceMatches =
                    minimumPrice == null || price > minimumPrice;

            boolean productMatches =
                    productKeyword == null
                    || productKeyword.isBlank()
                    || productName.contains(productKeyword)
                    || description.contains(productKeyword);

            if (categoryMatches
                    && maximumPriceMatches
                    && minimumPriceMatches
                    && productMatches) {

                matchingProducts.add(toProductMap(product));
            }
        }

        String reply = createReply(
                selectedLanguage,
                matchingProducts.size(),
                requestedCategory,
                maximumPrice,
                minimumPrice,
                productKeyword);

        Map<String, Object> response = new LinkedHashMap<>();

        response.put("reply", reply);
        response.put("message", reply);
        response.put("language", selectedLanguage);
        response.put("count", matchingProducts.size());
        response.put("products", matchingProducts);

        return response;
    }

    // --------------------------------------------------
    // LANGUAGE
    // --------------------------------------------------

    private String normalizeLanguage(String language) {

        if (language == null || language.isBlank()) {
            return "en";
        }

        String value = language.trim().toLowerCase(Locale.ROOT);

        if (value.equals("hi") || value.equals("hindi")) {
            return "hi";
        }

        if (value.equals("te") || value.equals("telugu")) {
            return "te";
        }

        return "en";
    }

    // --------------------------------------------------
    // NORMALIZE HINDI AND TELUGU REQUESTS
    // --------------------------------------------------

    private String normalizeShoppingMessage(String message) {

        String text = message.toLowerCase(Locale.ROOT);

        // Hindi shopping commands
        text = text.replace("दिखाइए", " show ");
        text = text.replace("दिखाएं", " show ");
        text = text.replace("दिखाओ", " show ");
        text = text.replace("बताइए", " show ");
        text = text.replace("मुझे", " ");
        text = text.replace("दीजिए", " ");
        text = text.replace("चाहिए", " ");
        text = text.replace("उत्पाद", " products ");
        text = text.replace("सामान", " items ");

        // Hindi categories
        text = text.replace("घर और रसोई", " home kitchen ");
        text = text.replace("घर का सामान", " home kitchen ");
        text = text.replace("रसोई का सामान", " home kitchen ");
        text = text.replace("ब्यूटी प्रोडक्ट्स", " beauty ");
        text = text.replace("सौंदर्य प्रसाधन", " beauty ");
        text = text.replace("सुंदरता के उत्पाद", " beauty ");
        text = text.replace("जूते और चप्पल", " footwear ");
        text = text.replace("बच्चों के खिलौने", " toys kids ");
        text = text.replace("बच्चों के सामान", " toys kids ");
        text = text.replace("खेल और फिटनेस", " sports fitness ");
        text = text.replace("खेल का सामान", " sports fitness ");
        text = text.replace("व्यायाम का सामान", " sports fitness ");
        text = text.replace("किराने का सामान", " grocery ");
        text = text.replace("किराने की चीजें", " grocery ");
        text = text.replace("खाने का सामान", " grocery ");
        text = text.replace("सहायक उपकरण", " accessories ");

        text = text.replace("फैशन", " fashion ");
        text = text.replace("कपड़े", " fashion ");
        text = text.replace("वस्त्र", " fashion ");
        text = text.replace("इलेक्ट्रॉनिक्स", " electronics ");
        text = text.replace("इलेक्ट्रॉनिक", " electronics ");
        text = text.replace("रसोई", " kitchen ");
        text = text.replace("ब्यूटी", " beauty ");
        text = text.replace("सौंदर्य", " beauty ");
        text = text.replace("मेकअप", " beauty ");
        text = text.replace("जूते", " footwear ");
        text = text.replace("चप्पल", " footwear ");
        text = text.replace("खिलौने", " toys kids ");
        text = text.replace("किताबें", " books ");
        text = text.replace("किताब", " books ");
        text = text.replace("पुस्तकें", " books ");
        text = text.replace("पुस्तक", " books ");
        text = text.replace("किराना", " grocery ");
        text = text.replace("खेल", " sports ");
        text = text.replace("फिटनेस", " fitness ");
        text = text.replace("एक्सेसरीज़", " accessories ");
        text = text.replace("बैग", " accessories ");

        // Hindi price phrases
        text = text.replace("से कम", " below ");
        text = text.replace("से नीचे", " below ");
        text = text.replace("से ज्यादा", " above ");
        text = text.replace("से अधिक", " above ");
        text = text.replace("से ऊपर", " above ");

        // Telugu shopping commands
        text = text.replace("చూపించండి", " show ");
        text = text.replace("చూపించు", " show ");
        text = text.replace("చూపించవచ్చు", " show ");
        text = text.replace("నాకు", " ");
        text = text.replace("ఇవ్వండి", " ");
        text = text.replace("ఇవ్వు", " ");
        text = text.replace("కావాలి", " ");
        text = text.replace("వస్తువులు", " items ");
        text = text.replace("ఉత్పత్తులు", " products ");

        // Telugu categories
        text = text.replace("ఇంటి మరియు వంటగది", " home kitchen ");
        text = text.replace("ఇంటి సామాన్లు", " home kitchen ");
        text = text.replace("బ్యూటీ ప్రొడక్ట్స్", " beauty ");
        text = text.replace("బ్యూటీ ఉత్పత్తులు", " beauty ");
        text = text.replace("సౌందర్య ఉత్పత్తులు", " beauty ");
        text = text.replace("అందం ఉత్పత్తులు", " beauty ");
        text = text.replace("పిల్లల బొమ్మలు", " toys kids ");
        text = text.replace("పిల్లల వస్తువులు", " toys kids ");
        text = text.replace("కిరాణా సరుకులు", " grocery ");
        text = text.replace("కిరాణా సామాన్లు", " grocery ");
        text = text.replace("ఆహార పదార్థాలు", " grocery ");
        text = text.replace("క్రీడలు మరియు ఫిట్‌నెస్", " sports fitness ");
        text = text.replace("క్రీడా వస్తువులు", " sports fitness ");
        text = text.replace("వ్యాయామ పరికరాలు", " sports fitness ");
        text = text.replace("అలంకరణ వస్తువులు", " accessories ");

        text = text.replace("ఫ్యాషన్", " fashion ");
        text = text.replace("దుస్తులు", " fashion ");
        text = text.replace("ఎలక్ట్రానిక్స్", " electronics ");
        text = text.replace("ఎలక్ట్రానిక్", " electronics ");
        text = text.replace("వంటగది", " kitchen ");
        text = text.replace("బ్యూటీ", " beauty ");
        text = text.replace("చెప్పులు", " footwear ");
        text = text.replace("బూట్లు", " footwear ");
        text = text.replace("బొమ్మలు", " toys kids ");
        text = text.replace("పుస్తకాలు", " books ");
        text = text.replace("పుస్తకం", " books ");
        text = text.replace("కిరాణా", " grocery ");
        text = text.replace("క్రీడలు", " sports ");
        text = text.replace("ఫిట్‌నెస్", " fitness ");
        text = text.replace("యాక్సెసరీస్", " accessories ");

        // Telugu price phrases
        text = text.replace("కంటే తక్కువ", " below ");
        text = text.replace("కంటే ఎక్కువ", " above ");
        text = text.replace("లోపు", " below ");
        text = text.replace("పైన", " above ");

        return text.replaceAll("\\s+", " ").trim();
    }

    // --------------------------------------------------
    // CATEGORY DETECTION
    // --------------------------------------------------

    private String detectCategory(String message) {

        String text = message.toLowerCase(Locale.ROOT);

        if (containsAny(text,
                "home kitchen", "home & kitchen",
                "home and kitchen", "kitchen", "home appliances")) {
            return "home_kitchen";
        }

        if (containsAny(text,
                "sports fitness", "sports & fitness",
                "sports and fitness", "sports", "fitness", "exercise")) {
            return "sports_fitness";
        }

        if (containsAny(text,
                "toys", "toy", "kids", "children", "child")) {
            return "toys_kids";
        }

        if (containsAny(text,
                "electronics", "electronic", "gadgets")) {
            return "electronics";
        }

        if (containsAny(text,
                "footwear", "shoes", "shoe", "sneakers", "sandals")) {
            return "footwear";
        }

        if (containsAny(text,
                "accessories", "accessory")) {
            return "accessories";
        }

        if (containsAny(text,
                "fashion", "clothing", "clothes", "apparel")) {
            return "fashion";
        }

        if (containsAny(text,
                "beauty", "cosmetics", "makeup", "personal care")) {
            return "beauty";
        }

        if (containsAny(text, "books", "book")) {
            return "books";
        }

        if (containsAny(text, "grocery", "groceries")) {
            return "grocery";
        }

        return null;
    }

    private boolean containsAny(String text, String... keywords) {

        for (String keyword : keywords) {
            if (text.contains(keyword)) {
                return true;
            }
        }

        return false;
    }

    // --------------------------------------------------
    // CATEGORY MATCHING
    // --------------------------------------------------

    private boolean categoryMatches(
            String databaseCategory,
            String requestedCategory) {

        if (databaseCategory == null || databaseCategory.isBlank()) {
            return false;
        }

        String category = databaseCategory
                .toLowerCase(Locale.ROOT)
                .replace("&", "and")
                .replaceAll("[^a-z0-9]+", " ")
                .trim();

        switch (requestedCategory) {

            case "fashion":
                return category.equals("fashion")
                        || category.contains("clothing")
                        || category.contains("apparel");

            case "electronics":
                return category.contains("electronic");

            case "home_kitchen":
                return category.contains("home")
                        || category.contains("kitchen");

            case "beauty":
                return category.contains("beauty")
                        || category.contains("cosmetic")
                        || category.contains("makeup")
                        || category.contains("personal care");

            case "footwear":
                return category.contains("footwear")
                        || category.contains("shoe")
                        || category.contains("sandal");

            case "toys_kids":
                return category.contains("toy")
                        || category.contains("kid")
                        || category.contains("child");

            case "books":
                return category.contains("book");

            case "grocery":
                return category.contains("grocery")
                        || category.contains("grocer");

            case "sports_fitness":
                return category.contains("sport")
                        || category.contains("fitness");

            case "accessories":
                return category.contains("accessor");

            default:
                return false;
        }
    }

    // --------------------------------------------------
    // PRICE EXTRACTION
    // --------------------------------------------------

    private Double extractMaximumPrice(String message) {

        String[] keywords = {
                "below", "under", "less than",
                "cheaper than", "maximum", "up to", "within"
        };

        for (String keyword : keywords) {
            Double value = extractPriceAfterKeyword(message, keyword);

            if (value != null) {
                return value;
            }
        }

        return null;
    }

    private Double extractMinimumPrice(String message) {

        String[] keywords = {
                "above", "over", "greater than",
                "more than", "minimum", "higher than"
        };

        for (String keyword : keywords) {
            Double value = extractPriceAfterKeyword(message, keyword);

            if (value != null) {
                return value;
            }
        }

        return null;
    }

    private Double extractPriceAfterKeyword(
            String message,
            String keyword) {

        int index = message.indexOf(keyword);

        if (index < 0) {
            return null;
        }

        String remaining = message.substring(index + keyword.length());

        Pattern pattern = Pattern.compile(
                "^\\s*(?:₹|rs\\.?\\s*)?([0-9]+(?:\\.[0-9]+)?)",
                Pattern.CASE_INSENSITIVE);

        Matcher matcher = pattern.matcher(remaining);

        if (matcher.find()) {
            try {
                return Double.parseDouble(matcher.group(1));
            } catch (NumberFormatException e) {
                return null;
            }
        }

        return null;
    }

    // --------------------------------------------------
    // PRODUCT KEYWORD EXTRACTION
    // --------------------------------------------------

    private String extractProductTerm(
            String message,
            String requestedCategory,
            Double maximumPrice,
            Double minimumPrice) {

        String text = message.toLowerCase(Locale.ROOT);

        String[] phrasesToRemove = {
                "show me", "show", "find me", "find",
                "search for", "search", "give me", "give",
                "display", "list", "please", "i want", "want",
                "products", "product", "items", "item",
                "available", "category", "in the category",
                "from the category", "in category", "from category",
                "less than", "below", "under", "cheaper than",
                "above", "over", "greater than", "more than",
                "minimum", "maximum", "up to", "within",
                "price", "priced", "costing",
                "rs.", "rs", "₹",
                "home kitchen", "home and kitchen", "home & kitchen",
                "home appliances", "kitchen",
                "sports and fitness", "sports & fitness",
                "sports fitness",
                "fashion", "clothing", "clothes", "apparel",
                "electronics", "electronic", "gadgets",
                "beauty", "cosmetics", "makeup", "personal care",
                "footwear", "shoes", "shoe", "sneakers", "sandals",
                "toys", "toy", "kids", "children", "child",
                "books", "book", "grocery", "groceries",
                "sports", "fitness", "exercise",
                "accessories", "accessory",
                "less", "than", "showing",
                "me", "the", "in", "from", "for", "of",
                "and", "with", "under", "above",
                "fashion", "electronics", "beauty", "footwear",
                "accessories", "books", "grocery"
        };

        for (String phrase : phrasesToRemove) {
            text = text.replaceAll(
                    "(?i)\\b" + Pattern.quote(phrase) + "\\b",
                    " ");
        }

        text = text.replaceAll("[0-9]+(?:\\.[0-9]+)?", " ");
        text = text.replaceAll("[^a-zA-Z\\s]", " ");
        text = text.replaceAll("\\s+", " ").trim();

        if (text.isBlank()) {
            return null;
        }

        // Avoid filtering by leftover command words.
        if (text.matches(
                "(?i)(me|the|in|from|for|of|and|with|under|above|show|give|find|please)+")) {
            return null;
        }

        return text;
    }

    // --------------------------------------------------
    // PRODUCT RESPONSE
    // --------------------------------------------------

    private Map<String, Object> toProductMap(Product product) {

        Map<String, Object> map = new LinkedHashMap<>();

        map.put("id", product.getId());
        map.put("name", product.getName());
        map.put("description", product.getDescription());
        map.put("price", product.getPrice());
        map.put("quantity", product.getQuantity());
        map.put("imageUrl", product.getImageUrl());
        map.put("colors", product.getColors());

        if (product.getCategory() != null) {
            map.put("category", product.getCategory().getName());
            map.put("categoryId", product.getCategory().getId());
        } else {
            map.put("category", null);
            map.put("categoryId", null);
        }

        return map;
    }

    // --------------------------------------------------
    // RESPONSE MESSAGES
    // --------------------------------------------------

    private String createReply(
            String language,
            int count,
            String category,
            Double maximumPrice,
            Double minimumPrice,
            String productKeyword) {

        if (count == 0) {

            if ("hi".equals(language)) {
                return "माफ़ कीजिए, आपकी खोज से मेल खाने वाले उत्पाद नहीं मिले। "
                        + "कृपया दूसरी श्रेणी या कीमत आज़माएँ।";
            }

            if ("te".equals(language)) {
                return "క్షమించండి, మీ శోధనకు సరిపోయే ఉత్పత్తులు కనుగొనబడలేదు. "
                        + "దయచేసి వేరే కేటగిరీ లేదా ధరను ప్రయత్నించండి.";
            }

            return "Sorry, no matching products were found. "
                    + "Try another category, product name, or price range.";
        }

        if ("hi".equals(language)) {
            return "आपकी खोज के अनुसार " + count + " उत्पाद मिले।";
        }

        if ("te".equals(language)) {
            return "మీ శోధనకు " + count + " ఉత్పత్తులు కనుగొనబడ్డాయి।";
        }

        StringBuilder reply = new StringBuilder(
                "Found " + count + " matching product(s)");

        if (category != null) {
            reply.append(" in ").append(category.replace('_', ' '));
        }

        if (maximumPrice != null) {
            reply.append(" below ₹").append(maximumPrice);
        }

        if (minimumPrice != null) {
            reply.append(" above ₹").append(minimumPrice);
        }

        if (productKeyword != null && !productKeyword.isBlank()) {
            reply.append(" matching ").append(productKeyword);
        }

        return reply.append(".").toString();
    }

    // --------------------------------------------------
    // SAFE STRING HANDLING
    // --------------------------------------------------

    private String safeLower(String value) {

        if (value == null) {
            return "";
        }

        return value.toLowerCase(Locale.ROOT);
    }
}