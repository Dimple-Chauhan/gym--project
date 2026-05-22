document.addEventListener("DOMContentLoaded", function () {

    const registerForm = document.getElementById("registerForm");
    if (!registerForm) return;

    registerForm.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;
        const confirmPassword = document.getElementById("confirmPassword").value;

        const emailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

        if (!emailRegex.test(email)) {
            alert("Enter valid Gmail address");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters");
            return;
        }

        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
    fetch("/api/auth/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            email: email,
            password: password
        })
    })
    .then(response => response.json())
    .then(data => {

        if (data.success) {
            alert("Registration successful");
            window.location.href = "login.html";
        } else {
            alert(data.message);
        }

    })
    .catch(error => {
        console.error("Error:", error);
        alert("Server error");
    });

    });
});
 // toggle password
function togglePassword(id) {
    const input = document.getElementById(id);

    if (input.type === "password") {
        input.type = "text";
    } else {
        input.type = "password";
    }
}