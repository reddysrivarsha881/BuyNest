// =====================================================
// BASE URL
// =====================================================

const BASE_URL = "https://buynest-backend-p1s9.onrender.com";


// =====================================================
// PAGE LOAD
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    loadOrders();

});


// =====================================================
// LOAD ORDERS
// =====================================================

async function loadOrders() {

    console.log("Loading admin orders...");

    try {

        const response = await fetch(
            BASE_URL + "/admin/orders"
        );


        console.log(
            "Orders response status:",
            response.status
        );


        if (!response.ok) {

            throw new Error(
                "HTTP Error: " + response.status
            );

        }


        const orders = await response.json();


        console.log(
            "Orders received:",
            orders
        );


        if (!Array.isArray(orders)) {

            throw new Error(
                "Orders data is not an array"
            );

        }


        // =================================================
        // TOTAL ORDERS
        // =================================================

        document.getElementById(
            "totalOrders"
        ).textContent = orders.length;


        // =================================================
        // TABLE
        // =================================================

        const tbody =
            document.getElementById(
                "ordersTableBody"
            );


        tbody.innerHTML = "";


        // =================================================
        // NO ORDERS
        // =================================================

        if (orders.length === 0) {

            tbody.innerHTML = `

                <tr>

                    <td
                        colspan="7"
                        style="text-align:center;">

                        No orders found.

                    </td>

                </tr>

            `;

            return;
        }


        // =================================================
        // LOAD DELIVERY PERSONS
        // =================================================

        const deliveryPersons =
            await loadDeliveryPersons();


        console.log(
            "Delivery persons:",
            deliveryPersons
        );


        // =================================================
        // DISPLAY ORDERS
        // =================================================

        orders.forEach(function (order) {

            const row =
                document.createElement("tr");


            // =================================================
            // CUSTOMER
            // =================================================

            const customerName =
                order.user
                    ? order.user.name
                    : "Unknown";


            const customerEmail =
                order.user
                    ? order.user.email
                    : "N/A";


            // =================================================
            // DELIVERY PERSON
            // =================================================

            let deliveryName =
                "Not Assigned";


            if (order.deliveryPerson) {

                deliveryName =
                    order.deliveryPerson.name;

            }


            // =================================================
            // STATUS
            // =================================================

            const orderStatus =
                order.status || "PLACED";


            // =================================================
            // DELIVERY OPTIONS
            // =================================================

            let deliveryOptions = `
                <option value="">
                    Select Delivery Person
                </option>
            `;


            deliveryPersons.forEach(
                function (person) {

                    // Show AVAILABLE persons
                    // OR the person already assigned
                    if (
                        person.status === "AVAILABLE" ||
                        (
                            order.deliveryPerson &&
                            Number(person.id) ===
                            Number(order.deliveryPerson.id)
                        )
                    ) {

                        const selected =
                            order.deliveryPerson &&
                            Number(person.id) ===
                            Number(order.deliveryPerson.id)
                                ? "selected"
                                : "";


                        deliveryOptions += `

                            <option
                                value="${person.id}"
                                ${selected}>

                                ${person.name}
                                (${person.status})

                            </option>

                        `;

                    }

                }
            );


            // =================================================
            // ASSIGN BUTTON
            // =================================================

            let actionButton = "";


            if (order.deliveryPerson) {

                actionButton = `

                    <button
                        disabled
                        style="
                            padding:8px 12px;
                            border:none;
                            border-radius:6px;
                            cursor:default;
                            background:#d4edda;
                            color:#155724;
                            font-weight:bold;
                        ">

                        Assigned

                    </button>

                `;

            } else {

                actionButton = `

                    <button
                        onclick="assignDelivery(${order.id})"
                        style="
                            padding:8px 12px;
                            border:none;
                            border-radius:6px;
                            cursor:pointer;
                        ">

                        Assign

                    </button>

                `;

            }


            // =================================================
            // CREATE ROW
            // =================================================

            row.innerHTML = `

                <td>
                    #${order.id}
                </td>


                <td>
                    ${customerName}
                </td>


                <td>
                    ${customerEmail}
                </td>


                <td>
                    ₹${Number(
                        order.totalAmount || 0
                    ).toLocaleString("en-IN")}
                </td>


                <td>

                    <span class="status confirmed">

                        ${orderStatus}

                    </span>

                </td>


                <td>

                    ${deliveryName}

                </td>


                <td>

                    <select
                        id="delivery-${order.id}"
                        ${order.deliveryPerson ? "disabled" : ""}
                        style="
                            padding:8px;
                            border-radius:6px;
                            border:1px solid #ccc;
                            margin-right:5px;
                        ">

                        ${deliveryOptions}

                    </select>


                    ${actionButton}

                </td>

            `;


            tbody.appendChild(row);

        });

    }


    catch (error) {

        console.error(
            "ORDER ERROR:",
            error
        );


        document.getElementById(
            "totalOrders"
        ).textContent = "0";


        document.getElementById(
            "ordersTableBody"
        ).innerHTML = `

            <tr>

                <td
                    colspan="7"
                    style="
                        text-align:center;
                        color:red;
                    ">

                    Error: ${error.message}

                </td>

            </tr>

        `;

    }

}


// =====================================================
// LOAD DELIVERY PERSONS
// =====================================================

async function loadDeliveryPersons() {

    try {

        const response =
            await fetch(
                BASE_URL +
                "/deliveryperson/all"
            );


        if (!response.ok) {

            throw new Error(
                "Failed to load delivery persons"
            );

        }


        return await response.json();

    }


    catch (error) {

        console.error(
            "Delivery loading error:",
            error
        );

        return [];

    }

}


// =====================================================
// ASSIGN DELIVERY PERSON
// =====================================================

async function assignDelivery(orderId) {

    const select =
        document.getElementById(
            "delivery-" + orderId
        );


    if (!select) {

        alert(
            "Delivery person selection not found."
        );

        return;

    }


    const deliveryPersonId =
        select.value;


    // =================================================
    // CHECK SELECTION
    // =================================================

    if (!deliveryPersonId) {

        alert(
            "Please select a delivery person."
        );

        return;

    }


    console.log(
        "Assigning delivery person:",
        deliveryPersonId,
        "to order:",
        orderId
    );


    try {

        const response =
            await fetch(
                BASE_URL +
                "/admin/orders/" +
                orderId +
                "/assign/" +
                deliveryPersonId,
                {
                    method: "PUT"
                }
            );


        const result =
            await response.text();


        console.log(
            "Assignment response:",
            result
        );


        if (!response.ok) {

            throw new Error(
                result ||
                "Failed to assign delivery person"
            );

        }


        alert(
            "Delivery person assigned successfully!"
        );


        // =================================================
        // RELOAD ORDERS
        // =================================================

        await loadOrders();

    }


    catch (error) {

        console.error(
            "ASSIGNMENT ERROR:",
            error
        );


        alert(
            "Failed to assign delivery person.\n\n" +
            error.message
        );

    }

}