// =====================================================
// API URLS
// =====================================================

const BASE_URL =
    "https://buynest-backend-p1s9.onrender.com";

const SAVE_ORDER_API =
    `${BASE_URL}/saveorder`;

const SAVE_ORDERITEM_API =
    `${BASE_URL}/orderitems`;


// =====================================================
// CURRENT USER
// =====================================================

const CURRENT_USER_ID =
    Number(
        localStorage.getItem("userId")
    );


// =====================================================
// CHECK LOGIN
// =====================================================

if (!CURRENT_USER_ID) {

    alert("Please login first.");

    window.location.href =
        "customer-login.html";
}


// =====================================================
// VARIABLES
// =====================================================

let cartItems = [];

let totalAmount = 0;


// =====================================================
// LOAD CHECKOUT
// =====================================================

async function loadCheckout() {

    try {

        console.log(
            "Logged-in User ID:",
            CURRENT_USER_ID
        );


        // =================================================
        // CHECK BUY NOW PRODUCT FIRST
        // =================================================

        const buyNowData =
            localStorage.getItem(
                "buyNowProduct"
            );


        if (buyNowData) {

            console.log(
                "Buy Now product found:",
                buyNowData
            );


            const buyNowProduct =
                JSON.parse(
                    buyNowData
                );


            // =============================================
            // CONVERT BUY NOW DATA INTO CART FORMAT
            // =============================================

            cartItems = [

                {

                    quantity:
                        Number(
                            buyNowProduct.quantity
                        ) || 1,

                    price:
                        Number(
                            buyNowProduct.price
                        ) || 0,

                    product: {

                        id:
                            Number(
                                buyNowProduct.productId
                            ),

                        name:
                            buyNowProduct.productName,

                        price:
                            Number(
                                buyNowProduct.price
                            ) || 0

                    }

                }

            ];


            // =============================================
            // CALCULATE BUY NOW TOTAL
            // =============================================

            totalAmount =
                Number(
                    buyNowProduct.totalAmount
                ) ||
                (
                    Number(
                        buyNowProduct.price
                    ) || 0
                ) *
                (
                    Number(
                        buyNowProduct.quantity
                    ) || 1
                );


            console.log(
                "Buy Now cart:",
                cartItems
            );


            console.log(
                "Buy Now total:",
                totalAmount
            );


            // =============================================
            // DISPLAY
            // =============================================

            displayCheckoutItems();

            updateTotals();

            return;
        }


        // =================================================
        // NORMAL CART CHECKOUT
        // =================================================

        const response =
            await fetch(
                `${BASE_URL}/getCartitems/${CURRENT_USER_ID}`
            );


        if (!response.ok) {

            const errorText =
                await response.text();

            console.error(
                "Cart loading error:",
                errorText
            );

            throw new Error(
                "Unable to load cart items"
            );
        }


        // =================================================
        // GET CART DATA
        // =================================================

        const data =
            await response.json();


        console.log(
            "Current user's cart:",
            data
        );


        // =================================================
        // STORE CART ITEMS
        // =================================================

        cartItems =
            Array.isArray(data)
                ? data
                : [];


        // =================================================
        // EMPTY CART
        // =================================================

        if (
            cartItems.length === 0
        ) {

            document.getElementById(
                "checkoutItems"
            ).innerHTML = `
                <p>Your cart is empty.</p>
            `;

            totalAmount = 0;

            updateTotals();

            return;
        }


        // =================================================
        // CALCULATE CART TOTAL
        // =================================================

        totalAmount = 0;


        cartItems.forEach(
            item => {

                const product =
                    item.product ||
                    item.products;


                if (!product) {
                    return;
                }


                const price =
                    Number(
                        item.price ??
                        product.price ??
                        0
                    );


                const quantity =
                    Number(
                        item.quantity
                    ) || 0;


                totalAmount +=
                    price * quantity;

            }
        );


        console.log(
            "Checkout Total:",
            totalAmount
        );


        // =================================================
        // DISPLAY CART ITEMS
        // =================================================

        displayCheckoutItems();


        // =================================================
        // UPDATE TOTALS
        // =================================================

        updateTotals();

    }


    catch (error) {

        console.error(
            "Checkout Error:",
            error
        );


        const checkoutItems =
            document.getElementById(
                "checkoutItems"
            );


        if (checkoutItems) {

            checkoutItems.innerHTML = `
                <p>
                    Unable to load cart items.
                </p>
            `;

        }

    }

}


