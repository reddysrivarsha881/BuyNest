// ===============================
// USER
// ===============================

const USER_ID =
    Number(
        localStorage.getItem("userId")
    );


// ===============================
// API
// ===============================

const BASE_URL =
    "https://buynest-backend-p1s9.onrender.com";

const CART_ITEMS_API =
    BASE_URL +
    "/getCartitems/" +
    USER_ID;


// ===============================
// CHECK LOGIN
// ===============================

if (!USER_ID) {

    alert("Please login first.");

    window.location.href =
        "customer-login.html";
}


// ===============================
// LOAD CART
// ===============================

async function loadCart() {

    try {

        const response =
            await fetch(
                CART_ITEMS_API
            );


        if (!response.ok) {

            throw new Error(
                "Failed to fetch cart"
            );
        }


        const result =
            await response.json();


        console.log(
            "Cart received:",
            result
        );


        const cartItems =
            Array.isArray(result)
                ? result
                : result.data;


        displayCart(
            cartItems || []
        );


    } catch (error) {

        console.error(
            "Error loading cart:",
            error
        );


        const cartContainer =
            document.getElementById(
                "cartItems"
            );


        if (cartContainer) {

            cartContainer.innerHTML = `

                <p style="
                    text-align:center;
                    color:red;
                    font-size:18px;
                ">

                    Unable to load cart.

                </p>

            `;
        }
    }
}


// ===============================
// DISPLAY CART
// ===============================

function displayCart(cartItems) {

    const cartContainer =
        document.getElementById(
            "cartItems"
        );


    if (!cartContainer) {

        console.error(
            "Cart container not found"
        );

        return;
    }


    cartContainer.innerHTML = "";


    // ===============================
    // EMPTY CART
    // ===============================

    if (
        !cartItems ||
        cartItems.length === 0
    ) {

        cartContainer.innerHTML = `

            <div style="
                text-align:center;
                padding:40px;
            ">

                <h2>
                    Your Cart is Empty
                </h2>

                <p>
                    Add some products to your cart.
                </p>

            </div>

        `;


        updateTotals(0);

        return;
    }


    let subtotal = 0;


    // ===============================
    // CART ITEMS
    // ===============================

    cartItems.forEach(
        cartItem => {

            const product =
                cartItem.product;


            const quantity =
                Number(
                    cartItem.quantity || 1
                );


            const price =
                Number(
                    product?.price || 0
                );


            const itemTotal =
                price * quantity;


            subtotal += itemTotal;


            const cartCard =
                document.createElement(
                    "div"
                );


            cartCard.className =
                "cart-item";


            cartCard.innerHTML = `

                <img
                    src="${
                        product?.imageUrl ||
                        product?.image ||
                        ""
                    }"
                    alt="${
                        product?.name ||
                        "Product"
                    }"
                    onerror="
                        this.src='https://via.placeholder.com/150x150?text=No+Image'
                    "
                >


                <div class="cart-item-details">

                    <h3>
                        ${
                            product?.name ||
                            "Product"
                        }
                    </h3>


                    <p>
                        Price:
                        ₹${price}
                    </p>


                    <!-- QUANTITY -->

                    <div class="quantity-controls">

                        <button
                            onclick="
                                decreaseQuantity(
                                    ${cartItem.id},
                                    ${quantity}
                                )
                            "
                        >
                            -
                        </button>


                        <span>
                            ${quantity}
                        </span>


                        <button
                            onclick="
                                increaseQuantity(
                                    ${cartItem.id},
                                    ${quantity}
                                )
                            "
                        >
                            +
                        </button>

                    </div>


                    <!-- ITEM TOTAL -->

                    <p>

                        <strong>
                            Total:
                            ₹${itemTotal}
                        </strong>

                    </p>


                    <!-- REMOVE -->

                    <button
                        onclick="
                            removeItem(
                                ${cartItem.id}
                            )
                        "
                    >
                        Remove
                    </button>

                </div>

            `;


            cartContainer.appendChild(
                cartCard
            );

        }
    );


    // ===============================
    // UPDATE TOTAL
    // ===============================

    updateTotals(
        subtotal
    );
}


// ===============================
// UPDATE TOTALS
// ===============================

