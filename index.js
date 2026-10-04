/* Jessica Syafaq Muthmaina — terminal portfolio
   Design after github.com/jackb1434/Terminal-Portfolio */

const NOTES_BASE = 'https://yourastrophysicist.github.io/your_astronotes/';
const REPO_URL = 'https://github.com/yourastrophysicist/yourastrophysicist';
const UNLOCK_KEY = 'astronotes-unlocked';
const QUIZ_LENGTH = 3;

const iterm = document.getElementById('iterm');
const form = document.getElementById('inputForm');
const input = document.getElementById('textAreaID');
const promptLabel = document.getElementById('promptLabel');
const viewer = document.getElementById('viewer');
const viewerFrame = document.getElementById('viewerFrame');
const viewerPath = document.getElementById('viewerPath');
const viewerExternal = document.getElementById('viewerExternal');
const viewerClose = document.getElementById('viewerClose');

const SHELL_PROMPT = promptLabel.innerHTML;
const QUIZ_PROMPT = 'quiz<span class="atSymbol">@</span>astronotes:?';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const LINE_DELAY = reducedMotion ? 0 : 25;


/* ---------- content helpers ---------- */

function cmd(name, label) {
    return `<button type="button" class="cmd" data-cmd="${name}">${label || name}</button>`;
}

function link(text, href) {
    return `<a href="${href}" target="_blank" rel="noopener">${text}</a>`;
}

function row(key, value, wide) {
    return { cls: wide ? 'row wide' : 'row', html: `<span class="key">${key}</span><span>${value}</span>` };
}

function head(text) {
    return { cls: 'title', html: text };
}

function escapeHtml(text) {
    const span = document.createElement('span');
    span.textContent = text;
    return span.innerHTML;
}


/* ---------- content ---------- */

const home = [
    { cls: 'row', html: `${cmd('whoami')}<span>- who am I?</span>` },
    { cls: 'row', html: `${cmd('education')}<span>- where I studied</span>` },
    { cls: 'row', html: `${cmd('research')}<span>- my published work on quasar 4C31.61</span>` },
    { cls: 'row', html: `${cmd('figures')}<span>- Allan deviation plots from the paper</span>` },
    { cls: 'row', html: `${cmd('experience')}<span>- research &amp; work experience</span>` },
    { cls: 'row', html: `${cmd('projects')}<span>- view my projects</span>` },
    { cls: 'row', html: `${cmd('skills')}<span>- view my toolchain</span>` },
    { cls: 'row', html: `${cmd('outreach')}<span>- writing, video &amp; advocacy</span>` },
    { cls: 'row', html: `${cmd('values')}<span>- what I care about</span>` },
    { cls: 'row', html: `${cmd('cv')}<span>- the whole CV in one go</span>` },
    { cls: 'row', html: `${cmd('socials')}<span>- view my socials &amp; contact</span>` },
    { cls: 'row', html: `${cmd('notes')}<span>- my second brain: Your AstroNotes <span class="event">(quiz-locked)</span></span>` },
    { cls: 'row', html: `${cmd('repo')}<span>- view project source</span>` },
    { cls: 'row', html: `${cmd('system')}<span>- view project information</span>` },
    { cls: 'row', html: `${cmd('clear')}<span>- clear the terminal</span>` },
    { cls: 'dim', html: 'tip: commands are clickable · tab completes · ↑/↓ walks history' },
];

const who = [
    head('Jessica Syafaq Muthmaina'),
    'M.Sc. student in Astrophysics &amp; Cosmology at the Università degli Studi di Padova, Department of Physics and Astronomy "Galileo Galilei". Before Padua: B.Sc. in Physics (Theoretical &amp; Computational) at Universitas Gadjah Mada, Yogyakarta.',
    '',
    'I work on observational astrophysics — active galactic nuclei, astronomical interferometry, radio instrumentation, and statistical signal analysis. My published work follows 33 years of VLBI observations of quasar 4C31.61 to test how stable it is as an anchor of the celestial reference frame.',
    '',
    'Day to day I love my computer: reduction pipelines, interferometric modelling, LaTeX, and a Zettelkasten in Obsidian. Away from the telescope data I write essays on Substack, tell cosmic stories on YouTube, and run Sadar Setara, a gender-equity advocacy platform in Garut, Indonesia.',
    { cls: 'dim', html: `next: ${cmd('research')} · ${cmd('notes')} · ${cmd('socials')}` },
];

