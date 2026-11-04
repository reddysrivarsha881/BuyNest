"use strict";

// =====================================================
// BUY NEST - PRODUCT PAGE + MULTILINGUAL AI ASSISTANT
// Supported languages: English, Hindi, Telugu
// =====================================================


// =====================================================
// API CONFIGURATION
// =====================================================

"use strict";

// =====================================================
// BUY NEST - PRODUCT PAGE + MULTILINGUAL AI ASSISTANT
// Supported languages: English, Hindi, Telugu
// =====================================================


// =====================================================
// API CONFIGURATION — LOCAL + CLOUD
// =====================================================

const BACKEND_URL =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
        ? "http://localhost:8080"
        : "https://buynest-backend-p1s9.onrender.com";

const PRODUCT_API_URL =
    `${BACKEND_URL}/getProducts`;

const CATEGORY_API_URL =
    `${BACKEND_URL}/getCategories`;

const PRODUCTS_BY_CATEGORY_URL =
    `${BACKEND_URL}/getProductsByCategory`;

const CART_API_URL =
    `${BACKEND_URL}/saveCartitem`;

const AI_API_URL =
    `${BACKEND_URL}/ai-shopping/chat`;

const PRODUCT_DETAILS_PAGE = "product-details.html";
const PRODUCTS_PAGE = "products.html";

// =====================================================
// HTML ELEMENTS
// =====================================================

const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const categorySelect = document.getElementById("categorySelect");
const sortSelect = document.getElementById("sortSelect");

const aiChatToggle = document.getElementById("aiChatToggle");
const aiChatWidget = document.getElementById("aiChatWidget");
const aiChatClose = document.getElementById("aiChatClose");
const aiChatForm = document.getElementById("aiChatForm");
const aiChatInput = document.getElementById("aiChatInput");
const aiChatMessages = document.getElementById("aiChatMessages");
const aiSendButton = document.getElementById("aiSendButton");
const aiVoiceButton = document.getElementById("aiVoiceButton");
const aiVoiceStatus = document.getElementById("aiVoiceStatus");

const aiLanguage = document.getElementById("aiLanguage");


// =====================================================
// PRODUCT VARIABLES
// =====================================================

let allProducts = [];
let displayedProducts = [];
let allCategories = [];
let aiFilteredProducts = null;

let aiVoiceReplyEnabled = false;
let categoryRequestVersion = 0;


// =====================================================
// LANGUAGE CONFIGURATION
// =====================================================

