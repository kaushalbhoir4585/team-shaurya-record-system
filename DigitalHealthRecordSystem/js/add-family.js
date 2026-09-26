let memberCount = 1;

document.addEventListener("DOMContentLoaded", function () {
    const familyId = document.getElementById("familyId");
    if (!familyId) return;

    const editIndex = localStorage.getItem("editFamilyIndex");
    if (editIndex !== null && editIndex !== "") {
        loadEditFamily();
    } else {
        familyId.value = generateFamilyId();
        syncHeadName();
    }
});

function syncHeadName() {
    const familyHead = document.getElementById("familyHead");
    const headMemberName = document.getElementById("headMemberName");
    if (familyHead && headMemberName) {
        headMemberName.value = familyHead.value;
    }
}

function updatePregnancyFields(card) {
    if (!card) return;
    const genderSelect = card.querySelector(".member-gender");
    const pregnancyBox = card.querySelector(".pregnancy-status-box");
    const pregnancySelect = card.querySelector(".member-pregnancy");
    const pregnancyDetails = card.querySelector(".pregnancy-details");

    if (!genderSelect || !pregnancyBox) return;

    if (genderSelect.value !== "Female") {
        pregnancyBox.style.display = "none";
        if (pregnancySelect) pregnancySelect.value = "Not Applicable";
        if (pregnancyDetails) pregnancyDetails.style.display = "none";
        return;
    }

    pregnancyBox.style.display = "";
    if (pregnancySelect && pregnancyDetails) {
        pregnancyDetails.style.display = (pregnancySelect.value === "Pregnant") ? "" : "none";
    }
}

document.addEventListener("change", function (event) {
    const card = event.target.closest(".member-card");
    if (!card) return;
    
    if (event.target.classList.contains("member-gender") || event.target.classList.contains("member-pregnancy")) {
        updatePregnancyFields(card);
    }
});