function updateTotals(
    subtotal
) {

    const subtotalElement =
        document.getElementById(
            "subtotal"
        );


    const totalElement =
        document.getElementById(
            "total"
        );


    if (subtotalElement) {

        subtotalElement.textContent =
            "₹" +
            subtotal;
    }


    if (totalElement) {

        totalElement.textContent =
            "₹" +
            subtotal;
    }
}


// ===============================
// INCREASE QUANTITY
// ===============================

function increaseQuantity(
    cartItemId,
    currentQuantity
) {

    updateCartItem(
        cartItemId,
        currentQuantity + 1
    );
}


// ===============================
// DECREASE QUANTITY
// ===============================

function decreaseQuantity(
    cartItemId,
    currentQuantity
) {

    if (
        currentQuantity <= 1
    ) {

        removeItem(
            cartItemId
        );

        return;
    }


    updateCartItem(
        cartItemId,
        currentQuantity - 1
    );
}


// ===============================
// UPDATE CART ITEM
// ===============================

async function updateCartItem(
    cartItemId,
    quantity
) {

    try {

        // ===============================
        // GET EXISTING CART ITEM
        // ===============================

        const getResponse =
            await fetch(
                BASE_URL +
                "/getCartitem/" +
                cartItemId
            );


        if (!getResponse.ok) {

            throw new Error(
                "Unable to get cart item"
            );
        }


        const result =
            await getResponse.json();


        console.log(
            "Existing cart item:",
            result
        );


        const cartItem =
            result.data ||
            result;


        // ===============================
        // GET USER ID
        // ===============================

        const currentUserId =
            Number(
                localStorage.getItem(
                    "userId"
                )
            );


        if (!currentUserId) {

            throw new Error(
                "User is not logged in"
            );
        }


        // ===============================
        // GET PRODUCT ID
        // ===============================

        const productId =
            Number(
                cartItem.product?.id
            );


        if (!productId) {

            throw new Error(
                "Product ID not found"
            );
        }


        // ===============================
        // CREATE CORRECT DTO
        // ===============================
        //
        // Backend expects:
        // userId
        // productId
        // quantity
        // ===============================

        const updateData = {

            userId:
                currentUserId,

            productId:
                productId,

            quantity:
                Number(quantity)

        };


        console.log(
            "Updating cart with:",
            updateData
        );


        // ===============================
        // UPDATE CART ITEM
        // ===============================

        const response =
            await fetch(
                BASE_URL +
                "/updateCartitem/" +
                cartItemId,
                {

                    method: "PUT",

                    headers: {

                        "Content-Type":
                            "application/json"

                    },

                    body:
                        JSON.stringify(
                            updateData
                        )

                }
            );


        // ===============================
        // CHECK RESPONSE
        // ===============================

        if (!response.ok) {

            const errorText =
                await response.text();


            throw new Error(
                errorText ||
                "Unable to update cart"
            );
        }


        console.log(
            "Cart updated successfully"
        );


        // ===============================
        // RELOAD CART
        // ===============================

        await loadCart();


    } catch (error) {

        console.error(
            "Error updating cart:",
            error
        );


        alert(
            "Unable to update cart.\n\n" +
            error.message
        );
    }
}


// ===============================
// REMOVE CART ITEM
// ===============================

async function removeItem(
    cartItemId
) {

    if (
        !confirm(
            "Are you sure you want to remove this item?"
        )
    ) {

        return;
    }


    try {

        const response =
            await fetch(
                BASE_URL +
                "/deleteCartitem/" +
                cartItemId,
                {

                    method: "DELETE"

                }
            );


        if (!response.ok) {

            throw new Error(
                "Unable to delete cart item"
            );
        }


        // ===============================
        // RELOAD CART
        // ===============================

        await loadCart();


    } catch (error) {

        console.error(
            "Error removing cart item:",
            error
        );


        alert(
            "Unable to remove item.\n\n" +
            error.message
        );
    }
}


// ===============================
// PROCEED TO CHECKOUT
// ===============================

function proceedToCheckout() {

    window.location.href =
        "checkout.html";
}


// ===============================
// INITIAL LOAD
// ===============================

loadCart();