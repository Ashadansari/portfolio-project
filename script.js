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

// Contact form mock submit
function submitForm() {
    const btn = event.target;
    btn.textContent = 'Sending...';
    btn.disabled = true;
    setTimeout(() => {
        btn.innerHTML = '<i class="fa-solid fa-check" style="margin-right:.5rem"></i>Message Sent!';
        const s = document.getElementById('formStatus');
        s.style.display = 'block';
        setTimeout(() => {
            btn.innerHTML = '<i class="fa-solid fa-paper-plane" style="margin-right:.5rem"></i>Send Message';
            btn.disabled = false;
            s.style.display = 'none';
        }, 4000);
    }, 1500);
}
