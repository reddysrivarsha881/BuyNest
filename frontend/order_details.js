// =====================================================
// GET ORDER ID FROM URL
// Example:
// http://127.0.0.1:5500/order_details.html?id=2
// =====================================================

const urlParams = new URLSearchParams(
    window.location.search
);

const orderId = urlParams.get("id");

console.log("Order ID:", orderId);


// =====================================================
// API
// =====================================================

const GET_ORDER_API =
    "https://buynest-backend-p1s9.onrender.com/getorder/";

// =====================================================
// HTML ELEMENTS
// =====================================================

const loading =
    document.getElementById("loading");

const orderDetails =
    document.getElementById("orderDetails");

const errorMessage =
    document.getElementById("errorMessage");

const orderIdElement =
    document.getElementById("orderId");

const customerName =
    document.getElementById("customerName");

const customerEmail =
    document.getElementById("customerEmail");

const customerPhone =
    document.getElementById("customerPhone");

const orderStatus =
    document.getElementById("orderStatus");

const totalAmount =
    document.getElementById("totalAmount");

const orderItems =
    document.getElementById("orderItems");


// =====================================================
// CHECK ORDER ID
// =====================================================

if (!orderId) {

    showError(
        "Order ID is missing from the URL."
    );

}


// =====================================================
// LOAD ORDER DETAILS
// =====================================================

async function loadOrderDetails() {

    try {

        console.log(
            "Loading order:",
            orderId
        );


        // Show loading

        loading.style.display = "block";

        orderDetails.style.display = "none";

        errorMessage.style.display = "none";


        // =================================================
        // GET ORDER FROM SPRING BOOT
        // =================================================

        const response = await fetch(
            GET_ORDER_API + orderId
        );


        console.log(
            "API Status:",
            response.status
        );


        // =================================================
        // CHECK RESPONSE
        // =================================================

        if (!response.ok) {

            throw new Error(
                "Unable to get order. Status: " +
                response.status
            );

        }


        // =================================================
        // CONVERT RESPONSE TO JSON
        // =================================================

        const result =
            await response.json();


        console.log(
            "Complete API Response:",
            result
        );


        // =================================================
        // GET ORDER OBJECT
        // =================================================

        const order =
            result.data
                ? result.data
                : result;


        console.log(
            "Order:",
            order
        );


        // =================================================
        // CHECK ORDER
        // =================================================

        if (!order) {

            throw new Error(
                "Order details not found."
            );

        }


        // =================================================
        // DISPLAY ORDER INFORMATION
        // =================================================

        displayOrder(order);


        // =================================================
        // GET ORDER ITEMS
        // =================================================

        const items =
            order.orderitems || [];


        console.log(
            "Order Items:",
            items
        );


        // =================================================
        // DISPLAY ORDER ITEMS
        // =================================================

        displayOrderItems(items);


        // Hide loading

        loading.style.display = "none";


        // Show order details

        orderDetails.style.display = "block";

    }


    catch (error) {

        console.error(
            "Order Details Error:",
            error
        );


        loading.style.display = "none";


        showError(
            error.message
        );

    }

}


// =====================================================
// DISPLAY ORDER INFORMATION
// =====================================================

function displayOrder(order) {


    // =================================================
    // ORDER ID
    // =================================================

    orderIdElement.textContent =
        order.id || orderId;


    // =================================================
    // USER
    // =================================================

    const user =
        order.user || {};


    // =================================================
    // CUSTOMER NAME
    // =================================================

    customerName.textContent =
        user.name ||
        "Customer";


    // =================================================
    // EMAIL
    // =================================================

    customerEmail.textContent =
        user.email ||
        "Not available";


    // =================================================
    // PHONE
    // =================================================

    customerPhone.textContent =
        user.phone ||
        "Not available";


    // =================================================
    // STATUS
    // =================================================

    orderStatus.textContent =
        order.status ||
        "UNKNOWN";


    // =================================================
    // TOTAL AMOUNT
    // =================================================

    const amount =
        Number(
            order.totalAmount || 0
        );


    totalAmount.textContent =
        amount.toLocaleString("en-IN");

}


// =====================================================
// DISPLAY ORDER ITEMS
// =====================================================

function displayOrderItems(items) {


    orderItems.innerHTML = "";


    // =================================================
    // NO ITEMS
    // =================================================

    if (
        !Array.isArray(items) ||
        items.length === 0
    ) {

        orderItems.innerHTML = `

            <div class="no-items">

                <p>
                    No products found for this order.
                </p>

            </div>

        `;

        return;

    }


    // =================================================
    // DISPLAY EACH ITEM
    // =================================================

    items.forEach(item => {


        // =================================================
        // PRODUCT
        // =================================================

        const product =
            item.products ||
            item.product ||
            {};


        // =================================================
        // PRODUCT NAME
        // =================================================

        const productName =
            product.name ||
            "Product";


        // =================================================
        // PRODUCT IMAGE
        // =================================================

        const imageUrl =
            product.imageUrl ||
            "";


        // =================================================
        // QUANTITY
        // =================================================

        const quantity =
            Number(
                item.quantity || 0
            );


        // =================================================
        // PRICE
        // =================================================

        const price =
            Number(
                item.price ??
                product.price ??
                0
            );


        // =================================================
        // ITEM TOTAL
        // =================================================

        const itemTotal =
            price * quantity;


        // =================================================
        // CREATE ITEM ELEMENT
        // =================================================

        const itemElement =
            document.createElement("div");


        itemElement.className =
            "order-item";


        // =================================================
        // ITEM HTML
        // =================================================

        itemElement.innerHTML = `

            <div class="item-image">

                ${
                    imageUrl
                    ?
                    `
                    <img
                        src="${imageUrl}"
                        alt="${productName}"
                    >
                    `
                    :
                    `
                    <div class="no-image">
                        🛍️
                    </div>
                    `
                }

            </div>


            <div class="item-info">

                <h3>
                    ${productName}
                </h3>

                <p>
                    Price:
                    ₹${price.toLocaleString("en-IN")}
                </p>

                <p>
                    Quantity:
                    ${quantity}
                </p>

                <strong>
                    Item Total:
                    ₹${itemTotal.toLocaleString("en-IN")}
                </strong>

            </div>

        `;


        orderItems.appendChild(
            itemElement
        );

    });

}


// =====================================================
// SHOW ERROR
// =====================================================

function showError(message) {


    loading.style.display =
        "none";


    orderDetails.style.display =
        "none";


    errorMessage.style.display =
        "block";


    errorMessage.innerHTML = `

        <div class="error-message">

            <h3>
                Unable to load order
            </h3>

            <p>
                ${message}
            </p>

            <button
                onclick="window.location.href='orders.html'"
            >
                ← Back to Orders
            </button>

        </div>

    `;

}


// =====================================================
// START
// =====================================================

if (orderId) {

    loadOrderDetails();

}