// Skill bar animation on scroll
const observer = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-fill').forEach(bar => {
                bar.style.width = bar.dataset.width + '%';
            });
        }
    });
}, { threshold: .3 });
document.querySelectorAll('.skill-category').forEach(el => observer.observe(el));
 
// Nav active highlight on scroll
const sections = document.querySelectorAll('section[id]');
const links = document.querySelectorAll('.nav-links a');
window.addEventListener('scroll', () => {
    let cur = '';
    sections.forEach(s => { if (window.scrollY >= s.offsetTop - 100) cur = s.id; });
    links.forEach(a => {
        a.style.color = a.getAttribute('href') === '#' + cur ? 'var(--accent2)' : '';
    });
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
        status.className = 'form-status' + (ok ? ' success' : '');
        status.style.display = 'block';
        if (!ok) {
            status.style.color = '#f87171';
            status.style.border = '1px solid rgba(248,113,113,.3)';
            status.style.background = 'rgba(248,113,113,.1)';
        } else {
            status.removeAttribute('style');
            status.style.display = 'block';
        }
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
 
    showStatus('✓ Opening your email app... just press Send there.', true);
    setTimeout(() => { status.style.display = 'none'; }, 6000);
}
 
