// PAGE LOAD
// =============================
document.addEventListener("DOMContentLoaded", function () {

    loadSidebarState();   // ✅ restore sidebar first
    loadDate();
    loadUser();
    loadProfileData();
    setupSidebar();
    setupLogout();
    createTracker();
    loadBookedSession();   

});

// SIDEBAR STATE (FIX RELOAD ISSUE)

function loadSidebarState(){

    const container = document.querySelector(".dashboard-container");

    const isHidden = localStorage.getItem("sidebarHidden");

    if(isHidden === "true"){
        container.classList.add("hide-sidebar");
    }

}

function setupSidebar(){

    const toggleBtn = document.getElementById("toggleSidebar");
    const container = document.querySelector(".dashboard-container");

    toggleBtn.addEventListener("click", function(){

        container.classList.toggle("hide-sidebar");

        // ✅ SAVE STATE
        const isHidden = container.classList.contains("hide-sidebar");
        localStorage.setItem("sidebarHidden", isHidden);

    });

}


// DATE
// =============================
function loadDate(){

    const dateElement = document.getElementById("currentDate");

    const today = new Date();

    const options = {
        weekday:"long",
        year:"numeric",
        month:"long",
        day:"numeric"
    };

    dateElement.textContent = today.toLocaleDateString("en-US",options);

}



// LOAD USER (FIX FLICKER)
// =============================
function loadUser(){

    const token = localStorage.getItem("token");

    if(!token){
        window.location.href = "login.html";
        return;
    }

    const nameEl = document.getElementById("userName");
    const avatarEl = document.getElementById("userAvatar");

    // ✅ hide until loaded
    //const container = document.querySelector(".dashboard-container");

    //const isSidebarHidden = container.classList.contains("hide-sidebar");

    //if(!isSidebarHidden){
        nameEl.classList.remove("hidden");
        avatarEl.classList.remove("hidden");
    //}

    fetch("/api/auth/profile",{
        method:"GET",
        headers:{
            "Authorization": token
        }
    })
    .then(res=>res.json())
    .then(data=>{

        if(data.success){

            const email = data.user.email;
            const username = email.split("@")[0];

            nameEl.textContent = username;
            avatarEl.textContent = username.charAt(0).toUpperCase();

            // ✅ show AFTER data loaded
            nameEl.classList.remove("hidden");
            avatarEl.classList.remove("hidden");

        }else{
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }

    })
    .catch(()=>{
        window.location.href = "login.html";
    });

}


// LOAD PROFILE DATA
// =============================
function loadProfileData(){

    const token = localStorage.getItem("token");

    fetch("/api/auth/profile",{
        method:"GET",
        headers:{
            "Authorization": token
        }
    })
    .then(res=>res.json())
    .then(data=>{

        if(data.success){

            const user = data.user;

            calculateBMI(user.height, user.weight);

            if(user.diseases && user.diseases !== ""){
                document.getElementById("diseaseDisplay").textContent = user.diseases;
            } else {
                document.getElementById("diseaseDisplay").textContent = "None";
            }

        }

    });

}

// =============================
// BMI
// =============================
function calculateBMI(height,weight){

    const bmiElement = document.getElementById("bmiDisplay");
    const levelElement = document.getElementById("userLevel");

    if(!height || !weight){
        bmiElement.textContent = "Not available";
        return;
    }

    const heightMeter = height / 100;
    const bmi = weight / (heightMeter * heightMeter);
    const bmiValue = bmi.toFixed(1);

    let status = "";
    let level = "";

    if(bmi < 18.5){
        status = "Underweight";
        level = "Basic";
    }
    else if(bmi < 25){
        status = "Normal";
        level = "Intermediate";
    }
    else{
        status = "Overweight";
        level = "Basic";
    }

    bmiElement.textContent = bmiValue + " (" + status + ")";
    levelElement.textContent = "Level: " + level;

}


// =============================
// LOGOUT
// =============================
function setupLogout(){

    const logoutBtn = document.getElementById("logoutBtn");

    logoutBtn.addEventListener("click", function(){

        if(confirm("Logout from your account?")){
            localStorage.removeItem("token");
            window.location.href = "login.html";
        }

    });

}


