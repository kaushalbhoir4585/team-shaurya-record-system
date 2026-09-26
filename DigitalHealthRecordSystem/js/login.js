/* =========================================
   LOGIN JAVASCRIPT - MULTI-USER PROTOTYPE
========================================= */

// Pre-approved ASHA Workers Database (Prototype)
const authorizedUsers = [
    { 
        username: "ASHA001", 
        password: "123", 
        ashaName: "Sample Ashaname",
        villageName: "Sarangpuri",
        subPhcName: "Dhasai Sub-Center",
        phcName: "Shenave"
    },
    { 
        username: "ASHA002", 
        password: "123", 
        ashaName: "Sample Ashaname",
        villageName: "Thune",
        subPhcName: "Lavale Sub-Center",
        phcName: "Takipathar"
    },
    { 
        username: "ASHA003", 
        password: "123", 
        ashaName: "Sample Ashaname",
        villageName: "Kinhavali",
        subPhcName: "Kinhavali PHC",
        phcName: "Kinhavali"
    }
];

function loginUser(event) {
    event.preventDefault();

    const usernameInput = document.getElementById("username").value.trim();
    const passwordInput = document.getElementById("password").value;
    const loginError = document.getElementById("loginError");

    // Check if entered credentials match any user in our array
    const userMatch = authorizedUsers.find(
        user => user.username === usernameInput && user.password === passwordInput
    );

    if (userMatch) {
        // 1. Set login status
        localStorage.setItem("loggedIn", "true");
        
        // 2. Automatically load their village profile if they haven't set one up yet
        const existingProfile = localStorage.getItem("ashaProfile");
        if (!existingProfile) {
            const initialProfile = {
                ashaName: userMatch.ashaName,
                villageName: userMatch.villageName,
                subPhcName: userMatch.subPhcName,
                phcName: userMatch.phcName
            };
            localStorage.setItem("ashaProfile", JSON.stringify(initialProfile));
        }

        // 3. Redirect to dashboard
        window.location.href = "dashboard.html";
    } else {
        // Show error message
        if (loginError) {
            loginError.classList.remove("d-none");
        }
    }
}
