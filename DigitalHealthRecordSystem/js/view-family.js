document.addEventListener("DOMContentLoaded", function () {
    loadSelectedFamily();
});

function loadSelectedFamily() {
    const selectedIndex = localStorage.getItem("selectedFamily");
    if (selectedIndex === null || selectedIndex === "") {
        showNoFamilyMessage();
        return;
    }
    const families = getFamilies();
    const family = families[parseInt(selectedIndex)];
    if (!family) {
        showNoFamilyMessage();
        return;
    }
    displayFamilyInformation(family);
}

function displayFamilyInformation(family) {
    setText("viewFamilyId", family.familyId || "-");
    setText("viewFamilyHead", family.familyHead || "-");
    setText("viewFamilyContact", family.contact || "-");
    setText("viewFamilyAddress", family.address || "-");
    setText("viewFamilyArea", family.area || "-");
    const members = family.members || [];
    setText("viewMemberCount", members.length);
    displayMembers(members);
}

function displayMembers(members) {
    const container = document.getElementById("viewMembersContainer");
    if (!container) return;
    container.innerHTML = "";

    if (members.length === 0) {
        container.innerHTML = `<div class="alert alert-info"><i class="bi bi-info-circle"></i> No member information available.</div>`;
        return;
    }

    members.forEach((member, index) => {
        const card = document.createElement("div");
        card.className = "view-member-card";
        const age = calculateAge(member.dob);

        card.innerHTML = `
            <div class="member-view-header">
                <div>
                    <span class="member-view-number">Member ${index + 1}</span>
                    <h4>${member.name || "Unnamed Member"}</h4>
                </div>
                <span class="badge bg-primary">${member.relation || "Relation not specified"}</span>
            </div>
            <hr>
            <div class="row g-3">
                <div class="col-md-3">
                    <div class="view-info-label">Date of Birth</div>
                    <div class="view-info-value">${formatDate(member.dob)}</div>
                </div>
                <div class="col-md-2">
                    <div class="view-info-label">Age</div>
                    <div class="view-info-value">${age !== "" ? age + " Years" : "-"}</div>
                </div>
                <div class="col-md-2">
                    <div class="view-info-label">Gender</div>
                    <div class="view-info-value">${member.gender || "-"}</div>
                </div>
                <div class="col-md-2">
                    <div class="view-info-label">Blood Group</div>
                    <div class="view-info-value">${member.blood || "-"}</div>
                </div>
                <div class="col-md-3">
                    <div class="view-info-label">Mobile</div>
                    <div class="view-info-value">${member.mobile || "-"}</div>
                </div>

                <!-- Government IDs Added for Viewing -->
                <div class="col-md-4">
                    <div class="view-info-label">Aadhaar Number</div>
                    <div class="view-info-value">${member.aadhaar || "-"}</div>
                </div>
                <div class="col-md-4">
                    <div class="view-info-label">ABHA Number</div>
                    <div class="view-info-value">${member.abha || "-"}</div>
                </div>
                <div class="col-md-4">
                    <div class="view-info-label">Ayushman Number</div>
                    <div class="view-info-value">${member.ayushman || "-"}</div>
                </div>

                <div class="col-12"><h6 class="health-section-title"><i class="bi bi-heart-pulse"></i> Health Information</h6></div>
                <div class="col-md-3">
                    <div class="view-info-label">BP Patient</div>
                    <div class="view-info-value">${getStatusBadge(member.bp, "BP")}</div>
                </div>
                <div class="col-md-3">
                    <div class="view-info-label">Diabetes</div>
                    <div class="view-info-value">${getStatusBadge(member.diabetes, "Diabetes")}</div>
                </div>
                <div class="col-md-3">
                    <div class="view-info-label">Pregnancy</div>
                    <div class="view-info-value">
                        ${getPregnancyBadge(member.pregnancy)}
                        ${member.pregnancy === "Pregnant" ? `
                            <button type="button" class="btn btn-sm btn-outline-warning mt-2" onclick="togglePregnancyDetails(${index})">
                                <i class="bi bi-chevron-down"></i> <span id="pregnancyBtnText-${index}">More</span>
                            </button>
                        ` : ""}
                    </div>
                </div>
                ${member.pregnancy === "Pregnant" ? `
                    <div class="col-12 pregnancy-details-view" id="pregnancyDetails-${index}" style="display:none;">
                        <div class="health-detail-box">
                            <h6 class="health-section-title"><i class="bi bi-person-standing-dress"></i> Pregnancy Details</h6>
                            <div class="row g-3">
                                <div class="col-md-3"><div class="view-info-label">LMP</div><div class="view-info-value">${formatDate(member.pregnancyLMP)}</div></div>
                                <div class="col-md-3"><div class="view-info-label">EDD</div><div class="view-info-value">${formatDate(member.pregnancyEDD)}</div></div>
                                <div class="col-md-3"><div class="view-info-label">Trimester</div><div class="view-info-value">${member.pregnancyTrimester || "-"}</div></div>
                                <div class="col-md-3"><div class="view-info-label">ANC Visits</div><div class="view-info-value">${member.pregnancyANC || "-"}</div></div>
                                <div class="col-md-3"><div class="view-info-label">High Risk</div><div class="view-info-value">${getStatusBadge(member.pregnancyHighRisk, "High Risk")}</div></div>
                                <div class="col-md-3"><div class="view-info-label">IFA Tablets</div><div class="view-info-value">${getStatusBadge(member.pregnancyIFA, "IFA")}</div></div>
                                <div class="col-md-3"><div class="view-info-label">Calcium Tablets</div><div class="view-info-value">${getStatusBadge(member.pregnancyCalcium, "Calcium")}</div></div>
                                ${member.pregnancyNotes ? `<div class="col-12"><div class="view-info-label">Pregnancy Notes</div><div class="health-notes">${member.pregnancyNotes}</div></div>` : ""}
                            </div>
                        </div>
                    </div>
                ` : ""}

                <div class="col-md-3">
                    <div class="view-info-label">Child</div>
                    <div class="view-info-value">${getStatusBadge(member.child, "Child")}</div>
                </div>

                <div class="col-12"><h6 class="health-section-title"><i class="bi bi-clipboard2-pulse"></i> Other Diseases / Conditions</h6></div>
                <div class="col-md-6">
                    <div class="view-info-label">Disease / Health Condition</div>
                    <div class="view-info-value">
                        ${member.disease && member.disease !== "None" ? `
                            <span class="badge bg-danger"><i class="bi bi-exclamation-circle"></i> ${member.disease}</span>
                            <button type="button" class="btn btn-sm btn-outline-danger ms-2" onclick="toggleDiseaseDetails(${index})">
                                <i class="bi bi-chevron-down"></i> <span id="diseaseBtnText-${index}">More</span>
                            </button>
                        ` : `<span class="badge bg-success"><i class="bi bi-check-circle"></i> No Disease Reported</span>`}
                    </div>
                </div>
                ${member.disease && member.disease !== "None" ? `
                    <div class="col-12 disease-details-view" id="diseaseDetails-${index}" style="display:none;">
                        <div class="health-detail-box">
                            <h6 class="health-section-title"><i class="bi bi-clipboard2-pulse"></i> Disease Details</h6>
                            <div class="row g-3">
                                ${member.disease === "Other" ? `<div class="col-md-6"><div class="view-info-label">Other Condition</div><div class="view-info-value">${member.otherDisease || "-"}</div></div>` : ""}
                                ${member.disease === "TB" ? `<div class="col-md-6"><div class="view-info-label">TB Status</div><div class="view-info-value">${member.tbStatus || "-"}</div></div>` : ""}
                                ${member.diseaseNotes ? `<div class="col-12"><div class="view-info-label">Special Health Notes</div><div class="health-notes">${member.diseaseNotes}</div></div>` : ""}
                            </div>
                        </div>
                    </div>
                ` : ""}

                <div class="col-12"><h6 class="health-section-title"><i class="bi bi-capsule"></i> Vaccination Information</h6></div>
                <div class="col-md-6"><div class="view-info-label">Last Vaccination</div><div class="view-info-value">${formatDate(member.vaccineDate)}</div></div>
                <div class="col-md-6"><div class="view-info-label">Next Vaccination Due</div><div class="view-info-value">${getVaccinationDueStatus(member.nextVaccine)}</div></div>
                ${member.notes ? `<div class="col-12"><h6 class="health-section-title"><i class="bi bi-journal-text"></i> Health Notes</h6><div class="health-notes">${member.notes}</div></div>` : ""}
            </div>
        `;
        container.appendChild(card);
    });
}