const education = [
    head('Education'),
    row('2025–now', `<span class="success">M.Sc. Astrophysics and Cosmology</span> — ${link('University of Padua', 'https://www.unipd.it/en/')}, Italy`, true),
    row('', 'Concentration: Observational and Computational Astrophysics', true),
    row('', 'Coursework: Astronomical Interferometry · Astrophysics Laboratory 1 (High Energy Instrumentation) · Stellar Astrophysics · General Relativity', true),
    row('2019–2023', `<span class="success">B.Sc. Physics</span> — ${link('Universitas Gadjah Mada', 'https://fisika.fmipa.ugm.ac.id/')}, Indonesia`, true),
    row('', 'Concentration: Theoretical and Computational Physics', true),
    row('', `Thesis: Implementation of Allan Standard Deviation Technique in Variability Analysis of 4C31.61 Quasar (${link('repository', 'https://etd.repository.ugm.ac.id/penelitian/detail/225834')})`, true),
];

const research = [
    head('Implementation of Allan Standard Deviation Technique in Stability Analysis of 4C31.61 Quasar Position'),
    'J. S. Muthmaina, I. N. Huda, D. S. Palupi',
    { cls: 'dim', html: 'Journal of Physics: Conference Series 2773 (2024) 012007' },
    `${link('DOI 10.1088/1742-6596/2773/1/012007', 'https://doi.org/10.1088/1742-6596/2773/1/012007')} · ${link('arXiv:2401.12325', 'https://arxiv.org/abs/2401.12325')}`,
    '',
    row('question', 'The International Celestial Reference Frame is pinned to thousands of quasars observed with VLBI. It is only as good as those quasars are still. Is 4C31.61 (2201+315) a stable anchor?'),
    row('data', '33 years of VLBI sessions (1990–2023, 6,342 sessions), reduced with VieVS against ICRF-3 / ITRF-2020 and cross-checked with the Paris Observatory Geodetic VLBI Center solution.'),
    row('method', 'Overlapping Allan standard deviation of the position time series; the log-log slope tells white noise (stable) from flicker noise and random walk (unstable).'),
    row('result', '<span class="success">White noise dominates across most time scales</span> — the position is stable. A random-walk signature at long time scales may trace jet ejections or binary black hole motion.'),
    { cls: 'dim', html: `see the plots: ${cmd('figures')}` },
];

const figures = [
    head('Figure 1 — overlapping Allan standard deviation, quasar 4C31.61'),
    {
        cls: 'figures', tag: 'div', html: [
            ['img/vievs-allan-ra.png', '(a) VieVS — α cos δ'],
            ['img/vievs-allan-dec.png', '(b) VieVS — δ'],
            ['img/paris-allan-ra.png', '(c) Paris Observatory GVC — α cos δ'],
            ['img/paris-allan-dec.png', '(d) Paris Observatory GVC — δ'],
        ].map(([src, caption]) =>
            `<figure><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="Allan standard deviation plot: ${caption}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`
        ).join('')
    },
    { cls: 'dim', html: 'Top: VieVS time series. Bottom: independent Paris Observatory solution. The τ^(-1/2) slope at short sampling intervals is the white-noise signature.' },
];

