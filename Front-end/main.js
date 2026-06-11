// ========================================
// KINGDOM NETWORK GLOBAL - MAIN JS
// All Features: Hamburger | Slider | Bible API | Scroll Effects
// ========================================

// ========== 1. HAMBURGER MENU ==========
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    // Close menu when any nav link is clicked
    document.querySelectorAll(".nav a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });
}

// ========== 2. IMAGE SLIDER ==========
const sliderTrack = document.querySelector(".slider-track");
const sliderImages = sliderTrack ? sliderTrack.querySelectorAll("img") : [];
let activeIndex = 0;
let sliderInterval;

function showImage(index) {
    if (!sliderImages.length) return;
    sliderImages.forEach((img, i) => {
        img.classList.toggle("active", i === index);
    });
}

function moveSlider(direction) {
    if (direction === "next") {
        activeIndex = (activeIndex + 1) % sliderImages.length;
    } else if (direction === "prev") {
        activeIndex = (activeIndex - 1 + sliderImages.length) % sliderImages.length;
    }
    showImage(activeIndex);
}

function startSlider() {
    if (sliderInterval) clearInterval(sliderInterval);
    sliderInterval = setInterval(() => moveSlider("next"), 4000);
}

function stopSlider() {
    if (sliderInterval) clearInterval(sliderInterval);
}

// Initialize slider
if (sliderImages.length) {
    showImage(activeIndex);
    startSlider();

    // Click on slider sides to navigate
    const sliderContainer = document.querySelector(".image-slider");
    if (sliderContainer) {
        sliderContainer.addEventListener("click", (e) => {
            const rect = sliderContainer.getBoundingClientRect();
            const x = e.clientX - rect.left;
            if (x < rect.width / 2) {
                moveSlider("prev");
            } else {
                moveSlider("next");
            }
            // Reset timer after manual click
            startSlider();
        });

        // Pause on hover
        sliderContainer.addEventListener("mouseenter", stopSlider);
        sliderContainer.addEventListener("mouseleave", startSlider);
    }
}

// ========== 3. DAILY VERSE (Bible API) ==========
const verseTextEl = document.querySelector(".verse-text");
const verseRefEl = document.querySelector(".verse-ref");

// Pre-defined verses as fallback
const fallbackVerses = [
    { text: "For God so loved the world that he gave his one and only Son, that whoever believes in him shall not perish but have eternal life.", ref: "John 3:16" },
    { text: "I can do all things through Christ who strengthens me.", ref: "Philippians 4:13" },
    { text: "The Lord is my shepherd; I shall not want.", ref: "Psalm 23:1" },
    { text: "And we know that in all things God works for the good of those who love him, who have been called according to his purpose.", ref: "Romans 8:28" },
    { text: "Trust in the Lord with all your heart and lean not on your own understanding.", ref: "Proverbs 3:5" },
    { text: "I have fought the good fight, I have finished the race, I have kept the faith.", ref: "2 Timothy 4:7" },
    { text: "Be strong and courageous. Do not be afraid; do not be discouraged, for the Lord your God will be with you wherever you go.", ref: "Joshua 1:9" },
    { text: "In all your ways submit to him, and he will make your paths straight.", ref: "Proverbs 3:6" },
    { text: "Do not worry about anything, but in everything by prayer and supplication with thanksgiving let your requests be made known to God.", ref: "Philippians 4:6" },
    { text: "And the peace of God, which surpasses all understanding, will guard your hearts and your minds in Christ Jesus.", ref: "Philippians 4:7" },
    { text: "Therefore, if anyone is in Christ, the new creation has come: The old has gone, the new is here!", ref: "2 Corinthians 5:17" },
    { text: "But those who hope in the Lord will renew their strength. They will soar on wings like eagles; they will run and not grow weary, they will walk and not be faint.", ref: "Isaiah 40:31" },
    { text: "He has shown you, O mortal, what is good. And what does the Lord require of you? To act justly and to love mercy and to walk humbly with your God.", ref: "Micah 6:8" },
    { text: "The Lord your God is with you, the Mighty Warrior who saves. He will take great delight in you; in his love he will no longer rebuke you, but will rejoice over you with singing.", ref: "Zephaniah 3:17" },
    { text: "Come to me, all you who are weary and burdened, and I will give you rest.", ref: "Matthew 11:28" },
    { text: "Take my yoke upon you and learn from me, for I am gentle and humble in heart, and you will find rest for your souls.", ref: "Matthew 11:29" },
    { text: "For I know the plans I have for you, declares the Lord, plans to prosper you and not to harm you, plans to give you hope and a future.", ref: "Jeremiah 29:11" },
    { text: "You will seek me and find me when you seek me with all your heart.", ref: "Jeremiah 29:13" },
    { text: "The thief comes only to steal and kill and destroy; I have come that they may have life, and have it to the full.", ref: "John 10:10" },
    { text: "Love is patient, love is kind. It does not envy, it does not boast, it is not proud.", ref: "1 Corinthians 13:4" },
    { text: "It does not dishonor others, it is not self-seeking, it is not easily angered, it keeps no record of wrongs.", ref: "1 Corinthians 13:5" },
    { text: "And now these three remain: faith, hope and love. But the greatest of these is love.", ref: "1 Corinthians 13:13" },
    { text: "Even though I walk through the darkest valley, I will fear no evil, for you are with me; your rod and your staff, they comfort me.", ref: "Psalm 23:4" },
    { text: "Surely your goodness and love will follow me all the days of my life, and I will dwell in the house of the Lord forever.", ref: "Psalm 23:6" },
    { text: "Your word is a lamp for my feet, a light on my path.", ref: "Psalm 119:105" },
    { text: "Jesus answered, 'I am the way and the truth and the life. No one comes to the Father except through me.'", ref: "John 14:6" },
    { text: "Cast all your anxiety on him because he cares for you.", ref: "1 Peter 5:7" },
    { text: "The name of the Lord is a fortified tower; the righteous run to it and are safe.", ref: "Proverbs 18:10" },
    { text: "For the Spirit God gave us does not make us timid, but gives us power, love and self-discipline.", ref: "2 Timothy 1:7" },
    { text: "Give thanks to the Lord, for he is good; his love endures forever.", ref: "Psalm 107:1" }
];

