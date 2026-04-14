/**
 * [Resume Pro Engine - v2.1 Ultimate]
 * Enhanced with Share Protocol and System Dispatch Logic.
 */

const query = new URLSearchParams(window.location.search);
const configuredApi = query.get('api');
const isDispatchAuto = query.get('system_dispatch') === 'true';

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
    actions: document.getElementById('resume-actions'),
    shareModal: document.getElementById('share-modal'),
    dispatchOverlay: document.getElementById('dispatch-overlay')
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
        const text = await r.text();
        results[key] = text;
        setProgress(50 + Math.floor(((idx + 1) / keys.length) * 40), `MOUNTING ${key.toUpperCase()}...`);
        return text;
    });
    await Promise.all(promises);
    return results;
}

// --- Renderers ---

function inject(id, html) {
    const el = document.getElementById(id);
    if (el) { el.innerHTML = html; el.classList.add('fade-in'); }
}

function processTemplate(tpl, data) {
    let output = tpl;
    Object.keys(data).forEach(key => { output = output.split(`{{${key}}}`).join(data[key]); });
    return output;
}

const RenderEngine = {
    header(tpl, p) {
        const socials = safeObj(p.socials);
        const linkedinId = safeStr(socials.linkedin).split('/').filter(Boolean).pop() || 'linkedin';
        const portfolio = safeArr(p.projects).find(pr => safeStr(pr.name).includes('Portfolio'))?.link || 'mern-portfolio-yasar-1.onrender.com';
        inject('header-module', processTemplate(tpl, {
            name: safeStr(p.name, 'A. MOHAMED YASAR'),
            title: safeStr(p.title, 'MERN Stack Developer'),
            location: safeStr(p.location, 'Tamil Nadu, India'),
            phone: safeStr(p.phone), email: safeStr(p.email),
            linkedinId, portfolioUrl: portfolio.replace('https://', '')
        }));
    },
    summary(tpl, p) { inject('summary-module', processTemplate(tpl, { summary: safeStr(p.summary) })); },
    skills(tpl, p) {
        inject('skills-module', tpl);
        const s = safeObj(p.technicalSkills);
        const html = [
            { l: 'Frontend', v: safeArr(s.frontend).join(', ') },
            { l: 'Backend', v: safeArr(s.backend).join(', ') },
            { l: 'Database', v: safeArr(s.database).join(', ') },
            { l: 'Tools', v: safeArr(s.tools).join(', ') }
        ].map(i => `<div class="skill-item"><b>${i.l}:</b> ${i.v || 'N/A'}</div>`).join('');
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
        inject('additional-container', `
            <div><b>Availability:</b> ${safeStr(inf.availability)}</div>
            <div><b>Languages:</b> ${safeArr(inf.languages).join(', ')}</div>
            <div style="margin-top:5px"><b>Soft Skills:</b> ${safeArr(p.softSkills).join(', ')}</div>
        `);
    }
};

// --- Initialization ---

async function init() {
    try {
        const profile = await fetchProfile();
        const templates = await loadTemplates();
        setProgress(95, 'FINALIZING RENDER...');
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

        if (isDispatchAuto) {
            UI.dispatchOverlay.classList.remove('hidden');
            setTimeout(() => { 
                window.downloadAsPDF(); 
                UI.dispatchOverlay.classList.add('hidden'); 
            }, 1500);
        }
    } catch (err) {
        setProgress(100, 'DATA LINK OFFLINE. RETRYING...');
        setTimeout(() => window.location.reload(), 5000);
    }
}

// --- Global Actions ---

function getPDFEngine() {
    const engine = window.html2pdf;
    if (!engine) {
        alert("PDF Engine offline. Please check your internet connection.");
        throw new Error("html2pdf library not loaded.");
    }
    return engine;
}

function downloadAsPDF() {
    const opt = {
        margin: 0, filename: 'A_MOHAMED_YASAR_RESUME.pdf',
        image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 3, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    getPDFEngine()().set(opt).from(UI.main).save();
}
window.downloadAsPDF = downloadAsPDF;

async function getPDFBlob() {
    const opt = {
        margin: 0, image: { type: 'jpeg', quality: 1 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    return getPDFEngine()().set(opt).from(UI.main).output('blob');
}
window.getPDFBlob = getPDFBlob;

function executeEmailDispatch() {
    UI.shareModal.classList.add('hidden');
    const url = `${window.location.origin}${window.location.pathname}?system_dispatch=true`;
    const sub = "A. Mohamed Yasar | Authenticated Asset Access";
    const body = `[ AUTHENTICATED_ACCESS_REQUEST ]\n\nLink: ${url}\n\nVERIFICATION_PROTOCOL: Upon clicking, the system will auto-extract the PDF asset.`;
    window.open(`https://mail.google.com/mail/?view=cm&fs=1&tf=1&su=${encodeURIComponent(sub)}&body=${encodeURIComponent(body)}`, '_blank');
}
window.executeEmailDispatch = executeEmailDispatch;

async function executeAssetExtraction() {
    UI.shareModal.classList.add('hidden');
    UI.dispatchOverlay.classList.remove('hidden');
    try {
        const blob = await getPDFBlob();
        const file = new File([blob], "A_MOHAMED_YASAR_RESUME.pdf", { type: "application/pdf" });
        if (navigator.canShare && navigator.canShare({ files: [file] })) {
            await navigator.share({ title: "A. Mohamed Yasar Resume", files: [file] });
        } else { 
            downloadAsPDF(); 
        }
    } catch (e) { 
        downloadAsPDF(); 
    } finally { 
        UI.dispatchOverlay.classList.add('hidden'); 
    }
}
window.executeAssetExtraction = executeAssetExtraction;

document.getElementById('share-toggle')?.addEventListener('click', () => UI.shareModal.classList.remove('hidden'));
document.getElementById('share-close')?.addEventListener('click', () => UI.shareModal.classList.add('hidden'));
document.getElementById('theme-toggle')?.addEventListener('click', () => document.body.classList.toggle('dark-mode-interactive'));

init();
