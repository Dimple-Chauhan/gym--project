function completePayment(){

    const upiInput = document.getElementById("upi");
    const pinInput = document.getElementById("pin");
    const error = document.getElementById("errorMsg");
    const success = document.getElementById("successMsg");

    const upi = upiInput.value.trim();
    const pin = pinInput.value.trim();

    error.textContent = "";

    if(upi === "" || pin === ""){
        error.textContent = "Please fill all details";
        return;
    }

    const upiRegex = /^[a-zA-Z0-9.\-_]{2,}@[a-zA-Z]{2,}$/;

    if(!upiRegex.test(upi)){
        error.textContent = "Invalid UPI ID";
        return;
    }

    if(!/^\d{4,6}$/.test(pin)){
        error.textContent = "PIN must be 4-6 digits";
        return;
    }

    const session = JSON.parse(localStorage.getItem("pendingSession"));
    const token = localStorage.getItem("token"); // ✅ IMPORTANT

    fetch("http://localhost:5000/api/session/book", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": token   // ✅ JWT
        },
        body: JSON.stringify({
            trainer: session.trainer,
            date: session.date
        })
    })
    .then(res => res.json())
    .then(data => {

        if(!data.success){
            error.textContent = data.message;
            return;
        }

        success.style.display = "block";

        localStorage.removeItem("pendingSession");

        setTimeout(()=>{
            window.location.href = "dashboard.html";
        },1500);

    });
}