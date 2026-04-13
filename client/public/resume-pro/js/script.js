/**
 * [Resume Pro Engine]
 * Responsibly fetches modular HTML templates and populates them with profile data.
 */

const query = new URLSearchParams(window.location.search);
const configuredApi = query.get('api');

const buildApiCandidates = () => {
    const candidates = [];

    if (configuredApi) {
        candidates.push(configuredApi);
    }

    if (window.location.hostname === 'localhost') {
        candidates.push('http://localhost:5001/api/profile');
    }

    // Default production fallback for direct resume URL access
    candidates.push('https://mern-portfolio-yasar.onrender.com/api/profile');
    // Secondary fallback if production domain is switched during migration
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

const safeArray = (value) => Array.isArray(value) ? value : [];
const safeText = (value, fallback = '') => typeof value === 'string' ? value : fallback;
const safeObject = (value) => (value && typeof value === 'object') ? value : {};

async function fetchProfileWithFallback() {
    let lastError = null;

    for (const apiUrl of CONFIG.apiCandidates) {
        try {
            const profileResp = await fetch(apiUrl);
            if (!profileResp.ok) {
                throw new Error(`API Fetch Failed (${profileResp.status}) from ${apiUrl}`);
            }
            return await profileResp.json();
        } catch (error) {
            lastError = error;
        }
    }

    throw lastError || new Error('No reachable profile API endpoint.');
}

async function init() {
    try {
        // 1. Fetch Profile Data
        const profile = await fetchProfileWithFallback();

        // 2. Load all templates
        const templateKeys = Object.keys(CONFIG.templates);
        const templatePromises = templateKeys.map(async key => {
            const r = await fetch(CONFIG.templates[key]);
            if (!r.ok) throw new Error(`Template Load Failed: ${key} (${r.status})`);
            return r.text();
        });
        const templateContents = await Promise.all(templatePromises);
        
        const templates = {};
        templateKeys.forEach((key, i) => { templates[key] = templateContents[i]; });

        // 3. Render Modules
        renderHeader(templates.header, profile);
        renderSummary(templates.summary, profile);
        renderSkills(templates.skills, profile);
        renderExperience(templates.experience, profile);
        renderProjects(templates.projects, profile);
        renderEducation(templates.education, profile);
        renderFooter(templates.footer, profile);

        // 4. Show Content
        document.getElementById('loading-overlay').classList.add('hidden');
        document.getElementById('main-resume').classList.remove('hidden');

    } catch (err) {
        console.error("Module Loading Failed:", err);
        document.getElementById('loading-overlay').innerText = "FATAL ERROR: Failed to load modules.";
    }
}

function renderHeader(template, p) {
    const socials = safeObject(p.socials);
    const projects = safeArray(p.projects);
    const linkedin = safeText(socials.linkedin);
    const linkedinId = linkedin ? linkedin.split('/').filter(Boolean).pop() : 'linkedin';
    const portfolioUrl = projects.find(proj => safeText(proj.name).includes('Portfolio'))?.link || 'mern-portfolio-yasar-1.onrender.com';
    const html = template
        .replace('{{name}}', safeText(p.name, 'Profile Unavailable'))
        .replace('{{title}}', safeText(p.title, 'Full Stack Developer'))
        .replace('{{location}}', safeText(p.location, 'N/A'))
        .replace('{{phone}}', safeText(p.phone, 'N/A'))
        .replace('{{email}}', safeText(p.email, 'N/A'))
        .replace('{{linkedinId}}', linkedinId)
        .replace('{{portfolioUrl}}', safeText(portfolioUrl, '').replace('https://', ''));
    document.getElementById('header-module').innerHTML = html;
}

function renderSummary(template, p) {
    const html = template.replace('{{summary}}', safeText(p.summary, 'Profile summary is currently unavailable.'));
    document.getElementById('summary-module').innerHTML = html;
}

function renderSkills(template, p) {
    const technicalSkills = safeObject(p.technicalSkills);
    document.getElementById('skills-module').innerHTML = template;
    const items = [
        { label: 'Frontend', val: safeArray(technicalSkills.frontend).join(', ') },
        { label: 'Backend', val: safeArray(technicalSkills.backend).join(', ') },
        { label: 'Database', val: safeArray(technicalSkills.database).join(', ') },
        { label: 'Pipeline', val: safeArray(technicalSkills.tools).join(', ') }
    ];
    if (safeArray(technicalSkills.aiTools).length) items.push({ label: 'AI Tools', val: safeArray(technicalSkills.aiTools).join(', ') });
    if (safeArray(technicalSkills.other).length) items.push({ label: 'Others', val: safeArray(technicalSkills.other).join(', ') });

    document.getElementById('skills-list').innerHTML = items.map(i => `
        <div class="skill-item"><b>${i.label}:</b> ${i.val || 'N/A'}</div>
    `).join('');
}

function renderExperience(template, p) {
    document.getElementById('experience-module').innerHTML = template;
    document.getElementById('experience-container').innerHTML = safeArray(p.experience).map(exp => `
        <div class="exp-item">
            <div class="exp-top"><span>${safeText(exp.role, 'Role')}</span><span>${safeText(exp.period, '')}</span></div>
            <div class="exp-sub"><span>${safeText(exp.company, 'Company')}, ${safeText(exp.location, 'India')}</span></div>
            <ul>${safeArray(exp.description).map(d => `<li>${safeText(d)}</li>`).join('')}</ul>
        </div>
    `).join('');
}

function renderProjects(template, p) {
    document.getElementById('projects-module').innerHTML = template;
    // Render clean projects without internal type labels
    document.getElementById('projects-container').innerHTML = safeArray(p.projects).filter(pr => safeText(pr.name) !== 'Scientific Calculator').map(pr => `
        <div class="exp-item">
            <div class="exp-top"><span>${safeText(pr.name, 'Project')}</span></div>
            <div class="exp-sub"><span>Core Tech: ${safeArray(pr.technologies).join(', ') || 'N/A'}</span></div>
            <ul>${safeArray(pr.description).map(d => `<li>${safeText(d)}</li>`).join('')}</ul>
        </div>
    `).join('');
}

function renderEducation(template, p) {
    document.getElementById('education-module').innerHTML = template;
    document.getElementById('education-container').innerHTML = safeArray(p.education).map(edu => `
        <div class="exp-item">
            <div class="exp-top"><span>${safeText(edu.degree, 'Education')}</span><span>${safeText(edu.year, '')}</span></div>
            <div class="exp-sub"><span>${safeText(edu.institution, 'Institution')}</span></div>
        </div>
    `).join('');
}

function renderFooter(template, p) {
    const additionalInfo = safeObject(p.additionalInfo);
    document.getElementById('footer-module').innerHTML = template;
    document.getElementById('additional-container').innerHTML = `
        <div><b>Availability:</b> ${safeText(additionalInfo.availability, 'N/A')}</div>
        <div><b>Work Mode:</b> ${safeText(additionalInfo.workPreference, 'N/A')}</div>
        <div><b>Languages:</b> ${safeArray(additionalInfo.languages).join(', ') || 'N/A'}</div>
        <div style="margin-top:5px"><b>Soft Skills:</b> ${safeArray(p.softSkills).join(', ') || 'N/A'}</div>
    `;
}

// PDF Generation Logic
window.downloadAsPDF = function() {
    const element = document.getElementById('main-resume');
    const opt = {
        margin: 0,
        filename: 'A_MOHAMED_YASAR_RESUME.pdf',
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();
}

/**
 * Returns the PDF as a Blob for sharing or other purposes.
 */
window.getPDFBlob = async function() {
    const element = document.getElementById('main-resume');
    const opt = {
        margin: 0,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true, letterRendering: true },
        jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    return html2pdf().set(opt).from(element).output('blob');
}

// Ignition
init();
