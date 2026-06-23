// Particles Background Canvas (Multi-colored dots for light mode)
class ParticleSystem {
    constructor() {
        this.canvas = document.getElementById('particles-canvas');
        if (!this.canvas) return;
        this.ctx = this.canvas.getContext('2d');
        this.particles = [];
        this.connectionDistance = 110;
        this.mouse = { x: null, y: null, radius: 140 };
        this.colors = [
            'rgba(139, 92, 246, 0.25)', // Violet
            'rgba(59, 130, 246, 0.25)',  // Blue
            'rgba(6, 182, 212, 0.25)'   // Cyan
        ];

        this.init();
        this.animate();
        this.setupEvents();
    }

    init() {
        this.resize();
        this.particles = [];
        const count = Math.min(Math.floor((this.canvas.width * this.canvas.height) / 14000), 80);
        
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 3 + 1.5,
                color: this.colors[Math.floor(Math.random() * this.colors.length)]
            });
        }
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    setupEvents() {
        window.addEventListener('resize', () => {
            this.resize();
            this.init();
        });

        window.addEventListener('mousemove', (e) => {
            this.mouse.x = e.clientX;
            this.mouse.y = e.clientY;
        });

        window.addEventListener('mouseout', () => {
            this.mouse.x = null;
            this.mouse.y = null;
        });
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        for (let i = 0; i < this.particles.length; i++) {
            const p1 = this.particles[i];
            
            for (let j = i + 1; j < this.particles.length; j++) {
                const p2 = this.particles[j];
                const dx = p1.x - p2.x;
                const dy = p1.y - p2.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < this.connectionDistance) {
                    const alpha = (1 - dist / this.connectionDistance) * 0.12;
                    this.ctx.strokeStyle = `rgba(139, 92, 246, ${alpha})`;
                    this.ctx.lineWidth = 0.8;
                    this.ctx.beginPath();
                    this.ctx.moveTo(p1.x, p1.y);
                    this.ctx.lineTo(p2.x, p2.y);
                    this.ctx.stroke();
                }
            }

            // Draw particle
            this.ctx.fillStyle = p1.color;
            this.ctx.beginPath();
            this.ctx.arc(p1.x, p1.y, p1.radius, 0, Math.PI * 2);
            this.ctx.fill();

            // Hover deflection
            if (this.mouse.x !== null) {
                const mDx = p1.x - this.mouse.x;
                const mDy = p1.y - this.mouse.y;
                const mDist = Math.sqrt(mDx * mDx + mDy * mDy);
                if (mDist < this.mouse.radius) {
                    const force = (this.mouse.radius - mDist) / this.mouse.radius;
                    p1.x += (mDx / mDist) * force * 1.5;
                    p1.y += (mDy / mDist) * force * 1.5;
                }
            }

            // Move particle
            p1.x += p1.vx;
            p1.y += p1.vy;

            // Boundary wrap around
            if (p1.x < 0) p1.x = this.canvas.width;
            if (p1.x > this.canvas.width) p1.x = 0;
            if (p1.y < 0) p1.y = this.canvas.height;
            if (p1.y > this.canvas.height) p1.y = 0;
        }
    }

    animate() {
        this.draw();
        requestAnimationFrame(() => this.animate());
    }
}

// Typing Animation
class Typewriter {
    constructor(elementId, words, speed = 80, delay = 1500) {
        this.element = document.getElementById(elementId);
        if (!this.element) return;
        this.words = words;
        this.speed = speed;
        this.delay = delay;
        this.wordIndex = 0;
        this.txt = '';
        this.isDeleting = false;
        
        this.tick();
    }

    tick() {
        const currentWord = this.words[this.wordIndex];
        
        if (this.isDeleting) {
            this.txt = currentWord.substring(0, this.txt.length - 1);
        } else {
            this.txt = currentWord.substring(0, this.txt.length + 1);
        }

        this.element.innerHTML = this.txt;

        let typeSpeed = this.speed;

        if (this.isDeleting) {
            typeSpeed /= 2;
        }

        if (!this.isDeleting && this.txt === currentWord) {
            typeSpeed = this.delay;
            this.isDeleting = true;
        } else if (this.isDeleting && this.txt === '') {
            this.isDeleting = false;
            this.wordIndex = (this.wordIndex + 1) % this.words.length;
            typeSpeed = 500;
        }

        setTimeout(() => this.tick(), typeSpeed);
    }
}

