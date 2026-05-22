document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");
    if (!loginForm) return;

    loginForm.addEventListener("submit", function (e) {

        e.preventDefault();

        const email = document.getElementById("email").value.trim().toLowerCase();
        const password = document.getElementById("password").value;

        fetch("/api/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        })
        .then(res => res.json())
        .then(data => {

            if (data.success) {

                localStorage.setItem("token", data.token);

               // alert("Login successful");

                if (data.profileCompleted) {
                    window.location.href = "dashboard.html";
                } else {
                    window.location.href = "profile/user-details.html";
                }

            } else {

                alert(data.message);

            }

        })
        .catch(err => {

            console.error(err);
            alert("Server error");

        });

    });

});

//toggle password
    function togglePassword(id) {
        const input = document.getElementById(id);

        if (input.type === "password") {
            input.type = "text";
        } else {
            input.type = "password";
        }
    }