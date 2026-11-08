// Keep the current section visible in the navigation.
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        links.forEach((link) => {
            const isCurrent = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('active', isCurrent);
            if (isCurrent) link.setAttribute('aria-current', 'location');
            else link.removeAttribute('aria-current');
        });
    });
}, { rootMargin: '-25% 0px -65% 0px' });
sections.forEach((section) => sectionObserver.observe(section));

// Toggle and remember the site's color theme.
const themeToggle = document.getElementById('themeToggle');
const themeIcon = themeToggle.querySelector('i');

function setTheme(theme) {
    document.body.dataset.theme = theme;
    document.querySelector('meta[name="theme-color"]').content = theme === 'dark' ? '#080808' : '#f5f5f0';
    const switchTo = theme === 'dark' ? 'light' : 'dark';
    themeToggle.setAttribute('aria-label', `Switch to ${switchTo} theme`);
    themeToggle.setAttribute('title', `Switch to ${switchTo} theme`);
    themeIcon.className = `fa-solid ${theme === 'dark' ? 'fa-sun' : 'fa-moon'}`;
}

try {
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme === 'light' || savedTheme === 'dark') setTheme(savedTheme);
} catch (error) {
    // Keep the default dark theme if browser storage is unavailable.
}

themeToggle.addEventListener('click', () => {
    const nextTheme = document.body.dataset.theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    try {
        localStorage.setItem('portfolio-theme', nextTheme);
    } catch (error) {
        // The theme still changes for the current page session.
    }
});

// Brighten the dot pattern around a mouse or pen pointer.
const hero = document.querySelector('.hero');
hero.addEventListener('pointermove', (event) => {
    if (event.pointerType === 'touch') return;
    const bounds = hero.getBoundingClientRect();
    hero.style.setProperty('--pointer-x', `${event.clientX - bounds.left}px`);
    hero.style.setProperty('--pointer-y', `${event.clientY - bounds.top}px`);
});
hero.addEventListener('pointerleave', () => {
    hero.style.setProperty('--pointer-x', '-500px');
    hero.style.setProperty('--pointer-y', '-500px');
});

// Contact form -> opens the visitor's email app with everything pre-filled
const MY_EMAIL = 'ashhadshamim2@gmail.com';

function submitForm(btn) {
    const first = document.getElementById('firstName').value.trim();
    const last = document.getElementById('lastName').value.trim();
    const email = document.getElementById('senderEmail').value.trim();
    const subject = document.getElementById('subject').value;
    const message = document.getElementById('message').value.trim();
    const status = document.getElementById('formStatus');

    const showStatus = (text, ok) => {
        status.textContent = text;
        status.className = `form-status ${ok ? 'success' : 'error'}`;
    };

    if (!first || !email || !message) {
        showStatus('Please fill in your first name, email and message.', false);
        return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        showStatus('Please enter a valid email address.', false);
        return;
    }

    const body =
        'Name: ' + first + ' ' + last + '\n' +
        'Email: ' + email + '\n\n' +
        message;

    const mailto = 'mailto:' + MY_EMAIL +
        '?subject=' + encodeURIComponent('[Portfolio] ' + subject) +
        '&body=' + encodeURIComponent(body);

    window.location.href = mailto;

    showStatus('Your email app should open with this message ready. Review it, then press Send.', true);
    setTimeout(() => { status.className = 'form-status'; }, 6000);
}

