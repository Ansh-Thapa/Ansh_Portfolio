/* ============================================
   Portfolio — Ansh Thapa
   Interactive JavaScript
   ============================================ */

// ─── DOM Elements ────────────────────────────
const cursorDot = document.getElementById('cursorDot');
const particleCanvas = document.getElementById('particleCanvas');
const navbar = document.getElementById('navbar');
const themeToggle = document.getElementById('themeToggle');
const mobileMenuBtn = document.getElementById('mobileMenuBtn');
const navLinks = document.getElementById('navLinks');
const contactForm = document.getElementById('contactForm');
const typingText = document.getElementById('typingText');
const githubChart = document.getElementById('githubChart');
const currentYearSpan = document.getElementById('currentYear');

// ─── Initialize ─────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
    setupCustomCursor();
    setupParticles();
    setupThemeToggle();
    setupMobileMenu();
    setupScrollEffects();
    setupActiveNavLink();
    setupTypingEffect();
    setupScrollReveal();
    setupContactForm();
    fetchGitHubStats();
    setCurrentYear();
});

// ═══════════════════════════════════════════
// 🎯 Custom Cursor Dot (smooth delayed trail)
// ═══════════════════════════════════════════
function setupCustomCursor() {
    if (window.innerWidth <= 768) {
        if (cursorDot) cursorDot.style.display = 'none';
        return;
    }

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
    });

    // Smooth lerp animation — the dot trails behind with a delay
    function animateDot() {
        // Lerp factor: lower = more delay/smoother trailing
        const ease = 0.08;
        dotX += (mouseX - dotX) * ease;
        dotY += (mouseY - dotY) * ease;

        cursorDot.style.left = dotX + 'px';
        cursorDot.style.top = dotY + 'px';
        requestAnimationFrame(animateDot);
    }
    animateDot();

    // Grow dot slightly on interactive elements
    const hoverTargets = document.querySelectorAll('a, button, input, textarea, .project-card, .glass-card');
    hoverTargets.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursorDot.style.width = '22px';
            cursorDot.style.height = '22px';
            cursorDot.style.background = '#c084fc';
            cursorDot.style.boxShadow = '0 0 25px rgba(192, 132, 252, 0.7), 0 0 8px rgba(192, 132, 252, 0.9)';
        });
        el.addEventListener('mouseleave', () => {
            cursorDot.style.width = '14px';
            cursorDot.style.height = '14px';
            cursorDot.style.background = '';
            cursorDot.style.boxShadow = '';
        });
    });

    // Hide dot when leaving window
    document.addEventListener('mouseleave', () => {
        cursorDot.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursorDot.style.opacity = '1';
    });
}