// Interactive AI Assistant Welcome Widget
class AIAssistant {
    constructor() {
        this.chatBox = document.getElementById('ai-chat-box');
        this.optionsContainer = document.getElementById('ai-options');
        if (!this.chatBox || !this.optionsContainer) return;

        this.responses = {
            projects: {
                question: "What projects have you built?",
                answer: "I've engineered 🌍 **Heat Transfer Visualizer** (2D thermodynamics tool), 🪐 **VoiceNoteFlow** (Speech transcribing agent in Streamlit), and 🌎 **Task Scheduler** (Python + SQLite organizer). Scroll to the Projects section to see details!"
            },
            skills: {
                question: "What are your skills?",
                answer: "I specialize in **Python (90%)**, **AI / ML model structures (85%)**, and **Prompt Engineering (90%)**. I also write **Java (80%)** and develop **Web frameworks (70%)**."
            },
            learning: {
                question: "What are you studying right now?",
                answer: "Currently, I'm focusing on **Data Structures & Algorithms (DSA)**, theoretical **Machine Learning**, **Large Language Models (LLMs)**, and building Prompt templates."
            },
            certs: {
                question: "Do you have certifications?",
                answer: "Yes! I hold **Oracle OCI Generative AI Professional** and **OCI Data Science Professional** credentials. I also completed **IBM Machine Learning** and **Coursera AI & ML** certificates."
            }
        };

        this.setupEvents();
    }

    setupEvents() {
        this.optionsContainer.addEventListener('click', (e) => {
            const chip = e.target.closest('.option-chip');
            if (!chip) return;

            const key = chip.getAttribute('data-ask');
            if (this.responses[key]) {
                this.handleUserInteraction(this.responses[key]);
            }
        });
    }

    handleUserInteraction(qaPair) {
        // 1. Add User Bubble
        this.addBubble(qaPair.question, 'user');
        
        // Hide options temporarily to prevent spamming
        this.optionsContainer.style.pointerEvents = 'none';
        this.optionsContainer.style.opacity = '0.5';

        // 2. Add Assistant Thinking Bubble
        setTimeout(() => {
            const thinkingBubble = this.addBubble('Thinking...', 'assistant thinking-bubble');
            
            // 3. Replace Thinking with Actual Answer
            setTimeout(() => {
                thinkingBubble.querySelector('.bubble-content').innerHTML = this.formatResponse(qaPair.answer);
                thinkingBubble.classList.remove('thinking-bubble');
                this.chatBox.scrollTop = this.chatBox.scrollHeight;
                
                // Re-enable options
                this.optionsContainer.style.pointerEvents = 'auto';
                this.optionsContainer.style.opacity = '1';
            }, 700);

        }, 400);
    }

    addBubble(text, sender) {
        const bubble = document.createElement('div');
        bubble.className = `chat-bubble ${sender}`;
        
        const isUser = sender === 'user';
        const avatarIcon = isUser ? 'fa-user' : 'fa-robot';
        
        bubble.innerHTML = `
            <div class="bubble-avatar"><i class="fa-solid ${avatarIcon}"></i></div>
            <div class="bubble-content">${text}</div>
        `;
        
        this.chatBox.appendChild(bubble);
        this.chatBox.scrollTop = this.chatBox.scrollHeight;
        return bubble;
    }

    formatResponse(text) {
        // Convert simple markdown-like **bold** in string to HTML
        return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    }
}

// Simulated Terminal Shell
class InteractiveTerminal {
    constructor() {
        this.input = document.getElementById('term-input');
        this.body = document.getElementById('term-body');
        if (!this.input || !this.body) return;
        
        this.setupEvents();
        this.focusInput();
    }

