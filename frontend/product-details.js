// =====================================================
// API URL
// =====================================================

const API_BASE_URL =
    "https://buynest-backend-p1s9.onrender.com";

const API_URL =
    API_BASE_URL + "/getProducts";

const SAVE_CART_ITEM_API =
    API_BASE_URL + "/saveCartitem";


// =====================================================
// GET PRODUCT ID FROM URL
// =====================================================

const urlParams =
    new URLSearchParams(
        window.location.search
    );

const productId =
    urlParams.get("id");

console.log(
    "Product ID:",
    productId
);


// =====================================================
// CURRENT USER
// =====================================================

const currentUserId =
    Number(
        localStorage.getItem("userId")
    );

console.log(
    "Current User ID:",
    currentUserId
);


// =====================================================
// CURRENT PRODUCT
// =====================================================

let currentProduct = null;


// =====================================================
// HTML ELEMENTS
// =====================================================

const productImage =
    document.getElementById(
        "productImage"
    );

const categoryElement =
    document.getElementById(
        "category"
    );

const productName =
    document.getElementById(
        "productName"
    );

const productDescription =
    document.getElementById(
        "productDescription"
    );

const productPrice =
    document.getElementById(
        "productPrice"
    );

const productQuantity =
    document.getElementById(
        "productQuantity"
    );

const quantityInput =
    document.getElementById(
        "quantity"
    );

const productIdElement =
    document.getElementById(
        "productId"
    );

const productCategory =
    document.getElementById(
        "productCategory"
    );

const detailsPrice =
    document.getElementById(
        "detailsPrice"
    );

const detailsQuantity =
    document.getElementById(
        "detailsQuantity"
    );

const cartButton =
    document.getElementById(
        "cartButton"
    );

const buyButton =
    document.getElementById(
        "buyButton"
    );


// =====================================================
// CHECK PRODUCT ID
// =====================================================

if (!productId) {

    productName.textContent =
        "Product not found";

    productDescription.textContent =
        "Product ID is missing.";

} else {

    loadProduct();

}


// =====================================================
// LOAD PRODUCT
// =====================================================

async function loadProduct() {

    try {

        console.log(
            "Fetching products from:",
            API_URL
        );


        const response =
            await fetch(
                API_URL
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load products"
            );

        }


        const products =
            await response.json();


        console.log(
            "Products:",
            products
        );


        // =================================================
        // FIND PRODUCT
        // =================================================

        currentProduct =
            products.find(
                product =>
                    Number(product.id) ===
                    Number(productId)
            );


        if (!currentProduct) {

            throw new Error(
                "Product not found"
            );

        }


        console.log(
            "Selected Product:",
            currentProduct
        );


        // =================================================
        // DISPLAY PRODUCT
        // =================================================

        displayProduct(
            currentProduct
        );

    }


    catch (error) {

        console.error(
            "Error loading product:",
            error
        );


        productName.textContent =
            "Unable to load product";

        productDescription.textContent =
            error.message;

    }

}


// =====================================================
// DISPLAY PRODUCT
// =====================================================