function togglePregnancyDetails(index) {
    const details = document.getElementById(`pregnancyDetails-${index}`);
    const buttonText = document.getElementById(`pregnancyBtnText-${index}`);
    const buttonIcon = buttonText?.previousElementSibling;
    if (!details || !buttonText) return;
    if (details.style.display === "none") {
        details.style.display = "";
        buttonText.textContent = "Less";
        if (buttonIcon) buttonIcon.className = "bi bi-chevron-up";
    } else {
        details.style.display = "none";
        buttonText.textContent = "More";
        if (buttonIcon) buttonIcon.className = "bi bi-chevron-down";
    }
}

function toggleDiseaseDetails(index) {
    const details = document.getElementById(`diseaseDetails-${index}`);
    const buttonText = document.getElementById(`diseaseBtnText-${index}`);
    const buttonIcon = buttonText?.previousElementSibling;
    if (!details || !buttonText) return;
    if (details.style.display === "none") {
        details.style.display = "";
        buttonText.textContent = "Less";
        if (buttonIcon) buttonIcon.className = "bi bi-chevron-up";
    } else {
        details.style.display = "none";
        buttonText.textContent = "More";
        if (buttonIcon) buttonIcon.className = "bi bi-chevron-down";
    }
}

function setText(elementId, value) {
    const element = document.getElementById(elementId);
    if (element) element.textContent = value;
}

