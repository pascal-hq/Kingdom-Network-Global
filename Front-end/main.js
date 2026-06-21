// ========================================
// KINGDOM NETWORK GLOBAL - MAIN JS
// All Features: Hamburger | Slider | Bible API | Scroll Effects
// ========================================

// ========== API CONFIGURATION ==========
//const API_BASE = 'http://127.0.0.1:8000/api';
const API_BASE = 'https://kingdom-network-global.onrender.com/api';

// ========== HELPER FUNCTIONS ==========
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
}

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

// ========== 3. DAILY VERSE (Local Only - No API) ==========
const verseTextEl = document.querySelector(".verse-text");
const verseRefEl = document.querySelector(".verse-ref");

// Pre-defined verses
const localVerses = [
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
    return localVerses[dayOfYear % localVerses.length];
}

function displayDailyVerse() {
    if (!verseTextEl || !verseRefEl) return;
    
    const verse = getVerseOfTheDay();
    verseTextEl.textContent = verse.text;
    verseRefEl.textContent = verse.ref;
    console.log('📖 Daily verse loaded:', verse.ref);
}

// Display verse immediately
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

// ========== 9. LOAD MINISTRY SETTINGS ==========
async function loadMinistrySettings() {
    try {
        const response = await fetch(`${API_BASE}/public/settings/`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const data = await response.json();
        
        const pillarRevelation = document.getElementById('pillarRevelation');
        const pillarManifestation = document.getElementById('pillarManifestation');
        const pillarExperience = document.getElementById('pillarExperience');
        
        if (pillarRevelation && data.pillar_revelation) pillarRevelation.textContent = data.pillar_revelation;
        if (pillarManifestation && data.pillar_manifestation) pillarManifestation.textContent = data.pillar_manifestation;
        if (pillarExperience && data.pillar_experience) pillarExperience.textContent = data.pillar_experience;
    } catch (error) {
        console.error('Failed to load ministry settings:', error);
    }
}

// ========== 10. LOAD EVENTS (with retry) ==========
async function loadEvents(retryCount = 0) {
    const eventsContainer = document.getElementById('upcomingEvents');
    if (!eventsContainer) return;
    
    eventsContainer.innerHTML = '<div class="loading">Loading events...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/public/events/`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const events = await response.json();
        
        if (events.length === 0) {
            eventsContainer.innerHTML = '<div class="empty-state">No upcoming events. Check back soon!</div>';
            return;
        }
        
        const today = new Date().toISOString().split('T')[0];
        const upcomingEvents = events.filter(event => event.date >= today).slice(0, 6);
        
        if (upcomingEvents.length === 0) {
            eventsContainer.innerHTML = '<div class="empty-state">No upcoming events. Check back soon!</div>';
            return;
        }
        
        eventsContainer.innerHTML = upcomingEvents.map(event => `
            <div class="event-card-mini">
                <div class="event-date-mini">📅 ${formatDate(event.date)}</div>
                <div class="event-title-mini">${escapeHtml(event.title)}</div>
                <div class="event-location-mini">📍 ${escapeHtml(event.location)}</div>
                ${event.description ? `<div class="event-desc-mini">${escapeHtml(event.description.substring(0, 100))}${event.description.length > 100 ? '...' : ''}</div>` : ''}
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Failed to load events:', error);
        
        if (retryCount < 3) {
            const delay = 1000 * Math.pow(2, retryCount);
            console.log(`Retrying events... attempt ${retryCount + 1} in ${delay}ms`);
            setTimeout(() => loadEvents(retryCount + 1), delay);
        } else {
            eventsContainer.innerHTML = `
                <div class="empty-state">
                    Unable to load events.
                    <button onclick="loadEvents()" class="btn-retry">Retry</button>
                </div>
            `;
        }
    }
}

// ========== 11. LOAD DEPARTMENTS (with retry) ==========
async function loadDepartments(retryCount = 0) {
    const container = document.getElementById('departmentsContainer');
    if (!container) return;
    
    container.innerHTML = '<div class="loading">Loading departments...</div>';
    
    try {
        const response = await fetch(`${API_BASE}/public/content/`);
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const departments = await response.json();
        
        if (departments.length === 0) {
            container.innerHTML = '<div class="empty-state">No departments found</div>';
            return;
        }
        
        departments.sort((a, b) => a.order - b.order);
        
        container.innerHTML = departments.map(dept => `
            <div class="department-card scroll-reveal">
                <div class="department-frame">
                    <div class="department-image">
                        <img src="images/${dept.key}.webp" alt="${dept.name} Department" onerror="this.onerror=null; this.src='images/placeholder.jpg'">
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
        `).join('');
        
        // Force reveal after loading
        setTimeout(() => {
            document.querySelectorAll('.scroll-reveal').forEach(el => {
                el.classList.add('revealed');
            });
        }, 100);
        
    } catch (error) {
        console.error('Failed to load departments:', error);
        
        if (retryCount < 3) {
            const delay = 1000 * Math.pow(2, retryCount);
            console.log(`Retrying departments... attempt ${retryCount + 1} in ${delay}ms`);
            setTimeout(() => loadDepartments(retryCount + 1), delay);
        } else {
            container.innerHTML = `
                <div class="empty-state">
                    Unable to load departments.
                    <button onclick="loadDepartments()" class="btn-retry">Retry</button>
                </div>
            `;
        }
    }
}

// ========== 12. PRAYER FORM ==========
function setupPrayerForm() {
    const prayerForm = document.getElementById('prayerForm');
    const successDiv = document.getElementById('prayerSuccess');
    
    if (!prayerForm) return;
    
    prayerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = {
            name: document.getElementById('prayerName')?.value || '',
            email: document.getElementById('prayerEmail')?.value || '',
            category: document.getElementById('prayerCategory')?.value || '',
            request: document.getElementById('prayerRequest')?.value || ''
        };
        
        const submitBtn = prayerForm.querySelector('button[type="submit"]');
        const originalText = submitBtn?.textContent || 'Submit';
        
        if (submitBtn) {
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;
        }
        
        try {
            const response = await fetch(`${API_BASE}/public/prayer/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            
            if (response.ok) {
                prayerForm.reset();
                if (successDiv) {
                    successDiv.classList.remove('hidden');
                    setTimeout(() => successDiv.classList.add('hidden'), 5000);
                }
                alert('✅ Prayer request submitted! Our team will pray for you.');
            } else {
                const error = await response.json();
                alert('❌ Failed to submit: ' + (error.error || 'Unknown error'));
            }
        } catch (error) {
            console.error('Prayer submission error:', error);
            alert('❌ Network error. Please try again.');
        } finally {
            if (submitBtn) {
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;
            }
        }
    });
}