const AI_LANGUAGES = {
    en: {
        name: "English",
        speechCode: "en-IN",

        greeting:
            "Hello! Welcome to BuyNest. 👋",

        introduction:
            "What are you looking for today? I can help you find products by name, category, or price.",

        example:
            "For example: Show me phones below ₹20,000.",

        placeholder:
            "Ask me what you want...",

        send:
            "Send",

        searching:
            "Searching...",

        suggestionsTitle:
            "Try asking:",

        allCategories:
            "All Categories",

        sortBy:
            "Sort By",

        priceLow:
            "Price: Low to High",

        priceHigh:
            "Price: High to Low",

        nameAZ:
            "Name: A to Z",

        nameZA:
            "Name: Z to A",

        loading:
            "Loading products...",

        loadingCategory:
            "Loading category products...",

        noProducts:
            "No matching products found.",

        reset:
            "Showing all BuyNest products again. 🛍️",

        noMatching:
            "No matching products were found. Try another search.",

        unableToSearch:
            "Unable to search products. Please try again.",

        unableToConnect:
            "Unable to connect to the AI backend. Make sure Spring Boot is running and CORS allows your frontend.",

        voiceListening:
            "Listening... Speak your shopping request.",

        voiceUnsupported:
            "Voice search is not supported in this browser. Please type your request instead.",

        voiceDenied:
            "Microphone access denied. Please allow microphone access in your browser.",

        voiceNoSpeech:
            "No speech detected. Please try again.",

        voiceError:
            "Voice search failed. You can type your request instead.",

        voiceFinished:
            "Voice input finished.",

        productError:
            "Unable to load products. Please try again later.",

        categoryError:
            "Unable to load products for this category.",

        viewProduct:
            "View Product",

        viewDetails:
            "View Details",

        addToCart:
            "Add to Cart",

        adding:
            "Adding...",

        added:
            "Added ✓",

        loginRequired:
            "Please log in to add products to your cart.",

        missingProductId:
            "Product ID is missing.",

        addCartError:
            "Unable to add this product to the cart. Please try again.",

        priceUnavailable:
            "Price unavailable",

        chatFooter:
            "Product recommendations are based on BuyNest's product data.",

        listeningLabel:
            "Listening..."
    },

    hi: {
        name: "हिन्दी",
        speechCode: "hi-IN",

        greeting:
            "नमस्ते! BuyNest में आपका स्वागत है। 👋",

        introduction:
            "आज आप क्या खरीदना चाहते हैं? मैं आपको उत्पाद का नाम, श्रेणी या कीमत के आधार पर उत्पाद ढूँढने में मदद कर सकता हूँ।",

        example:
            "उदाहरण: ₹20,000 से कम कीमत वाले फ़ोन दिखाएँ।",

        placeholder:
            "बताइए, आपको क्या चाहिए...",

        send:
            "भेजें",

        searching:
            "खोज रहे हैं...",

        suggestionsTitle:
            "यह पूछकर देखें:",

        allCategories:
            "सभी श्रेणियाँ",

        sortBy:
            "क्रमबद्ध करें",

        priceLow:
            "कम से अधिक कीमत",

        priceHigh:
            "अधिक से कम कीमत",

        nameAZ:
            "नाम: A से Z",

        nameZA:
            "नाम: Z से A",

        loading:
            "उत्पाद लोड हो रहे हैं...",

        loadingCategory:
            "श्रेणी के उत्पाद लोड हो रहे हैं...",

        noProducts:
            "कोई मेल खाने वाला उत्पाद नहीं मिला।",

        reset:
            "BuyNest के सभी उत्पाद फिर से दिखाए जा रहे हैं। 🛍️",

        noMatching:
            "आपकी खोज से मेल खाने वाले उत्पाद नहीं मिले। कृपया दूसरी खोज करें।",

        unableToSearch:
            "उत्पाद खोजने में समस्या हुई। कृपया फिर से प्रयास करें।",

        unableToConnect:
            "AI सर्वर से कनेक्ट नहीं हो पा रहा है। कृपया Spring Boot सर्वर चालू होने की जाँच करें।",

        voiceListening:
            "सुन रहा हूँ... अपने खरीदारी अनुरोध को बोलें।",

        voiceUnsupported:
            "इस ब्राउज़र में वॉइस सर्च उपलब्ध नहीं है। कृपया अपना अनुरोध टाइप करें।",

        voiceDenied:
            "माइक्रोफ़ोन की अनुमति नहीं मिली। कृपया ब्राउज़र में माइक्रोफ़ोन की अनुमति दें।",

        voiceNoSpeech:
            "आपकी आवाज़ सुनाई नहीं दी। कृपया फिर से प्रयास करें।",

        voiceError:
            "वॉइस सर्च नहीं हो पाई। आप अपना अनुरोध टाइप कर सकते हैं।",

        voiceFinished:
            "वॉइस इनपुट पूरा हुआ।",

        productError:
            "उत्पाद लोड नहीं हो सके। कृपया बाद में फिर से प्रयास करें।",

        categoryError:
            "इस श्रेणी के उत्पाद लोड नहीं हो सके।",

        viewProduct:
            "उत्पाद देखें",

        viewDetails:
            "विवरण देखें",

        addToCart:
            "कार्ट में जोड़ें",

        adding:
            "जोड़ा जा रहा है...",

        added:
            "जोड़ दिया गया ✓",

        loginRequired:
            "उत्पाद को कार्ट में जोड़ने के लिए कृपया लॉगिन करें।",

        missingProductId:
            "उत्पाद की ID उपलब्ध नहीं है।",

        addCartError:
            "उत्पाद कार्ट में नहीं जुड़ पाया। कृपया फिर से प्रयास करें।",

        priceUnavailable:
            "कीमत उपलब्ध नहीं है",

        chatFooter:
            "उत्पाद सुझाव BuyNest के उत्पाद डेटा पर आधारित हैं।",

        listeningLabel:
            "सुन रहा हूँ..."
    },

    te: {
        name: "తెలుగు",
        speechCode: "te-IN",

        greeting:
            "నమస్కారం! BuyNest కు స్వాగతం. 👋",

        introduction:
            "ఈరోజు మీరు ఏమి కొనాలనుకుంటున్నారు? ఉత్పత్తి పేరు, కేటగిరీ లేదా ధర ఆధారంగా ఉత్పత్తులను కనుగొనడంలో నేను సహాయం చేస్తాను.",

        example:
            "ఉదాహరణ: ₹20,000 కంటే తక్కువ ధర ఉన్న ఫోన్లను చూపించండి.",

        placeholder:
            "మీకు ఏమి కావాలో అడగండి...",

        send:
            "పంపండి",

        searching:
            "వెతుకుతున్నాం...",

        suggestionsTitle:
            "ఇలా అడగండి:",

        allCategories:
            "అన్ని కేటగిరీలు",

        sortBy:
            "క్రమబద్ధీకరించండి",

        priceLow:
            "తక్కువ ధర నుండి ఎక్కువ ధర",

        priceHigh:
            "ఎక్కువ ధర నుండి తక్కువ ధర",

        nameAZ:
            "పేరు: A నుండి Z",

        nameZA:
            "పేరు: Z నుండి A",

        loading:
            "ఉత్పత్తులు లోడ్ అవుతున్నాయి...",

        loadingCategory:
            "కేటగిరీ ఉత్పత్తులు లోడ్ అవుతున్నాయి...",

        noProducts:
            "సరిపోలే ఉత్పత్తులు ఏవీ కనుగొనబడలేదు.",

        reset:
            "BuyNest లోని అన్ని ఉత్పత్తులను మళ్లీ చూపిస్తున్నాము. 🛍️",

        noMatching:
            "మీ శోధనకు సరిపోలే ఉత్పత్తులు కనుగొనబడలేదు. మరొకసారి ప్రయత్నించండి.",

        unableToSearch:
            "ఉత్పత్తులను వెతకడంలో సమస్య వచ్చింది. దయచేసి మళ్లీ ప్రయత్నించండి.",

        unableToConnect:
            "AI సర్వర్‌కు కనెక్ట్ కాలేకపోతున్నాము. Spring Boot సర్వర్ నడుస్తోందో లేదో తనిఖీ చేయండి.",

        voiceListening:
            "వింటున్నాను... మీకు కావలసిన ఉత్పత్తి గురించి మాట్లాడండి.",

        voiceUnsupported:
            "ఈ బ్రౌజర్‌లో వాయిస్ సెర్చ్ అందుబాటులో లేదు. దయచేసి మీ అభ్యర్థనను టైప్ చేయండి.",

        voiceDenied:
            "మైక్రోఫోన్ అనుమతి నిరాకరించబడింది. దయచేసి బ్రౌజర్‌లో మైక్రోఫోన్ అనుమతిని ఇవ్వండి.",

        voiceNoSpeech:
            "మీ మాటలు వినబడలేదు. దయచేసి మళ్లీ ప్రయత్నించండి.",

        voiceError:
            "వాయిస్ సెర్చ్ విఫలమైంది. మీరు మీ అభ్యర్థనను టైప్ చేయవచ్చు.",

        voiceFinished:
            "వాయిస్ ఇన్‌పుట్ పూర్తయింది.",

        productError:
            "ఉత్పత్తులను లోడ్ చేయలేకపోయాము. దయచేసి తర్వాత మళ్లీ ప్రయత్నించండి.",

        categoryError:
            "ఈ కేటగిరీ ఉత్పత్తులను లోడ్ చేయలేకపోయాము.",

        viewProduct:
            "ఉత్పత్తిని చూడండి",

        viewDetails:
            "వివరాలు చూడండి",

        addToCart:
            "కార్ట్‌లో చేర్చండి",

        adding:
            "చేర్చుతున్నాం...",

        added:
            "చేర్చబడింది ✓",

        loginRequired:
            "ఉత్పత్తులను కార్ట్‌లో చేర్చడానికి దయచేసి లాగిన్ అవ్వండి.",

        missingProductId:
            "ఉత్పత్తి ID అందుబాటులో లేదు.",

        addCartError:
            "ఉత్పత్తిని కార్ట్‌లో చేర్చలేకపోయాము. దయచేసి మళ్లీ ప్రయత్నించండి.",

        priceUnavailable:
            "ధర అందుబాటులో లేదు",

        chatFooter:
            "ఉత్పత్తి సూచనలు BuyNest ఉత్పత్తుల డేటా ఆధారంగా ఉంటాయి.",

        listeningLabel:
            "వింటున్నాను..."
    }
};


