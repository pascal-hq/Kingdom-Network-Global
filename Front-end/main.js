// ========================================
// KINGDOM NETWORK GLOBAL - MAIN JS
// All Features: Hamburger | Slider | Bible API | Scroll Effects | Departments
// ========================================

// ========== 1. HAMBURGER MENU ==========
const hamburger = document.getElementById("hamburger");
const navMenu = document.getElementById("nav-menu");

if (hamburger && navMenu) {
    hamburger.addEventListener("click", () => {
        navMenu.classList.toggle("active");
        hamburger.classList.toggle("active");
    });

    document.querySelectorAll(".nav a").forEach(link => {
        link.addEventListener("click", () => {
            navMenu.classList.remove("active");
            hamburger.classList.remove("active");
        });
    });
}

// ========== 2. HERO IMAGE SLIDER ==========
// Scoped to the hero's own .image-slider so it can never collide with the
// About section's slider markup elsewhere on the page.
const heroSliderRoot = document.querySelector(".image-slider");
const sliderTrack = heroSliderRoot ? heroSliderRoot.querySelector(".slider-track") : null;
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

if (sliderImages.length) {
    showImage(activeIndex);
    startSlider();

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
            startSlider();
        });

        sliderContainer.addEventListener("mouseenter", stopSlider);
        sliderContainer.addEventListener("mouseleave", startSlider);
    }
}

// ========== 3. DAILY VERSE ==========
const verseTextEl = document.querySelector(".verse-text");
const verseRefEl = document.querySelector(".verse-ref");

const verses = [
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
    return verses[dayOfYear % verses.length];
}

function displayDailyVerse() {
    if (!verseTextEl || !verseRefEl) return;
    const verse = getVerseOfTheDay();
    verseTextEl.textContent = verse.text;
    verseRefEl.textContent = verse.ref;
}

displayDailyVerse();

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
handleHeaderScroll();

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

// ========== 9. WHATSAPP CONTACT ==========
const WHATSAPP_NUMBER = '254718975808';

function openWhatsApp(message) {
    const encodedMessage = encodeURIComponent(message || 'Hello, I would like to join the team.');
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
}

// ========== 10. SETUP WHATSAPP APPLY BUTTONS ==========
function setupApplyButtons() {
    document.querySelectorAll('[data-whatsapp-apply]').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const message = this.getAttribute('data-message') || 'Hello, I would like to join the team.';
            openWhatsApp(message);
        });
    });
    
    document.querySelectorAll('.btn-talent').forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const role = this.closest('.talent-card')?.querySelector('h3')?.textContent || 'the team';
            const message = `Hello, I would like to apply for the ${role} position.`;
            openWhatsApp(message);
        });
    });
}

// ========== 11. LOAD DEPARTMENTS ==========
function loadDepartments() {
    const container = document.getElementById('departmentsContainer');
    if (!container) return;
    
    const departments = [
        {
            key: 'missions',
            name: 'Missions',
            description: 'Extending the Kingdom through outreach, evangelism, and community impact.',
            team_lead: 'Jack',
            order: 1,
            gallery: ['images/missions.webp']
        },
        {
            key: 'media',
            name: 'Media',
            description: 'Communicating revelation and testimony through digital platforms and creative expression.',
            team_lead: 'Derek',
            order: 2,
            gallery: ['images/media.webp']
        },
        {
            key: 'worship',
            name: 'Praise & Worship',
            description: 'Leading the ministry into tangible experiences of God\'s presence through worship.',
            team_lead: 'Stephanie',
            order: 3,
            gallery: ['images/worship.webp']
        },
        {
            key: 'mentorship',
            name: 'School of Mentorship',
            description: 'Building spiritual stamina through intentional teaching, discipleship, and mentorship.',
            team_lead: 'Michelle',
            order: 4,
            gallery: ['images/mentorship.webp']
        }
    ];

    departments.sort((a, b) => a.order - b.order);

    function escapeHtml(text) {
        if (!text) return '';
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    container.innerHTML = departments.map(dept => {
        const imageUrl = dept.gallery && dept.gallery.length > 0 
            ? dept.gallery[0] 
            : `images/${dept.key}.webp`;
        
        return `
            <div class="department-card scroll-reveal">
                <div class="department-frame">
                    <div class="department-image">
                        <img src="${imageUrl}" alt="${dept.name} Department" onerror="this.onerror=null; this.src='images/placeholder.jpg'">
                    </div>
                    <div class="department-body">
                        <h3>${escapeHtml(dept.name)}</h3>
                        <p>${escapeHtml(dept.description)}</p>
                        <h4>Team Lead</h4>
                        <p>${escapeHtml(dept.team_lead || 'TBA')}</p>
                        <a href="departments/${dept.key}.html" class="btn-more">
                            <span>More...</span>
                            <i class="fas fa-arrow-right"></i>
                        </a>
                    </div>
                </div>
            </div>
        `;
    }).join('');

    setTimeout(() => {
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            el.classList.add('revealed');
        });
    }, 100);
}

