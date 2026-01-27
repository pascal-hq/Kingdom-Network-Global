// ==========================
// 1. HAMBURGER MENU TOGGLE
// ==========================
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

hamburger.addEventListener("click", () => {
    navMenu.classList.toggle("active");
    hamburger.classList.toggle("active");
});

// Close menu when a nav link is clicked (mobile)
document.querySelectorAll(".nav a").forEach(link => {
    link.addEventListener("click", () => {
        if (navMenu.classList.contains("active")) {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        }
    });
});

// ==========================
// 2. HOME IMAGE SLIDER
// ==========================
const sliderTrack = document.querySelector(".slider-track");
const sliderImages = sliderTrack.querySelectorAll("img");
let activeIndex = 0;

// Show image by index
function showImage(index) {
    sliderImages.forEach((img, i) => {
        img.classList.toggle("active", i === index);
    });
}

// Move slider left or right
function moveSlider(direction) {
    if (direction === "next") {
        activeIndex = (activeIndex + 1) % sliderImages.length;
    } else if (direction === "prev") {
        activeIndex = (activeIndex - 1 + sliderImages.length) % sliderImages.length;
    }
    showImage(activeIndex);
}

// Initial display
showImage(activeIndex);

// Click to navigate (left/right side)
const sliderContainer = document.querySelector(".image-slider");
sliderContainer.addEventListener("click", e => {
    const rect = sliderContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) {
        moveSlider("prev");
    } else {
        moveSlider("next");
    }
});

// Optional: Auto slide every 4 seconds
setInterval(() => moveSlider("next"), 4000);

// ==========================
// 3. DAILY VERSE FETCHING
// ==========================
const verseTextEl = document.querySelector(".verse-text");
const verseRefEl = document.querySelector(".verse-ref");

async function fetchDailyVerse() {
    try {
        const response = await fetch("https://beta.ourmanna.com/api/v1/get/?format=json");
        const data = await response.json();
        const verse = data.verse.details.text;
        const reference = data.verse.details.reference;

        verseTextEl.textContent = verse;
        verseRefEl.textContent = reference;
    } catch (error) {
        console.error("Failed to fetch verse:", error);
        verseTextEl.textContent = "Unable to load verse today.";
        verseRefEl.textContent = "";
    }
}

// Fetch on load
fetchDailyVerse();

// ==========================
// 4. OPTIONAL: SECTION BACKGROUND ROTATION
// ==========================
const bgSections = document.querySelectorAll(".bg-rotate");

// Example images per section
const sectionImages = {
    founder: ["images/vision.jpg", "images/vision2.jpg"],
    about: ["images/about.jpg", "images/about2.jpg"]
};

bgSections.forEach(section => {
    const id = section.id;
    if (!sectionImages[id]) return;

    let idx = 0;
    setInterval(() => {
        section.style.backgroundImage = `url('${sectionImages[id][idx]}')`;
        section.style.backgroundSize = "cover";
        section.style.backgroundPosition = "center";
        idx = (idx + 1) % sectionImages[id].length;
    }, 7000); // every 7 seconds
});
