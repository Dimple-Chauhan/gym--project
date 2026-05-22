document.getElementById("resetForm").addEventListener("submit", function(e){

e.preventDefault();

let email = document.getElementById("email").value.trim().toLowerCase();
let newPassword = document.getElementById("newPassword").value;
let confirmPassword = document.getElementById("confirmPassword").value;


if(newPassword.length < 6){
    alert("Password must be at least 6 characters");
    return;
}

if(newPassword !== confirmPassword){
    alert("Passwords do not match");
    return;
}

// ✅ SEND TO BACKEND
fetch("/api/auth/forgot-password",{
    method:"POST",
    headers:{
        "Content-Type":"application/json"
    },
    body: JSON.stringify({
        email,
        newPassword
    })
})
.then(res=>res.json())
.then(data=>{

    if(data.success){
        alert("Password reset successful");
        window.location.href="login.html";
    } else {
        alert(data.message);
    }

})
.catch(err=>{
    console.error(err);
    alert("Server error");
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