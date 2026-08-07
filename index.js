/* Jessica Syafaq Muthmaina - Interactive Windows 98 / Y2K Desktop JavaScript Logic */

let activeDragWindow = null;
let dragOffsetX = 0;
let dragOffsetY = 0;
let topZIndex = 100;

document.addEventListener("DOMContentLoaded", () => {
    // 1. Initial window layout and tray clock setup
    updateTrayClock();
    setInterval(updateTrayClock, 1000);
    updateLockClock();
    setInterval(updateLockClock, 1000);
    
    // Start clean with NO windows open on startup as requested
    document.querySelectorAll('.window').forEach(win => {
        win.style.display = 'none';
    });
    rebuildTaskbarTabs();
    
    // Global mousedown/touchstart listeners to handle window focus activation
    document.querySelectorAll('.window').forEach(win => {
        win.addEventListener('mousedown', () => focusWindow(win.id));
        win.addEventListener('touchstart', () => focusWindow(win.id), { passive: true });
    });

    // Touch listeners for titlebars on mobile
    document.querySelectorAll('.title-bar').forEach(tb => {
        const parentWin = tb.closest('.window');
        if (parentWin) {
            tb.addEventListener('touchstart', (e) => dragStart(e, parentWin.id), { passive: false });
        }
    });

    // Close Start Menu when clicking outside
    document.addEventListener('click', (e) => {
        const startBtn = document.getElementById('start-menu-btn');
        const startMenu = document.getElementById('start-menu');
        if (startMenu && startBtn) {
            if (!startBtn.contains(e.target) && !startMenu.contains(e.target)) {
                startMenu.classList.remove('show-menu');
                startBtn.classList.remove('active');
            }
        }
    });

    // 2. Allan Deviation Simulator Initialization
    initAllanSimulator();

    // 3. Initialize SoundCloud API Widget
    initSoundCloudWidget();
});

/* Lock Screen Handler */
function unlockDesktop() {
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen && lockScreen.style.display !== 'none') {
        lockScreen.classList.add('unlock-fade');
        setTimeout(() => {
            lockScreen.style.display = 'none';
        }, 400);
    }
}

document.addEventListener('keydown', (e) => {
    const lockScreen = document.getElementById('lock-screen');
    if (lockScreen && lockScreen.style.display !== 'none') {
        if (e.key === 'Enter' || e.key === 'Escape' || (e.ctrlKey && e.altKey && (e.key === 'Delete' || e.key === 'Del'))) {
            unlockDesktop();
        }
    }
});

function updateLockClock() {
    const el = document.getElementById('lock-screen-clock');
    if (!el) return;
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    el.textContent = `${hours}:${minutes} ${ampm}`;
}

/* Window Dragging Handlers (Mouse & Touch Support for Mobile) */
function dragStart(e, windowId) {
    const win = document.getElementById(windowId);
    if (!win || win.classList.contains('maximized-window')) return;
    
    // Bring window to focus
    focusWindow(windowId);
    
    activeDragWindow = win;
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    dragOffsetX = clientX - win.offsetLeft;
    dragOffsetY = clientY - win.offsetTop;
    
    document.addEventListener('mousemove', dragMove);
    document.addEventListener('mouseup', dragEnd);
    document.addEventListener('touchmove', dragMove, { passive: false });
    document.addEventListener('touchend', dragEnd);
}

function dragMove(e) {
    if (!activeDragWindow) return;
    
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    
    let left = clientX - dragOffsetX;
    let top = clientY - dragOffsetY;
    
    // Constrain within desktop boundary
    const desktop = document.getElementById('desktop');
    if (desktop) {
        const maxLeft = Math.max(0, desktop.clientWidth - activeDragWindow.clientWidth);
        const maxTop = Math.max(0, desktop.clientHeight - activeDragWindow.clientHeight);
        
        if (left < 0) left = 0;
        if (top < 0) top = 0;
        if (left > maxLeft) left = maxLeft;
        if (top > maxTop) top = maxTop;
    }
    
    activeDragWindow.style.left = left + 'px';
    activeDragWindow.style.top = top + 'px';
    
    if (e.touches) e.preventDefault();
}

function dragEnd() {
    activeDragWindow = null;
    document.removeEventListener('mousemove', dragMove);
    document.removeEventListener('mouseup', dragEnd);
    document.removeEventListener('touchmove', dragMove);
    document.removeEventListener('touchend', dragEnd);
}

