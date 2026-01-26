// ================================
// 1. HAMBURGER MENU TOGGLE
// ================================
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


// ================================
// 2. CLICKABLE IMAGE SLIDER
// ================================
const slides = document.querySelectorAll(".slider-track img");
let currentIndex = 0;

// Show the first image
slides[currentIndex].classList.add("active");

// Function to show image by index
function showImage(index) {
    slides[currentIndex].classList.remove("active");
    currentIndex = (index + slides.length) % slides.length; // wrap around
    slides[currentIndex].classList.add("active");
}

// Handle click on each image
slides.forEach(slide => {
    slide.addEventListener("click", (e) => {
        const rect = slide.getBoundingClientRect();
        const clickX = e.clientX - rect.left;

        if (clickX < rect.width / 2) {
            // Clicked left half → previous image
            showImage(currentIndex - 1);
        } else {
            // Clicked right half → next image
            showImage(currentIndex + 1);
        }
    });
});

// Optional: Auto-slide every 5 seconds
let autoSlide = setInterval(() => {
    showImage(currentIndex + 1);
}, 5000);

// Pause auto-slide on hover
document.querySelector(".image-slider").addEventListener("mouseenter", () => clearInterval(autoSlide));
document.querySelector(".image-slider").addEventListener("mouseleave", () => {
    autoSlide = setInterval(() => showImage(currentIndex + 1), 5000);
});


// ================================
// 3. AUTO-SWITCHING SECTION BACKGROUNDS
// ================================
const sectionsWithBg = document.querySelectorAll(".bg-rotate");

const sectionImages = {
    about: ["images/about1.jpg", "images/about2.jpg", "images/about3.jpg"],
    departments: ["images/dept1.jpg", "images/dept2.jpg", "images/dept3.jpg"],
    founder: ["images/founder1.jpg", "images/founder2.jpg"]
};

sectionsWithBg.forEach(section => {
    const id = section.id;
    if (sectionImages[id]) {
        let index = 0;
        setInterval(() => {
            section.style.backgroundImage = `url('${sectionImages[id][index]}')`;
            section.style.backgroundSize = "cover";
            section.style.backgroundPosition = "center";
            index = (index + 1) % sectionImages[id].length;
        }, 5000);
    }
});


// ================================
// 4. DAILY VERSE FETCHING
// ================================
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
        console.error("Error fetching daily verse:", error);
        verseTextEl.textContent = "Unable to load verse today.";
        verseRefEl.textContent = "";
    }
}

// Fetch verse on page load
fetchDailyVerse();
