// Custom Cursor
const cursor = document.querySelector('.custom-cursor');
const cursorFollower = document.querySelector('.custom-cursor-follower');
const interactiveElements = document.querySelectorAll('a, button, .interactive, .project-card, .glass-card');

document.addEventListener('mousemove', (e) => {
    // Basic cursor movement
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
    
    // Follower has a slight delay
    setTimeout(() => {
        cursorFollower.style.left = e.clientX + 'px';
        cursorFollower.style.top = e.clientY + 'px';
    }, 50);
});

interactiveElements.forEach(el => {
    el.addEventListener('mouseenter', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursor.style.backgroundColor = 'var(--accent-2)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1.5)';
        cursorFollower.style.borderColor = 'var(--accent-2)';
    });
    
    el.addEventListener('mouseleave', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.backgroundColor = 'var(--accent-1)';
        cursorFollower.style.transform = 'translate(-50%, -50%) scale(1)';
        cursorFollower.style.borderColor = 'var(--accent-1)';
    });
});

// Mobile Nav Menu
const mobileBtn = document.querySelector('.mobile-menu-btn');
const navItems = document.querySelector('.nav-items');
const navLinks = document.querySelectorAll('.nav-item');

mobileBtn.addEventListener('click', () => {
    mobileBtn.classList.toggle('active');
    navItems.classList.toggle('active');
});

navLinks.forEach(link => {
    link.addEventListener('click', () => {
        mobileBtn.classList.remove('active');
        navItems.classList.remove('active');
    });
});

// Scroll Reveal with Intersection Observer
const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.15
};

const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if(entry.isIntersecting) {
            entry.target.classList.add('show');
            // Optional: stop observing once revealed
            // observer.unobserve(entry.target); 
        } else {
            // Optional: reset animation when scrolling away
            entry.target.classList.remove('show');
        }
    });
}, observerOptions);

document.querySelectorAll('.hidden').forEach((element) => {
    observer.observe(element);
});

// Typing Text Effect for Subtitle
const typingText = document.querySelector('.typing-text');
const originalText = typingText.textContent;
typingText.textContent = '';
let charIndex = 0;

function type() {
    if (charIndex < originalText.length) {
        typingText.textContent += originalText.charAt(charIndex);
        charIndex++;
        setTimeout(type, 80);
    }
}
// Start typing after a short delay
setTimeout(type, 1000);


// Theme Toggler
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');

// Check saved theme
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.documentElement.classList.add('light-mode');
    themeIcon.setAttribute('name', 'moon-outline');
}

themeToggleBtn.addEventListener('click', () => {
    document.documentElement.classList.toggle('light-mode');
    const isLight = document.documentElement.classList.contains('light-mode');
    
    if (isLight) {
        themeIcon.setAttribute('name', 'moon-outline');
        localStorage.setItem('theme', 'light');
    } else {
        themeIcon.setAttribute('name', 'sunny-outline');
        localStorage.setItem('theme', 'dark');
    }
    updateCanvasColors();
});

// Neural Network Canvas Background
const canvas = document.getElementById('neural-canvas');
const ctx = canvas.getContext('2d');

let width, height;
let particles = [];
const connectionDistance = 120;
const particleCount = 80;

let accent1Str = '0, 243, 255';
let accent2Str = '138, 43, 226';

function updateCanvasColors() {
    if (document.documentElement.classList.contains('light-mode')) {
        accent1Str = '14, 165, 233';
        accent2Str = '124, 58, 237';
    } else {
        accent1Str = '0, 243, 255';
        accent2Str = '138, 43, 226';
    }
}
updateCanvasColors();

function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

class Particle {
    constructor() {
        this.x = Math.random() * width;
        this.y = Math.random() * height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.radius = Math.random() * 2 + 1;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > width) this.vx *= -1;
        if (this.y < 0 || this.y > height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${accent1Str}, 0.5)`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle());
    }
}

function connectParticles() {
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < connectionDistance) {
                const opacity = 1 - (distance / connectionDistance);
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(${accent2Str}, ${opacity * 0.2})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        }
    }
}

let mouseX = 0;
let mouseY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function drawMouseConnections() {
    particles.forEach(p => {
        const dx = mouseX - p.x;
        const dy = mouseY - p.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 150) {
            const opacity = 1 - (distance / 150);
            ctx.beginPath();
            ctx.moveTo(mouseX, mouseY);
            ctx.lineTo(p.x, p.y);
            ctx.strokeStyle = `rgba(${accent1Str}, ${opacity * 0.5})`;
            ctx.lineWidth = 1;
            ctx.stroke();
        }
    });
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach(p => {
        p.update();
        p.draw();
    });

    connectParticles();
    drawMouseConnections();

    requestAnimationFrame(animate);
}

initParticles();
animate();

// Active nav link highlight on scroll
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
    let current = '';
    
    sections.forEach(section => {
        const rect = section.getBoundingClientRect();
        // Section is considered active if its top is near or above the navbar 
        // AND its bottom is below the navbar
        if(rect.top <= 250 && rect.bottom >= 250) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if(current && link.getAttribute('href').includes(current)){
            link.classList.add('active');
        }
    });
});
