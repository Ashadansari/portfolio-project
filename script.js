// Highlight the section nearest the reading line in the floating navigation.
const sections = Array.from(document.querySelectorAll('section[id]'));
const navLinks = Array.from(document.querySelectorAll('.floating-nav-item[href^="#"]'));
let navigationUpdateQueued = false;

function updateActiveNavigation() {
    const readingLine = Math.min(window.innerHeight * .4, 320);
    let currentSection = null;
    sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        if (bounds.top <= readingLine && bounds.bottom > readingLine) currentSection = section;
    });

    navLinks.forEach((link) => {
        const isCurrent = currentSection && link.getAttribute('href') === `#${currentSection.id}`;
        if (isCurrent) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
}

function scheduleNavigationUpdate() {
    if (navigationUpdateQueued) return;
    navigationUpdateQueued = true;
    window.requestAnimationFrame(() => {
        navigationUpdateQueued = false;
        updateActiveNavigation();
    });
}

window.addEventListener('scroll', scheduleNavigationUpdate, { passive: true });
window.addEventListener('resize', scheduleNavigationUpdate);
updateActiveNavigation();

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

// Data and tab behavior for the Skills section.
const expertise = [
    { name: 'Frontend Development', skills: ['HTML5', 'CSS3', 'JavaScript', 'React'] },
    { name: 'Backend Development', skills: ['Python', 'Django', 'SQL', 'MongoDB'] },
    { name: 'Development Tools', skills: ['Git', 'GitHub', 'Docker', 'Packet Tracer'] },
    { name: 'Networking', skills: ['IPv4 Addressing', 'Subnetting', 'CIDR', 'TCP', 'UDP', 'DNS', 'DHCP', 'ARP', 'ICMP', 'NAT', 'LAN', 'WAN', 'WLAN', 'Ethernet'] },
    { name: 'Cybersecurity', skills: ['Wireshark', 'Metasploit', 'Burp Suite', 'PortSwigger', 'TryHackMe'] }
];

const skillTabs = document.getElementById('skillTabs');
const skillPanel = document.getElementById('skillPanel');
const skillPanelIndex = document.getElementById('skillPanelIndex');
const skillPanelTitle = document.getElementById('skillPanelTitle');
const selectedSkills = document.getElementById('selectedSkills');
const skillTabButtons = [];
let skillSelectionVersion = 0;

expertise.forEach((category, index) => {
    const tab = document.createElement('button');
    const number = String(index + 1).padStart(2, '0');
    tab.className = 'skill-pill';
    tab.id = `skill-tab-${index}`;
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-controls', 'skillPanel');
    tab.tabIndex = -1;

    const label = document.createElement('span');
    label.className = 'skill-pill-label';
    const indexLabel = document.createElement('span');
    indexLabel.className = 'skill-pill-number';
    indexLabel.textContent = number;
    const name = document.createElement('span');
    name.textContent = category.name;
    const indicator = document.createElement('span');
    indicator.className = 'skill-pill-indicator';
    indicator.setAttribute('aria-hidden', 'true');
    indicator.textContent = '↗';
    label.append(indexLabel, name);
    tab.append(label, indicator);
    tab.addEventListener('click', () => selectExpertise(index));
    tab.addEventListener('keydown', (event) => {
        let nextIndex;
        if (event.key === 'ArrowRight' || event.key === 'ArrowDown') nextIndex = (index + 1) % expertise.length;
        else if (event.key === 'ArrowLeft' || event.key === 'ArrowUp') nextIndex = (index - 1 + expertise.length) % expertise.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = expertise.length - 1;
        else return;
        event.preventDefault();
        selectExpertise(nextIndex, true);
    });
    skillTabs.append(tab);
    skillTabButtons.push(tab);
});

function selectExpertise(index, moveFocus = false) {
    const category = expertise[index];
    const selectionVersion = ++skillSelectionVersion;
    const number = String(index + 1).padStart(2, '0');
    const total = String(expertise.length).padStart(2, '0');

    skillTabButtons.forEach((tab, tabIndex) => {
        const selected = tabIndex === index;
        tab.setAttribute('aria-selected', String(selected));
        tab.tabIndex = selected ? 0 : -1;
    });
    if (moveFocus) skillTabButtons[index].focus();

    skillPanel.setAttribute('aria-labelledby', `skill-tab-${index}`);
    skillPanel.classList.add('is-switching');
    window.requestAnimationFrame(() => {
        window.requestAnimationFrame(() => {
            if (selectionVersion !== skillSelectionVersion) return;
            skillPanelIndex.textContent = `${number} / ${total}`;
            skillPanelTitle.textContent = category.name;
            selectedSkills.setAttribute('aria-label', `${category.name} skills`);
            selectedSkills.replaceChildren(...category.skills.map((skill) => {
                const item = document.createElement('li');
                item.textContent = skill;
                return item;
            }));
            skillPanel.classList.remove('is-switching');
        });
    });
}

selectExpertise(0);

// Data for the Projects showcase.
const projects = [
    {
        name: 'VÉRON Fashion Store',
        wordmark: 'VÉRON',
        category: 'E-commerce',
        description: 'A production-oriented fashion storefront with searchable products, customer accounts, cart, Cash on Delivery checkout, and admin tools.',
        technologies: ['Next.js', 'React', 'TypeScript', 'PostgreSQL', 'Prisma'],
        repository: 'https://github.com/Ashadansari/veron',
        live: 'https://veron-fashion.netlify.app/'
    },
    {
        name: 'E-Commerce Platform',
        wordmark: 'E-COMMERCE',
        category: 'E-commerce · Full stack',
        description: 'Full-stack online store with a product catalog, cart, payments and an admin dashboard.',
        technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
        repository: 'https://github.com/Ashadansari/E-commerce-web',
        live: 'https://e-commerce-webap.netlify.app/'
    },
    {
        name: 'Restaurant Website',
        wordmark: 'RESTAURANT',
        category: 'Restaurant · Web',
        description: 'Responsive restaurant website showcasing the food menu and team members.',
        technologies: ['Socket.io', 'React', 'Express', 'Redis'],
        repository: 'https://github.com/Ashadansari/Restaurant-website',
        live: 'https://restaurant-website-dud7mj7j4-ashadansaris-projects.vercel.app/'
    },
    {
        name: 'Task Manager App',
        wordmark: 'TASK MANAGER',
        category: 'Productivity · Web app',
        description: 'Kanban-style productivity app with drag-and-drop, deadlines, collaboration and reminders.',
        technologies: ['Vue.js', 'Firebase', 'Pinia'],
        repository: 'https://github.com/Ashadansari/task-manager-app',
        live: 'https://task-managerap.netlify.app/'
    },
    {
        name: 'CyberWeb',
        wordmark: 'CYBERWEB',
        category: 'Portfolio · Frontend',
        description: 'Cyber-themed portfolio design built to showcase front-end skills.',
        technologies: ['JavaScript', 'HTML', 'CSS'],
        repository: 'https://github.com/Ashadansari/cyberWeb',
        live: 'https://cyber-web-amber.vercel.app/'
    }
];

const projectTabs = document.getElementById('projectTabs');
const projectPanel = document.getElementById('projectPanel');
const projectTitle = document.getElementById('projectTitle');
const projectCategory = document.getElementById('projectCategory');
const projectDescription = document.getElementById('projectDescription');
const projectTechnologies = document.getElementById('projectTechnologies');
const projectExplore = document.getElementById('projectExplore');
const projectRepository = document.getElementById('projectRepository');
const projectCount = document.getElementById('projectCount');
const previewIndex = document.getElementById('previewIndex');
const previewWordmark = document.getElementById('previewWordmark');
const previewCaption = document.getElementById('previewCaption');
const projectTabButtons = [];

projects.forEach((project, index) => {
    const tab = document.createElement('button');
    const number = String(index + 1).padStart(2, '0');
    tab.className = 'project-tab';
    tab.id = `project-tab-${index}`;
    tab.type = 'button';
    tab.setAttribute('role', 'tab');
    tab.setAttribute('aria-selected', 'false');
    tab.setAttribute('aria-controls', 'projectPanel');
    tab.tabIndex = -1;

    const inner = document.createElement('span');
    inner.className = 'project-tab-inner';
    const projectNumber = document.createElement('span');
    projectNumber.className = 'project-tab-number';
    projectNumber.textContent = number;
    const copy = document.createElement('span');
    const projectName = document.createElement('span');
    projectName.className = 'project-tab-name';
    projectName.textContent = project.name;
    const category = document.createElement('span');
    category.className = 'project-tab-category';
    category.textContent = project.category;
    copy.append(projectName, category);
    const arrow = document.createElement('span');
    arrow.className = 'project-tab-arrow';
    arrow.setAttribute('aria-hidden', 'true');
    arrow.textContent = '↗';
    inner.append(projectNumber, copy, arrow);
    tab.append(inner);
    tab.addEventListener('click', () => selectProject(index));
    tab.addEventListener('keydown', (event) => {
        let nextIndex;
        if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % projects.length;
        else if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + projects.length) % projects.length;
        else if (event.key === 'Home') nextIndex = 0;
        else if (event.key === 'End') nextIndex = projects.length - 1;
        else return;
        event.preventDefault();
        selectProject(nextIndex, true);
    });
    projectTabs.append(tab);
    projectTabButtons.push(tab);
});

function selectProject(index, moveFocus = false) {
    const project = projects[index];
    const number = String(index + 1).padStart(2, '0');
    const total = String(projects.length).padStart(2, '0');

    projectTabButtons.forEach((tab, tabIndex) => {
        const isSelected = tabIndex === index;
        tab.setAttribute('aria-selected', String(isSelected));
        tab.tabIndex = isSelected ? 0 : -1;
    });
    if (moveFocus) projectTabButtons[index].focus();

    projectPanel.setAttribute('aria-labelledby', `project-tab-${index}`);
    projectPanel.classList.add('is-switching');
    window.requestAnimationFrame(() => {
        projectTitle.textContent = project.name;
        projectCategory.textContent = project.category;
        projectDescription.textContent = project.description;
        projectTechnologies.textContent = project.technologies.join(' · ');
        projectCount.textContent = `${number} / ${total}`;
        previewIndex.textContent = `${number} / ${total}`;
        previewWordmark.textContent = project.wordmark;
        previewCaption.textContent = project.category;
        projectExplore.href = project.live;
        projectRepository.href = project.repository;
        projectPanel.classList.remove('is-switching');
    });
}

selectProject(0);

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

