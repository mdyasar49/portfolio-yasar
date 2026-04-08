async function fetchProfile() {
    const apiUrl = 'https://mern-portfolio-yasar.onrender.com/api/profile';
    const resp = await fetch(apiUrl);
    const data = await resp.json();
    renderResume(data);
}

function renderResume(p) {
    document.getElementById('user-name').innerText = p.name;
    document.getElementById('user-title').innerText = p.title;
    document.getElementById('user-summary').innerText = p.summary;

    document.getElementById('skills-front').innerHTML = p.technicalSkills.frontend.map(s => `<span class="skill-tag">${s}</span>`).join('');
    document.getElementById('skills-back').innerHTML = p.technicalSkills.backend.map(s => `<span class="skill-tag">${s}</span>`).join('');
    document.getElementById('skills-db').innerHTML = p.technicalSkills.database.map(s => `<span class="skill-tag">${s}</span>`).join('');

    document.getElementById('experience-list').innerHTML = p.experience.map(exp => `
        <div class="history-item">
            <div class="history-header">
                <span class="history-role">${exp.role}</span>
                <span class="history-date">${exp.period}</span>
            </div>
            <div class="history-company">${exp.company}</div>
            <ul class="timeline-bullet">
                ${exp.description.map(d => `<li>${d}</li>`).join('')}
            </ul>
        </div>
    `).join('');

    document.getElementById('education-list').innerHTML = p.education.map(edu => `
        <div class="edu-card">
            <b>${edu.degree}</b>
            <span>${edu.institution} | ${edu.year}</span>
        </div>
    `).join('');

    document.getElementById('languages-list').innerHTML = p.additionalInfo.languages.map(l => `<div>${l.toUpperCase()}</div>`).join('');
    document.getElementById('availability-info').innerText = p.additionalInfo.availability.toUpperCase();

    document.getElementById('loading').classList.add('hidden');
    document.getElementById('resumeContent').classList.remove('hidden');
}

fetchProfile();