    setupEvents() {
        this.body.addEventListener('click', () => this.focusInput());
        
        this.input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const cmd = this.input.value.trim().toLowerCase();
                this.executeCommand(cmd);
                this.input.value = '';
            }
        });

        document.querySelectorAll('.terminal-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.stopPropagation();
                const cmd = link.getAttribute('data-cmd');
                this.input.value = cmd;
                this.executeCommand(cmd);
                this.input.value = '';
            });
        });
    }

    focusInput() {
        this.input.focus();
    }

    executeCommand(cmd) {
        if (!cmd) return;

        const pLine = document.createElement('div');
        pLine.className = 'terminal-input-line';
        pLine.innerHTML = `<span class="terminal-prompt">dhanyashree@shell:~$</span> <span>${cmd}</span>`;
        this.body.appendChild(pLine);

        let output = '';

        switch (cmd) {
            case 'help':
                output = `Available Commands:
  about    - Details about me
  skills   - Core technical competencies
  projects - Portfolio of highlighted projects
  timeline - Professional and educational milestones
  mission  - Current focus, learning, and targets
  contact  - Reach out or connect
  clear    - Clear terminal logs
  help     - Show this help menu`;
                break;
            case 'about':
                output = `Dhanyashree S - Computer Science and Engineering Student
--------------------------------------------------------------
Enthusiastic developer building the future as an AI/ML Engineer.
Deeply passionate about Generative AI, prompt workflows, 
and practical problem-solving.

University: KGiSL Institute of Technology
Location: Coimbatore, Tamil Nadu`;
                break;
            case 'skills':
                output = `Technical Proficiencies:
--------------------------------
- Python           [█████████ ] 90%
- AI/ML            [████████  ] 85%
- Prompt Engg      [█████████ ] 90%
- Java             [████████  ] 80%
- Web Dev          [███████   ] 70%

Current Learning Core: DSA, Deep Learning, Large Language Models (LLMs)`;
                break;
            case 'projects':
                output = `Highlighted Projects:
--------------------------------
🌍 Heat Transfer Visualizer
  └ Visualize heat distribution dynamics using NumPy & Matplotlib
🪐 VoiceNoteFlow
  └ Audio-to-structured text notes app built with Speech Recognition & Streamlit
🌎 Task Scheduler
  └ Activity planner and organizer backed by SQLite database`;
                break;
            case 'timeline':
                output = `🚀 My AI Journey
--------------------------------
2024          -> 🎓 Started B.E CSE at KGiSL Institute of Technology
2025 (Early)  -> 🐍 Learned Python Programming & 💻 started building software projects
2025 (Mid)    -> 🗣️ Built VoiceNoteFlow & 📅 Developed Task Scheduler
2025 (Late)   -> 🏆 Oracle Generative AI & OCI Data Science Professional certifications
2026          -> 🤖 Entered Prompt Engineering & 💼 joined ATS as Intern
2026-Present  -> 📚 Learning ML, Deep Learning, & practicing DSA
2027 (Target) -> 🎯 Build impactful projects & participate in hackathons/AI competitions
2028 (Target) -> 🎓 Graduate as an AI&ML Engineer

Future Goal 🚀: Become an AI/ML Engineer, work on LLMs, and build real-world AI solutions.`;
                break;
            case 'mission':
                output = `Current Directives:
--------------------------------
Mission: Become an industry-grade AI Engineer.
Learning focus: Data Structures & Algorithms, Machine Learning theory, LLMs.
Next Target: Engage in research and industry scale projects.`;
                break;
            case 'contact':
                output = `Contact Information:
--------------------------------
📞 Phone: 9942480018
📧 Email: dhanyashree316@gmail.com
📍 Location: Coimbatore, Tamil Nadu
🔗 LinkedIn: https://www.linkedin.com/in/dhanyashree-s-38b940314/
🐙 GitHub: https://github.com/Dhanyashree06`;
                break;
            case 'clear':
                this.body.innerHTML = `
                    <div class="terminal-welcome">
                        Welcome to Dhanyashree's Interactive Shell v1.0.0.
                        Type <span style="color: #7c3aed;">help</span> or click shortcut options.
                    </div>
                `;
                this.focusInput();
                return;
            default:
                output = `Command not found: '${cmd}'. Type 'help' for options.`;
                break;
        }

        if (output) {
            const outDiv = document.createElement('div');
            outDiv.className = 'terminal-output';
            outDiv.innerText = output;
            this.body.appendChild(outDiv);
        }

        this.body.scrollTop = this.body.scrollHeight;
    }
}