// AI DIET ANALYZER
// =============================
function processDiet(){

    const btn = document.getElementById("analyzeBtn");
    const mealInput = document.getElementById("mealInput").value;
    const output = document.getElementById("aiOutput");

    if(mealInput.trim() === ""){
        alert("Please enter your meal");
        return;
    }

    // BUTTON LOADING STATE
    btn.textContent = "Analyzing...";
    btn.disabled = true;

    fetch("/api/ai/analyze",{
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({
            meal: mealInput
        })
    })
    .then(res=>res.json())
    .then(data => {

        btn.textContent = "Analyze Diet with AI";
        btn.disabled = false;

        if(data.success){

            const today = new Date().toLocaleDateString("en-US", { weekday: "long" });

            const plan = document.getElementById("userLevel").textContent.includes("Intermediate")
                ? "Intermediate"
                : "Basic";

            output.innerHTML = `
                <h4>Total Calories: ${data.calories} kcal</h4>
                <p><b>Intensity:</b> ${data.intensity}</p>
                <p><b>${today} Workout (${plan} Plan):</b></p>
                <p>${data.extraWorkout}</p>
            `;

            localStorage.setItem("intensity", data.intensity.toLowerCase());
        }

    })
    .catch(()=>{
        btn.textContent = "Analyze Diet with AI";
        btn.disabled = false;
        output.innerHTML = "Server error";
    });

}


// WORKOUT TRACKER
// =============================
function createTracker(){

    const container = document.getElementById("trackerGrid");
    if(!container) return;

    const storedData =
        JSON.parse(localStorage.getItem("workoutTracker")) || {};

    container.innerHTML = "";

    const today = new Date();

    const months = [
        new Date(today.getFullYear(), today.getMonth() - 1, 1),
        new Date(today.getFullYear(), today.getMonth(), 1),
        new Date(today.getFullYear(), today.getMonth() + 1, 1)
    ];

    months.forEach(monthDate => {

        const year = monthDate.getFullYear();
        const month = monthDate.getMonth();

        const daysInMonth = new Date(year, month + 1, 0).getDate();

        // Month container
        const monthBlock = document.createElement("div");
        monthBlock.classList.add("month-block");

        // Month title
        const title = document.createElement("div");
        title.classList.add("month-title");
        title.textContent = monthDate.toLocaleString("default", { month: "long" });

        // Grid
        const grid = document.createElement("div");
        grid.classList.add("month-grid");

        for(let d = 1; d <= daysInMonth; d++){

            const key = year + "-" +
                        String(month + 1).padStart(2, "0") + "-" +
                        String(d).padStart(2, "0");

            const day = document.createElement("div");
            day.classList.add("tracker-day");

            if(storedData[key]){
                day.classList.add("active");
            }

            grid.appendChild(day);
        }

        monthBlock.appendChild(title);
        monthBlock.appendChild(grid);

        container.appendChild(monthBlock);
    });
}


function markWorkout(){

    let tracker =
        JSON.parse(localStorage.getItem("workoutTracker")) || {};

    // ✅ FIX: if old array exists, reset it
    if(Array.isArray(tracker)){
        tracker = {};
    }

    const today = new Date();

    const key = today.getFullYear() + "-" +
                String(today.getMonth() + 1).padStart(2, "0") + "-" +
                String(today.getDate()).padStart(2, "0");

    tracker[key] = true;

    localStorage.setItem("workoutTracker", JSON.stringify(tracker));

    createTracker();
}

function loadBookedSession(){

    const token = localStorage.getItem("token");
    const card = document.getElementById("sessionCard");

    fetch("/api/session/my", {
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {

        if(data.success && data.sessions.length > 0){

            card.innerHTML = "";

            data.sessions.forEach(session => {
                card.innerHTML += `
                    <div style="margin-bottom:15px; padding:15px; border-radius:10px; background:#1e1e1e;">
                        <h3>🏋 Trainer: ${session.trainer}</h3>
                        <p>📅 Date: ${new Date(session.date).toDateString()}</p>
                        <p style="color:lightgreen;">✔ Confirmed</p>

                        <button 
                            onclick="cancelSession('${session._id}')"
                            style="margin-top:10px; padding:6px 12px; border:none; border-radius:6px; background:#e74c3c; color:white; cursor:pointer;">
                            ❌ Cancel
                        </button>
                    </div>
                `;
            });

        } else {
            card.innerHTML = `<p>No session booked yet</p>`;
        }

    });

}

function cancelSession(sessionId){

    const token = localStorage.getItem("token");

    if(!confirm("Cancel this session?")) return;

    fetch(`/api/session/cancel/${sessionId}`, {
        method: "DELETE",
        headers: {
            "Authorization": token
        }
    })
    .then(res => res.json())
    .then(data => {

        if(data.success){
            alert("Session cancelled!");
            loadBookedSession(); // 🔥 refresh UI
        } else {
            alert(data.message);
        }

    });

}

window.markWorkout = markWorkout;