function addMember() {
    const container = document.getElementById("membersContainer");
    if (!container) return;

    memberCount++;
    const member = document.createElement("div");
    member.className = "member-card";

    member.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-3">
            <h5><i class="bi bi-person"></i> <span class="member-number">Member ${memberCount}</span></h5>
            <button type="button" class="btn btn-sm btn-outline-danger" onclick="removeMember(this)"><i class="bi bi-trash"></i> Remove Member</button>
        </div>
        <div class="row g-3">
            <div class="col-md-4">
                <label class="form-label">Full Name</label>
                <input type="text" class="form-control member-name" placeholder="Enter full name" required>
            </div>
            <div class="col-md-4">
                <label class="form-label">Date of Birth</label>
                <input type="date" class="form-control member-dob">
            </div>
            <div class="col-md-4">
                <label class="form-label">Gender</label>
                <select class="form-select member-gender">
                    <option value="">Select Gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Relation with Head</label>
                <select class="form-select member-relation">
                    <option value="">Select Relation</option>
                    <option value="Wife">Wife</option>
                    <option value="Husband">Husband</option>
                    <option value="Father">Father</option>
                    <option value="Mother">Mother</option>
                    <option value="Son">Son</option>
                    <option value="Daughter">Daughter</option>
                    <option value="Brother">Brother</option>
                    <option value="Sister">Sister</option>
                    <option value="Other">Other</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Mobile Number</label>
                <input type="tel" class="form-control member-mobile" maxlength="10">
            </div>
            <div class="col-md-4">
                <label class="form-label">Blood Group</label>
                <select class="form-select member-blood">
                    <option value="">Select Blood Group</option>
                    <option value="A+">A+</option><option value="A-">A-</option>
                    <option value="B+">B+</option><option value="B-">B-</option>
                    <option value="O+">O+</option><option value="O-">O-</option>
                    <option value="AB+">AB+</option><option value="AB-">AB-</option>
                </select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Aadhaar Number</label>
                <input type="text" class="form-control member-aadhaar" placeholder="Enter 12 digit Aadhaar Number" maxlength="12" inputmode="numeric" autocomplete="off">
            </div>
            <div class="col-md-4">
                <label class="form-label">ABHA Number</label>
                <input type="text" class="form-control member-abha" placeholder="Enter ABHA Number (Optional)" autocomplete="off">
            </div>
            <div class="col-md-4">
                <label class="form-label">Ayushman Number</label>
                <input type="text" class="form-control member-ayushman" placeholder="Enter Ayushman Number (Optional)" autocomplete="off">
            </div>

            <div class="col-12"><hr><h6 class="text-primary"><i class="bi bi-heart-pulse"></i> Health Information</h6></div>
            
            <div class="col-md-4">
                <label class="form-label">BP Patient</label>
                <select class="form-select member-bp"><option value="No">No</option><option value="Yes">Yes</option></select>
            </div>
            <div class="col-md-4">
                <label class="form-label">Diabetes</label>
                <select class="form-select member-diabetes"><option value="No">No</option><option value="Yes">Yes</option></select>
            </div>
            
            <div class="col-md-4 pregnancy-status-box" style="display:none;">
                <label class="form-label">Pregnancy Status</label>
                <select class="form-select member-pregnancy">
                    <option value="Not Applicable">Not Applicable</option>
                    <option value="Not Pregnant">Not Pregnant</option>
                    <option value="Pregnant">Pregnant</option>
                </select>
            </div>
            <div class="col-12 pregnancy-details" style="display:none;">
                <div class="p-3 border rounded bg-light">
                    <h6 class="text-primary mb-3"><i class="bi bi-person-heart"></i> Pregnancy Details</h6>
                    <div class="row g-3">
                        <div class="col-md-4"><label class="form-label">LMP</label><input type="date" class="form-control pregnancy-lmp"></div>
                        <div class="col-md-4"><label class="form-label">EDD</label><input type="date" class="form-control pregnancy-edd"></div>
                        <div class="col-md-4">
                            <label class="form-label">Pregnancy Trimester</label>
                            <select class="form-select pregnancy-trimester">
                                <option value="">Select Trimester</option>
                                <option value="1st Trimester">1st</option><option value="2nd Trimester">2nd</option><option value="3rd Trimester">3rd</option>
                            </select>
                        </div>
                        <div class="col-md-4"><label class="form-label">ANC Visits</label><input type="number" class="form-control pregnancy-anc" min="0"></div>
                        <div class="col-md-4"><label class="form-label">High-Risk Pregnancy</label><select class="form-select pregnancy-high-risk"><option value="No">No</option><option value="Yes">Yes</option></select></div>
                        <div class="col-md-4"><label class="form-label">Iron / Folic Acid</label><select class="form-select pregnancy-ifa"><option value="No">No</option><option value="Yes">Yes</option></select></div>
                        <div class="col-md-4"><label class="form-label">Calcium</label><select class="form-select pregnancy-calcium"><option value="No">No</option><option value="Yes">Yes</option></select></div>
                        <div class="col-12"><label class="form-label">Pregnancy Notes</label><textarea class="form-control pregnancy-notes" rows="2"></textarea></div>
                    </div>
                </div>
            </div>

            <div class="col-12"><hr><h6 class="text-danger"><i class="bi bi-clipboard2-pulse"></i> Other Diseases / Conditions</h6></div>
            <div class="col-md-6">
                <label class="form-label">Disease / Health Condition</label>
                <select class="form-select member-disease">
                    <option value="None">None</option><option value="TB">TB / क्षयरोग</option><option value="Asthma">Asthma</option>
                    <option value="Epilepsy">Epilepsy</option><option value="Heart Disease">Heart Disease</option>
                    <option value="Cancer">Cancer</option><option value="Kidney Disease">Kidney Disease</option><option value="Other">Other</option>
                </select>
            </div>
            <div class="col-md-6 other-disease-name-box" style="display:none;">
                <label class="form-label">Other Disease / Condition</label>
                <input type="text" class="form-control member-other-disease">
            </div>
            <div class="col-md-6 tb-status-box" style="display:none;">
                <label class="form-label">TB Status</label>
                <select class="form-select member-tb-status">
                    <option value="">Select TB Status</option>
                    <option value="TB Confirmed - Treatment Ongoing">TB Confirmed — Treatment Ongoing</option>
                    <option value="TB Suspected - Sample Sent">TB Suspected — Sample Sent</option>
                    <option value="TB Treatment Completed">TB Treatment Completed</option>
                </select>
            </div>
            <div class="col-12">
                <label class="form-label">Disease Notes</label><textarea class="form-control member-disease-notes" rows="2"></textarea>
            </div>

            <div class="col-12"><hr><h6 class="text-success"><i class="bi bi-capsule"></i> Child / Vaccination Info</h6></div>
            <div class="col-md-4"><label class="form-label">Is Child?</label><select class="form-select member-child"><option value="No">No</option><option value="Yes">Yes</option></select></div>
            <div class="col-md-4"><label class="form-label">Last Vaccination</label><input type="date" class="form-control member-vaccine-date"></div>
            <div class="col-md-4"><label class="form-label">Next Vaccination</label><input type="date" class="form-control member-next-vaccine"></div>
            <div class="col-12"><label class="form-label">Additional Health Notes</label><textarea class="form-control member-notes" rows="2"></textarea></div>
        </div>
    `;

    container.appendChild(member);
    updateMemberNumbers();
}

function removeMember(button) {
    const cards = document.querySelectorAll(".member-card");
    if (cards.length <= 1) {
        alert("At least one family member is required.");
        return;
    }
    const card = button.closest(".member-card");
    if (card) card.remove();
    updateMemberNumbers();
}

function updateMemberNumbers() {
    const members = document.querySelectorAll(".member-card");
    members.forEach(function (member, index) {
        const number = member.querySelector(".member-number");
        if (number) number.textContent = `Member ${index + 1}`;
    });
    memberCount = members.length;
}

function saveFamily() {
    const familyHeadElement = document.getElementById("familyHead");
    const addressElement = document.getElementById("familyAddress");

    if (!familyHeadElement || !addressElement) return;

    const familyHead = familyHeadElement.value.trim();
    const address = addressElement.value.trim();

    if (familyHead === "") { alert("Please enter the Head of Family."); familyHeadElement.focus(); return; }
    if (address === "") { alert("Please enter the Family Address."); addressElement.focus(); return; }

    const memberCards = document.querySelectorAll(".member-card");
    if (memberCards.length === 0) { alert("Please add at least one family member."); return; }

    const familyMembers = [];
    memberCards.forEach(function (member) {
        const name = member.querySelector(".member-name")?.value.trim();
        if (!name) return;

        familyMembers.push({
            name: name,
            dob: member.querySelector(".member-dob")?.value || "",
            gender: member.querySelector(".member-gender")?.value || "",
            relation: member.querySelector(".member-relation")?.value || "",
            mobile: member.querySelector(".member-mobile")?.value || "",
            aadhaar: member.querySelector(".member-aadhaar")?.value.trim() || "",
            abha: member.querySelector(".member-abha")?.value.trim() || "",
            ayushman: member.querySelector(".member-ayushman")?.value.trim() || "",
            blood: member.querySelector(".member-blood")?.value || "",
            
            bp: member.querySelector(".member-bp")?.value || "No",
            diabetes: member.querySelector(".member-diabetes")?.value || "No",
            
            pregnancy: member.querySelector(".member-pregnancy")?.value || "Not Applicable",
            pregnancyLMP: member.querySelector(".pregnancy-lmp")?.value || "",
            pregnancyEDD: member.querySelector(".pregnancy-edd")?.value || "",
            pregnancyTrimester: member.querySelector(".pregnancy-trimester")?.value || "",
            pregnancyANC: member.querySelector(".pregnancy-anc")?.value || "",
            pregnancyHighRisk: member.querySelector(".pregnancy-high-risk")?.value || "",
            pregnancyIFA: member.querySelector(".pregnancy-ifa")?.value || "",
            pregnancyCalcium: member.querySelector(".pregnancy-calcium")?.value || "",
            pregnancyNotes: member.querySelector(".pregnancy-notes")?.value.trim() || "",
            
            disease: member.querySelector(".member-disease")?.value || "None",
            otherDisease: member.querySelector(".member-other-disease")?.value.trim() || "",
            tbStatus: member.querySelector(".member-tb-status")?.value || "",
            diseaseNotes: member.querySelector(".member-disease-notes")?.value.trim() || "",
            
            child: member.querySelector(".member-child")?.value || "No",
            vaccineDate: member.querySelector(".member-vaccine-date")?.value || "",
            nextVaccine: member.querySelector(".member-next-vaccine")?.value || "",
            notes: member.querySelector(".member-notes")?.value.trim() || ""
        });
    });

    if (familyMembers.length === 0) { alert("Please enter at least one member name."); return; }

    const familyData = {
        familyId: document.getElementById("familyId").value,
        familyHead: familyHead,
        contact: document.getElementById("familyContact")?.value || "",
        address: address,
        area: document.getElementById("familyArea")?.value || "",
        members: familyMembers
    };

    const families = getFamilies();
    const editIndex = localStorage.getItem("editFamilyIndex");

    if (editIndex !== null && editIndex !== "") {
        families[parseInt(editIndex)] = familyData;
        localStorage.removeItem("editFamilyIndex");
    } else {
        families.push(familyData);
    }

    saveFamilies(families);
    alert("Family record saved successfully!");
    window.location.href = "families.html";
}

function loadEditFamily() {
    const editIndex = localStorage.getItem("editFamilyIndex");
    if (editIndex === null || editIndex === "") return;

    const families = getFamilies();
    const family = families[parseInt(editIndex)];
    if (!family) return;

    document.getElementById("familyId").value = family.familyId || "";
    document.getElementById("familyHead").value = family.familyHead || "";
    document.getElementById("familyContact").value = family.contact || "";
    document.getElementById("familyAddress").value = family.address || "";
    document.getElementById("familyArea").value = family.area || "";

    syncHeadName();

    const container = document.getElementById("membersContainer");
    if (!container) return;

    const members = Array.isArray(family.members) ? family.members : [];
    if (members.length === 0) return;

    const firstMember = container.querySelector(".member-card");
    if (firstMember) fillMemberCard(firstMember, members[0], true);

    memberCount = 1;

    for (let i = 1; i < members.length; i++) {
        addMember();
        const cards = container.querySelectorAll(".member-card");
        const newCard = cards[cards.length - 1];
        if (newCard) fillMemberCard(newCard, members[i], false);
    }
    updateMemberNumbers();
}

function fillMemberCard(card, data, isHead) {
    if (!card || !data) return;

    // Safe Assignment Helper to prevent crashing if a field is temporarily missing
    const setVal = (selector, val) => {
        const el = card.querySelector(selector);
        if (el) el.value = val;
    };

    setVal(".member-name", data.name || "");
    setVal(".member-dob", data.dob || "");
    setVal(".member-gender", data.gender || "");
    setVal(".member-relation", isHead ? "Head" : (data.relation || ""));
    setVal(".member-mobile", data.mobile || "");
    setVal(".member-aadhaar", data.aadhaar || "");
    setVal(".member-abha", data.abha || "");
    setVal(".member-ayushman", data.ayushman || "");
    setVal(".member-blood", data.blood || "");

    setVal(".member-bp", data.bp || "No");
    setVal(".member-diabetes", data.diabetes || "No");

    setVal(".member-pregnancy", data.pregnancy || "Not Applicable");
    setVal(".pregnancy-lmp", data.pregnancyLMP || "");
    setVal(".pregnancy-edd", data.pregnancyEDD || "");
    setVal(".pregnancy-trimester", data.pregnancyTrimester || "");
    setVal(".pregnancy-anc", data.pregnancyANC || "");
    setVal(".pregnancy-high-risk", data.pregnancyHighRisk || "No");
    setVal(".pregnancy-ifa", data.pregnancyIFA || "No");
    setVal(".pregnancy-calcium", data.pregnancyCalcium || "No");
    setVal(".pregnancy-notes", data.pregnancyNotes || "");

    setVal(".member-disease", data.disease || "None");
    setVal(".member-other-disease", data.otherDisease || "");
    setVal(".member-tb-status", data.tbStatus || "");
    setVal(".member-disease-notes", data.diseaseNotes || "");

    setVal(".member-child", data.child || "No");
    setVal(".member-vaccine-date", data.vaccineDate || "");
    setVal(".member-next-vaccine", data.nextVaccine || "");
    setVal(".member-notes", data.notes || "");

    if (typeof updatePregnancyFields === "function") updatePregnancyFields(card);
    if (typeof updateDiseaseFields === "function") updateDiseaseFields(card);
}

function updateDiseaseFields(card) {
    if (!card) return;
    const diseaseSelect = card.querySelector(".member-disease");
    const otherDiseaseBox = card.querySelector(".other-disease-name-box");
    const tbStatusBox = card.querySelector(".tb-status-box");

    if (!diseaseSelect) return;
    const disease = diseaseSelect.value;

    if (otherDiseaseBox) {
        if (disease === "Other") {
            otherDiseaseBox.style.display = "";
        } else {
            otherDiseaseBox.style.display = "none";
            const otherInput = otherDiseaseBox.querySelector(".member-other-disease");
            if (otherInput) otherInput.value = "";
        }
    }

    if (tbStatusBox) {
        if (disease === "TB") {
            tbStatusBox.style.display = "";
        } else {
            tbStatusBox.style.display = "none";
            const tbSelect = tbStatusBox.querySelector(".member-tb-status");
            if (tbSelect) tbSelect.value = "";
        }
    }
}

document.addEventListener("change", function (event) {
    const card = event.target.closest(".member-card");
    if (!card) return;
    if (event.target.classList.contains("member-disease")) {
        updateDiseaseFields(card);
    }
});