const experience = [
    head('Research &amp; work'),
    row('2023', `<span class="success">Research Intern</span> — ${link('National Research and Innovation Agency (BRIN)', 'https://brin.go.id/')}. Processed and analysed VLBI datasets with VieVS and Paris Observatory data for celestial reference frame research.`, true),
    row('2024', `<span class="success">Technical Writer</span> — ${link('Ministry of Energy and Mineral Resources (ESDM)', 'https://esdm.go.id/')}. Turned engineering requirements into clear documentation for 200+ stakeholders.`, true),
    row('2024', '<span class="success">Data Analyst &amp; Field Researcher</span> — Saving Next Generation Indonesia. Evaluated programme effectiveness with fsQCA and wrote policy recommendations.', true),
    row('2022', `<span class="success">Data Science Intern</span> — ${link('Startup Campus', 'https://startupcampus.id/')}. Tableau dashboards, RFM + K-Means customer segmentation, A/B test analysis.`, true),
    '',
    head('Teaching &amp; leadership'),
    row('2025–now', '<span class="success">Founder</span> — Sadar Setara, a social advocacy platform for gender equality and human rights (Garut, Indonesia).', true),
    row('2022', '<span class="success">Teaching &amp; Lab Assistant</span> — Universitas Gadjah Mada. Guided 30+ students through physics laboratory experiments and exam preparation.', true),
];

const projects = [
    head('Projects'),
    row('astronotes', `My second brain — an open digital garden of graduate lecture notes, derivations and Maps of Content from the Padova M.Sc. Type ${cmd('notes')} to unlock it.`),
    row('comp_astro', `${link('comp_astro_26', 'https://github.com/yourastrophysicist/comp_astro_26')} — computational astrophysics coursework.`),
    row('gender-data', `Data-driven analysis of gender inequality across Indonesian provinces: regression modelling and demographic decomposition. ${link('arXiv:2412.00012', 'https://arxiv.org/abs/2412.00012')}`),
    row('quasar', `VLBI stability analysis of 4C31.61 — see ${cmd('research')}.`),
    row('this site', `A terminal you are typing into right now — ${cmd('repo')}.`),
];

const skills = [
    head('Toolchain'),
    row('python', 'Astropy | NumPy | SciPy | Matplotlib | Polars | scikit-learn'),
    row('radio', 'VieVS (Vienna VLBI Software) | Paris Observatory GVC data | Allan variance analysis'),
    row('languages', 'Python | C | Shell | LaTeX'),
    row('data', 'statistical modelling | Tableau | K-Means / RFM | A/B testing | fsQCA'),
    row('knowledge', 'Obsidian Zettelkasten | Maps of Content'),
    row('human', 'Indonesian (native) | English (C1) | French (A2)'),
];

const outreach = [
    head('Science communication'),
    row('youtube', `${link('Observationally Speaking', 'https://www.youtube.com/@obspeaking')} — storytelling that blends warm visual reflection with high-energy astrophysics.`),
    row('substack', `${link('yourastrophysicist', 'https://yourastrophysicist.substack.com')} — essays between physics, literature, philosophy and the environment.`),
    row('instagram', `${link('@your.astrophysicist', 'https://www.instagram.com/your.astrophysicist/')} — research, M.Sc. life in Padua, and cosmic visual stories.`),
    row('advocacy', 'Sadar Setara — grassroots community education and gender equity in Garut, Indonesia.'),
];

const values = [
    head('Core values'),
    row('rigor', 'Thorough observational analysis, honest error bars, and empirical truth over convenient answers.'),
    row('openness', 'Accessible research, open-source tools, and astronomy explained so anyone can follow.'),
    row('community', 'Inclusive academic spaces and intersectional grassroots advocacy.'),
    row('exchange', 'Bridging Indonesia and Europe — UGM, UNIPD, and the observatories in between.'),
];

const socialNames = ['GitHub', 'LinkedIn', 'Instagram', 'YouTube', 'Substack', 'Email'];
const socialLinks = [
    'https://github.com/yourastrophysicist',
    'https://www.linkedin.com/in/syafaqmuth/',
    'https://www.instagram.com/your.astrophysicist/',
    'https://www.youtube.com/@obspeaking',
    'https://yourastrophysicist.substack.com',
    'mailto:jessicasyafaq.muthmaina@studenti.unipd.it',
];
const socials = socialNames.map((name, i) => link(name, socialLinks[i]));

