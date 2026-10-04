/* Jessica Syafaq Muthmaina, terminal portfolio
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

const SUBSTACK = 'https://yourastrophysicist.substack.com';

function essay(slug, title) {
    return link(title, `${SUBSTACK}/p/${slug}`);
}

const home = [
    { cls: 'row', html: `${cmd('whoami')}<span>- who am I?</span>` },
    { cls: 'row', html: `${cmd('now')}<span>- what I am studying this semester</span>` },
    { cls: 'row', html: `${cmd('education')}<span>- where I studied</span>` },
    { cls: 'row', html: `${cmd('research')}<span>- my published work on quasar 4C31.61</span>` },
    { cls: 'row', html: `${cmd('figures')}<span>- Allan deviation plots from the paper</span>` },
    { cls: 'row', html: `${cmd('experience')}<span>- research and work experience</span>` },
    { cls: 'row', html: `${cmd('projects')}<span>- view my projects</span>` },
    { cls: 'row', html: `${cmd('skills')}<span>- view my toolchain</span>` },
    { cls: 'row', html: `${cmd('writing')}<span>- essays from my Substack</span>` },
    { cls: 'row', html: `${cmd('outreach')}<span>- video, writing and community work</span>` },
    { cls: 'row', html: `${cmd('values')}<span>- what I believe, in my own sentences</span>` },
    { cls: 'row', html: `${cmd('cv')}<span>- the whole CV in one go</span>` },
    { cls: 'row', html: `${cmd('socials')}<span>- view my socials and contact</span>` },
    { cls: 'row', html: `${cmd('notes')}<span>- my second brain, Your AstroNotes <span class="event">(quiz-locked)</span></span>` },
    { cls: 'row', html: `${cmd('repo')}<span>- view project source</span>` },
    { cls: 'row', html: `${cmd('system')}<span>- view project information</span>` },
    { cls: 'row', html: `${cmd('clear')}<span>- clear the terminal</span>` },
    { cls: 'dim', html: 'tip - commands are clickable, tab completes, ↑/↓ walks history' },
];

const who = [
    head('Jessica Syafaq Muthmaina'),
    { cls: 'dim', html: 'a BRAT astrophysicist' },
    '',
    'I am a second-year M.Sc. student in Astrophysics and Cosmology at the University of Padua. I came here from Indonesia, where I studied Physics at Universitas Gadjah Mada.',
    '',
    "Most of my time in Padova is not spent looking at the night sky through a romantic telescope. It is spent at a desk, wrestling with Einstein's field equations, taking apart radiative transfer integrals, and tidying Christoffel symbols on scratch paper.",
    { cls: 'dim', html: `my own words, translated from ${essay('melepaskan-ribuan-catatan-ke-ruang', 'Melepaskan Ribuan Catatan ke Ruang Terbuka')}` },
    '',
    'My published research follows 33 years of VLBI observations of the quasar 4C31.61 to test how stable it is as an anchor of the celestial reference frame. This year I am working on exoplanet transit photometry, Bayesian statistics and atmospheric retrievals.',
    '',
    'I write essays on Substack, mostly in Indonesian, about physics, science in public life and being a person. I make videos as Observationally Speaking, and I founded Sadar Setara, an advocacy platform for gender equality and human rights in Garut.',
    { cls: 'dim', html: `next - ${cmd('now')} · ${cmd('research')} · ${cmd('writing')} · ${cmd('notes')}` },
];

const now = [
    head('This semester in Padova (M.Sc. year 2, autumn 2026)'),
    row('exoplanets', 'Exoplanetary Astrophysics. Demographics, 51 Peg b, TRAPPIST-1, radial velocity semi-amplitudes and transit light curves.'),
    row('statistics', 'Astro-Statistics and Cosmology. Probability as extended logic, parameter estimation, Fisher information and MCMC sampling.'),
    row('laboratory', 'Astrophysics Laboratory 2. Exoplanet transit photometry with the Copernico 1.82 m telescope (TASTE) and TESS, CCD calibration, aperture extraction and Bayesian MCMC modelling.'),
    row('computing', 'Computational Astrophysics. Forward radiative transfer, atmospheric retrievals with TauREx 3, nested sampling and MPI scaling on CloudVeneto.'),
    row('side quest', 'Archaeoastronomy of Nusantara. Old Javanese inscriptions and wariga dating read as astronomical records.'),
    { cls: 'dim', html: `the first year lives in my second brain - ${cmd('notes')}` },
];

const education = [
    head('Education'),
    row('2025-now', `<span class="success">M.Sc. Astrophysics and Cosmology</span>, ${link('University of Padua', 'https://www.unipd.it/en/')}, Italy`, true),
    row('', 'Concentration in Observational and Computational Astrophysics', true),
    row('', 'Year 1 - Fundamentals of Astrophysics and Cosmology, Observational Astrophysics, General Relativity, Mathematical and Numerical Methods, Astrophysics Laboratory 1 (High Energy), Astrophysics of Galaxies, Stellar Astrophysics, Astronomical Interferometry, Observational Cosmology, Astronomical Spectroscopy', true),
    row('', 'Year 2 - Exoplanetary Astrophysics, Astro-Statistics and Cosmology, Astrophysics Laboratory 2, Computational Astrophysics', true),
    row('2019-2023', `<span class="success">B.Sc. Physics</span>, ${link('Universitas Gadjah Mada', 'https://fisika.fmipa.ugm.ac.id/')}, Indonesia`, true),
    row('', 'Concentration in Theoretical and Computational Physics', true),
    row('', `Thesis on the Allan standard deviation technique in variability analysis of the quasar 4C31.61 (${link('repository', 'https://etd.repository.ugm.ac.id/penelitian/detail/225834')})`, true),
];

const research = [
    head('Implementation of Allan Standard Deviation Technique in Stability Analysis of 4C31.61 Quasar Position'),
    'J. S. Muthmaina, I. N. Huda, D. S. Palupi',
    { cls: 'dim', html: 'Journal of Physics Conference Series 2773 (2024) 012007' },
    `${link('DOI 10.1088/1742-6596/2773/1/012007', 'https://doi.org/10.1088/1742-6596/2773/1/012007')} · ${link('arXiv 2401.12325', 'https://arxiv.org/abs/2401.12325')}`,
    '',
    row('question', 'The International Celestial Reference Frame is pinned to thousands of quasars observed with VLBI. It is only as good as those quasars are still. Is 4C31.61 (2201+315) a stable anchor?'),
    row('data', '33 years of VLBI sessions (1990 to 2023, 6,342 sessions), reduced with VieVS against ICRF-3 and ITRF-2020 and cross-checked with the Paris Observatory Geodetic VLBI Center solution.'),
    row('method', 'Overlapping Allan standard deviation of the position time series. The log-log slope separates white noise (stable) from flicker noise and random walk (unstable).'),
    row('result', '<span class="success">White noise dominates across most time scales</span>, so the position is stable. A random walk signature at long time scales may trace jet ejections or binary black hole motion.'),
    { cls: 'dim', html: `see the plots - ${cmd('figures')}` },
];

const figures = [
    head('Figure 1 - overlapping Allan standard deviation, quasar 4C31.61'),
    {
        cls: 'figures', tag: 'div', html: [
            ['img/vievs-allan-ra.png', '(a) VieVS, α cos δ'],
            ['img/vievs-allan-dec.png', '(b) VieVS, δ'],
            ['img/paris-allan-ra.png', '(c) Paris Observatory GVC, α cos δ'],
            ['img/paris-allan-dec.png', '(d) Paris Observatory GVC, δ'],
        ].map(([src, caption]) =>
            `<figure><a href="${src}" target="_blank" rel="noopener"><img src="${src}" alt="Allan standard deviation plot ${caption}" loading="lazy"></a><figcaption>${caption}</figcaption></figure>`
        ).join('')
    },
    { cls: 'dim', html: 'Top row from my VieVS time series, bottom row from the independent Paris Observatory solution. The τ^(-1/2) slope at short sampling intervals is the white noise signature.' },
];

const experience = [
    head('Research and work'),
    row('2023', `<span class="success">Research Intern</span>, ${link('National Research and Innovation Agency (BRIN)', 'https://brin.go.id/')}. Processed and analysed VLBI datasets with VieVS and Paris Observatory data for celestial reference frame research.`, true),
    row('2024', `<span class="success">Technical Writer</span>, ${link('Ministry of Energy and Mineral Resources (ESDM)', 'https://esdm.go.id/')}. Turned engineering requirements into clear documentation for 200+ stakeholders.`, true),
    row('2024', '<span class="success">Data Analyst and Field Researcher</span>, Saving Next Generation Indonesia. Evaluated programme effectiveness with fsQCA and wrote policy recommendations.', true),
    row('2022', `<span class="success">Data Science Intern</span>, ${link('Startup Campus', 'https://startupcampus.id/')}. Tableau dashboards, RFM and K-Means customer segmentation, A/B test analysis.`, true),
    '',
    head('Teaching and leadership'),
    row('2025-now', '<span class="success">Founder</span>, Sadar Setara. A social advocacy platform for gender equality and human rights in Garut, Indonesia.', true),
    row('2022', '<span class="success">Teaching and Lab Assistant</span>, Universitas Gadjah Mada. Guided 30+ students through physics laboratory experiments and exam preparation.', true),
];

const projects = [
    head('Projects'),
    row('astronotes', `Your AstroNotes, my second brain. More than 1,300 atomic notes and a Map of Content for every course of the Padova M.Sc., written so that no derivation skips a step. Type ${cmd('notes')} to unlock it.`),
    row('comp_astro', `${link('comp_astro_26', 'https://github.com/yourastrophysicist/comp_astro_26')}, computational astrophysics coursework.`),
    row('gender-data', `Data-driven analysis of gender inequality across Indonesian provinces with regression modelling and demographic decomposition. ${link('arXiv 2412.00012', 'https://arxiv.org/abs/2412.00012')}`),
    row('quasar', `VLBI stability analysis of 4C31.61. See ${cmd('research')}.`),
    row('substack', `Essays in Indonesian and English. See ${cmd('writing')}.`),
    row('this site', `A terminal you are typing into right now. See ${cmd('repo')}.`),
];

const skills = [
    head('Toolchain'),
    row('python', 'Astropy | NumPy | SciPy | Matplotlib | Polars | scikit-learn'),
    row('radio', 'VieVS (Vienna VLBI Software) | Paris Observatory GVC data | Allan variance analysis'),
    row('this year', 'transit photometry | CCD calibration | Bayesian MCMC | TauREx 3 retrievals | nested sampling | mpi4py'),
    row('languages', 'Python | C | Shell | LaTeX'),
    row('data', 'statistical modelling | Tableau | K-Means and RFM | A/B testing | fsQCA'),
    row('knowledge', 'Obsidian Zettelkasten | Maps of Content'),
    row('human', 'Indonesian (native) | English (C1) | French (A2)'),
];

// Essays as published on Substack, with my own titles and subtitles.
const essays = [
    ['id', 'logika-saintifik-bukan-barang-mewah', 'Logika Saintifik Bukan Barang Mewah', 'Indonesia bersiap menampung lumbung data center raksasa, tetapi tanpa logika saintifik kita cuma menjelma sapi gelonggongan yang mati kekenyangan.'],
    ['id', 'kamu-bukan-kelabang-empat-dimensi', 'Kamu bukan kelabang empat dimensi', 'Indonesia belum siap belajar astrofisika dan kosmologi.'],
    ['id', 'melepaskan-ribuan-catatan-ke-ruang', 'Melepaskan Ribuan Catatan ke Ruang Terbuka', 'rahasia alam semesta terlalu berat jika hanya disimpan sendiri.'],
    ['id', 'belajar-alam-semesta-bukan-lomba', 'Belajar Alam Semesta Bukan Lomba Lari', 'beban mengatahui usia alam semesta.'],
    ['id', 'aku-lulus-ujian-lisan-general-relativity', 'Aku Lulus Ujian Lisan General Relativity dan Rumus Einstein Bukan Satu-satunya yang Menyakitkan', 'Tentang melewati warisan matematis yang membuatmu ingin menangis'],
    ['en', 'it-all-starts-from-an-astronomy-club', 'It All Starts From an Astronomy Club', 'Roman Space Telescope just launched :)'],
    ['id', 'satu-teleskop-tidak-pernah-cukup', 'Satu Teleskop Tidak Pernah Cukup untuk Memuaskan Rasa Ingin Tahu', 'bagaimana astronom merentangkan jarak demi melihat detail terdalam semesta'],
    ['en', 'it-was-never-about-how-smart-you', 'It Was Never About How Smart You Are', 'Someone dumped a kilogram of salt on a cake you spent years baking.'],
    ['id', 'ai-tidak-membunuh-ilmu-pengetahuan', 'AI Tidak Membunuh Ilmu Pengetahuan Tapi Manusia yang Memakainya Bisa', 'Mengapa membatasi AI bukan tanda ketinggalan zaman, melainkan bentuk pertahanan paling rasional yang tersisa.'],
];

const writing = [
    head('your astrophysicist, on Substack'),
    { cls: 'dim', html: 'a BRAT astrophysicist' },
    '',
    ...essays.flatMap(([lang, slug, title, subtitle]) => [
        { cls: 'hang', html: `<span class="key">[${lang}]</span> ${essay(slug, title)}` },
        { cls: 'sub dim', html: subtitle },
    ]),
    '',
    `${link('read everything on Substack', SUBSTACK)}`,
];

const outreach = [
    head('Science communication'),
    row('substack', `${link('your astrophysicist', SUBSTACK)}. Essays in Indonesian and English. See ${cmd('writing')}.`),
    row('youtube', `${link('Observationally Speaking', 'https://www.youtube.com/@obspeaking')}. Astrophysics on video.`),
    row('instagram', `${link('@your.astrophysicist', 'https://www.instagram.com/your.astrophysicist/')}. Research and M.Sc. life in Padua.`),
    row('notes', `Your AstroNotes, an open digital garden of my lecture notes. See ${cmd('notes')}.`),
    row('advocacy', 'Sadar Setara. Gender equality and human rights advocacy in Garut, Indonesia.'),
];

const values = [
    head('What I believe, in my own sentences'),
    'Scientific logic is not a luxury good.',
    { cls: 'indent dim', html: `from ${essay('logika-saintifik-bukan-barang-mewah', 'Logika Saintifik Bukan Barang Mewah')}` },
    'Learning the universe is not a race.',
    { cls: 'indent dim', html: `from ${essay('belajar-alam-semesta-bukan-lomba', 'Belajar Alam Semesta Bukan Lomba Lari')}` },
    'Knowledge about this vast universe was never meant to make us feel smarter or higher than other people.',
    { cls: 'indent dim', html: `from ${essay('melepaskan-ribuan-catatan-ke-ruang', 'Melepaskan Ribuan Catatan ke Ruang Terbuka')}` },
    'Ambition without action becomes anxiety.',
    { cls: 'indent dim', html: `from ${essay('it-all-starts-from-an-astronomy-club', 'It All Starts From an Astronomy Club')}` },
    { cls: 'dim', html: 'the first three are translated from Indonesian' },
];

const socialNames = ['GitHub', 'LinkedIn', 'Instagram', 'YouTube', 'Substack', 'Email'];
const socialLinks = [
    'https://github.com/yourastrophysicist',
    'https://www.linkedin.com/in/syafaqmuth/',
    'https://www.instagram.com/your.astrophysicist/',
    'https://www.youtube.com/@obspeaking',
    SUBSTACK,
    'mailto:jessicasyafaq.muthmaina@studenti.unipd.it',
];
const socials = socialNames.map((name, i) => link(name, socialLinks[i]));

const system = [
    row('author', 'Jessica Syafaq Muthmaina'),
    row('host', 'Padova, Italy (45.4° N, 11.9° E)'),
    row('framework', 'none, plain HTML, CSS and JavaScript'),
    row('design', `after ${link('Terminal-Portfolio', 'https://github.com/jackb1434/Terminal-Portfolio')} by jackb1434`),
    row('theme', 'gruvbox dark'),
    row('version', '2.1.0'),
    row('updated', '2026-10-04'),
];

const files = {
    'aboutme.txt': 'whoami',
    'now.txt': 'now',
    'quasar.doc': 'research',
    'cv_latex.pdf': 'cv',
    'essays/': 'writing',
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
// Add or edit questions freely, any entry in `answers` is accepted.
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
        `Password required. Luckily the password is astronomy. Answer ${QUIZ_LENGTH} easy questions to get in.`,
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
            `<span class="error">error</span> - not quite. hint - ${current.hint}`,
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
        '<span class="success">success</span> - access granted. welcome to the second brain',
    ]);
    await showVault();
}

async function showVault() {
    const lines = [
        head('~/second-brain/your_astronotes'),
        'From your BRAT astrophysicist for your astronotes. More than 1,300 atomic notes, derivations and Maps of Content from the first year of the Padova M.Sc., compiled, derived and explored by one voyager only.',
        'I rewrote every derivation without skipping a step. Keeping all of it locked in my laptop felt selfish, so the door is wide open.',
        { cls: 'dim', html: `the story, in Indonesian - ${essay('melepaskan-ribuan-catatan-ke-ruang', 'Melepaskan Ribuan Catatan ke Ruang Terbuka')}` },
        '',
    ];
    [1, 2].forEach((sem) => {
        lines.push({ cls: 'event', html: sem === 1 ? 'semester-1/ foundations' : 'semester-2/ stars, galaxies, cosmology' });
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
        await insertNewElement([`<span class="error">error</span> - usage - open &lt;1-${courses.length} | atlas | home&gt;`]);
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
    now: () => { setTitleState('Terminal | Now'); return insertNewElement(now); },
    writing: () => { setTitleState('Terminal | Writing'); return insertNewElement(writing); },
    socials: () => { setTitleState('Terminal | My Socials'); return insertNewElement(socials); },
    system: () => { setTitleState('Terminal | System'); return insertNewElement(system); },
    repo: () => openGithubRepository(),
    clear: () => { iterm.innerHTML = ''; setTitleState('Terminal | yourastrophysicist'); },
    cv: async () => {
        setTitleState('Terminal | CV');
        await insertNewElement([
            head('Jessica Syafaq Muthmaina, curriculum vitae'),
            'Observational Astrophysics and Cosmology M.Sc. student at the University of Padua with published research on quasar stability using VLBI data and Python pipelines. Proficient in data analysis and statistical modelling for large datasets.',
        ]);
        await insertNewElement(education);
        await insertNewElement(research.slice(0, 4));
        await insertNewElement(experience);
        await insertNewElement(skills);
        await insertNewElement([{ cls: 'dim', html: `references available on request, see ${cmd('socials')}` }]);
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
    contact: 'socials', astronotes: 'notes', brain: 'notes', essays: 'writing', substack: 'writing', blog: 'writing', cls: 'clear', exit: 'clear',
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
    "Hi, I'm <span class=\"title\">Jessica Syafaq Muthmaina</span>, your astrophysicist.",
    `please type ${cmd('home')} or ${cmd('cmds')} to see a list of available commands.`,
]));