function getVerseOfTheDay() {
    const today = new Date();
    const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 86400000);
    return fallbackVerses[dayOfYear % fallbackVerses.length];
}

async function fetchDailyVerse() {
    if (!verseTextEl) return;

    try {
        const verse = getVerseOfTheDay();
        const response = await fetch(`https://bible-api.com/${verse.ref}?translation=web`);
        
        if (!response.ok) throw new Error("API failed");
        
        const data = await response.json();
        verseTextEl.textContent = data.text || verse.text;
        verseRefEl.textContent = data.reference || verse.ref;
    } catch (error) {
        console.log("Using fallback verse");
        const fallback = getVerseOfTheDay();
        verseTextEl.textContent = fallback.text;
        verseRefEl.textContent = fallback.ref;
    }
}

// Load verse when page loads
fetchDailyVerse();

// ========== 4. HEADER SCROLL EFFECT ==========
const header = document.querySelector(".header");

function handleHeaderScroll() {
    if (!header) return;
    if (window.scrollY > 50) {
        header.classList.add("scrolled");
    } else {
        header.classList.remove("scrolled");
    }
}

window.addEventListener("scroll", handleHeaderScroll);
handleHeaderScroll(); // Run on load

// ========== 5. ACTIVE NAVIGATION HIGHLIGHT ==========
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll(".nav a");

function updateActiveNav() {
    if (!sections.length || !navLinks.length) return;
    
    let current = "";
    const scrollPosition = window.scrollY + 150;

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.offsetHeight;
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            current = section.getAttribute("id");
        }
    });

    navLinks.forEach(link => {
        link.classList.remove("active");
        const href = link.getAttribute("href");
        if (href && href.substring(1) === current) {
            link.classList.add("active");
        }
    });
}

window.addEventListener("scroll", updateActiveNav);
window.addEventListener("load", updateActiveNav);

// ========== 6. SCROLL REVEAL ANIMATION ==========
const revealElements = document.querySelectorAll(".scroll-reveal");

function checkScrollReveal() {
    if (!revealElements.length) return;
    
    const windowHeight = window.innerHeight;
    const revealThreshold = 100;

    revealElements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        if (elementTop < windowHeight - revealThreshold) {
            element.classList.add("revealed");
        }
    });
}

window.addEventListener("scroll", checkScrollReveal);
window.addEventListener("load", checkScrollReveal);

// ========== 7. SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function(e) {
        const targetId = this.getAttribute("href");
        if (targetId === "#" || targetId === "#home") {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
            return;
        }
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            e.preventDefault();
            targetElement.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });
        }
    });
});

// ========== 8. AUTO-UPDATE FOOTER YEAR ==========
const yearSpan = document.getElementById("currentYear");
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// ========== 9. DEPARTMENT PAGE FORM HANDLERS ==========
// Check if we're on a department page with a join form
const mentorshipForm = document.getElementById("mentorshipForm");
if (mentorshipForm) {
    mentorshipForm.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Application submitted! Our team will contact you within 3 days.");
        this.reset();
    });
}

const missionsForm = document.getElementById("missionsJoinForm");
if (missionsForm) {
    missionsForm.addEventListener("submit", function(e) {
        e.preventDefault();
        alert("Thank you for your interest! We will contact you soon.");
        this.reset();
    });
}

// ========== 10. IMAGE FALLBACK HANDLER ==========
// Prevent broken images from showing ugly icons
document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", function() {
        // Don't replace with default if it's already trying to load a fallback
        if (!this.src.includes("placeholder")) {
            console.log("Image failed to load:", this.src);
            // Optional: set a placeholder color instead of broken icon
            this.style.backgroundColor = "rgba(201, 160, 61, 0.2";
            this.style.minHeight = "100px";
        }
    });
});

// ========== 11. VIDEO GALLERY PLACEHOLDER (for Media page) ==========
// Replace YouTube embed placeholders with actual videos if needed
const youtubeIframes = document.querySelectorAll('iframe[src*="VIDEO_ID"]');
youtubeIframes.forEach(iframe => {
    // This is just a placeholder - you can replace with actual video IDs
    console.log("Please replace VIDEO_ID with actual YouTube video IDs in Media page");
});

// ========== 12. PAGE LOAD COMPLETE ==========
console.log("Kingdom Network Global - Website loaded successfully");