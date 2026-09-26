/* =========================================
   PROFILE PAGE
   ========================================= */


/* =========================================
   PAGE LOAD
   ========================================= */

document.addEventListener("DOMContentLoaded", function () {

    loadProfile();

});


/* =========================================
   GET PROFILE DATA
   ========================================= */

function getProfile() {

    try {

        return JSON.parse(
            localStorage.getItem("ashaProfile")
        ) || {

            ashaName: "",
            villageName: "",
            subPhcName: "",
            phcName: ""

        };

    }

    catch (error) {

        console.error(
            "Error reading profile data:",
            error
        );

        return {

            ashaName: "",
            villageName: "",
            subPhcName: "",
            phcName: ""

        };

    }

}


/* =========================================
   LOAD PROFILE
   ========================================= */

function loadProfile() {

    const profile = getProfile();


    const ashaName =
        document.getElementById("ashaName");

    const villageName =
        document.getElementById("villageName");

    const subPhcName =
        document.getElementById("subPhcName");

    const phcName =
        document.getElementById("phcName");


    if (ashaName) {

        ashaName.textContent =
            profile.ashaName || "Not Set";

    }


    if (villageName) {

        villageName.textContent =
            profile.villageName || "Not Set";

    }


    if (subPhcName) {

        subPhcName.textContent =
            profile.subPhcName || "Not Set";

    }


    if (phcName) {

        phcName.textContent =
            profile.phcName || "Not Set";

    }

}


/* =========================================
   OPEN EDIT PROFILE
   ========================================= */

function openEditProfile() {

    const profile = getProfile();


    const ashaInput =
        document.getElementById("editAshaName");

    const villageInput =
        document.getElementById("editVillageName");

    const subPhcInput =
        document.getElementById("editSubPhcName");

    const phcInput =
        document.getElementById("editPhcName");


    if (ashaInput) {

        ashaInput.value =
            profile.ashaName || "";

    }


    if (villageInput) {

        villageInput.value =
            profile.villageName || "";

    }


    if (subPhcInput) {

        subPhcInput.value =
            profile.subPhcName || "";

    }


    if (phcInput) {

        phcInput.value =
            profile.phcName || "";

    }


    /* Open Bootstrap Modal */

    const modalElement =
        document.getElementById(
            "editProfileModal"
        );


    const modal =
        bootstrap.Modal.getOrCreateInstance(
            modalElement
        );


    modal.show();

}


/* =========================================
   SAVE PROFILE
   ========================================= */

function saveProfile() {

    const ashaInput =
        document.getElementById("editAshaName");

    const villageInput =
        document.getElementById("editVillageName");

    const subPhcInput =
        document.getElementById("editSubPhcName");

    const phcInput =
        document.getElementById("editPhcName");


    const ashaName =
        ashaInput.value.trim();

    const villageName =
        villageInput.value.trim();

    const subPhcName =
        subPhcInput.value.trim();

    const phcName =
        phcInput.value.trim();


    /* =====================================
       VALIDATION
       ===================================== */

    if (!ashaName) {

        alert(
            "Please enter the ASHA worker name."
        );

        ashaInput.focus();

        return;

    }


    if (!villageName) {

        alert(
            "Please enter the village name."
        );

        villageInput.focus();

        return;

    }


    if (!subPhcName) {

        alert(
            "Please enter the Sub-PHC name."
        );

        subPhcInput.focus();

        return;

    }


    if (!phcName) {

        alert(
            "Please enter the PHC name."
        );

        phcInput.focus();

        return;

    }


    /* =====================================
       CREATE PROFILE OBJECT
       ===================================== */

    const profile = {

        ashaName: ashaName,

        villageName: villageName,

        subPhcName: subPhcName,

        phcName: phcName

    };


    /* =====================================
       SAVE TO LOCAL STORAGE
       ===================================== */

    localStorage.setItem(
        "ashaProfile",
        JSON.stringify(profile)
    );


    /* =====================================
       UPDATE DISPLAY
       ===================================== */

    loadProfile();


    /* =====================================
       CLOSE MODAL
       ===================================== */

    const modalElement =
        document.getElementById(
            "editProfileModal"
        );


    const modal =
        bootstrap.Modal.getInstance(
            modalElement
        );


    if (modal) {

        modal.hide();

    }


    alert(
        "Profile updated successfully."
    );

}