// ========== 12. WHATSAPP CONTACT FOR APPLY BUTTONS ==========
function applyNow(role) {
    const message = `Hello, I would like to apply for the ${role || 'team'} position.`;
    openWhatsApp(message);
}

// ========== 13. ABOUT PAGE IMAGE SLIDER (Mobile Only) ==========
// FIX: the track's class was renamed in the HTML from "slider-track" to
// "about-slider-track" so it no longer matches the hero slider's global
// ".slider-track img { opacity: 0 }" rule in styles.css. This IIFE is now
// the ONLY place this slider is initialized — the duplicate copy that used
// to live in an inline <script> at the bottom of index.html has been
// deleted, so there is exactly one autoplay interval and one set of dots.
(function() {
    const track = document.getElementById('aboutSliderTrack');
    const slides = track ? track.querySelectorAll('.slide') : [];
    const prevBtn = document.getElementById('aboutSliderPrev');
    const nextBtn = document.getElementById('aboutSliderNext');
    const dotsContainer = document.getElementById('aboutSliderDots');

    if (!track || slides.length === 0) {
        console.warn('About slider not initialized - no slides found');
        return;
    }

    let currentIndex = 0;

    // Create dots
    if (dotsContainer) {
        slides.forEach((_, index) => {
            const dot = document.createElement('button');
            dot.className = 'dot' + (index === 0 ? ' active' : '');
            dot.setAttribute('data-index', index);
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentIndex = index;
        track.style.transform = `translateX(-${currentIndex * 100}%)`;
        if (dotsContainer) {
            dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
                dot.classList.toggle('active', i === currentIndex);
            });
        }
    }

    function nextSlide() { goToSlide(currentIndex + 1); }
    function prevSlide() { goToSlide(currentIndex - 1); }

    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);

    // Auto-play
    let autoplayInterval;
    function startAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
        autoplayInterval = setInterval(nextSlide, 4000);
    }
    function stopAutoplay() {
        if (autoplayInterval) clearInterval(autoplayInterval);
    }

    // Only run autoplay on mobile
    function checkScreenSize() {
        if (window.innerWidth <= 768) {
            startAutoplay();
        } else {
            stopAutoplay();
        }
    }

    // Initial check
    checkScreenSize();

    // Pause on hover/touch
    const container = document.querySelector('.about-image-slider-mobile');
    if (container) {
        container.addEventListener('mouseenter', stopAutoplay);
        container.addEventListener('mouseleave', checkScreenSize);
        container.addEventListener('touchstart', stopAutoplay);
        container.addEventListener('touchend', () => {
            setTimeout(checkScreenSize, 3000);
        });
    }

    // Re-check on resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(checkScreenSize, 200);
    });

    // Initial render
    goToSlide(0);
})();

// ========== 14. INITIALIZE ==========
document.addEventListener('DOMContentLoaded', function() {
    loadDepartments();
    checkScrollReveal();
    setupApplyButtons();
    console.log('Kingdom Network Global - Website loaded successfully');
});

// ========== 15. IMAGE FALLBACK HANDLER ==========
document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", function() {
        if (!this.src.includes("placeholder")) {
            console.log("Image failed to load:", this.src);
            this.style.backgroundColor = "rgba(201, 160, 61, 0.2)";
            this.style.minHeight = "100px";
        }
    });
});