// =====================================================
// GET SELECTED LANGUAGE
// =====================================================

function getSelectedLanguage() {
    const selected = aiLanguage?.value || "en";

    return AI_LANGUAGES[selected]
        ? selected
        : "en";
}

function getLanguageText(key) {
    const language = getSelectedLanguage();

    return AI_LANGUAGES[language][key] ??
        AI_LANGUAGES.en[key] ??
        "";
}

function getSpeechLanguage() {
    return AI_LANGUAGES[getSelectedLanguage()].speechCode;
}


// =====================================================
// UPDATE ASSISTANT UI WHEN LANGUAGE CHANGES
// =====================================================

function updateAssistantLanguage() {
    if (!aiLanguage) {
        return;
    }

    const language = getSelectedLanguage();
    const text = AI_LANGUAGES[language];

    document.documentElement.lang =
        language === "hi"
            ? "hi"
            : language === "te"
                ? "te"
                : "en";

    if (aiChatInput) {
        aiChatInput.placeholder = text.placeholder;
    }

    if (aiSendButton && !aiSendButton.disabled) {
        aiSendButton.textContent = text.send;
    }

    const suggestionsTitle = document.querySelector(
        ".ai-suggestions-title"
    );

    if (suggestionsTitle) {
        suggestionsTitle.textContent =
            text.suggestionsTitle;
    }

    const suggestionButtons = document.querySelectorAll(
        "[data-ai-message]"
    );

    const translatedSuggestions = {
        en: [
            "Products below ₹50,000",
            "Phones below ₹20,000",
            "Laptops above ₹40,000",
            "Show all products"
        ],

        hi: [
            "₹50,000 से कम के उत्पाद",
            "₹20,000 से कम के फ़ोन",
            "₹40,000 से अधिक के लैपटॉप",
            "सभी उत्पाद दिखाएँ"
        ],

        te: [
            "₹50,000 కంటే తక్కువ ఉత్పత్తులు",
            "₹20,000 కంటే తక్కువ ఫోన్లు",
            "₹40,000 కంటే ఎక్కువ ల్యాప్‌టాప్‌లు",
            "అన్ని ఉత్పత్తులను చూపించండి"
        ]
    };

    suggestionButtons.forEach((button, index) => {
        if (translatedSuggestions[language][index]) {
            button.textContent =
                translatedSuggestions[language][index];
        }
    });

    const footer = document.querySelector(
        ".ai-chat-footer"
    );

    if (footer) {
        footer.textContent = text.chatFooter;
    }

    // Change the initial greeting only if the conversation
    // contains just the initial assistant message.
    if (
        aiChatMessages &&
        aiChatMessages.children.length === 1 &&
        aiChatMessages.firstElementChild?.dataset.initialGreeting === "true"
    ) {
        const bubble = aiChatMessages.firstElementChild;

        bubble.replaceChildren();

        [
            text.greeting,
            text.introduction,
            text.example
        ].forEach(message => {
            const paragraph = document.createElement("p");

            paragraph.textContent = message;

            bubble.appendChild(paragraph);
        });
    }
}


// =====================================================
// GENERAL PRODUCT HELPERS
// =====================================================

function getProductId(product) {
    return product?.id ??
        product?.productId ??
        product?.product_id;
}

function getProductName(product) {
    return product?.name ??
        product?.productName ??
        product?.product_name ??
        "Unnamed Product";
}

function getProductPrice(product) {
    const value = Number(product?.price);

    return Number.isFinite(value) ? value : null;
}

function getProductImage(product) {
    return product?.imageUrl ??
        product?.image ??
        product?.productImage ??
        product?.image_url ??
        "";
}


// =====================================================
// PRODUCT CATEGORY HELPERS
// =====================================================

function getProductCategory(product) {
    const category = product?.category;

    if (typeof category === "string") {
        return category.trim();
    }

    if (category && typeof category === "object") {
        const name =
            category.name ??
            category.categoryName ??
            category.category_name ??
            category.title;

        if (name != null) {
            return String(name).trim();
        }
    }

    const categoryName =
        product?.categoryName ??
        product?.category_name ??
        product?.categoryTitle ??
        product?.category_title;

    if (categoryName != null) {
        return String(categoryName).trim();
    }

    const categoryId = getProductCategoryId(product);

    if (categoryId) {
        const matchingCategory = allCategories.find(
            category =>
                String(category.id) === String(categoryId)
        );

        if (matchingCategory) {
            return matchingCategory.name;
        }
    }

    return "";
}