// ═══════════════════════════════════════════
// ✨ Particle Background
// ═══════════════════════════════════════════
function setupParticles() {
    const ctx = particleCanvas.getContext('2d');
    let particles = [];
    let animationId;

    function resize() {
        particleCanvas.width = window.innerWidth;
        particleCanvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', () => {
        resize();
        createParticles();
    });

    class Particle {
        constructor() {
            this.reset();
            this.y = Math.random() * particleCanvas.height;
        }

        reset() {
            this.x = Math.random() * particleCanvas.width;
            this.y = -10;
            this.size = Math.random() * 2 + 0.5;
            this.speedY = Math.random() * 0.4 + 0.1;
            this.speedX = (Math.random() - 0.5) * 0.3;
            this.opacity = Math.random() * 0.5 + 0.1;
            this.opacityChange = (Math.random() - 0.5) * 0.005;
        }

        update() {
            this.y += this.speedY;
            this.x += this.speedX;
            this.opacity += this.opacityChange;

            // Bounce opacity
            if (this.opacity >= 0.6 || this.opacity <= 0.05) {
                this.opacityChange *= -1;
            }

            // Reset when off screen
            if (this.y > particleCanvas.height + 10) {
                this.reset();
            }
            if (this.x < -10 || this.x > particleCanvas.width + 10) {
                this.speedX *= -1;
            }
        }

        draw(ctx) {
            const isLight = document.documentElement.getAttribute('data-theme') === 'light';
            const color = isLight ? `108, 92, 231` : `108, 92, 231`;
            ctx.fillStyle = `rgba(${color}, ${this.opacity})`;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();

            // Connect nearby particles
            particles.forEach(p => {
                const dx = this.x - p.x;
                const dy = this.y - p.y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < 120) {
                    const alpha = (1 - dist / 120) * 0.08;
                    ctx.strokeStyle = `rgba(${color}, ${alpha})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(this.x, this.y);
                    ctx.lineTo(p.x, p.y);
                    ctx.stroke();
                }
            });
        }
    }

    function createParticles() {
        const count = Math.min(Math.floor(window.innerWidth * 0.05), 80);
        particles = [];
        for (let i = 0; i < count; i++) {
            particles.push(new Particle());
        }
    }
    createParticles();

    function animate() {
        ctx.clearRect(0, 0, particleCanvas.width, particleCanvas.height);
        particles.forEach(p => {
            p.update();
            p.draw(ctx);
        });
        animationId = requestAnimationFrame(animate);
    }
    animate();

    // Handle theme change for particles
    window.addEventListener('themeChanged', () => {
        // Particles will use current theme color on next frame
    });
}

// ═══════════════════════════════════════════
// 🌓 Theme Toggle (Light/Dark)
// ═══════════════════════════════════════════
function setupThemeToggle() {
    // Check saved preference
    const savedTheme = localStorage.getItem('theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);

    themeToggle.addEventListener('click', () => {
        const current = document.documentElement.getAttribute('data-theme');
        const next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        window.dispatchEvent(new Event('themeChanged'));
    });
}

// ═══════════════════════════════════════════
// 📱 Mobile Menu
// ═══════════════════════════════════════════
function setupMobileMenu() {
    mobileMenuBtn.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = mobileMenuBtn.querySelectorAll('span');
        if (navLinks.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close menu when clicking a link
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            const spans = mobileMenuBtn.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ═══════════════════════════════════════════
// 📜 Scroll Effects
// ═══════════════════════════════════════════
function setupScrollEffects() {
    window.addEventListener('scroll', () => {
        // Navbar background on scroll
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active nav link
        updateActiveNavLink();
    });
}

function setupActiveNavLink() {
    updateActiveNavLink();
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    const navLinksAll = document.querySelectorAll('.nav-link');
    let current = '';

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 120;
        if (window.scrollY >= sectionTop) {
            current = section.getAttribute('id');
        }
    });

    navLinksAll.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === '#' + current) {
            link.classList.add('active');
        }
    });
}

// ═══════════════════════════════════════════
// ⌨️ Typing Effect
// ═══════════════════════════════════════════
function setupTypingEffect() {
    const phrases = [
        'Full-Stack Developer',
        'AI & ML Enthusiast',
        'Problem Solver',
        'Lifelong Learner',
        'Tech Explorer'
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let isWaiting = false;

    function type() {
        const currentPhrase = phrases[phraseIndex];

        if (isDeleting) {
            typingText.textContent = currentPhrase.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingText.textContent = currentPhrase.substring(0, charIndex + 1);
            charIndex++;
        }

        let speed = isDeleting ? 40 : 80;

        if (!isDeleting && charIndex === currentPhrase.length) {
            // Finished typing - wait, then delete
            isWaiting = true;
            speed = 2000;
            setTimeout(() => {
                isDeleting = true;
                isWaiting = false;
                type();
            }, speed);
            return;
        }

        if (isDeleting && charIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % phrases.length;
            speed = 300;
        }

        if (!isWaiting) {
            setTimeout(type, speed);
        }
    }

    type();
}

// ═══════════════════════════════════════════
// 👁️ Scroll Reveal Animation
// ═══════════════════════════════════════════
function setupScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.section-title, .about-card, .skill-category, .project-card, ' +
        '.education-card, .timeline-item, .learning-card, .github-card, ' +
        '.contact-form, .contact-info, .certs-placeholder'
    );

    revealElements.forEach(el => {
        el.classList.add('reveal');
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
}

// ═══════════════════════════════════════════
// 📬 Contact Form
// ═══════════════════════════════════════════
function setupContactForm() {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const name = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const message = document.getElementById('message').value.trim();

        if (!name || !email || !message) {
            showFormMessage('Please fill in all fields.', 'error');
            return;
        }

        // Create mailto link as fallback
        const mailtoLink = `mailto:anshthapa97@gmail.com?subject=Portfolio Contact from ${encodeURIComponent(name)}&body=${encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\n\n' + message)}`;

        showFormMessage('Opening email client...', 'success');
        window.location.href = mailtoLink;

        contactForm.reset();
    });
}

function showFormMessage(msg, type) {
    // Remove existing message
    const existing = contactForm.querySelector('.form-message');
    if (existing) existing.remove();

    const messageEl = document.createElement('div');
    messageEl.className = `form-message form-${type}`;
    messageEl.textContent = msg;
    messageEl.style.cssText = `
        margin-top: 1rem;
        padding: 0.75rem 1rem;
        border-radius: var(--radius-sm);
        font-size: 0.88rem;
        font-weight: 500;
        animation: fadeInUp 0.3s ease;
        ${type === 'success'
            ? 'background: rgba(16, 185, 129, 0.1); color: #10b981; border: 1px solid rgba(16, 185, 129, 0.3);'
            : 'background: rgba(239, 68, 68, 0.1); color: #ef4444; border: 1px solid rgba(239, 68, 68, 0.3);'
        }
    `;
    contactForm.appendChild(messageEl);

    setTimeout(() => {
        if (messageEl) messageEl.remove();
    }, 5000);
}

// ═══════════════════════════════════════════
// 🐙 Fetch GitHub Stats
// ═══════════════════════════════════════════
async function fetchGitHubStats() {
    const ghRepos = document.getElementById('ghRepos');
    const ghStars = document.getElementById('ghStars');
    const ghLang = document.getElementById('ghLang');

    try {
        const response = await fetch('https://api.github.com/users/Ansh-Thapa/repos?per_page=100');
        if (!response.ok) throw new Error('Failed to fetch');

        const repos = await response.json();

        // Repo count
        ghRepos.textContent = repos.length;

        // Total stars
        const totalStars = repos.reduce((sum, repo) => sum + repo.stargazers_count, 0);
        ghStars.textContent = totalStars;

        // Languages used
        const languages = new Set();
        repos.forEach(repo => {
            if (repo.language) languages.add(repo.language);
        });
        ghLang.textContent = languages.size;

    } catch (err) {
        console.log('GitHub stats: Using fallback (API rate limited or offline)');
        ghRepos.textContent = '5+';
        ghStars.textContent = '—';
        ghLang.textContent = '5+';
    }
}

// ═══════════════════════════════════════════
// 📅 Current Year
// ═══════════════════════════════════════════
function setCurrentYear() {
    if (currentYearSpan) {
        currentYearSpan.textContent = new Date().getFullYear();
    }
}
