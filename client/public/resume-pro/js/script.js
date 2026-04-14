/**
 * [Resume Pro Engine - v2.0 Premium]
 * Highly modernized resume generator with modular architecture.
 */

const query = new URLSearchParams(window.location.search);
const configuredApi = query.get('api');

const buildApiCandidates = () => {
    const candidates = [];
    if (configuredApi) candidates.push(configuredApi);
    if (window.location.hostname === 'localhost') candidates.push('http://localhost:5001/api/profile');
    candidates.push('https://mern-portfolio-yasar.onrender.com/api/profile');
    candidates.push('https://mern-portfolio-yasar-1.onrender.com/api/profile');
    return [...new Set(candidates.filter(Boolean))];
};

const CONFIG = {
    apiCandidates: buildApiCandidates(),
    templates: {
        header: './templates/header.html',
        summary: './templates/summary.html',
        skills: './templates/skills.html',
        experience: './templates/experience.html',
        projects: './templates/projects.html',
        education: './templates/education.html',
        footer: './templates/footer.html'
    }
};

// --- Utilities ---
const UI = {
    overlay: document.getElementById('loading-overlay'),
    message: document.getElementById('loader-message'),
    progress: document.getElementById('loader-progress'),
    main: document.getElementById('main-resume'),
    actions: document.getElementById('resume-actions')
};

const setProgress = (percent, message) => {
    if (UI.progress) UI.progress.style.width = `${percent}%`;
    if (UI.message) UI.message.innerText = message || 'PROCESSING...';
};

const sleep = (ms) => new Promise(r => setTimeout(r, ms));
const safeArr = (v) => Array.isArray(v) ? v : [];
const safeStr = (v, f = '') => typeof v === 'string' ? v : f;
const safeObj = (v) => (v && typeof v === 'object') ? v : {};

// --- Core Logic ---

async function fetchProfile(maxAttempts = 3) {
    setProgress(10, 'SYNCING WITH DATA CORE...');
    let lastError = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        for (const url of CONFIG.apiCandidates) {
            try {
                const resp = await fetch(url, { cache: 'no-store' });
                if (!resp.ok) throw new Error(`Status ${resp.status}`);
                const data = await resp.json();
                setProgress(40, 'DATA RETRIEVED.');
                return data;
            } catch (e) {
                lastError = e;
                console.warn(`Fetch failed for ${url}:`, e.message);
            }
        }
        if (attempt < maxAttempts) {
            setProgress(10 + (attempt * 10), `RETRYING CONNECTION (${attempt}/${maxAttempts})...`);
            await sleep(2000);
        }
    }
    throw lastError || new Error('All endpoints unreachable');
}

async function loadTemplates() {
    setProgress(50, 'FETCHING MODULES...');
    const keys = Object.keys(CONFIG.templates);
    const results = {};
    
    const promises = keys.map(async (key, idx) => {
        const r = await fetch(CONFIG.templates[key]);
        if (!r.ok) throw new Error(`Missing module: ${key}`);
        const text = await r.text();
        results[key] = text;
        const p = 50 + Math.floor(((idx + 1) / keys.length) * 40);
        setProgress(p, `MOUNTING ${key.toUpperCase()}...`);
        return text;
    });

    await Promise.all(promises);
    return results;
}

// --- Renderers ---

function inject(id, html) {
    const el = document.getElementById(id);
    if (el) {
        el.innerHTML = html;
        el.classList.add('fade-in');
    }
}

function processTemplate(tpl, data) {
    let output = tpl;
    Object.keys(data).forEach(key => {
        output = output.split(`{{${key}}}`).join(data[key]);
    });
    return output;
}

