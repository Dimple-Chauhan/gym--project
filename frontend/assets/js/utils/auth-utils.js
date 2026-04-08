// ===============================
// USER STORAGE UTILS
// ===============================

function getUsers() {
    return JSON.parse(localStorage.getItem("users")) || [];
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

// ===============================
// PASSWORD HASH (basic frontend-level)
// ===============================
function hashPassword(password) {
    return btoa(password); // simple encoding (not real security)
}
