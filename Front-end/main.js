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
        navMenu.classList.remove("active");
        hamburger.classList.remove("active");
    });
});

// ==========================
// 2. HOME IMAGE SLIDER
// ==========================
const sliderTrack = document.querySelector(".slider-track");
const sliderImages = sliderTrack.querySelectorAll("img");
let activeIndex = 0;

function showImage(index) {
    sliderImages.forEach((img, i) => {
        img.classList.toggle("active", i === index);
    });
}

function moveSlider(direction) {
    if (direction === "next") activeIndex = (activeIndex + 1) % sliderImages.length;
    else if (direction === "prev") activeIndex = (activeIndex - 1 + sliderImages.length) % sliderImages.length;
    showImage(activeIndex);
}

showImage(activeIndex);

const sliderContainer = document.querySelector(".image-slider");
sliderContainer.addEventListener("click", e => {
    const rect = sliderContainer.getBoundingClientRect();
    const x = e.clientX - rect.left;
    if (x < rect.width / 2) moveSlider("prev");
    else moveSlider("next");
});

setInterval(() => moveSlider("next"), 4000);

// ==========================
// 3. DAILY VERSE FETCHING (Bible API NIV)
// ==========================
const verseTextEl = document.querySelector(".verse-text");
const verseRefEl = document.querySelector(".verse-ref");

// Optional: pre-defined daily verses (if you want rotation)
const dailyVerses = [
    "John 3:16",
    "Philippians 4:13",
    "Psalm 23:1",
    "Romans 8:28",
    "Proverbs 3:5"
];

function getTodaysVerse() {
    // Use date to pick a verse deterministically
    const today = new Date();
    const index = today.getDate() % dailyVerses.length;
    return dailyVerses[index];
}

async function fetchDailyVerse() {
    const verse = getTodaysVerse();
    try {
        const response = await fetch(`https://bible-api.com/${verse}?translation=web`);
        const data = await response.json();
        verseTextEl.textContent = data.text;
        verseRefEl.textContent = data.reference;
    } catch (error) {
        console.error("Failed to fetch verse:", error);
        verseTextEl.textContent = "Unable to load verse today.";
        verseRefEl.textContent = "";
    }
}

fetchDailyVerse();

// ==========================
// 4. SECTION BACKGROUND ROTATION
// ==========================
const bgSections = document.querySelectorAll(".bg-rotate");
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
    }, 7000);
});