const system = [
    row('author', 'Jessica Syafaq Muthmaina'),
    row('host', 'Padova, Italy (45.4° N, 11.9° E)'),
    row('framework', 'none — plain HTML, CSS and JavaScript'),
    row('design', `after ${link('Terminal-Portfolio', 'https://github.com/jackb1434/Terminal-Portfolio')} by jackb1434`),
    row('theme', 'gruvbox dark'),
    row('version', '2.0.0'),
    row('updated', '2026-10-04'),
];

const files = {
    'aboutme.txt': 'whoami',
    'quasar.doc': 'research',
    'cv_latex.pdf': 'cv',
    'outreach.url': 'outreach',
    'values.txt': 'values',
    'astronotes/': 'notes',
};


/* ---------- AstroNotes: the second brain ---------- */

const courses = [
    { sem: 1, title: 'Fundamentals of Astrophysics & Cosmology', page: 'Fundamentals_Astrophysics_Cosmology_MOC' },
    { sem: 1, title: 'Observational Astrophysics', page: 'Observational_Astrophysics_MOC' },
    { sem: 1, title: 'General Relativity for Astrophysics', page: 'General_Relativity_MOC' },
    { sem: 1, title: 'Mathematical and Numerical Methods', page: 'Mathematical_Numerical_Methods_MOC' },
    { sem: 1, title: 'Astrophysics Laboratory 1 (High Energy)', page: 'Lab_High-Energy_MOC' },
    { sem: 2, title: 'Astrophysics of Galaxies', page: 'Astrophysics_of_Galaxies_MOC' },
    { sem: 2, title: 'Stellar Astrophysics', page: 'Stellar_Astrophysics_MOC' },
    { sem: 2, title: 'Astronomical Interferometry', page: 'Astronomical_Interferometry_MOC' },
    { sem: 2, title: 'Observational Cosmology', page: 'Observational_Cosmology_MOC' },
    { sem: 2, title: 'Astronomical Spectroscopy', page: 'Astronomical_Spectroscopy_MOC' },
];

function courseUrl(course) {
    return `${NOTES_BASE}04_Atlas/${course.page}.html`;
}

const vaultPages = {
    home: { title: 'README', url: NOTES_BASE },
    atlas: { title: '04_Atlas', url: `${NOTES_BASE}04_Atlas/04_Atlas.html` },
};

// The gate is a friendly quiz, not real security: the notes are a public site.
// Add or edit questions freely — any entry in `answers` is accepted.
const quizPool = [
    { q: 'Which planet is known as the Red Planet?', answers: ['mars'], hint: 'it is named after the Roman god of war' },
    { q: 'What is the name of the star at the centre of our Solar System?', answers: ['sun', 'sol'], hint: 'you see it every day' },
    { q: 'What is the name of the galaxy we live in?', answers: ['milkyway', 'milkywaygalaxy'], hint: 'it shares its name with a chocolate bar' },
    { q: 'How many planets are in our Solar System?', answers: ['8', 'eight', '8planets', 'eightplanets'], hint: 'Pluto was reclassified in 2006' },
    { q: "What is Earth's natural satellite called?", answers: ['moon', 'luna'], hint: 'it lights up the night sky' },
    { q: 'What is the largest planet in our Solar System?', answers: ['jupiter'], hint: 'it has a Great Red Spot' },
    { q: 'Which planet is famous for its bright rings?', answers: ['saturn'], hint: 'the sixth planet from the Sun' },
    { q: 'What force keeps the planets in orbit around the Sun?', answers: ['gravity', 'gravitation', 'gravitationalforce'], hint: 'it also made the apple fall on Newton' },
];

let quiz = null;

function isUnlocked() {
    try {
        return sessionStorage.getItem(UNLOCK_KEY) === '1';
    } catch (e) {
        return isUnlocked.memory === true;
    }
}

function setUnlocked(value) {
    isUnlocked.memory = value;
    try {
        if (value) sessionStorage.setItem(UNLOCK_KEY, '1');
        else sessionStorage.removeItem(UNLOCK_KEY);
    } catch (e) { /* storage blocked: stay unlocked for this page view only */ }
}