function getProductCategoryId(product) {
    const category = product?.category;

    if (category && typeof category === "object") {
        const id =
            category.id ??
            category.categoryId ??
            category.category_id;

        if (id != null) {
            return String(id);
        }
    }

    const categoryId =
        product?.categoryId ??
        product?.category_id;

    if (categoryId != null) {
        return String(categoryId);
    }

    return "";
}


// =====================================================
// FORMAT PRICE
// =====================================================

function formatPrice(price) {
    if (price === null || price === undefined) {
        return getLanguageText("priceUnavailable");
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
        return getLanguageText("priceUnavailable");
    }

    return numericPrice.toLocaleString("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 2
    });
}


// =====================================================
// NORMALIZE PRODUCT API RESPONSE
// =====================================================

function getProductArray(responseData) {
    if (Array.isArray(responseData)) {
        return responseData;
    }

    if (Array.isArray(responseData?.data)) {
        return responseData.data;
    }

    if (Array.isArray(responseData?.products)) {
        return responseData.products;
    }

    if (Array.isArray(responseData?.content)) {
        return responseData.content;
    }

    if (Array.isArray(responseData?.data?.products)) {
        return responseData.data.products;
    }

    console.error(
        "Unexpected product API response:",
        responseData
    );

    return [];
}


// =====================================================
// LOAD CATEGORIES
// =====================================================

async function loadCategories() {
    if (!categorySelect) {
        console.error("Category dropdown was not found.");
        return;
    }

    try {
        const response = await fetch(CATEGORY_API_URL);

        if (!response.ok) {
            throw new Error(
                `Category API returned HTTP ${response.status}`
            );
        }

        const responseData = await response.json();

        const categories = Array.isArray(responseData)
            ? responseData
            : Array.isArray(responseData?.data)
                ? responseData.data
                : Array.isArray(responseData?.categories)
                    ? responseData.categories
                    : [];

        allCategories = categories.filter(
            category =>
                category &&
                category.id != null &&
                category.name
        );

        const currentValue = categorySelect.value;

        categorySelect.replaceChildren();

        const defaultOption = document.createElement("option");

        defaultOption.value = "";
        defaultOption.textContent =
            getLanguageText("allCategories");

        categorySelect.appendChild(defaultOption);

        allCategories.forEach(category => {
            const option = document.createElement("option");

            option.value = String(category.id);
            option.textContent = category.name;

            option.dataset.categoryId = String(category.id);
            option.dataset.categoryName = category.name;

            categorySelect.appendChild(option);
        });

        if (
            [...categorySelect.options].some(
                option => option.value === currentValue
            )
        ) {
            categorySelect.value = currentValue;
        }

        console.log(
            "BuyNest categories loaded:",
            allCategories
        );

    } catch (error) {
        console.error(
            "Unable to load categories:",
            error
        );
    }
}


// =====================================================
// LOAD PRODUCTS
// =====================================================

async function loadProducts() {
    if (!productGrid) {
        console.error("Product grid was not found.");
        return;
    }

    productGrid.replaceChildren();

    const loading = document.createElement("p");

    loading.className = "product-loading";
    loading.textContent = getLanguageText("loading");

    productGrid.appendChild(loading);

    try {
        const response = await fetch(PRODUCT_API_URL);

        if (!response.ok) {
            throw new Error(
                `Product API returned HTTP ${response.status}`
            );
        }

        const responseData = await response.json();

        console.log(
            "BuyNest product API response:",
            responseData
        );

        allProducts = getProductArray(responseData);

        displayedProducts = [...allProducts];

        renderProducts(allProducts);

        console.log(
            `Loaded ${allProducts.length} products.`
        );

    } catch (error) {
        console.error(
            "Unable to load products:",
            error
        );

        productGrid.replaceChildren();

        const message = document.createElement("p");

        message.className = "product-error";
        message.textContent = getLanguageText("productError");

        productGrid.appendChild(message);
    }
}


// =====================================================
// FETCH PRODUCTS BY CATEGORY
// =====================================================

async function fetchProductsByCategory(categoryId) {
    const response = await fetch(
        `${PRODUCTS_BY_CATEGORY_URL}/${encodeURIComponent(categoryId)}`
    );

    if (!response.ok) {
        throw new Error(
            `Category products API returned HTTP ${response.status}`
        );
    }

    return getProductArray(await response.json());
}


// =====================================================
// FILTER PRODUCTS BY CATEGORY
// =====================================================

async function filterProductsByCategory(categoryId) {
    const requestVersion = ++categoryRequestVersion;

    aiFilteredProducts = null;

    if (searchInput) {
        searchInput.value = "";
    }

    if (!categoryId) {
        displayedProducts = [...allProducts];

        applySearchAndSort(displayedProducts);

        return;
    }

    const selectedCategory = allCategories.find(
        category =>
            String(category.id) === String(categoryId)
    );

    if (!selectedCategory) {
        console.warn(
            "Selected category was not found:",
            categoryId
        );

        return;
    }

    productGrid.replaceChildren();

    const loading = document.createElement("p");

    loading.className = "product-loading";
    loading.textContent = getLanguageText("loadingCategory");

    productGrid.appendChild(loading);

    try {
        const categoryProducts =
            await fetchProductsByCategory(categoryId);

        if (requestVersion !== categoryRequestVersion) {
            return;
        }

        displayedProducts = categoryProducts;

        applySearchAndSort(categoryProducts);

    } catch (error) {
        console.error(
            "Unable to filter products by category:",
            error
        );

        if (requestVersion !== categoryRequestVersion) {
            return;
        }

        productGrid.replaceChildren();

        const message = document.createElement("p");

        message.className = "product-error";
        message.textContent = getLanguageText("categoryError");

        productGrid.appendChild(message);
    }
}


