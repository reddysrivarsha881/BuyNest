const BASE_URL = "https://buynest-backend-p1s9.onrender.com";


// =====================================================
// LOAD PAGE
// =====================================================

document.addEventListener("DOMContentLoaded", function () {

    loadDeliveryPersons();

    loadOrders();

});


// =====================================================
// LOAD DELIVERY PERSONS
// =====================================================

function loadDeliveryPersons() {

    fetch(`${BASE_URL}/deliveryperson/all`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load delivery persons");
            }

            return response.json();

        })

        .then(persons => {

            console.log("Delivery Persons:", persons);

            displayDeliveryPersons(persons);

        })

        .catch(error => {

            console.error(
                "Delivery Person Error:",
                error
            );

            document.getElementById("deliveryPersons").innerHTML =
                "<p>Unable to load delivery persons.</p>";

        });

}


// =====================================================
// DISPLAY DELIVERY PERSONS
// =====================================================

function displayDeliveryPersons(persons) {

    const container =
        document.getElementById("deliveryPersons");

    container.innerHTML = "";


    persons.forEach(person => {

        const card =
            document.createElement("div");

        card.className = "person-card";


        let statusClass =
            person.status === "AVAILABLE"
                ? "available"
                : "busy";


        card.innerHTML = `

            <h3>🚚 ${person.name}</h3>

            <p>
                📧 ${person.email}
            </p>

            <p>
                📞 ${person.phone}
            </p>

            <p class="${statusClass}">
                Status: ${person.status}
            </p>

            <p>
                ID: ${person.id}
            </p>

        `;


        container.appendChild(card);

    });

}


// =====================================================
// LOAD ORDERS
// =====================================================

function loadOrders() {

    fetch(`${BASE_URL}/admin/orders`)

        .then(response => {

            if (!response.ok) {
                throw new Error("Unable to load orders");
            }

            return response.json();

        })

        .then(orders => {

            console.log("Orders:", orders);

            loadPersonsForOrders(orders);

        })

        .catch(error => {

            console.error(
                "Order Error:",
                error
            );

            document.getElementById("ordersTable").innerHTML = `
                <tr>
                    <td colspan="6">
                        Unable to load orders.
                    </td>
                </tr>
            `;

        });

}


// =====================================================
// LOAD DELIVERY PERSONS FOR DROPDOWNS
// =====================================================

function loadPersonsForOrders(orders) {

    fetch(`${BASE_URL}/deliveryperson/all`)

        .then(response => response.json())

        .then(persons => {

            displayOrders(
                orders,
                persons
            );

        })

        .catch(error => {

            console.error(
                "Delivery person loading error:",
                error
            );

        });

}


// =====================================================
// DISPLAY ORDERS
// =====================================================

function displayOrders(
    orders,
    persons
) {

    const table =
        document.getElementById("ordersTable");

    table.innerHTML = "";


    orders.forEach(order => {

        const row =
            document.createElement("tr");


        // ---------------------------------------------
        // CURRENT DELIVERY PERSON
        // ---------------------------------------------

        let currentPersonId = null;

        let currentPersonName =
            "Not Assigned";


        if (order.deliveryPerson) {

            currentPersonId =
                order.deliveryPerson.id;

            currentPersonName =
                order.deliveryPerson.name;

        }


        // ---------------------------------------------
        // CREATE DROPDOWN
        // ---------------------------------------------

        let options = `
            <option value="">
                Select Delivery Person
            </option>
        `;


        persons.forEach(person => {

            const selected =
                person.id === currentPersonId
                    ? "selected"
                    : "";


            options += `
                <option
                    value="${person.id}"
                    ${selected}
                >
                    ${person.name}
                </option>
            `;

        });


        // ---------------------------------------------
        // CREATE ROW
        // ---------------------------------------------

        row.innerHTML = `

            <td>
                #${order.id}
            </td>

            <td>
                ${getCustomerName(order)}
            </td>

            <td>
                ₹${getOrderAmount(order)}
            </td>

            <td>
                ${order.status || "PLACED"}
            </td>

            <td>

                <span class="assigned">
                    ${currentPersonName}
                </span>

            </td>

            <td>

                <select
                    id="person-${order.id}"
                >

                    ${options}

                </select>

                <button
                    class="assign-btn"
                    onclick="assignDeliveryPerson(${order.id})"
                >
                    Assign
                </button>

            </td>

        `;


        table.appendChild(row);

    });

}


// =====================================================
// GET CUSTOMER NAME
// =====================================================

function getCustomerName(order) {

    if (order.user && order.user.name) {

        return order.user.name;

    }

    if (order.userName) {

        return order.userName;

    }

    return "Customer";

}


// =====================================================
// GET ORDER AMOUNT
// =====================================================

function getOrderAmount(order) {

    if (order.totalAmount !== undefined) {

        return order.totalAmount;

    }

    if (order.amount !== undefined) {

        return order.amount;

    }

    return 0;

}


// =====================================================
// ASSIGN DELIVERY PERSON
// =====================================================

function assignDeliveryPerson(orderId) {

    const select =
        document.getElementById(
            `person-${orderId}`
        );


    const deliveryPersonId =
        select.value;


    if (!deliveryPersonId) {

        alert(
            "Please select a delivery person."
        );

        return;

    }


    console.log(
        "Assigning Order:",
        orderId,
        "Delivery Person:",
        deliveryPersonId
    );


    fetch(
        `${BASE_URL}/admin/orders/${orderId}/assign/${deliveryPersonId}`,
        {
            method: "PUT"
        }
    )

    .then(response => {

        if (!response.ok) {

            throw new Error(
                "Assignment failed"
            );

        }

        return response.json();

    })

    .then(updatedOrder => {

        console.log(
            "Updated Order:",
            updatedOrder
        );


        alert(
            "Order assigned successfully!"
        );


        // Reload orders
        loadOrders();

    })

    .catch(error => {

        console.error(
            "Assignment Error:",
            error
        );


        alert(
            "Failed to assign delivery person."
        );

    });

}