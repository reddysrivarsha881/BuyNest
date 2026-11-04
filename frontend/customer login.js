// ===============================
// CHECK CUSTOMER ALREADY LOGGED IN
// ===============================

if (localStorage.getItem("loggedIn") === "true") {

    window.location.href = "home.html";

}


// ===============================
// LOGIN FORM
// ===============================

const form = document.querySelector("#loginForm");


form.addEventListener("submit", async function (event) {

    event.preventDefault();


    // ===============================
    // GET LOGIN DETAILS
    // ===============================

    const email =
        document.querySelector("#email").value.trim();

    const password =
        document.querySelector("#password").value;


    // ===============================
    // EMAIL VALIDATION
    // ===============================

    if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(email)) {

        alert("Please enter a valid Gmail address.");

        return;

    }


    // ===============================
    // PASSWORD VALIDATION
    // ===============================

    if (password.length < 8) {

        alert("Password must contain at least 8 characters.");

        return;

    }


    // ===============================
    // LOGIN DATA
    // ===============================

    const loginData = {

        email: email,

        password: password

    };


    console.log(
        "LOGIN DATA:",
        loginData
    );


    // ===============================
    // LOGIN API
    // ===============================

    try {

        const response = await fetch(

            "https://buynest-backend-p1s9.onrender.com/login",

            {

                method: "POST",

                headers: {

                    "Content-Type":
                        "application/json"

                },

                body:
                    JSON.stringify(loginData)

            }

        );


        // ===============================
        // DEBUG INFORMATION
        // ===============================

        console.log(
            "LOGIN EMAIL:",
            email
        );

        console.log(
            "RESPONSE STATUS:",
            response.status
        );

        console.log(
            "RESPONSE OK:",
            response.ok
        );


        // ===============================
        // LOGIN SUCCESS
        // ===============================

        if (response.ok) {

            const user =
                await response.json();


            console.log(
                "LOGIN RESPONSE:",
                user
            );


            // ===============================
            // SAVE CUSTOMER LOGIN STATUS
            // ===============================

            localStorage.setItem(
                "loggedIn",
                "true"
            );


            // ===============================
            // SAVE CUSTOMER DETAILS
            // ===============================

            localStorage.setItem(
                "userId",
                user.id
            );

            localStorage.setItem(
                "userName",
                user.name
            );

            localStorage.setItem(
                "userEmail",
                user.email
            );


            // ===============================
            // SUCCESS MESSAGE
            // ===============================

            alert(
                "Login successful! Welcome " +
                user.name
            );


            // ===============================
            // GO TO CUSTOMER HOME PAGE
            // ===============================

            window.location.href =
                "home.html";

        }


        // ===============================
        // LOGIN FAILED
        // ===============================

        else {

            const message =
                await response.text();


            console.error(
                "LOGIN FAILED STATUS:",
                response.status
            );

            console.error(
                "LOGIN FAILED RESPONSE:",
                message
            );


            alert(
                "Login failed.\n\n" +
                "Status: " +
                response.status +
                "\nResponse: " +
                message
            );

        }


    }
    
    // ===============================
    // SERVER / NETWORK ERROR
    // ===============================

    catch (error) {

        console.error(
            "LOGIN ERROR:",
            error
        );


        alert(
            "Unable to connect to server.\n\n" +
            error.message
        );

    }

});