// ========== 13. DEPARTMENT PAGE FORM HANDLERS ==========
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

// ========== 14. IMAGE FALLBACK HANDLER ==========
document.querySelectorAll("img").forEach(img => {
    img.addEventListener("error", function() {
        if (!this.src.includes("placeholder")) {
            console.log("Image failed to load:", this.src);
            this.style.backgroundColor = "rgba(201, 160, 61, 0.2)";
            this.style.minHeight = "100px";
        }
    });
});

// ========== 15. VIDEO GALLERY PLACEHOLDER ==========
const youtubeIframes = document.querySelectorAll('iframe[src*="VIDEO_ID"]');
youtubeIframes.forEach(iframe => {
    console.log("Please replace VIDEO_ID with actual YouTube video IDs in Media page");
});

// ========== 16. INITIALIZE EVERYTHING ==========
document.addEventListener('DOMContentLoaded', () => {
    // Load everything in parallel using Promise.allSettled
    Promise.allSettled([
        loadMinistrySettings(),
        loadEvents(),
        loadDepartments(),
        setupPrayerForm()
    ]).then(results => {
        results.forEach((result, index) => {
            if (result.status === 'rejected') {
                console.warn(`Feature ${index} failed to load:`, result.reason);
            }
        });
    });
    
    checkScrollReveal();
});

// ========== 17. PAGE LOAD COMPLETE ==========
console.log("Kingdom Network Global - Website loaded successfully");