// =====================================================
// RENDER PRODUCTS
// =====================================================

function renderProducts(products) {
    if (!productGrid) {
        return;
    }

    productGrid.replaceChildren();

    if (!Array.isArray(products) || products.length === 0) {
        const message = document.createElement("p");

        message.className = "no-products-message";
        message.textContent = getLanguageText("noProducts");

        productGrid.appendChild(message);

        displayedProducts = [];

        return;
    }

    displayedProducts = [...products];

    products.forEach(product => {
        const card = document.createElement("article");

        card.className = "product-card";

        const productId = getProductId(product);
        const productName = getProductName(product);
        const productPrice = getProductPrice(product);
        const imageUrl = getProductImage(product);
        const categoryName = getProductCategory(product);

        // PRODUCT IMAGE
        const imageLink = document.createElement("a");

        imageLink.className = "product-image-link";

        imageLink.href = productId != null
            ? `${PRODUCT_DETAILS_PAGE}?id=${encodeURIComponent(productId)}`
            : PRODUCTS_PAGE;

        const image = document.createElement("img");

        image.className = "product-image";
        image.alt = productName;
        image.loading = "lazy";

        if (imageUrl) {
            image.src = imageUrl;

            image.addEventListener("error", () => {
                image.style.display = "none";

                const placeholder =
                    document.createElement("div");

                placeholder.className =
                    "product-image-placeholder";

                placeholder.textContent = "🛍️";

                imageLink.appendChild(placeholder);

            }, { once: true });

        } else {
            image.style.display = "none";

            const placeholder =
                document.createElement("div");

            placeholder.className =
                "product-image-placeholder";

            placeholder.textContent = "🛍️";

            imageLink.appendChild(placeholder);
        }

        imageLink.appendChild(image);

        // PRODUCT DETAILS
        const details = document.createElement("div");

        details.className = "product-details";

        const name = document.createElement("h3");

        name.className = "product-name";
        name.textContent = productName;

        const category = document.createElement("p");

        category.className = "product-category";
        category.textContent = categoryName;

        const price = document.createElement("p");

        price.className = "product-price";
        price.textContent = formatPrice(productPrice);

        // VIEW DETAILS
        const viewButton = document.createElement("a");

        viewButton.className = "view-product-button";
        viewButton.textContent = getLanguageText("viewDetails");

        viewButton.href = productId != null
            ? `${PRODUCT_DETAILS_PAGE}?id=${encodeURIComponent(productId)}`
            : PRODUCTS_PAGE;

        // ADD TO CART
        const addToCartButton =
            document.createElement("button");

        addToCartButton.type = "button";
        addToCartButton.className = "add-to-cart-button";
        addToCartButton.textContent = getLanguageText("addToCart");

        addToCartButton.addEventListener("click", async () => {
            await addProductToCart(
                product,
                addToCartButton
            );
        });

        details.append(
            name,
            category,
            price,
            viewButton,
            addToCartButton
        );

        card.append(imageLink, details);

        productGrid.appendChild(card);
    });
}


// =====================================================
// SEARCH AND SORT
// =====================================================

function applySearchAndSort(products) {
    const searchTerm = searchInput
        ? searchInput.value.trim().toLowerCase()
        : "";

    let filteredProducts = [...products];

    if (searchTerm) {
        filteredProducts = filteredProducts.filter(product => {
            const name =
                getProductName(product).toLowerCase();

            const category =
                getProductCategory(product).toLowerCase();

            const description =
                String(product?.description ?? "").toLowerCase();

            return name.includes(searchTerm) ||
                category.includes(searchTerm) ||
                description.includes(searchTerm);
        });
    }

    filteredProducts = sortProductList(
        filteredProducts,
        sortSelect?.value || ""
    );

    renderProducts(filteredProducts);
}

async function applyNormalProductFilters() {
    const selectedCategoryId = categorySelect
        ? categorySelect.value
        : "";

    if (selectedCategoryId) {
        await filterProductsByCategory(selectedCategoryId);

        return;
    }

    aiFilteredProducts = null;

    applySearchAndSort(allProducts);
}


// =====================================================
// SORT PRODUCTS
// =====================================================

function sortProductList(products, sortValue) {
    const sortedProducts = [...products];

    switch (sortValue) {
        case "priceLow":
        case "priceLowToHigh":
        case "price-asc":
        case "low-to-high":

            sortedProducts.sort((a, b) =>
                (getProductPrice(a) ?? Infinity) -
                (getProductPrice(b) ?? Infinity)
            );

            break;

        case "priceHigh":
        case "priceHighToLow":
        case "price-desc":
        case "high-to-low":

            sortedProducts.sort((a, b) =>
                (getProductPrice(b) ?? -Infinity) -
                (getProductPrice(a) ?? -Infinity)
            );

            break;

        case "nameAZ":
        case "name-asc":

            sortedProducts.sort((a, b) =>
                getProductName(a).localeCompare(
                    getProductName(b)
                )
            );

            break;

        case "nameZA":
        case "name-desc":

            sortedProducts.sort((a, b) =>
                getProductName(b).localeCompare(
                    getProductName(a)
                )
            );

            break;
    }

    return sortedProducts;
}


// =====================================================
// SEARCH BUTTON AND ENTER KEY
// =====================================================

if (searchButton) {
    searchButton.addEventListener("click", () => {
        applyNormalProductFilters();
    });
}

if (searchInput) {
    searchInput.addEventListener("keydown", event => {
        if (event.key === "Enter") {
            event.preventDefault();

            applyNormalProductFilters();
        }
    });
}


