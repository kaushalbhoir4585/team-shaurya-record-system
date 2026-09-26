document.addEventListener("DOMContentLoaded", function () {
    // BUG FIX: Force clear the edit memory when landing on dashboard
    localStorage.removeItem("editFamilyIndex"); 
    
    loadDashboardStats();
    loadDashboardProfile();
});

/* =================================
   LOAD DASHBOARD STATISTICS
================================= */
function loadDashboardStats() {
    const families = getFamilies();
    const totalFamilies = document.getElementById("totalFamilies");
    if (totalFamilies) totalFamilies.textContent = families.length;
    const totalPopulation = document.getElementById("totalPopulation");
    if (totalPopulation) totalPopulation.textContent = getTotalPopulation();
    const pregnantWomen = document.getElementById("pregnantWomen");
    if (pregnantWomen) pregnantWomen.textContent = getPregnantWomen();
    const children = document.getElementById("children");
    if (children) children.textContent = getChildren();
    const bpPatients = document.getElementById("bpPatients");
    if (bpPatients) bpPatients.textContent = getBPPatients();
    const vaccinationsDue = document.getElementById("vaccinationsDue");
    if (vaccinationsDue) vaccinationsDue.textContent = getVaccinationsDue();
}

/* =================================
   LOAD ASHA PROFILE
================================= */
function loadDashboardProfile() {
    const profileData = localStorage.getItem("ashaProfile");
    if (!profileData) return;
    try {
        const profile = JSON.parse(profileData);
        const ashaName = document.getElementById("ashaName");
        const village = document.getElementById("dashboardVillage");
        const subPhc = document.getElementById("dashboardSubPhc");
        const phc = document.getElementById("dashboardPhc");

        if (ashaName && profile.ashaName) ashaName.textContent = profile.ashaName;
        if (village && profile.villageName) village.textContent = profile.villageName;
        if (subPhc && profile.subPhcName) subPhc.textContent = profile.subPhcName;
        if (phc && profile.phcName) phc.textContent = profile.phcName;
    } catch (error) {
        console.error("Error loading ASHA profile:", error);
    }
}

/* =================================
   GENERATE EXCEL REPORT
================================= */
function generateVillageReportExcel() {
    const profileData = JSON.parse(localStorage.getItem("ashaProfile")) || {};
    const families = getFamilies();
    if (families.length === 0) { alert("No family data available to generate a report."); return; }

    const ashaName = profileData.ashaName || "Not Set";
    const village = profileData.villageName || "Not Set";
    const phc = profileData.phcName || "Not Set";
    const subPhc = profileData.subPhcName || "Not Set";
    const dateStr = new Date().toLocaleDateString('en-IN');
    const excelData = [];

    // Header Rows
    excelData.push(["Village Health Survey Master Record"]);
    excelData.push(["ASHA Worker:", ashaName, "Village:", village]);
    excelData.push(["PHC:", phc, "Sub-PHC:", subPhc, "Date:", dateStr]);
    excelData.push([]); 

    // Table Column Headers
    excelData.push(["Family ID", "Head of Family", "Member Name", "Relation", "Age", "Gender", "Contact Number", "Aadhaar Number", "ABHA Number", "Ayushman Number", "BP", "Diabetes", "Pregnancy Details", "Other Diseases / TB", "Next Vaccine Due", "Notes"]);

    // Populate Data Rows
    families.forEach(family => {
        const members = family.members || [];
        members.forEach(member => {
            const age = calculateAge(member.dob) || "-";
            let pregStatus = member.pregnancy === "Pregnant" ? "Pregnant" : "-";
            if (member.pregnancy === "Pregnant" && member.pregnancyTrimester) pregStatus += ` (${member.pregnancyTrimester})`;
            let diseaseStatus = member.disease && member.disease !== "None" ? member.disease : "-";
            if (member.disease === "TB" && member.tbStatus) diseaseStatus = `TB: ${member.tbStatus}`;
            else if (member.disease === "Other" && member.otherDisease) diseaseStatus = `Other: ${member.otherDisease}`;

            excelData.push([
                family.familyId || "-", family.familyHead || "-", member.name || "-", member.relation || "-",
                age, member.gender || "-", member.mobile || family.contact || "-",
                member.aadhaar || "-", member.abha || "-", member.ayushman || "-",
                member.bp || "No", member.diabetes || "No", pregStatus, diseaseStatus,
                member.nextVaccine ? formatDate(member.nextVaccine) : "-", member.notes || ""
            ]);
        });
    });

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    ws['!cols'] = [{ wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 12 }, { wch: 5 }, { wch: 8 }, { wch: 15 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 5 }, { wch: 8 }, { wch: 18 }, { wch: 22 }, { wch: 15 }, { wch: 25 }];
    XLSX.utils.book_append_sheet(wb, ws, "Village Record");

    const safeVillageName = village.replace(/[^a-zA-Z0-9]/g, "_") || "Village";
    XLSX.writeFile(wb, `Health_Record_${safeVillageName}_${dateStr.replace(/\//g, "-")}.xlsx`);
}

