const loader = document.getElementById("top-loader");

// When the page first loads
window.addEventListener("load", () => {
    if (loader) {
        loader.style.width = "100%";
        setTimeout(() => loader.style.opacity = "0", 300);
    }
});

// When clicking any link
document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", function (e) {
            const href = this.getAttribute("href");
            // Ignore links like "#", same page anchors, or javascript: calls
            if (!href || href.startsWith("#") || href.includes("javascript:")) return;

            e.preventDefault(); // Stop instant navigation
            if (loader) {
                loader.style.opacity = "1";
                loader.style.width = "30%";

                setTimeout(() => loader.style.width = "70%", 150);

                // Go to the next page after animation
                setTimeout(() => {
                    window.location.href = href;
                }, 350);
            } else {
                window.location.href = href;
            }
        });
    });
});