// =====================================================
// CATEGORY AND SORT DROPDOWNS
// =====================================================

if (categorySelect) {
    categorySelect.addEventListener("change", () => {
        filterProductsByCategory(categorySelect.value);
    });
}

if (sortSelect) {
    sortSelect.addEventListener("change", () => {
        if (Array.isArray(aiFilteredProducts)) {
            renderProducts(
                sortProductList(
                    aiFilteredProducts,
                    sortSelect.value
                )
            );

            return;
        }

        const selectedCategoryId = categorySelect
            ? categorySelect.value
            : "";

        if (selectedCategoryId) {
            filterProductsByCategory(selectedCategoryId);
        } else {
            applySearchAndSort(allProducts);
        }
    });
}


// =====================================================
// CATEGORY PAGE LINK SUPPORT
// =====================================================

async function applyCategoryFromURL() {
    const params = new URLSearchParams(
        window.location.search
    );

    const categoryId = params.get("categoryId");
    const categoryNameFromURL = params.get("category");

    if (!categoryId && !categoryNameFromURL) {
        return;
    }

    let selectedCategoryId = categoryId;

    if (!selectedCategoryId && categoryNameFromURL) {
        const matchingCategory = allCategories.find(
            category =>
                category.name.trim().toLowerCase() ===
                categoryNameFromURL.trim().toLowerCase()
        );

        if (matchingCategory) {
            selectedCategoryId = String(matchingCategory.id);
        }
    }

    if (selectedCategoryId && categorySelect) {
        categorySelect.value = selectedCategoryId;

        if (categorySelect.value === selectedCategoryId) {
            await filterProductsByCategory(selectedCategoryId);
        }
    }
}


// =====================================================
// AI PRODUCT FILTER FUNCTIONS
// =====================================================

window.applyAIProductFilter = function (products) {
    if (!Array.isArray(products)) {
        console.error(
            "AI product results must be an array."
        );

        return;
    }

    aiFilteredProducts = [...products];

    renderProducts(aiFilteredProducts);

    if (productGrid) {
        productGrid.scrollIntoView({
            behavior: "smooth",
            block: "start"
        });
    }
};

window.resetAIProductFilter = function () {
    aiFilteredProducts = null;

    if (searchInput) {
        searchInput.value = "";
    }

    if (categorySelect) {
        categorySelect.value = "";
    }

    if (sortSelect) {
        sortSelect.value = "";
    }

    renderProducts(allProducts);
};

window.getBuyNestProducts = function () {
    return [...allProducts];
};


// =====================================================
// ADD PRODUCT TO CART
// =====================================================

async function addProductToCart(product, button) {
    const userId = localStorage.getItem("userId");

    const productId = getProductId(product);

    if (!userId) {
        alert(getLanguageText("loginRequired"));

        window.location.href = "customer-login.html";

        return;
    }

    if (productId == null) {
        alert(getLanguageText("missingProductId"));

        return;
    }

    const originalText = button.textContent;

    button.disabled = true;
    button.textContent = getLanguageText("adding");

    try {
        const response = await fetch(CART_API_URL, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                user: {
                    id: Number(userId)
                },

                product: {
                    id: Number(productId)
                },

                quantity: 1
            })
        });

        if (!response.ok) {
            const errorText = await response.text();

            throw new Error(
                errorText ||
                `Add to cart failed: HTTP ${response.status}`
            );
        }

        button.textContent = getLanguageText("added");

        setTimeout(() => {
            button.textContent = getLanguageText("addToCart");
        }, 1500);

    } catch (error) {
        console.error(
            "Add to cart error:",
            error
        );

        alert(getLanguageText("addCartError"));

        button.textContent = originalText;

    } finally {
        button.disabled = false;
    }
}


// =====================================================
// AI SHOPPING ASSISTANT
// =====================================================

