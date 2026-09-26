/* =====================================================
   TEAM SHAURYA - MAIN WEBSITE JS
===================================================== */

document.addEventListener("DOMContentLoaded", function () {

    /* ---------------------------------------------
       Current Year
    --------------------------------------------- */

    const yearElement = document.getElementById("currentYear");

    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }


    /* ---------------------------------------------
       Close Mobile Navbar After Clicking Link
    --------------------------------------------- */

    const navLinks = document.querySelectorAll(
        "#mainNavbar .nav-link"
    );

    const navbar = document.getElementById("mainNavbar");

    navLinks.forEach(function (link) {

        link.addEventListener("click", function () {

            if (
                window.innerWidth < 992 &&
                navbar.classList.contains("show")
            ) {

                const bsCollapse =
                    bootstrap.Collapse.getInstance(navbar);

                if (bsCollapse) {
                    bsCollapse.hide();
                }
            }

        });

    });


    /* ---------------------------------------------
       Navbar Background While Scrolling
    --------------------------------------------- */

    const mainNavbar =
        document.querySelector(".main-navbar");

    window.addEventListener("scroll", function () {

        if (window.scrollY > 50) {

            mainNavbar.style.background =
                "rgba(5, 12, 25, 0.98)";

        } else {

            mainNavbar.style.background =
                "rgba(8, 15, 30, 0.94)";
        }

    });


    /* ---------------------------------------------
       Active Navigation Link
    --------------------------------------------- */

    const sections =
        document.querySelectorAll("section[id]");

    window.addEventListener("scroll", function () {

        let currentSection = "";

        sections.forEach(function (section) {

            const sectionTop =
                section.offsetTop - 150;

            const sectionHeight =
                section.offsetHeight;

            if (
                window.scrollY >= sectionTop &&
                window.scrollY < sectionTop + sectionHeight
            ) {
                currentSection = section.getAttribute("id");
            }

        });


        navLinks.forEach(function (link) {

            link.classList.remove("active");

            if (
                link.getAttribute("href") ===
                "#" + currentSection
            ) {

                link.classList.add("active");
            }

        });

    });

});