function displayProduct(
    product
) {

    // =================================================
    // BASIC DETAILS
    // =================================================

    productName.textContent =
        product.name ||
        "Product";


    productDescription.textContent =
        product.description ||
        "No description available.";


    // =================================================
    // PRICE
    // =================================================

    const price =
        Number(
            product.price || 0
        );


    productPrice.textContent =
        "₹" +
        price.toLocaleString(
            "en-IN"
        );


    detailsPrice.textContent =
        "₹" +
        price.toLocaleString(
            "en-IN"
        );


    // =================================================
    // PRODUCT ID
    // =================================================

    productIdElement.textContent =
        product.id ||
        "-";


    // =================================================
    // CATEGORY
    // =================================================

    let categoryName =
        "Category";


    if (
        product.category &&
        typeof product.category === "object"
    ) {

        categoryName =
            product.category.name ||
            product.category.categoryName ||
            "Category";

    }

    else if (
        typeof product.category === "string"
    ) {

        categoryName =
            product.category;

    }


    categoryElement.textContent =
        categoryName;


    productCategory.textContent =
        categoryName;


    // =================================================
    // QUANTITY
    // =================================================

    const availableQuantity =
        Number(
            product.quantity ||
            product.stock ||
            0
        );


    productQuantity.textContent =
        "Available: " +
        availableQuantity;


    detailsQuantity.textContent =
        availableQuantity;


    // =================================================
    // PRODUCT IMAGE
    // =================================================

    if (product.imageUrl) {

        productImage.innerHTML = `
            <img
                src="${product.imageUrl}"
                alt="${product.name || "Product"}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:contain;
                "
            >
        `;

    }

    else if (product.image) {

        productImage.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name || "Product"}"
                style="
                    width:100%;
                    height:100%;
                    object-fit:contain;
                "
            >
        `;

    }

    else {

        productImage.innerHTML =
            "🛍️";

    }


    // =================================================
    // RESET QUANTITY
    // =================================================

    quantityInput.value = 1;

}


// =====================================================
// INCREASE QUANTITY
// =====================================================

function increaseQuantity() {

    if (!currentProduct) {
        return;
    }


    const availableQuantity =
        Number(
            currentProduct.quantity ||
            currentProduct.stock ||
            0
        );


    let quantity =
        Number(
            quantityInput.value
        );


    if (
        availableQuantity > 0 &&
        quantity < availableQuantity
    ) {

        quantity++;

        quantityInput.value =
            quantity;

    }

}


// =====================================================
// DECREASE QUANTITY
// =====================================================

function decreaseQuantity() {

    let quantity =
        Number(
            quantityInput.value
        );


    if (quantity > 1) {

        quantity--;

        quantityInput.value =
            quantity;

    }

}


// =====================================================
// ADD TO CART BUTTON
// =====================================================

if (cartButton) {

    cartButton.addEventListener(
        "click",
        addProductToCart
    );

}


// =====================================================
// ADD PRODUCT TO CART
// =====================================================

async function addProductToCart() {

    if (!currentProduct) {

        alert(
            "Product is not loaded yet."
        );

        return;

    }


    if (!currentUserId) {

        alert(
            "Please login first."
        );

        window.location.href =
            "customer-login.html";

        return;

    }


    const quantity =
        Number(
            quantityInput.value
        );


    const cartItem = {

        userId:
            currentUserId,

        productId:
            Number(
                currentProduct.id
            ),

        quantity:
            quantity

    };


    console.log(
        "Saving cart item:",
        cartItem
    );


    try {

        const response =
            await fetch(
                SAVE_CART_ITEM_API,
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json"
                    },

                    body:
                        JSON.stringify(
                            cartItem
                        )
                }
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Cart error:",
                errorText
            );

            throw new Error(
                "Failed to add product to cart"
            );

        }


        alert(
            "Product added to cart successfully!"
        );


    }

    catch (error) {

        console.error(
            "Add to cart error:",
            error
        );

        alert(
            error.message
        );

    }

}


// =====================================================
// BUY NOW BUTTON
// =====================================================

if (buyButton) {

    buyButton.addEventListener(
        "click",
        buyNow
    );

}


// =====================================================
// BUY NOW
// =====================================================

function buyNow() {

    if (!currentProduct) {

        alert(
            "Product is not loaded yet."
        );

        return;

    }


    if (!currentUserId) {

        alert(
            "Please login first."
        );

        window.location.href =
            "customer-login.html";

        return;

    }


    const quantity =
        Number(
            quantityInput.value
        );


    const price =
        Number(
            currentProduct.price || 0
        );


    const totalAmount =
        price * quantity;


    const buyNowData = {

        userId:
            currentUserId,

        productId:
            Number(
                currentProduct.id
            ),

        productName:
            currentProduct.name,

        price:
            price,

        quantity:
            quantity,

        totalAmount:
            totalAmount

    };


    console.log(
        "Buy Now data:",
        buyNowData
    );


    // =================================================
    // SAVE BUY NOW DATA
    // =================================================

    localStorage.setItem(
        "buyNowProduct",
        JSON.stringify(
            buyNowData
        )
    );


    // =================================================
    // CLEAR OLD CHECKOUT DATA
    // =================================================

    localStorage.removeItem(
        "orderId"
    );

    localStorage.removeItem(
        "orderTotal"
    );

    localStorage.removeItem(
        "totalAmount"
    );

    localStorage.removeItem(
        "paymentMethod"
    );


    // =================================================
    // GO TO CHECKOUT
    // =================================================

    window.location.href =
        "checkout.html";

}