function normalizeAnswer(text) {
    return text.toLowerCase().replace(/[^a-z0-9]/g, '').replace(/^the/, '');
}

function setQuizMode(on) {
    promptLabel.innerHTML = on ? QUIZ_PROMPT : SHELL_PROMPT;
    input.placeholder = on ? 'type your answer' : 'enter input here';
}

function quizQuestionLine() {
    const current = quiz.questions[quiz.index];
    return `<span class="key">Q${quiz.index + 1}/${quiz.questions.length}</span> ${current.q}`;
}

async function startQuiz() {
    const shuffled = quizPool.slice().sort(() => Math.random() - 0.5);
    quiz = { questions: shuffled.slice(0, QUIZ_LENGTH), index: 0 };
    setQuizMode(true);
    await insertNewElement([
        '<span class="event">event</span> - ~/second-brain is locked',
        `Password required. Luckily the password is astronomy: answer ${QUIZ_LENGTH} easy questions to get in.`,
        { cls: 'dim', html: 'type your answer and press enter · type exit to give up' },
        '',
        quizQuestionLine(),
    ], false);
}

async function answerQuiz(raw) {
    const answer = normalizeAnswer(raw);
    const current = quiz.questions[quiz.index];

    if (['exit', 'quit', 'cancel'].includes(answer)) {
        quiz = null;
        setQuizMode(false);
        await insertNewElement(['<span class="event">event</span> - quiz cancelled, the notes stay locked']);
        return;
    }

    if (!current.answers.includes(answer)) {
        await insertNewElement([
            `<span class="error">error</span> - not quite. hint: ${current.hint}`,
            quizQuestionLine(),
        ], false);
        return;
    }

    quiz.index += 1;
    if (quiz.index < quiz.questions.length) {
        await insertNewElement(['<span class="success">success</span> - correct!', '', quizQuestionLine()], false);
        return;
    }

    quiz = null;
    setQuizMode(false);
    setUnlocked(true);
    await insertNewElement([
        '<span class="success">success</span> - correct!',
        '<span class="success">success</span> - access granted. welcome to the second brain ✦',
    ]);
    await showVault();
}

async function showVault() {
    const lines = [
        head('~/second-brain/your_astronotes'),
        'From your BRAT astrophysicist for your astronotes — lecture notes, derivations, Maps of Content and observational figures from the Padova M.Sc. (semesters 1–2).',
        '',
    ];
    [1, 2].forEach((sem) => {
        lines.push({ cls: 'event', html: sem === 1 ? 'semester-1/ — foundations' : 'semester-2/ — stars, galaxies, cosmology' });
        courses.forEach((course, i) => {
            if (course.sem !== sem) return;
            const number = String(i + 1).padStart(2, ' ');
            lines.push({
                cls: 'indent',
                html: `<span class="key">[${number}]</span> <a href="${courseUrl(course)}" data-view="${course.page}">${escapeHtml(course.title)}</a>`,
            });
        });
    });
    lines.push(
        '',
        `${cmd('open atlas')} - the full Maps of Content hub · ${cmd('open home')} - the vault README`,
        { cls: 'dim', html: `open a course by clicking it or typing e.g. ${cmd('open 8')} · ${cmd('lock')} locks the vault again` },
    );
    setTitleState('Terminal | Second Brain');
    await insertNewElement(lines);
}

function resolveNote(target) {
    if (vaultPages[target]) return vaultPages[target];
    const byNumber = courses[Number(target) - 1];
    const course = byNumber || courses.find((c) => c.page.toLowerCase() === target || c.page.toLowerCase().includes(target));
    return course ? { title: course.page, url: courseUrl(course) } : null;
}

function openViewer(note) {
    viewerPath.textContent = `~/second-brain/${note.title}`;
    viewerExternal.href = note.url;
    viewerFrame.src = note.url;
    viewer.hidden = false;
    document.body.style.overflow = 'hidden';
    viewerClose.focus();
}

