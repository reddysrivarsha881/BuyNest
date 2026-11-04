const BASE_URL = "https://buynest-backend-p1s9.onrender.com";

document
    .getElementById("adminLoginForm")
    .addEventListener("submit", function (event) {

        event.preventDefault();

        const email =
            document.getElementById("email").value.trim();

        const password =
            document.getElementById("password").value.trim();

        console.log("Admin Email:", email);

        fetch(`${BASE_URL}/loginAdmin`, {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                email: email,
                password: password
            })
        })

        .then(response => {

            console.log(
                "Admin Login Status:",
                response.status
            );

            if (!response.ok) {
                throw new Error("Invalid admin email or password");
            }

            return response.json();
        })

        .then(admin => {

            console.log(
                "Logged in Admin:",
                admin
            );

            // Save admin details
            localStorage.setItem(
                "adminId",
                admin.id
            );

            localStorage.setItem(
                "adminEmail",
                admin.email
            );

            // Go to Admin Dashboard
            window.location.href =
                "admin dashboard.html";
        })

        .catch(error => {

            console.error(
                "Admin Login Error:",
                error
            );

            alert(
                "Invalid admin email or password"
            );
        });

    });