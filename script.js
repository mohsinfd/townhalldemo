/* ==========================================
   BANKKARO EXECUTIVE DECK — JAVASCRIPT
   Lenis smooth scroll + snap navigation
   ========================================== */

// Initialize Lenis smooth scroll
const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    gestureOrientation: 'vertical',
    smoothWheel: true,
    wheelMultiplier: 1,
    touchMultiplier: 2,
    infinite: false,
});

// Animation frame loop for Lenis
function raf(time) {
    lenis.raf(time);
    requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Next button navigation
document.querySelectorAll('.next-btn').forEach(button => {
    button.addEventListener('click', () => {
        const targetId = button.getAttribute('data-target');
        const targetSection = document.getElementById(targetId);
        
        if (targetSection) {
            lenis.scrollTo(targetSection, {
                offset: 0,
                duration: 1.2,
            });
        }
    });
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const slides = document.querySelectorAll('.slide');
    const currentSlide = getCurrentSlide(slides);
    
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        const nextIndex = Math.min(currentSlide + 1, slides.length - 1);
        lenis.scrollTo(slides[nextIndex], { duration: 1.2 });
    }
    
    if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        const prevIndex = Math.max(currentSlide - 1, 0);
        lenis.scrollTo(slides[prevIndex], { duration: 1.2 });
    }
    
    // Number keys for direct navigation (1-5)
    if (e.key >= '1' && e.key <= '5') {
        const slideIndex = parseInt(e.key) - 1;
        if (slides[slideIndex]) {
            lenis.scrollTo(slides[slideIndex], { duration: 1.2 });
        }
    }
    
    // Home key - go to first slide
    if (e.key === 'Home') {
        e.preventDefault();
        lenis.scrollTo(slides[0], { duration: 1.2 });
    }
    
    // End key - go to last slide
    if (e.key === 'End') {
        e.preventDefault();
        lenis.scrollTo(slides[slides.length - 1], { duration: 1.2 });
    }
});

// Helper: Get current visible slide index
function getCurrentSlide(slides) {
    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;
    
    for (let i = 0; i < slides.length; i++) {
        const slideTop = slides[i].offsetTop;
        const slideBottom = slideTop + slides[i].offsetHeight;
        
        if (scrollY >= slideTop - windowHeight / 2 && scrollY < slideBottom - windowHeight / 2) {
            return i;
        }
    }
    return 0;
}

// Optional: Auto-loop mode for passive viewing
let autoLoopInterval = null;
const AUTO_LOOP_DELAY = 10000; // 10 seconds per slide

function startAutoLoop() {
    const slides = document.querySelectorAll('.slide');
    let currentIndex = 0;
    
    autoLoopInterval = setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        lenis.scrollTo(slides[currentIndex], { duration: 1.2 });
    }, AUTO_LOOP_DELAY);
}

function stopAutoLoop() {
    if (autoLoopInterval) {
        clearInterval(autoLoopInterval);
        autoLoopInterval = null;
    }
}

// Press 'L' to toggle auto-loop
document.addEventListener('keydown', (e) => {
    if (e.key === 'l' || e.key === 'L') {
        if (autoLoopInterval) {
            stopAutoLoop();
            console.log('Auto-loop stopped');
        } else {
            startAutoLoop();
            console.log('Auto-loop started (10s per slide)');
        }
    }
});

// Stop auto-loop on manual interaction
['wheel', 'touchstart', 'click'].forEach(event => {
    document.addEventListener(event, () => {
        if (autoLoopInterval) {
            stopAutoLoop();
            console.log('Auto-loop stopped (manual navigation detected)');
        }
    }, { passive: true });
});

// Log ready state
console.log('BankKaro Executive Deck loaded');
console.log('Keyboard shortcuts:');
console.log('  ↓/↑ or Space/PageDown/PageUp - Navigate slides');
console.log('  1-5 - Jump to specific slide');
console.log('  Home/End - First/Last slide');
console.log('  L - Toggle auto-loop mode');
