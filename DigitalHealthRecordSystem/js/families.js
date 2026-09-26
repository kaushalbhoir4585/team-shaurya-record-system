document.addEventListener("DOMContentLoaded", function () {
    // BUG FIX: Force clear the edit memory when landing on families page
    localStorage.removeItem("editFamilyIndex"); 
    loadFamilies();
});

function loadFamilies() {
    const familyList = document.getElementById("familyList");
    const noFamilies = document.getElementById("noFamilies");
    const totalFamilies = document.getElementById("totalFamilies");

    if (!familyList) return;

    const families = getFamilies();
    if (totalFamilies) totalFamilies.textContent = families.length;
    familyList.innerHTML = "";

    if (families.length === 0) {
        if (noFamilies) noFamilies.classList.remove("d-none");
        return;
    }
    if (noFamilies) noFamilies.classList.add("d-none");

    families.forEach(function (family, index) {
        createFamilyCard(family, index, familyList);
    });
}

function searchFamilies() {
    const searchInput = document.getElementById("familySearch");
    if (!searchInput) return;

    const search = searchInput.value.toLowerCase().trim();
    const families = getFamilies();
    const familyList = document.getElementById("familyList");
    const noFamilies = document.getElementById("noFamilies");

    if (!familyList) return;

    const filteredFamilies = families.filter(function (family) {
        const familyId = String(family.familyId || "").toLowerCase();
        const familyHead = String(family.familyHead || "").toLowerCase();
        const address = String(family.address || "").toLowerCase();
        const members = family.members || [];

        if (familyId.includes(search) || familyHead.includes(search) || address.includes(search)) return true;

        return members.some(function (member) {
            return String(member.name || "").toLowerCase().includes(search) || 
                   String(member.aadhaar || "").toLowerCase().includes(search) ||
                   String(member.ayushman || "").toLowerCase().includes(search);
        });
    });

    familyList.innerHTML = "";

    if (filteredFamilies.length === 0) {
        if (noFamilies) noFamilies.classList.remove("d-none");
        return;
    }
    if (noFamilies) noFamilies.classList.add("d-none");

    filteredFamilies.forEach(function (family) {
        const originalIndex = families.indexOf(family);
        createFamilyCard(family, originalIndex, familyList);
    });
}

function createFamilyCard(family, index, container) {
    const card = document.createElement("div");
    card.className = "family-list-card";
    const members = family.members || [];

    card.innerHTML = `
        <div class="row align-items-center">
            <div class="col-md-5">
                <div class="family-id">${family.familyId || "No ID"}</div>
                <div class="family-head">${family.familyHead || "No Head Name"}</div>
                <div class="family-info mt-1"><i class="bi bi-geo-alt"></i> ${family.address || "Address not provided"}</div>
            </div>
            <div class="col-md-2 mt-3 mt-md-0">
                <span class="badge text-bg-primary"><i class="bi bi-people"></i> ${members.length} Members</span>
            </div>
            <div class="col-md-2 mt-3 mt-md-0">
                <div class="family-info"><i class="bi bi-telephone"></i> ${family.contact || "No contact"}</div>
            </div>
            <div class="col-md-3 mt-3 mt-md-0 text-md-end">
                <button class="btn btn-sm btn-outline-primary family-action-btn" onclick="viewFamily(${index})">
                    <i class="bi bi-eye"></i> View
                </button>
                <button class="btn btn-sm btn-outline-warning family-action-btn" onclick="editFamily(${index})">
                    <i class="bi bi-pencil"></i> Edit
                </button>
                <button class="btn btn-sm btn-outline-danger family-action-btn" onclick="deleteFamily(${index})">
                    <i class="bi bi-trash"></i> Delete
                </button>
            </div>
        </div>
    `;
    container.appendChild(card);
}

function viewFamily(index) {
    localStorage.setItem("selectedFamily", index);
    window.location.href = "view-family.html";
}

function editFamily(index) {
    localStorage.setItem("editFamilyIndex", index);
    window.location.href = "add-family.html";
}

function deleteFamily(index) {
    const families = getFamilies();
    const family = families[index];
    if (!family) return;
    const confirmDelete = confirm(`Are you sure you want to delete family ${family.familyId}?`);
    if (!confirmDelete) return;
    families.splice(index, 1);
    saveFamilies(families);
    loadFamilies();
    alert("Family record deleted successfully.");
}