const RenderEngine = {
    header(tpl, p) {
        const socials = safeObj(p.socials);
        const linkedin = safeStr(socials.linkedin);
        const linkedinId = linkedin ? linkedin.split('/').filter(Boolean).pop() : 'linkedin';
        const portfolio = safeArr(p.projects).find(pr => safeStr(pr.name).includes('Portfolio'))?.link || 'mern-portfolio-yasar.onrender.com';
        
        const html = processTemplate(tpl, {
            name: safeStr(p.name, 'A. MOHAMED YASAR'),
            title: safeStr(p.title, 'MERN Stack Developer'),
            location: safeStr(p.location, 'Tamil Nadu, India'),
            phone: safeStr(p.phone, '+91-XXXXXXXXXX'),
            email: safeStr(p.email, 'example@mail.com'),
            linkedinId: linkedinId,
            portfolioUrl: safeStr(portfolio, '').replace('https://', '')
        });
        inject('header-module', html);
    },

    summary(tpl, p) {
        inject('summary-module', processTemplate(tpl, { summary: safeStr(p.summary) }));
    },

    skills(tpl, p) {
        inject('skills-module', tpl);
        const s = safeObj(p.technicalSkills);
        const skills = [
            { l: 'Frontend', v: safeArr(s.frontend).join(', ') },
            { l: 'Backend', v: safeArr(s.backend).join(', ') },
            { l: 'Database', v: safeArr(s.database).join(', ') },
            { l: 'Tools', v: safeArr(s.tools).join(', ') }
        ];
        if (safeArr(s.aiTools).length) skills.push({ l: 'AI Tools', v: s.aiTools.join(', ') });
        
        const html = skills.map(i => `<div class="skill-item"><b>${i.l}:</b> ${i.v || 'N/A'}</div>`).join('');
        inject('skills-list', html);
    },

    experience(tpl, p) {
        inject('experience-module', tpl);
        const html = safeArr(p.experience).map(exp => `
            <div class="exp-item">
                <div class="exp-top"><span>${safeStr(exp.role)}</span><span>${safeStr(exp.period)}</span></div>
                <div class="exp-sub"><span>${safeStr(exp.company)}, ${safeStr(exp.location)}</span></div>
                <ul>${safeArr(exp.description).map(d => `<li>${safeStr(d)}</li>`).join('')}</ul>
            </div>
        `).join('');
        inject('experience-container', html);
    },

    projects(tpl, p) {
        inject('projects-module', tpl);
        const html = safeArr(p.projects).filter(pr => pr.name !== 'Scientific Calculator').map(pr => `
            <div class="exp-item">
                <div class="exp-top"><span>${safeStr(pr.name)}</span></div>
                <div class="exp-sub"><span>Tech: ${safeArr(pr.technologies).join(', ')}</span></div>
                <ul>${safeArr(pr.description).map(d => `<li>${safeStr(d)}</li>`).join('')}</ul>
            </div>
        `).join('');
        inject('projects-container', html);
    },

    education(tpl, p) {
        inject('education-module', tpl);
        const html = safeArr(p.education).map(edu => `
            <div class="exp-item">
                <div class="exp-top"><span>${safeStr(edu.degree)}</span><span>${safeStr(edu.year)}</span></div>
                <div class="exp-sub"><span>${safeStr(edu.institution)}</span></div>
            </div>
        `).join('');
        inject('education-container', html);
    },

    footer(tpl, p) {
        inject('footer-module', tpl);
        const inf = safeObj(p.additionalInfo);
        const html = `
            <div><b>Availability:</b> ${safeStr(inf.availability)}</div>
            <div><b>Languages:</b> ${safeArr(inf.languages).join(', ')}</div>
            <div style="margin-top:5px"><b>Soft Skills:</b> ${safeArr(p.softSkills).join(', ')}</div>
        `;
        inject('additional-container', html);
    }
};

// --- Initialization ---

async function init() {
    try {
        const profile = await fetchProfile();
        const templates = await loadTemplates();

        setProgress(95, 'FINALIZING RENDER...');
        await sleep(400);

        RenderEngine.header(templates.header, profile);
        RenderEngine.summary(templates.summary, profile);
        RenderEngine.skills(templates.skills, profile);
        RenderEngine.experience(templates.experience, profile);
        RenderEngine.projects(templates.projects, profile);
        RenderEngine.education(templates.education, profile);
        RenderEngine.footer(templates.footer, profile);

        setProgress(100, 'SYSTEM READY.');
        await sleep(500);

        UI.overlay.classList.add('hidden');
        UI.main.classList.remove('hidden');
        UI.actions.classList.remove('hidden');

    } catch (err) {
        console.error("Critical Failure:", err);
        setProgress(100, 'DATA LINK OFFLINE. RETRYING...');
        setTimeout(() => window.location.reload(), 5000);
    }
}

// --- Global Actions ---

window.downloadAsPDF = function() {
    const opt = {
        margin: 0,
        filename: 'A_MOHAMED_YASAR_RESUME.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    html2pdf().set(opt).from(UI.main).save();
};

document.getElementById('theme-toggle')?.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode-interactive');
    const isDark = document.body.classList.contains('dark-mode-interactive');
    console.log('Interactive Mode:', isDark ? 'ON' : 'OFF');
});

// Run
init();
