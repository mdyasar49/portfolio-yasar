/**
 * [Resume Pro Engine]
 * Responsibly fetches modular HTML templates and populates them with profile data.
 */

const CONFIG = {
    // Dynamic API discovery
    api: window.location.hostname === 'localhost' ? 'http://localhost:5001/api/profile' : '/api/profile',
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

async function init() {
    try {
        // 1. Fetch Profile Data
        const profileResp = await fetch(CONFIG.api);
        if (!profileResp.ok) throw new Error(`API Fetch Failed: ${profileResp.status}`);
        const profile = await profileResp.json();

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
    const linkedinId = p.socials.linkedin.split('/').pop();
    const portfolioUrl = p.projects.find(proj => proj.name.includes('Portfolio'))?.link || 'mern-portfolio-yasar-1.onrender.com';
    const html = template
        .replace('{{name}}', p.name)
        .replace('{{title}}', p.title)
        .replace('{{location}}', p.location)
        .replace('{{phone}}', p.phone)
        .replace('{{email}}', p.email)
        .replace('{{linkedinId}}', linkedinId)
        .replace('{{portfolioUrl}}', portfolioUrl.replace('https://', ''));
    document.getElementById('header-module').innerHTML = html;
}

function renderSummary(template, p) {
    const html = template.replace('{{summary}}', p.summary);
    document.getElementById('summary-module').innerHTML = html;
}

function renderSkills(template, p) {
    document.getElementById('skills-module').innerHTML = template;
    const items = [
        { label: 'Frontend', val: p.technicalSkills.frontend.join(', ') },
        { label: 'Backend', val: p.technicalSkills.backend.join(', ') },
        { label: 'Database', val: p.technicalSkills.database.join(', ') },
        { label: 'Pipeline', val: p.technicalSkills.tools.join(', ') }
    ];
    if (p.technicalSkills.aiTools) items.push({ label: 'AI Tools', val: p.technicalSkills.aiTools.join(', ') });
    if (p.technicalSkills.other) items.push({ label: 'Others', val: p.technicalSkills.other.join(', ') });

    document.getElementById('skills-list').innerHTML = items.map(i => `
        <div class="skill-item"><b>${i.label}:</b> ${i.val}</div>
    `).join('');
}

function renderExperience(template, p) {
    document.getElementById('experience-module').innerHTML = template;
    document.getElementById('experience-container').innerHTML = p.experience.map(exp => `
        <div class="exp-item">
            <div class="exp-top"><span>${exp.role}</span><span>${exp.period}</span></div>
            <div class="exp-sub"><span>${exp.company}, ${exp.location || 'India'}</span></div>
            <ul>${exp.description.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
    `).join('');
}

function renderProjects(template, p) {
    document.getElementById('projects-module').innerHTML = template;
    // Render clean projects without internal type labels
    document.getElementById('projects-container').innerHTML = p.projects.filter(pr => pr.name !== 'Scientific Calculator').map(pr => `
        <div class="exp-item">
            <div class="exp-top"><span>${pr.name}</span></div>
            <div class="exp-sub"><span>Core Tech: ${pr.technologies.join(', ')}</span></div>
            <ul>${pr.description.map(d => `<li>${d}</li>`).join('')}</ul>
        </div>
    `).join('');
}

function renderEducation(template, p) {
    document.getElementById('education-module').innerHTML = template;
    document.getElementById('education-container').innerHTML = p.education.map(edu => `
        <div class="exp-item">
            <div class="exp-top"><span>${edu.degree}</span><span>${edu.year}</span></div>
            <div class="exp-sub"><span>${edu.institution}</span></div>
        </div>
    `).join('');
}

function renderFooter(template, p) {
    document.getElementById('footer-module').innerHTML = template;
    document.getElementById('additional-container').innerHTML = `
        <div><b>Availability:</b> ${p.additionalInfo.availability}</div>
        <div><b>Work Mode:</b> ${p.additionalInfo.workPreference}</div>
        <div><b>Languages:</b> ${p.additionalInfo.languages.join(', ')}</div>
        <div style="margin-top:5px"><b>Soft Skills:</b> ${p.softSkills.join(', ')}</div>
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

// Ignition
init();