// Scroll and Reveal Observer
function setupRevealObserver() {
    const reveals = document.querySelectorAll('.reveal');
    const skillFills = document.querySelectorAll('.skill-bar-fill');

    const observerOptions = {
        root: null,
        threshold: 0.1,
        rootMargin: '0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // If it is the skills container, trigger progress bar animation
                if (entry.target.id === 'skills') {
                    skillFills.forEach(fill => {
                        const targetWidth = fill.getAttribute('data-percentage') || '0%';
                        fill.style.width = targetWidth;
                    });
                }
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => observer.observe(reveal));
}

// Mobile Menu Navigation
function setupMobileMenu() {
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('nav');
    
    if (hamburger && nav) {
        hamburger.addEventListener('click', () => {
            nav.classList.toggle('active');
            hamburger.classList.toggle('active');
        });

        document.querySelectorAll('nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('active');
                hamburger.classList.remove('active');
            });
        });
    }
}

// Contact Form Handler
function setupContactForm() {
    const form = document.getElementById('contact-form');
    const toast = document.getElementById('contact-toast');
    const toastIcon = document.getElementById('contact-toast-icon');
    const toastMsg = document.getElementById('contact-toast-msg');
    const submitBtn = document.getElementById('contact-submit-btn');

    if (!form) return;

    function showToast(success, message) {
        toast.className = 'contact-toast ' + (success ? 'toast-success' : 'toast-error');
        toastIcon.innerHTML = success
            ? '<i class="fa-solid fa-circle-check"></i>'
            : '<i class="fa-solid fa-circle-exclamation"></i>';
        toastMsg.textContent = message;
        toast.classList.add('show');
        setTimeout(() => toast.classList.remove('show'), 4000);
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const name    = document.getElementById('form-name').value.trim();
        const email   = document.getElementById('form-email').value.trim();
        const message = document.getElementById('form-message').value.trim();

        // Basic validation
        if (!name) {
            showToast(false, 'Please enter your name.');
            document.getElementById('form-name').focus();
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            showToast(false, 'Please enter a valid email address.');
            document.getElementById('form-email').focus();
            return;
        }

        if (!message) {
            showToast(false, 'Please enter a message.');
            document.getElementById('form-message').focus();
            return;
        }

        // Disable button while "sending"
        submitBtn.disabled = true;
        submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-spinner fa-spin"></i>';

        // Open default mail client with pre-filled content
        const subject = encodeURIComponent(`Portfolio Message from ${name}`);
        const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);
        const mailtoLink = `mailto:dhanyashree316@gmail.com?subject=${subject}&body=${body}`;

        // Small delay for UX feel, then open mailto
        setTimeout(() => {
            window.location.href = mailtoLink;

            // Reset form & button
            form.reset();
            submitBtn.disabled = false;
            submitBtn.innerHTML = 'Send Message <i class="fa-regular fa-paper-plane"></i>';

            showToast(true, 'Opening your mail client — thanks for reaching out, ' + name + '! 🎉');
        }, 800);
    });
}

// Initialize on DOM Load
document.addEventListener('DOMContentLoaded', () => {
    new ParticleSystem();
    new Typewriter('typewriter', [
        'Dhanyashree AI Lab 🧠',
        'Future AI Engineer 🚀',
        'Prompt Engineering Specialist 🪐',
        'Computer Science Innovator 🎓'
    ]);
    new AIAssistant();
    new InteractiveTerminal();
    setupRevealObserver();
    setupMobileMenu();
    setupContactForm();
});