// =====================================================
// DISPLAY CHECKOUT ITEMS
// =====================================================

function displayCheckoutItems() {

    const container =
        document.getElementById(
            "checkoutItems"
        );


    if (!container) {
        return;
    }


    container.innerHTML = "";


    cartItems.forEach(
        item => {

            const product =
                item.product ||
                item.products;


            if (!product) {
                return;
            }


            const price =
                Number(
                    item.price ??
                    product.price ??
                    0
                );


            const quantity =
                Number(
                    item.quantity
                ) || 0;


            const itemTotal =
                price * quantity;


            const orderItem =
                document.createElement(
                    "div"
                );


            orderItem.className =
                "order-item";


            orderItem.innerHTML = `

                <span>
                    ${product.name} × ${quantity}
                </span>

                <span>
                    ₹${itemTotal.toLocaleString("en-IN")}
                </span>

            `;


            container.appendChild(
                orderItem
            );

        }
    );

}


// =====================================================
// UPDATE TOTALS
// =====================================================

function updateTotals() {

    const subtotal =
        document.getElementById(
            "subtotal"
        );


    const total =
        document.getElementById(
            "total"
        );


    if (subtotal) {

        subtotal.innerText =
            "₹" +
            totalAmount.toLocaleString(
                "en-IN"
            );

    }


    if (total) {

        total.innerText =
            "₹" +
            totalAmount.toLocaleString(
                "en-IN"
            );

    }

}


// =====================================================
// VALIDATE CHECKOUT DETAILS
// =====================================================

function validateCheckoutDetails() {

    const firstName =
        document.getElementById(
            "firstName"
        ).value.trim();


    const lastName =
        document.getElementById(
            "lastName"
        ).value.trim();


    const email =
        document.getElementById(
            "email"
        ).value.trim();


    const phone =
        document.getElementById(
            "phone"
        ).value.trim();


    const address =
        document.getElementById(
            "address"
        ).value.trim();


    const city =
        document.getElementById(
            "city"
        ).value.trim();


    const pinCode =
        document.getElementById(
            "pinCode"
        ).value.trim();


    // =================================================
    // PATTERNS
    // =================================================

    const namePattern =
        /^[A-Za-z ]+$/;

    const emailPattern =
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const phonePattern =
        /^[0-9]{10}$/;

    const pinPattern =
        /^[0-9]{6}$/;


    // =================================================
    // FIRST NAME
    // =================================================

    if (!firstName) {

        alert(
            "Please enter your first name."
        );

        return false;
    }


    if (!namePattern.test(firstName)) {

        alert(
            "First name should contain alphabets only."
        );

        return false;
    }


    // =================================================
    // LAST NAME
    // =================================================

    if (!lastName) {

        alert(
            "Please enter your last name."
        );

        return false;
    }


    if (!namePattern.test(lastName)) {

        alert(
            "Last name should contain alphabets only."
        );

        return false;
    }


    // =================================================
    // EMAIL
    // =================================================

    if (!email) {

        alert(
            "Please enter your email."
        );

        return false;
    }


    if (!emailPattern.test(email)) {

        alert(
            "Please enter a valid email address."
        );

        return false;
    }


    // =================================================
    // PHONE
    // =================================================

    if (!phone) {

        alert(
            "Please enter your phone number."
        );

        return false;
    }


    if (!phonePattern.test(phone)) {

        alert(
            "Phone number must contain exactly 10 digits."
        );

        return false;
    }


    // =================================================
    // ADDRESS
    // =================================================

    if (!address) {

        alert(
            "Please enter your address."
        );

        return false;
    }


    // =================================================
    // CITY
    // =================================================

    if (!city) {

        alert(
            "Please enter your city."
        );

        return false;
    }


    if (!namePattern.test(city)) {

        alert(
            "City should contain alphabets only."
        );

        return false;
    }


    // =================================================
    // PIN CODE
    // =================================================

    if (!pinCode) {

        alert(
            "Please enter your PIN code."
        );

        return false;
    }


    if (!pinPattern.test(pinCode)) {

        alert(
            "PIN code must contain exactly 6 digits."
        );

        return false;
    }


    return true;

}