if (
    aiChatToggle &&
    aiChatWidget &&
    aiChatClose &&
    aiChatForm &&
    aiChatInput &&
    aiChatMessages &&
    aiSendButton
) {

    // ---------------------------------------------
    // OPEN AND CLOSE CHAT
    // ---------------------------------------------

    function openAIChat() {
        aiChatWidget.hidden = false;

        aiChatWidget.setAttribute(
            "aria-hidden",
            "false"
        );

        aiChatToggle.setAttribute(
            "aria-expanded",
            "true"
        );

        aiChatInput.focus();
    }

    function closeAIChat() {
        aiChatWidget.hidden = true;

        aiChatWidget.setAttribute(
            "aria-hidden",
            "true"
        );

        aiChatToggle.setAttribute(
            "aria-expanded",
            "false"
        );

        aiChatToggle.focus();
    }

    aiChatToggle.addEventListener("click", () => {
        if (aiChatWidget.hidden) {
            openAIChat();
        } else {
            closeAIChat();
        }
    });

    aiChatClose.addEventListener(
        "click",
        closeAIChat
    );


    // ---------------------------------------------
    // ADD CHAT MESSAGE
    // ---------------------------------------------

    function addAIMessage(message, sender) {
        const bubble = document.createElement("div");

        bubble.className = `ai-message ${sender}`;

        // textContent prevents user/backend text from
        // being interpreted as HTML.
        bubble.textContent = message;

        aiChatMessages.appendChild(bubble);

        aiChatMessages.scrollTop =
            aiChatMessages.scrollHeight;

        return bubble;
    }


    // ---------------------------------------------
    // DISPLAY PRODUCTS INSIDE CHAT
    // ---------------------------------------------

    function showAIProducts(products, parentBubble) {
        if (
            !Array.isArray(products) ||
            products.length === 0
        ) {
            return;
        }

        const productList =
            document.createElement("div");

        productList.className = "ai-product-list";

        products.forEach(product => {
            const card = document.createElement("article");

            card.className = "ai-product-card";

            const imageUrl = getProductImage(product);

            if (imageUrl) {
                const image = document.createElement("img");

                image.src = imageUrl;
                image.alt = getProductName(product);
                image.loading = "lazy";

                image.addEventListener("error", () => {
                    const placeholder =
                        document.createElement("div");

                    placeholder.className =
                        "ai-product-image-placeholder";

                    placeholder.textContent = "🛍️";

                    image.replaceWith(placeholder);

                }, { once: true });

                card.appendChild(image);
            }

            const info = document.createElement("div");

            info.className = "ai-product-info";

            const name = document.createElement("h4");

            name.textContent = getProductName(product);

            const price = document.createElement("p");

            price.className = "ai-product-price";

            price.textContent = formatPrice(
                getProductPrice(product)
            );

            const link = document.createElement("a");

            link.className = "ai-product-link";

            link.textContent = getLanguageText("viewProduct");

            const id = getProductId(product);

            link.href = id != null
                ? `${PRODUCT_DETAILS_PAGE}?id=${encodeURIComponent(id)}`
                : PRODUCTS_PAGE;

            info.append(name, price, link);

            card.appendChild(info);

            productList.appendChild(card);
        });

        parentBubble.appendChild(productList);

        aiChatMessages.scrollTop =
            aiChatMessages.scrollHeight;
    }


    // ---------------------------------------------
    // RESET REQUEST DETECTION
    // ---------------------------------------------

    function isResetRequest(message) {
        const text = message.toLowerCase().trim();

        const englishPhrases = [
            "show all products",
            "display all products",
            "view all products",
            "see all products",
            "all products",
            "clear filter",
            "clear filters",
            "reset filter",
            "reset filters",
            "remove filters",
            "show everything"
        ];

        const hindiPhrases = [
            "सभी उत्पाद दिखाएँ",
            "सभी उत्पाद दिखाओ",
            "सारे उत्पाद दिखाओ",
            "सभी प्रोडक्ट दिखाओ",
            "सारे प्रोडक्ट दिखाओ",
            "सब कुछ दिखाओ",
            "फ़िल्टर हटाओ",
            "फिल्टर हटाओ"
        ];

        const teluguPhrases = [
            "అన్ని ఉత్పత్తులను చూపించండి",
            "అన్ని ఉత్పత్తులు చూపించు",
            "అన్ని ప్రొడక్ట్స్ చూపించు",
            "అన్ని ప్రొడక్ట్స్ చూపించండి",
            "అన్నీ చూపించండి",
            "అన్నీ చూపించు",
            "ఫిల్టర్లు తీసివేయండి",
            "ఫిల్టర్లు తొలగించండి"
        ];

        return [
            ...englishPhrases,
            ...hindiPhrases,
            ...teluguPhrases
        ].some(phrase => text.includes(phrase.toLowerCase()));
    }


    // ---------------------------------------------
    // SEND AI SHOPPING REQUEST
    // ---------------------------------------------

    async function sendAIShoppingRequest(message) {
        const userMessage = message.trim();

        if (
            !userMessage ||
            aiSendButton.disabled
        ) {
            return;
        }

        const selectedLanguage = getSelectedLanguage();

        const languageText =
            AI_LANGUAGES[selectedLanguage];

        addAIMessage(userMessage, "user");

        aiChatInput.value = "";

        aiSendButton.disabled = true;

        aiSendButton.textContent =
            languageText.searching;

        try {
            // Reset requests do not need an API call.
            if (isResetRequest(userMessage)) {
                window.resetAIProductFilter();

                addAIMessage(
                    languageText.reset,
                    "assistant"
                );

                return;
            }

            const response = await fetch(AI_API_URL, {
                method: "POST",

                headers: {
                    "Content-Type": "application/json"
                },

                body: JSON.stringify({
                    message: userMessage,
                    language: selectedLanguage
                })
            });

            let data;

            try {
                data = await response.json();
            } catch {
                throw new Error(
                    languageText.unableToSearch
                );
            }

            if (!response.ok) {
                throw new Error(
                    data.error ||
                    languageText.unableToSearch
                );
            }

            // The backend must return a localized reply
            // for the selected language.
            const reply = data.reply ||
                languageText.noMatching;

            const assistantBubble = addAIMessage(
                reply,
                "assistant"
            );

            if (Array.isArray(data.products)) {
                // Update the main product grid.
                window.applyAIProductFilter(
                    data.products
                );

                if (data.products.length > 0) {
                    showAIProducts(
                        data.products,
                        assistantBubble
                    );
                } else {
                    addAIMessage(
                        languageText.noMatching,
                        "assistant"
                    );
                }

            } else {
                console.warn(
                    "AI response has no products array:",
                    data
                );
            }

            // -----------------------------------------
            // SPEAK THE RESPONSE
            // -----------------------------------------

            if (
                aiVoiceReplyEnabled &&
                "speechSynthesis" in window
            ) {
                window.speechSynthesis.cancel();

                const utterance =
                    new SpeechSynthesisUtterance(reply);

                utterance.lang =
                    languageText.speechCode;

                window.speechSynthesis.speak(
                    utterance
                );
            }

            aiVoiceReplyEnabled = false;

            if (aiVoiceStatus) {
                aiVoiceStatus.textContent = "";
            }

        } catch (error) {
            console.error(
                "BuyNest AI error:",
                error
            );

            let errorMessage =
                error.message ||
                languageText.unableToSearch;

            if (
                error instanceof TypeError ||
                errorMessage.includes("Failed to fetch")
            ) {
                errorMessage =
                    languageText.unableToConnect;
            }

            addAIMessage(
                errorMessage,
                "assistant"
            );

            aiVoiceReplyEnabled = false;

            if (aiVoiceStatus) {
                aiVoiceStatus.textContent = "";
            }

        } finally {
            aiSendButton.disabled = false;

            aiSendButton.textContent =
                getLanguageText("send");

            aiChatInput.focus();
        }
    }


    // ---------------------------------------------
    // CHAT FORM
    // ---------------------------------------------

    aiChatForm.addEventListener("submit", event => {
        event.preventDefault();

        sendAIShoppingRequest(
            aiChatInput.value
        );
    });


    // ---------------------------------------------
    // SUGGESTED QUESTIONS
    // ---------------------------------------------

    document.querySelectorAll(
        "[data-ai-message]"
    ).forEach(button => {
        button.addEventListener("click", () => {
            const language = getSelectedLanguage();

            const messages = {
                en: [
                    "Show me products below 50000",
                    "Show me phones below 20000",
                    "Show me laptops above 40000",
                    "Show all products"
                ],

                hi: [
                    "मुझे 50000 से कम कीमत वाले उत्पाद दिखाओ",
                    "मुझे 20000 से कम कीमत वाले फोन दिखाओ",
                    "मुझे 40000 से अधिक कीमत वाले लैपटॉप दिखाओ",
                    "सभी उत्पाद दिखाओ"
                ],

                te: [
                    "50000 కంటే తక్కువ ధర ఉన్న ఉత్పత్తులను చూపించండి",
                    "20000 కంటే తక్కువ ధర ఉన్న ఫోన్లను చూపించండి",
                    "40000 కంటే ఎక్కువ ధర ఉన్న ల్యాప్‌టాప్‌లను చూపించండి",
                    "అన్ని ఉత్పత్తులను చూపించండి"
                ]
            };

            const buttons = [
                ...document.querySelectorAll("[data-ai-message]")
            ];

            const index = buttons.indexOf(button);

            const message =
                messages[language][index] ??
                button.dataset.aiMessage;

            openAIChat();

            sendAIShoppingRequest(message);
        });
    });


    // ---------------------------------------------
    // VOICE SEARCH
    // ---------------------------------------------

    const SpeechRecognition =
        window.SpeechRecognition ||
        window.webkitSpeechRecognition;

    let recognition = null;

    if (
        SpeechRecognition &&
        aiVoiceButton
    ) {
        recognition = new SpeechRecognition();

        recognition.continuous = false;

        recognition.interimResults = false;

        aiVoiceButton.addEventListener("click", () => {
            try {
                recognition.lang = getSpeechLanguage();

                aiVoiceReplyEnabled = true;

                if (aiVoiceStatus) {
                    aiVoiceStatus.textContent =
                        getLanguageText("voiceListening");
                }

                aiVoiceButton.classList.add("listening");

                recognition.start();

            } catch (error) {
                console.error(
                    "Voice recognition error:",
                    error
                );

                if (aiVoiceStatus) {
                    aiVoiceStatus.textContent =
                        getLanguageText("voiceError");
                }
            }
        });

        recognition.addEventListener("result", event => {
            const transcript =
                event.results[0][0].transcript.trim();

            aiChatInput.value = transcript;

            if (aiVoiceStatus) {
                aiVoiceStatus.textContent =
                    transcript;
            }

            sendAIShoppingRequest(transcript);
        });

        recognition.addEventListener("error", event => {
            aiVoiceReplyEnabled = false;

            aiVoiceButton.classList.remove("listening");

            if (!aiVoiceStatus) {
                return;
            }

            if (event.error === "not-allowed") {
                aiVoiceStatus.textContent =
                    getLanguageText("voiceDenied");

            } else if (event.error === "no-speech") {
                aiVoiceStatus.textContent =
                    getLanguageText("voiceNoSpeech");

            } else {
                aiVoiceStatus.textContent =
                    getLanguageText("voiceError");
            }
        });

        recognition.addEventListener("end", () => {
            aiVoiceButton.classList.remove("listening");

            if (
                aiVoiceStatus &&
                aiVoiceStatus.textContent ===
                    getLanguageText("voiceListening")
            ) {
                aiVoiceStatus.textContent =
                    getLanguageText("voiceFinished");
            }
        });

    } else if (aiVoiceButton) {
        aiVoiceButton.addEventListener("click", () => {
            if (aiVoiceStatus) {
                aiVoiceStatus.textContent =
                    getLanguageText("voiceUnsupported");
            }
        });
    }

}


