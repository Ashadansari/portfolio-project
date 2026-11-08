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

