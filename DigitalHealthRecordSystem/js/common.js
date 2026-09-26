/* =========================================
   COMMON JAVASCRIPT
   Digital Health Record System
========================================= */


/* =========================================
   GET FAMILIES FROM LOCAL STORAGE
========================================= */
function getFamilies() {
    try {
        return JSON.parse(localStorage.getItem("families")) || [];
    } catch (error) {
        console.error("Error reading family data:", error);
        return [];
    }
}

/* =========================================
   SAVE FAMILIES TO LOCAL STORAGE
========================================= */
function saveFamilies(families) {
    localStorage.setItem("families", JSON.stringify(families));
}

/* =========================================
   GENERATE FAMILY ID
========================================= */
function generateFamilyId() {
    const families = getFamilies();
    let maxNumber = 0;

    families.forEach(family => {
        const match = String(family.familyId || "").match(/\d+/);
        if (match) {
            const number = parseInt(match[0]);
            if (number > maxNumber) maxNumber = number;
        }
    });

    return "F" + String(maxNumber + 1).padStart(3, "0");
}

/* =========================================
   LOGOUT
========================================= */
function logoutUser() {
    localStorage.removeItem("loggedIn");
    localStorage.removeItem("selectedFamily");
    localStorage.removeItem("editFamilyIndex");
    window.location.href = "login.html";
}

/* =========================================
   LOGIN CHECK
========================================= */
function checkLogin() {
    const loggedIn = localStorage.getItem("loggedIn");
    if (loggedIn !== "true") {
        window.location.href = "index.html";
    }
}

/* =========================================
   TOTAL POPULATION
========================================= */
function getTotalPopulation() {
    const families = getFamilies();
    return families.reduce((total, family) => {
        return total + (family.members ? family.members.length : 0);
    }, 0);
}

/* =========================================
   COUNT HEALTH CATEGORY
========================================= */
function countMembersByCondition(condition) {
    const families = getFamilies();
    let count = 0;
    families.forEach(family => {
        const members = family.members || [];
        members.forEach(member => {
            if (condition(member)) count++;
        });
    });
    return count;
}

/* =========================================
   COUNT BP, DIABETES, PREGNANCY, CHILDREN
========================================= */
function getBPPatients() {
    return countMembersByCondition(member => member.bp === "Yes");
}

function getDiabetesPatients() {
    return countMembersByCondition(member => member.diabetes === "Yes");
}

function getPregnantWomen() {
    return countMembersByCondition(member => member.pregnancy === "Pregnant");
}

function getChildren() {
    return countMembersByCondition(member => member.child === "Yes");
}

/* =========================================
   COUNT VACCINATIONS DUE
========================================= */
function getVaccinationsDue() {
    const families = getFamilies();
    const today = new Date().toISOString().split("T")[0];
    let count = 0;

    families.forEach(family => {
        const members = family.members || [];
        members.forEach(member => {
            if (member.nextVaccine && member.nextVaccine <= today) count++;
        });
    });
    return count;
}

/* =========================================
   CALCULATE AGE & FORMAT DATE
========================================= */
function calculateAge(dateOfBirth) {
    if (!dateOfBirth) return "";
    const birthDate = new Date(dateOfBirth);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) age--;
    return age;
}

function formatDate(dateString) {
    if (!dateString) return "-";
    const date = new Date(dateString);
    if (isNaN(date)) return dateString;
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

/* =========================================
   SAFE NAVIGATION TO ADD NEW FAMILY (BUG FIX)
========================================= */
function goToAddFamily() {
    // This removes the "edit mode" memory before navigating to the blank form
    localStorage.removeItem("editFamilyIndex");
    localStorage.removeItem("selectedFamily");
    window.location.href = "add-family.html";
}

/* =========================================
   PAGE READY
========================================= */
document.addEventListener("DOMContentLoaded", function () {
    const protectedPages = [
        "dashboard.html",
        "add-family.html",
        "families.html",
        "view-family.html",
        "profile.html"
    ];
    const currentPage = window.location.pathname.split("/").pop();
    if (protectedPages.includes(currentPage)) {
        checkLogin();
    }
});