// =====================================================
// LANGUAGE SELECTOR EVENT
// =====================================================

if (aiLanguage) {
    aiLanguage.addEventListener("change", () => {
        updateAssistantLanguage();

        // Change the initial greeting if the user has
        // not started a conversation.
        if (
            aiChatMessages &&
            aiChatMessages.children.length === 1 &&
            aiChatMessages.firstElementChild?.dataset.initialGreeting === "true"
        ) {
            updateAssistantLanguage();
        }
    });
}


// =====================================================
// INITIAL GREETING
// =====================================================

function initializeAIGreeting() {
    if (!aiChatMessages) {
        return;
    }

    const initialBubble =
        aiChatMessages.querySelector(".ai-message.assistant");

    if (!initialBubble) {
        return;
    }

    initialBubble.dataset.initialGreeting = "true";

    const languageText =
        AI_LANGUAGES[getSelectedLanguage()];

    initialBubble.replaceChildren();

    [
        languageText.greeting,
        languageText.introduction,
        languageText.example
    ].forEach(message => {
        const paragraph = document.createElement("p");

        paragraph.textContent = message;

        initialBubble.appendChild(paragraph);
    });
}


// =====================================================
// INITIALIZE PRODUCT PAGE
// =====================================================

async function initializeProductPage() {
    updateAssistantLanguage();

    initializeAIGreeting();

    await Promise.all([
        loadCategories(),
        loadProducts()
    ]);

    await applyCategoryFromURL();
}

initializeProductPage();