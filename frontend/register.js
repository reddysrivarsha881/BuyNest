const form = document.querySelector("form");

form.addEventListener("submit", async function (event) {

event.preventDefault();
const name = document.querySelector("#name").value.trim();
const email = document.querySelector("#email").value.trim();
const phone = document.querySelector("#phone").value.trim();
const password = document.querySelector("#password").value;
const confirmPassword = document.querySelector("#confirmPassword").value;
// =========================
// NAME VALIDATION
// =========================
if (!/^[A-Za-z][A-Za-z ]*$/.test(name)) {
    alert("Name should contain only letters and spaces and should not start with a space.");
    return;
}
// =========================
// EMAIL VALIDATION
// =========================
if (!/^[A-Za-z0-9._%+-]+@gmail\.com$/.test(email)) {
    alert("Please enter a valid Gmail address.");
    return;
}
// =========================
// PHONE VALIDATION
// =========================
if (!/^[0-9]{10}$/.test(phone)) {
    alert("Phone number must contain exactly 10 digits.");
    return;
}
// =========================
// PASSWORD VALIDATION
// =========================
if (password.length < 8) {
    alert("Password must contain at least 8 characters.");
    return;
}
// =========================
// CONFIRM PASSWORD
// =========================
if (password !== confirmPassword) {
    alert("Password and Confirm Password must be the same.");
    return;
}
// =========================
// USER OBJECT
// =========================
const user = {
    name: name,
    email: email,
    password: password,
    phone: Number(phone)
};
// =========================
// SAVE USER
// =========================
try {
    const response = await fetch("https://buynest-backend-p1s9.onrender.com/saveUser", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(user)
    });
    const result = await response.json();
    // =========================
    // SUCCESS
    // =========================
    if (response.ok && result.status === "SUCCESS") {
        alert("Registration successful!");
        window.location.href = "customer-login.html";
    }
    // =========================
    // FAILED
    // =========================
    else {
        alert(result.message || "Registration failed");
    }
} catch (error) {
    console.error(error);
    alert("Unable to connect to server");
}

});