/* Window Control Actions */
function openWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    
    win.classList.remove('minimized-window');
    win.style.display = 'flex';
    focusWindow(windowId);
    rebuildTaskbarTabs();

    if (window.MathJax && window.MathJax.typesetPromise) {
        try { window.MathJax.typesetPromise([win]); } catch(e){}
    }
}

function closeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    
    win.style.display = 'none';
    rebuildTaskbarTabs();
}

function minimizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    
    win.classList.add('minimized-window');
    rebuildTaskbarTabs();
}

function maximizeWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    
    win.classList.toggle('maximized-window');
    
    // Refocus on maximize
    focusWindow(windowId);
}

function focusWindow(windowId) {
    const win = document.getElementById(windowId);
    if (!win) return;
    
    // Check if it's already top focused
    if (win.style.zIndex == topZIndex && win.classList.contains('active-window')) {
        return;
    }
    
    // Reset all active classes
    document.querySelectorAll('.window').forEach(w => {
        w.classList.remove('active-window');
    });
    
    topZIndex += 2;
    win.style.zIndex = topZIndex;
    win.classList.add('active-window');
    
    // Sync taskbar active state
    updateActiveTaskTab(windowId);
}

/* Taskbar Synchronization */
function rebuildTaskbarTabs() {
    const tabContainer = document.getElementById('taskbar-tabs');
    if (!tabContainer) return;
    
    tabContainer.innerHTML = '';
    
    // Get all windows
    const windows = document.querySelectorAll('.window');
    windows.forEach(win => {
        // Only show tabs for windows that are open (style.display !== 'none')
        if (win.style.display !== 'none') {
            const windowId = win.id;
            const titleBar = win.querySelector('.title-bar-text');
            const titleText = titleBar ? titleBar.textContent : 'Window';
            
            const tab = document.createElement('div');
            tab.className = 'task-tab';
            tab.id = 'tab-' + windowId;
            tab.textContent = titleText;
            
            // Toggle minimize/focus on tab click
            tab.addEventListener('click', () => {
                if (win.classList.contains('minimized-window')) {
                    // Restore and focus
                    win.classList.remove('minimized-window');
                    focusWindow(windowId);
                    rebuildTaskbarTabs();
                } else if (win.classList.contains('active-window')) {
                    // Minimize if already focused
                    win.classList.add('minimized-window');
                    rebuildTaskbarTabs();
                } else {
                    // Just bring to focus
                    focusWindow(windowId);
                }
            });
            
            if (win.classList.contains('active-window') && !win.classList.contains('minimized-window')) {
                tab.classList.add('active-tab');
            }
            
            tabContainer.appendChild(tab);
        }
    });
}

function updateActiveTaskTab(windowId) {
    document.querySelectorAll('.task-tab').forEach(tab => {
        tab.classList.remove('active-tab');
    });
    const activeTab = document.getElementById('tab-' + windowId);
    if (activeTab) {
        activeTab.classList.add('active-tab');
    }
}

/* Start Menu Controls */
function toggleStartMenu() {
    const startMenu = document.getElementById('start-menu');
    const startBtn = document.getElementById('start-menu-btn');
    if (startMenu && startBtn) {
        startMenu.classList.toggle('show-menu');
        startBtn.classList.toggle('active');
    }
}

function launchAndClose(windowId) {
    openWindow(windowId);
    toggleStartMenu();
}

function closeAllAndAlert() {
    toggleStartMenu();
    // Simulate system shutdown dialogue
    alert("System Shutdown command received. System is going to standby mode. Click OK to return to desktop.");
}

/* System Tray Clock */
function updateTrayClock() {
    const clockElement = document.getElementById('taskbar-clock');
    if (!clockElement) return;
    
    const now = new Date();
    let hours = now.getHours();
    let minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; // Hour '0' should be '12'
    minutes = minutes < 10 ? '0' + minutes : minutes;
    
    clockElement.textContent = hours + ':' + minutes + ' ' + ampm;
}

