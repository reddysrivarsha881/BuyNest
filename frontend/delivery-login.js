const BASE_URL = "https://buynest-backend-p1s9.onrender.com";


// ===============================
// CHECK DELIVERY PERSON ALREADY LOGGED IN
// ===============================

if (localStorage.getItem("deliveryLoggedIn") === "true") {

    window.location.href = "delivery dashboard.html";

}


// ===============================
// LOGIN FORM
// ===============================

document
    .getElementById("deliveryLoginForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();


        // ===============================
        // GET LOGIN DETAILS
        // ===============================

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value;


        console.log(
            "Login Email:",
            email
        );


        // ===============================
        // LOGIN API
        // ===============================

        fetch(
            `${BASE_URL}/deliveryperson/login?email=${encodeURIComponent(email)}&password=${encodeURIComponent(password)}`,
            {
                method: "POST"
            }
        )


        // ===============================
        // CHECK RESPONSE
        // ===============================

        .then(response => {

            console.log(
                "Login Response:",
                response.status
            );


            if (!response.ok) {

                throw new Error(
                    "Invalid email or password"
                );

            }


            return response.json();

        })


        // ===============================
        // LOGIN SUCCESS
        // ===============================

        .then(deliveryPerson => {

            console.log(
                "Logged in Delivery Person:",
                deliveryPerson
            );


            // ===============================
            // SAVE LOGIN STATUS
            // ===============================

            localStorage.setItem(
                "deliveryLoggedIn",
                "true"
            );


            // ===============================
            // SAVE DELIVERY PERSON DETAILS
            // ===============================

            localStorage.setItem(
                "deliveryPersonId",
                deliveryPerson.id
            );

            localStorage.setItem(
                "deliveryPersonName",
                deliveryPerson.name
            );

            localStorage.setItem(
                "deliveryPersonEmail",
                deliveryPerson.email
            );


            // ===============================
            // SUCCESS MESSAGE
            // ===============================

            alert(
                "Login successful! Welcome " +
                deliveryPerson.name
            );


            // ===============================
            // OPEN DELIVERY DASHBOARD
            // ===============================

            window.location.href =
                "delivery dashboard.html";

        })


        // ===============================
        // LOGIN ERROR
        // ===============================

        .catch(error => {

            console.error(
                "Login Error:",
                error
            );


            alert(
                "Invalid email or password"
            );

        });

    });