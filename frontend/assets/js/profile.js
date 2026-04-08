document.addEventListener("DOMContentLoaded", function () {

    const form = document.getElementById("healthForm");

    form.addEventListener("submit", function (e) {

        e.preventDefault();

        const age = document.getElementById("age").value;
        const height = document.getElementById("height").value;
        const weight = document.getElementById("weight").value;

        const diseaseCheckboxes = document.querySelectorAll('input[name="disease"]:checked');

        let diseases = [];

        diseaseCheckboxes.forEach(function (d) {
            diseases.push(d.value);
        });

        if (diseases.includes("none")) {
            diseases = ["None"];
        }

        const token = localStorage.getItem("token");

        fetch("http://localhost:5000/api/auth/profile", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": token
            },
            body: JSON.stringify({
                age,
                height,
                weight,
                diseases: diseases.join(", ")
            })
        })
        .then(res => res.json())
        .then(data => {

            if (data.success) {
                //alert("Profile saved successfully");
                window.location.href = "../dashboard.html";
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