/* =================================
   GENERATE PDF REPORT
================================= */
function generateVillageReportPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('landscape');
    const profileData = JSON.parse(localStorage.getItem("ashaProfile")) || {};
    const families = getFamilies();
    if (families.length === 0) { alert("No family data available to generate a report."); return; }

    const ashaName = profileData.ashaName || "Not Set";
    const village = profileData.villageName || "Not Set";
    const phc = profileData.phcName || "Not Set";
    const subPhc = profileData.subPhcName || "Not Set";
    const dateStr = new Date().toLocaleDateString('en-IN');

    doc.setFontSize(18); doc.setTextColor(13, 110, 253); doc.text("Village Health Survey Master Record", 14, 15);
    doc.setFontSize(11); doc.setTextColor(50, 50, 50);
    doc.text(`ASHA Worker: ${ashaName}  |  Village: ${village}`, 14, 23);
    doc.text(`PHC: ${phc}  |  Sub-PHC: ${subPhc}  |  Date: ${dateStr}`, 14, 29);

    const tableColumns = ["Fam ID", "Member Name", "Rel", "Age / Sex", "Contact", "Govt IDs", "NCD (BP/Db)", "Special / Pregnancy", "Vaccine Due"];
    const tableRows = [];

    families.forEach(family => {
        const members = family.members || [];
        members.forEach(member => {
            const ageStr = calculateAge(member.dob) || "-";
            const genderChar = member.gender ? member.gender.charAt(0) : "-";
            const ageSex = `${ageStr} / ${genderChar}`;
            const idList = `Aadhaar: ${member.aadhaar || "-"}\nABHA: ${member.abha || "-"}\nAyushman: ${member.ayushman || "-"}`;
            const ncdList = `BP: ${member.bp || "No"}\nDb: ${member.diabetes || "No"}`;
            
            let specialStr = "-";
            let conditions = [];
            if (member.gender === 'Female' && member.pregnancy === 'Pregnant') conditions.push("Pregnant");
            if (member.disease && member.disease !== "None") conditions.push(member.disease);
            if (conditions.length > 0) specialStr = conditions.join("\n");
            
            const vaccineStr = member.nextVaccine ? formatDate(member.nextVaccine) : "-";

            tableRows.push([family.familyId || "-", member.name || "-", member.relation || "-", ageSex, member.mobile || family.contact || "-", idList, ncdList, specialStr, vaccineStr]);
        });
    });

    doc.autoTable({
        head: [tableColumns], body: tableRows, startY: 35, theme: 'grid',
        styles: { fontSize: 8, cellPadding: 3, valign: 'middle' },
        headStyles: { fillColor: [13, 110, 253], textColor: 255, halign: 'center' },
        columnStyles: { 0: { fontStyle: 'bold', halign: 'center' }, 3: { halign: 'center' }, 6: { halign: 'center' } },
        drawRow: function (row, data) {
            if (row.index > 0 && tableRows[row.index][0] !== tableRows[row.index - 1][0]) {
                doc.setDrawColor(13, 110, 253); doc.setLineWidth(0.5);
                doc.line(data.settings.margin.left, row.y, doc.internal.pageSize.width - data.settings.margin.right, row.y);
            }
        }
    });

    const safeVillageName = village.replace(/[^a-zA-Z0-9]/g, "_") || "Village";
    doc.save(`Audit_Record_${safeVillageName}_${dateStr.replace(/\//g, "-")}.pdf`);
}