/* 3. Allan Deviation Simulation Logic (arXiv:2401.12325 Quasar 4C31.61) */
function initAllanSimulator() {
    const canvases = [
        document.getElementById('allan-canvas'),
        document.getElementById('doc-allan-canvas')
    ].filter(Boolean);

    if (canvases.length === 0) return;

    // Observational Data Points from arXiv:2401.12325 (Quasar 4C31.61 position time series)
    const arxivDataPoints = [
        { tau: 5, sigma: 0.112 },
        { tau: 15, sigma: 0.068 },
        { tau: 30, sigma: 0.049 },
        { tau: 50, sigma: 0.042 },
        { tau: 90, sigma: 0.045 },
        { tau: 150, sigma: 0.054 },
        { tau: 250, sigma: 0.067 },
        { tau: 400, sigma: 0.086 }
    ];

    function drawSingleCanvas(cv, tauVal, baselineVal, totalSigma) {
        const ctx = cv.getContext('2d');
        const w = cv.width;
        const h = cv.height;

        ctx.clearRect(0, 0, w, h);
        
        // Dark background grid
        ctx.fillStyle = '#060612';
        ctx.fillRect(0, 0, w, h);

        ctx.strokeStyle = '#181830';
        ctx.lineWidth = 1;
        ctx.beginPath();
        for (let x = 0; x < w; x += 40) {
            ctx.moveTo(x, 0); ctx.lineTo(x, h);
        }
        for (let y = 0; y < h; y += 30) {
            ctx.moveTo(0, y); ctx.lineTo(w, y);
        }
        ctx.stroke();

        const scaleX = w / 500;
        const centerY = h * 0.85;

        // Draw theoretical white noise asymptote (slope -1/2)
        ctx.strokeStyle = 'rgba(0, 255, 200, 0.4)';
        ctx.lineWidth = 1.5;
        ctx.setLineDash([4, 4]);
        ctx.beginPath();
        for (let px = 0; px < w; px++) {
            const t = px / scaleX + 1;
            const sw = 0.25 * Math.pow(t, -0.5) * (8000 / baselineVal);
            const py = centerY - sw * (h * 1.8);
            if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Draw theoretical random walk asymptote (slope +1/2)
        ctx.strokeStyle = 'rgba(255, 180, 0, 0.4)';
        ctx.beginPath();
        for (let px = 0; px < w; px++) {
            const t = px / scaleX + 1;
            const srw = 0.003 * Math.pow(t, 0.5);
            const py = centerY - srw * (h * 1.8);
            if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();
        ctx.setLineDash([]);

        // Draw total Allan deviation curve σ_y(τ)
        ctx.strokeStyle = '#ff007f'; /* Y2K Magenta */
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let px = 0; px < w; px++) {
            const t = px / scaleX + 1;
            const sw = 0.25 * Math.pow(t, -0.5) * (8000 / baselineVal);
            const srw = 0.003 * Math.pow(t, 0.5);
            const sig = Math.sqrt(sw * sw + srw * srw);
            const py = centerY - sig * (h * 1.8);
            if (px === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
        }
        ctx.stroke();

        // Draw empirical arXiv:2401.12325 VLBI observational data points
        arxivDataPoints.forEach(pt => {
            const px = pt.tau * scaleX;
            const py = centerY - pt.sigma * (h * 1.8);
            ctx.fillStyle = '#00ffff';
            ctx.beginPath();
            ctx.arc(px, py, 3.5, 0, Math.PI * 2);
            ctx.fill();
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.stroke();
        });

        // Draw active tau pointer marker
        const markerX = tauVal * scaleX;
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        ctx.setLineDash([2, 2]);
        ctx.beginPath();
        ctx.moveTo(markerX, 0); ctx.lineTo(markerX, h);
        ctx.stroke();
        ctx.setLineDash([]);

        const markerY = centerY - totalSigma * (h * 1.8);
        ctx.fillStyle = '#ffff00'; /* Neon Yellow active marker */
        ctx.beginPath();
        ctx.arc(markerX, markerY, 5.5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Canvas legend overlay
        ctx.fillStyle = 'rgba(0,0,0,0.6)';
        ctx.fillRect(8, 8, 190, 42);
        ctx.strokeStyle = '#333355';
        ctx.strokeRect(8, 8, 190, 42);

        ctx.fillStyle = '#00ffff';
        ctx.font = '10px monospace';
        ctx.fillText('• arXiv:2401.12325 VLBI Data', 14, 22);

        ctx.fillStyle = '#ff007f';
        ctx.fillText('— Total σ_y(τ) Model', 14, 38);
    }

    function updateAll(srcTauVal, srcBaselineVal) {
        const tau = parseFloat(srcTauVal);
        const b = parseFloat(srcBaselineVal);

        const sigmaWhite = 0.25 * Math.pow(tau, -0.5) * (8000 / b);
        const sigmaRW = 0.003 * Math.pow(tau, 0.5);
        const totalSigma = Math.sqrt(sigmaWhite * sigmaWhite + sigmaRW * sigmaRW);
        const resStr = totalSigma.toFixed(3) + ' mas';

        // Update control panel elements for stand-alone simulator
        const inputTau = document.getElementById('input-tau');
        const inputBaseline = document.getElementById('input-baseline');
        const lblTau = document.getElementById('lbl-tau');
        const lblBaseline = document.getElementById('lbl-baseline');
        const lblResult = document.getElementById('lbl-result');

        if (inputTau) inputTau.value = tau;
        if (inputBaseline) inputBaseline.value = b;
        if (lblTau) lblTau.textContent = tau + ' days';
        if (lblBaseline) lblBaseline.textContent = b + ' km';
        if (lblResult) lblResult.textContent = resStr;

        // Update control panel elements for document embedded figure
        const docInputTau = document.getElementById('doc-input-tau');
        const docInputBaseline = document.getElementById('doc-input-baseline');
        const docLblTau = document.getElementById('doc-lbl-tau');
        const docLblBaseline = document.getElementById('doc-lbl-baseline');
        const docLblResult = document.getElementById('doc-lbl-result');

        if (docInputTau) docInputTau.value = tau;
        if (docInputBaseline) docInputBaseline.value = b;
        if (docLblTau) docLblTau.textContent = tau + ' days';
        if (docLblBaseline) docLblBaseline.textContent = b + ' km';
        if (docLblResult) docLblResult.textContent = resStr;

        // Re-render canvases
        canvases.forEach(cv => drawSingleCanvas(cv, tau, b, totalSigma));
    }

    // Attach listeners for main simulator controls
    const inputTau = document.getElementById('input-tau');
    const inputBaseline = document.getElementById('input-baseline');
    const calcBtn = document.getElementById('calc-btn');

    if (inputTau) inputTau.oninput = (e) => updateAll(e.target.value, inputBaseline ? inputBaseline.value : 8000);
    if (inputBaseline) inputBaseline.oninput = (e) => updateAll(inputTau ? inputTau.value : 50, e.target.value);
    if (calcBtn) calcBtn.onclick = () => updateAll(inputTau ? inputTau.value : 50, inputBaseline ? inputBaseline.value : 8000);

    // Attach listeners for doc embedded figure controls
    const docInputTau = document.getElementById('doc-input-tau');
    const docInputBaseline = document.getElementById('doc-input-baseline');

    if (docInputTau) docInputTau.oninput = (e) => updateAll(e.target.value, docInputBaseline ? docInputBaseline.value : 8000);
    if (docInputBaseline) docInputBaseline.oninput = (e) => updateAll(docInputTau ? docInputTau.value : 50, e.target.value);

    // Initial render
    updateAll(50, 8000);
}

/* PDF Viewer Tab Switcher */
function switchPdfTab(tabName) {
    const renderedView = document.getElementById('pdf-rendered-view');
    const texView = document.getElementById('pdf-tex-view');
    const btnRendered = document.getElementById('btn-pdf-rendered');
    const btnTex = document.getElementById('btn-pdf-tex');

    if (!renderedView || !texView) return;

    if (tabName === 'rendered') {
        renderedView.style.display = 'block';
        texView.style.display = 'none';
        btnRendered.classList.add('active-tab');
        btnTex.classList.remove('active-tab');
    } else {
        renderedView.style.display = 'none';
        texView.style.display = 'block';
        btnTex.classList.add('active-tab');
        btnRendered.classList.remove('active-tab');
    }
}

/* Winamp v2.91 Media Player Engine */
const winampPlaylist = [
    { title: "1. Ninajirachi - I Love My Computer", duration: 204, strDur: "3:24", freq: 440 },
    { title: "2. Ninajirachi - Start Button", duration: 178, strDur: "2:58", freq: 523 },
    { title: "3. Ninajirachi - Info Superhighway", duration: 225, strDur: "3:45", freq: 659 },
    { title: "4. Ninajirachi - Cyber Dream", duration: 252, strDur: "4:12", freq: 587 },
    { title: "5. Ninajirachi - Y2K System Shock", duration: 195, strDur: "3:15", freq: 698 },
    { title: "6. Ninajirachi - Binary Hearts", duration: 230, strDur: "3:50", freq: 784 }
];

let winampCurrentTrack = 0;
let winampIsPlaying = false;
let winampIsPaused = false;
let winampCurrentTime = 0;
let winampVolume = 0.8;
let winampTimerInterval = null;
let winampAnimFrame = null;
let audioCtx = null;
let synthOsc = null;
let synthGain = null;

let scWidget = null;
let scIsReady = false;

function initSoundCloudWidget() {
    const iframe = document.getElementById('sc-widget');
    if (!iframe) return;
    
    if (typeof SC === 'undefined' || !SC.Widget) {
        setTimeout(initSoundCloudWidget, 500);
        return;
    }
    
    try {
        scWidget = SC.Widget(iframe);
        scWidget.bind(SC.Widget.Events.READY, function() {
            scIsReady = true;
            scWidget.setVolume(winampVolume * 100);
            scWidget.getSounds(function(sounds) {
                if (sounds && sounds.length) {
                    winampPlaylist.length = 0;
                    sounds.forEach((snd, i) => {
                        const durMs = snd.duration || 204000;
                        const mins = Math.floor((durMs / 1000) / 60);
                        const secs = String(Math.floor((durMs / 1000) % 60)).padStart(2, '0');
                        
                        const trackName = (snd && snd.title && snd.title !== 'undefined') ? snd.title : 'I Love My Computer';
                        const artistName = (snd && snd.user && snd.user.username && snd.user.username !== 'undefined') ? snd.user.username : 'Ninajirachi';
                        
                        winampPlaylist.push({
                            title: `${i + 1}. ${artistName} - ${trackName}`,
                            duration: Math.floor(durMs / 1000),
                            strDur: `${mins}:${secs}`
                        });
                    });
                    renderPlaylistUI();
                    updateWinampUI();
                }
            });
        });
        
        scWidget.bind(SC.Widget.Events.PLAY_PROGRESS, function(data) {
            winampCurrentTime = Math.floor(data.currentPosition / 1000);
            updateWinampTimeDisplay();
            if (data.relativePosition) {
                const seekEl = document.getElementById('winamp-seek');
                if (seekEl) seekEl.value = Math.floor(data.relativePosition * 100);
            }
        });
        
        scWidget.bind(SC.Widget.Events.PLAY, function() {
            winampIsPlaying = true;
            winampIsPaused = false;
            startWinampVisualizer();
            updateWinampUI();
        });
        
        scWidget.bind(SC.Widget.Events.PAUSE, function() {
            winampIsPaused = true;
            updateWinampUI();
        });
        
        scWidget.bind(SC.Widget.Events.FINISH, function() {
            winampNext();
        });
    } catch(e) {
        console.error("SC Widget Init Error:", e);
    }
}

function renderPlaylistUI() {
    const listEl = document.getElementById('winamp-playlist-items');
    if (!listEl) return;
    listEl.innerHTML = '';
    
    let totalSecs = 0;
    winampPlaylist.forEach((item, idx) => {
        totalSecs += item.duration;
        const li = document.createElement('li');
        li.className = 'pl-item' + (idx === winampCurrentTrack ? ' active' : '');
        li.onclick = () => winampSelectTrack(idx);
        li.innerHTML = `<span>${item.title}</span> <span class="pl-dur">${item.strDur}</span>`;
        listEl.appendChild(li);
    });
    
    const infoEl = document.getElementById('pl-total-info');
    if (infoEl) {
        const tMins = Math.floor(totalSecs / 60);
        const tSecs = String(totalSecs % 60).padStart(2, '0');
        infoEl.textContent = `${winampPlaylist.length} tracks | ${tMins}:${tSecs} total time`;
    }
}

function winampPlay() {
    winampIsPlaying = true;
    winampIsPaused = false;
    if (scWidget && scIsReady) {
        try { scWidget.play(); } catch(e){}
    } else {
        initSoundCloudWidget();
    }
    startWinampVisualizer();
    updateWinampUI();
}

function winampPause() {
    if (winampIsPaused) {
        winampIsPaused = false;
        if (scWidget && scIsReady) {
            try { scWidget.play(); } catch(e){}
        }
    } else {
        winampIsPaused = true;
        if (scWidget && scIsReady) {
            try { scWidget.pause(); } catch(e){}
        }
    }
    updateWinampUI();
}

function winampStop() {
    winampIsPlaying = false;
    winampIsPaused = false;
    winampCurrentTime = 0;
    if (scWidget && scIsReady) {
        try { scWidget.pause(); scWidget.seekTo(0); } catch(e){}
    }
    if (winampAnimFrame) cancelAnimationFrame(winampAnimFrame);
    clearWinampCanvas();
    updateWinampUI();
}

function winampNext() {
    winampCurrentTrack = (winampCurrentTrack + 1) % winampPlaylist.length;
    winampCurrentTime = 0;
    if (scWidget && scIsReady) {
        try { scWidget.skip(winampCurrentTrack); scWidget.play(); } catch(e){}
    }
    updateWinampUI();
}

function winampPrev() {
    winampCurrentTrack = (winampCurrentTrack - 1 + winampPlaylist.length) % winampPlaylist.length;
    winampCurrentTime = 0;
    if (scWidget && scIsReady) {
        try { scWidget.skip(winampCurrentTrack); scWidget.play(); } catch(e){}
    }
    updateWinampUI();
}

function winampSelectTrack(index) {
    winampCurrentTrack = index;
    winampCurrentTime = 0;
    if (scWidget && scIsReady) {
        try { scWidget.skip(index); scWidget.play(); } catch(e){}
    }
    winampPlay();
}

function winampSetVolume(val) {
    winampVolume = val / 100;
    const volEl = document.getElementById('winamp-vol-val');
    if (volEl) volEl.textContent = val + '%';
    if (scWidget && scIsReady) {
        try { scWidget.setVolume(val); } catch(e){}
    }
}

function winampSeek(val) {
    if (scWidget && scIsReady) {
        try {
            scWidget.getDuration(function(duration) {
                const targetMs = (val / 100) * duration;
                scWidget.seekTo(targetMs);
            });
        } catch(e){}
    }
}

function startWinampTimer() {
    if (winampTimerInterval) clearInterval(winampTimerInterval);
    winampTimerInterval = setInterval(() => {
        if (!winampIsPlaying || winampIsPaused) return;
        winampCurrentTime++;
        const track = winampPlaylist[winampCurrentTrack];
        if (winampCurrentTime >= track.duration) {
            winampNext();
        } else {
            updateWinampTimeDisplay();
        }
    }, 1000);
}

function updateWinampTimeDisplay() {
    const mins = String(Math.floor(winampCurrentTime / 60)).padStart(2, '0');
    const secs = String(winampCurrentTime % 60).padStart(2, '0');
    const timeEl = document.getElementById('winamp-time');
    if (timeEl) timeEl.textContent = `${mins}:${secs}`;
    
    const track = winampPlaylist[winampCurrentTrack];
    const seekEl = document.getElementById('winamp-seek');
    if (seekEl) seekEl.value = (winampCurrentTime / track.duration) * 100;
}

function updateWinampUI() {
    const defaultTrack = { title: "1. Ninajirachi - I Love My Computer", duration: 204, strDur: "3:24" };
    const track = winampPlaylist[winampCurrentTrack] || winampPlaylist[0] || defaultTrack;
    const tickerEl = document.getElementById('winamp-ticker');
    if (tickerEl) {
        let trackTitle = (track && track.title) ? track.title : "1. Ninajirachi - I Love My Computer";
        trackTitle = trackTitle.replace(/undefined/g, "Ninajirachi");
        const trackDur = (track && track.strDur) ? track.strDur : "3:24";
        const state = winampIsPaused ? '[PAUSED] ' : (winampIsPlaying ? '▶ PLAYING: ' : '■ STOPPED: ');
        tickerEl.textContent = `${state} ${trackTitle} (${trackDur}) *** WINAMP v2.91 ***`;
    }
    
    updateWinampTimeDisplay();

    // Highlight active track in playlist
    const items = document.querySelectorAll('.pl-item');
    items.forEach((item, idx) => {
        if (idx === winampCurrentTrack) {
            item.classList.add('active');
        } else {
            item.classList.remove('active');
        }
    });
}

let synthInterval = null;
let noteStep = 0;

const trackMelodies = [
    // Track 1: I Love My Computer (C Major Hyperpop Lead)
    [261.63, 329.63, 392.00, 523.25, 659.25, 523.25, 392.00, 329.63],
    // Track 2: Start Button (E Minor Electro Wave)
    [329.63, 392.00, 493.88, 659.25, 783.99, 659.25, 493.88, 392.00],
    // Track 3: Info Superhighway (F Major Chiptune)
    [349.23, 440.00, 523.25, 698.46, 880.00, 698.46, 523.25, 440.00],
    // Track 4: Cyber Dream (A Minor Ambient Pulse)
    [220.00, 261.63, 329.63, 440.00, 523.25, 440.00, 329.63, 261.63],
    // Track 5: Y2K System Shock (G Major Bass Synth)
    [196.00, 246.94, 293.66, 392.00, 493.88, 392.00, 293.66, 246.94],
    // Track 6: Binary Hearts (D Minor Synthpop)
    [293.66, 349.23, 440.00, 587.33, 698.46, 587.33, 440.00, 349.23]
];

function startWinampAudioSynth() {
    try {
        if (!audioCtx) {
            audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
        stopWinampAudioSynth();
        
        noteStep = 0;
        const melody = trackMelodies[winampCurrentTrack % trackMelodies.length];
        
        // Play melodic electronic synth notes & bass beat pulse every 180ms
        synthInterval = setInterval(() => {
            if (!winampIsPlaying || winampIsPaused || !audioCtx) return;
            
            const freq = melody[noteStep % melody.length];
            noteStep++;
            
            // Lead Synth Note
            const osc = audioCtx.createOscillator();
            const gain = audioCtx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            const volume = winampVolume * 0.25;
            gain.gain.setValueAtTime(0.01, audioCtx.currentTime);
            gain.gain.linearRampToValueAtTime(volume, audioCtx.currentTime + 0.02);
            gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.16);
            
            osc.connect(gain);
            gain.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + 0.17);
            
            // Bass Kick Pulse on rhythmic beats
            if (noteStep % 4 === 1) {
                const bassOsc = audioCtx.createOscillator();
                const bassGain = audioCtx.createGain();
                
                bassOsc.type = 'sine';
                bassOsc.frequency.setValueAtTime(110, audioCtx.currentTime);
                bassOsc.frequency.exponentialRampToValueAtTime(40, audioCtx.currentTime + 0.12);
                
                bassGain.gain.setValueAtTime(winampVolume * 0.3, audioCtx.currentTime);
                bassGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.14);
                
                bassOsc.connect(bassGain);
                bassGain.connect(audioCtx.destination);
                
                bassOsc.start();
                bassOsc.stop(audioCtx.currentTime + 0.15);
            }
        }, 180);

    } catch (e) {
        // Audio synthesis fallback
    }
}

function stopWinampAudioSynth() {
    if (synthInterval) {
        clearInterval(synthInterval);
        synthInterval = null;
    }
}

function startWinampVisualizer() {
    const canvas = document.getElementById('winamp-spectrum');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    function draw() {
        if (!winampIsPlaying || winampIsPaused) {
            clearWinampCanvas();
            return;
        }
        ctx.fillStyle = '#000000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        const numBars = 22;
        const barWidth = canvas.width / numBars;
        
        for (let i = 0; i < numBars; i++) {
            const barHeight = Math.floor(Math.random() * (canvas.height - 4)) + 4;
            const x = i * barWidth;
            const y = canvas.height - barHeight;
            
            const grad = ctx.createLinearGradient(0, canvas.height, 0, 0);
            grad.addColorStop(0, '#00ff00');
            grad.addColorStop(0.65, '#ffff00');
            grad.addColorStop(1, '#ff0000');
            
            ctx.fillStyle = grad;
            ctx.fillRect(x + 1, y, barWidth - 2, barHeight);
        }
        
        winampAnimFrame = requestAnimationFrame(draw);
    }
    
    if (winampAnimFrame) cancelAnimationFrame(winampAnimFrame);
    draw();
}

function clearWinampCanvas() {
    const canvas = document.getElementById('winamp-spectrum');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#000000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