function closeViewer() {
    if (viewer.hidden) return;
    viewer.hidden = true;
    viewerFrame.src = 'about:blank';
    document.body.style.overflow = '';
    input.focus();
}

async function openNote(target) {
    if (!isUnlocked()) {
        await insertNewElement([`<span class="error">error</span> - the second brain is locked. type ${cmd('notes')} and pass the quiz first.`]);
        return;
    }
    const note = target && resolveNote(target);
    if (!note) {
        await insertNewElement([`<span class="error">error</span> - usage: open &lt;1-${courses.length} | atlas | home&gt;`]);
        return;
    }
    await insertNewElement([`<span class="event">event</span> - opening ${escapeHtml(note.title)}`]);
    openViewer(note);
}


/* ---------- terminal ---------- */

function delay(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function setTitleState(state) {
    document.title = state;
}

function scrollToInput() {
    form.scrollIntoView({ block: 'nearest' });
}

function appendLine(line) {
    const spec = typeof line === 'string' ? { html: line } : line;
    const element = document.createElement(spec.tag || 'p');
    if (spec.cls) element.className = spec.cls;
    element.innerHTML = spec.html;
    iterm.appendChild(element);
    scrollToInput();
}

// print lines one by one, like the terminal is thinking
async function insertNewElement(lines, trailingBreak = true) {
    for (const line of lines) {
        appendLine(line);
        if (LINE_DELAY) await delay(LINE_DELAY);
    }
    if (trailingBreak) appendLine('');
}

async function openGithubRepository() {
    await insertNewElement(['<span class="event">event</span> - sending you to the GitHub repository!']);
    await delay(reducedMotion ? 0 : 1000);
    window.open(REPO_URL, '_blank', 'noopener');
}

function spellCheck(inputVal) {
    const known = Object.keys(commands);
    const guess = known.find((name) => name.startsWith(inputVal.slice(0, 3)) || inputVal.startsWith(name));
    const lines = [`<span class="error">error</span> - '${escapeHtml(inputVal)}' is not a valid command.`];
    lines.push(guess
        ? { cls: 'dim', html: `did you mean ${cmd(guess)}? type ${cmd('home')} to see every command.` }
        : { cls: 'dim', html: `type ${cmd('home')} or ${cmd('cmds')} to see a list of available commands.` });
    return insertNewElement(lines);
}

const commands = {
    home: () => { setTitleState('Terminal | Home'); return insertNewElement(home); },
    whoami: () => { setTitleState('Terminal | Background'); return insertNewElement(who); },
    education: () => { setTitleState('Terminal | Education'); return insertNewElement(education); },
    research: () => { setTitleState('Terminal | Research'); return insertNewElement(research); },
    figures: () => { setTitleState('Terminal | Figures'); return insertNewElement(figures); },
    experience: () => { setTitleState('Terminal | Experience'); return insertNewElement(experience); },
    projects: () => { setTitleState('Terminal | My Projects'); return insertNewElement(projects); },
    skills: () => { setTitleState('Terminal | My Skills'); return insertNewElement(skills); },
    outreach: () => { setTitleState('Terminal | Outreach'); return insertNewElement(outreach); },
    values: () => { setTitleState('Terminal | Values'); return insertNewElement(values); },
    socials: () => { setTitleState('Terminal | My Socials'); return insertNewElement(socials); },
    system: () => { setTitleState('Terminal | System'); return insertNewElement(system); },
    repo: () => openGithubRepository(),
    clear: () => { iterm.innerHTML = ''; setTitleState('Terminal | yourastrophysicist'); },
    cv: async () => {
        setTitleState('Terminal | CV');
        await insertNewElement([
            head('Jessica Syafaq Muthmaina — curriculum vitae'),
            'Observational Astrophysics and Cosmology M.Sc. student at the University of Padua with published research on quasar stability using VLBI data and Python pipelines. Proficient in data analysis and statistical modelling for large datasets.',
        ]);
        await insertNewElement(education);
        await insertNewElement(research.slice(0, 4));
        await insertNewElement(experience);
        await insertNewElement(skills);
        await insertNewElement([{ cls: 'dim', html: `references available on request — ${cmd('socials')}` }]);
    },
    notes: () => (isUnlocked() ? showVault() : startQuiz()),
    open: (args) => openNote(args[0]),
    lock: () => {
        setUnlocked(false);
        return insertNewElement(['<span class="event">event</span> - second brain locked']);
    },
    ls: () => insertNewElement([
        Object.keys(files).map((name) => cmd(`cat ${name}`, name)).join('&nbsp;&nbsp;'),
    ]),
    cat: (args) => {
        const target = files[args[0]] || files[`${args[0]}/`];
        if (target) return runCommand(target);
        return insertNewElement([`<span class="error">error</span> - cat: ${escapeHtml(args[0] || '')}: no such file. try ${cmd('ls')}`]);
    },
    sudo: () => insertNewElement(['<span class="error">error</span> - visitor is not in the sudoers file. this incident will be reported to the nearest black hole.']),
};

const aliases = {
    cmds: 'home', help: 'home', who: 'whoami', about: 'whoami', paper: 'research', publication: 'research',
    contact: 'socials', astronotes: 'notes', brain: 'notes', cls: 'clear', exit: 'clear',
};

function runCommand(line) {
    const [name, ...args] = line.toLowerCase().split(/\s+/);
    const resolved = aliases[name] || name;
    if (Object.prototype.hasOwnProperty.call(commands, resolved)) return commands[resolved](args);
    return spellCheck(line);
}

// one command at a time, so typed output never interleaves
let queue = Promise.resolve();
const history = [];
let historyIndex = 0;

function callCommand(raw) {
    const line = raw.trim();
    if (!line) return;
    history.push(line);
    historyIndex = history.length;

    queue = queue.then(async () => {
        appendLine({ cls: 'echo', html: `<span class="inputLine">${promptLabel.innerHTML}</span> ${escapeHtml(line)}` });
        if (quiz) await answerQuiz(line);
        else await runCommand(line);
        scrollToInput();
    }).catch((error) => {
        console.error(error);
        appendLine('<span class="error">error</span> - something went wrong running that command.');
    });
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    callCommand(input.value);
    input.value = '';
});