function getStatusBadge(value, type) {
    if (value === "Yes") return `<span class="badge bg-danger"><i class="bi bi-exclamation-circle"></i> Yes</span>`;
    if (value === "No") return `<span class="badge bg-success"><i class="bi bi-check-circle"></i> No</span>`;
    return "-";
}

function getPregnancyBadge(value) {
    if (value === "Pregnant") return `<span class="badge bg-warning text-dark"><i class="bi bi-person-standing-dress"></i> Pregnant</span>`;
    if (value === "Not Pregnant") return `<span class="badge bg-success">Not Pregnant</span>`;
    return "-";
}

function getVaccinationDueStatus(date) {
    if (!date) return "-";
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    const formattedDate = formatDate(date);

    if (dueDate < today) return `<span class="badge bg-danger"><i class="bi bi-exclamation-triangle"></i> Overdue</span><br><small>${formattedDate}</small>`;
    if (dueDate.getTime() === today.getTime()) return `<span class="badge bg-warning text-dark"><i class="bi bi-clock"></i> Due Today</span><br><small>${formattedDate}</small>`;
    return `<span class="badge bg-success"><i class="bi bi-calendar-check"></i> ${formattedDate}</span>`;
}

function showNoFamilyMessage() {
    const container = document.getElementById("viewMembersContainer");
    if (container) container.innerHTML = `<div class="alert alert-warning"><i class="bi bi-exclamation-triangle"></i> Family record could not be found.</div>`;
}

function backToFamilies() {
    localStorage.removeItem("selectedFamily");
    window.location.href = "families.html";
}

function editCurrentFamily() {
    const selectedIndex = localStorage.getItem("selectedFamily");
    if (selectedIndex === null) { alert("Family record not found."); return; }
    localStorage.setItem("editFamilyIndex", selectedIndex);
    window.location.href = "add-family.html";
}

function deleteCurrentFamily() {
    const selectedIndex = localStorage.getItem("selectedFamily");
    if (selectedIndex === null) return;
    const families = getFamilies();
    const family = families[parseInt(selectedIndex)];
    if (!family) return;
    const confirmed = confirm(`Are you sure you want to delete family ${family.familyId}?`);
    if (!confirmed) return;
    families.splice(parseInt(selectedIndex), 1);
    saveFamilies(families);
    localStorage.removeItem("selectedFamily");
    alert("Family record deleted successfully.");
    window.location.href = "families.html";
}