// =====================================================
// PLACE ORDER
// =====================================================

async function placeOrder() {

    try {

        // =================================================
        // CHECK CART
        // =================================================

        if (
            !cartItems ||
            cartItems.length === 0
        ) {

            alert(
                "Your cart is empty."
            );

            return;
        }


        // =================================================
        // VALIDATE DETAILS
        // =================================================

        if (
            !validateCheckoutDetails()
        ) {

            return;
        }


        // =================================================
        // PAYMENT
        // =================================================

        const payment =
            document.querySelector(
                'input[name="payment"]:checked'
            );


        const paymentMethod =
            payment
                ? payment.value
                : "Cash on Delivery";


        // =================================================
        // CREATE ORDER
        // =================================================

        const order = {

            totalAmount:
                totalAmount,

            status:
                "PLACED",

            user: {

                id:
                    CURRENT_USER_ID

            }

        };


        console.log(
            "Order being saved:",
            order
        );


        // =================================================
        // SAVE ORDER
        // =================================================

        const orderResponse =
            await fetch(
                SAVE_ORDER_API,
                {

                    method:
                        "POST",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            order
                        )

                }
            );


        if (!orderResponse.ok) {

            const errorText =
                await orderResponse.text();


            console.error(
                "Order save error:",
                errorText
            );


            throw new Error(
                "Failed to save order"
            );
        }


        const orderResult =
            await orderResponse.json();


        console.log(
            "Order saved:",
            orderResult
        );


        // =================================================
        // GET SAVED ORDER
        // =================================================

        const savedOrder =
            orderResult.data;


        if (!savedOrder) {

            throw new Error(
                "Order data was not returned."
            );
        }


        const orderId =
            savedOrder.id;


        console.log(
            "Created Order ID:",
            orderId
        );


        // =================================================
        // SAVE ORDER ITEMS
        // =================================================

        for (
            const item of cartItems
        ) {

            const product =
                item.product ||
                item.products;


            if (!product) {
                continue;
            }


            const price =
                Number(
                    item.price ??
                    product.price ??
                    0
                );


            const quantity =
                Number(
                    item.quantity
                ) || 0;


            const orderItem = {

                quantity:
                    quantity,

                price:
                    price,

                orders: {

                    id:
                        orderId

                },

                products: {

                    id:
                        product.id

                }

            };


            console.log(
                "Saving order item:",
                orderItem
            );


            const itemResponse =
                await fetch(
                    SAVE_ORDERITEM_API,
                    {

                        method:
                            "POST",

                        headers: {

                            "Content-Type":
                                "application/json"

                        },

                        body:
                            JSON.stringify(
                                orderItem
                            )

                    }
                );


            if (!itemResponse.ok) {

                const errorText =
                    await itemResponse.text();


                console.error(
                    "Order item error:",
                    errorText
                );


                throw new Error(
                    "Failed to save order item"
                );
            }


            const savedItem =
                await itemResponse.json();


            console.log(
                "Order item saved:",
                savedItem
            );

        }


        // =================================================
        // SAVE SUCCESS PAGE DATA
        // =================================================

        localStorage.setItem(
            "orderId",
            orderId
        );


        localStorage.setItem(
            "totalAmount",
            totalAmount
        );


        localStorage.setItem(
            "paymentMethod",
            paymentMethod
        );


        // =================================================
        // REMOVE BUY NOW DATA
        // =================================================

        localStorage.removeItem(
            "buyNowProduct"
        );


        // =================================================
        // SUCCESS
        // =================================================

        alert(
            "Order placed successfully!"
        );


        window.location.href =
            "order-success.html";

    }


    catch (error) {

        console.error(
            "Place Order Error:",
            error
        );


        alert(
            "Unable to place order. Please try again."
        );

    }

}


// =====================================================
// BUTTON EVENT
// =====================================================

document.addEventListener(
    "DOMContentLoaded",
    function () {

        loadCheckout();


        const placeOrderButton =
            document.getElementById(
                "placeOrderBtn"
            );


        if (placeOrderButton) {

            placeOrderButton.addEventListener(
                "click",
                placeOrder
            );

        }

    }
);