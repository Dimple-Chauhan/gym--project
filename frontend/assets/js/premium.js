// ==========================
// PAGE LOAD
// ==========================
document.addEventListener("DOMContentLoaded", function () {

    // ==========================
    // TRAINER AUTO SCROLL
    // ==========================
    const slider = document.getElementById("trainerSlider");

    if (slider) {
        setInterval(() => {
            if (slider.scrollLeft + slider.clientWidth >= slider.scrollWidth) {
                slider.scrollTo({ left: 0, behavior: "smooth" });
            } else {
                slider.scrollBy({ left: 270, behavior: "smooth" });
            }
        }, 4000);
    }

    // ==========================
    // DISABLE PAST DATES
    // ==========================
    const dateInput = document.getElementById("sessionDate");

    if (dateInput) {
        const today = new Date();
        today.setDate(today.getDate() + 1); // only future

        dateInput.min = today.toISOString().split("T")[0];
    }

});


// ==========================
// BOOK SESSION → REDIRECT
// ==========================
function bookSession() {

    const trainer = document.getElementById("trainerSelect").value;
    const date = document.getElementById("sessionDate").value;

    // ❌ no alert → just stop
    if (!trainer || !date) return;

    const session = {
        trainer: trainer,
        date: date
    };

    // store temporarily
    localStorage.setItem("pendingSession", JSON.stringify(session));

    // go to payment page
    window.location.href = "payment.html";
}