input.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
        if (!history.length) return;
        e.preventDefault();
        historyIndex = Math.max(0, Math.min(history.length, historyIndex + (e.key === 'ArrowUp' ? -1 : 1)));
        input.value = history[historyIndex] || '';
    } else if (e.key === 'Tab' && input.value && !quiz) {
        const typed = input.value.toLowerCase();
        const matches = Object.keys(commands).filter((name) => name.startsWith(typed));
        if (matches.length === 1) {
            e.preventDefault();
            input.value = matches[0];
        }
    } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        commands.clear();
    }
});

document.addEventListener('click', (e) => {
    const commandButton = e.target.closest('.cmd');
    if (commandButton) {
        callCommand(commandButton.dataset.cmd);
        input.focus({ preventScroll: true });
        return;
    }

    const noteLink = e.target.closest('a[data-view]');
    if (noteLink && !e.ctrlKey && !e.metaKey && !e.shiftKey) {
        e.preventDefault();
        callCommand(`open ${noteLink.dataset.view.toLowerCase()}`);
        return;
    }

    // click anywhere on the terminal to keep typing, unless selecting text or using a link
    if (!viewer.hidden || e.target.closest('a, button, input')) return;
    if (String(window.getSelection())) return;
    input.focus({ preventScroll: true });
});

viewerClose.addEventListener('click', closeViewer);
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeViewer();
});

// boot sequence
queue = queue.then(() => insertNewElement([
    '<span class="event">event</span> - pointing telescopes',
    '<span class="event">event</span> - correlating baselines',
    '<span class="success">success</span> - fringes detected, connected to Padova',
    '',
    "Hi, I'm <span class=\"title\">Jessica Syafaq Muthmaina</span> — your astrophysicist.",
    `please type ${cmd('home')} or ${cmd('cmds')} to see a list of available commands.`,
]));
