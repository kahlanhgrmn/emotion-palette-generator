const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const viewPalettesBtn = document.getElementById("viewPalettesBtn");
// debug canvas (created when debug enabled)
let debugCanvas = null; 

// start the camera
async function startCamera() {
    console.log("Attempting to start camera...");

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        console.error("getUserMedia is not supported in this browser.");
        alert("Your browser does not support camera access via getUserMedia.");
        return;
    }

    try{
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        console.log("Camera stream obtained:", stream);
        video.srcObject = stream;
        // try to start playback; some browsers may block autoplay until user interaction
        await video.play().catch(() => {});
        return stream;
    } 
    catch(err){
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions and try again.");
    }
}

// colours for each mood
const moodOverlayColours = {
    none: "transparent",
    happy: "rgba(192, 147, 22, 0.6)",   // yellow
    calm: "rgba(192, 255, 249, 0.6)",    // light blue
    sad: "rgba(28, 71, 201, 0.6)",      // blue
    angry: "rgba(255, 106, 136, 0.6)",    // red
    disgusted: "rgba(102, 153, 0, 0.55)", // olive green
    fearful: "rgba(80, 40, 120, 0.45)",   // purple
    surprised: "rgba(255, 220, 100, 0.6)" // bright
};

// mood palettes (each mood has multiple named variants)
const moodPalettes = {
    happy: [
        { name: "summer beach", colours: ["#E2852E", "#F5C857", "#FFEE91", "#ABE0F0"] },
        { name: "lemonade", colours: ["#FF9B00", "#FFE100", "#FFC900", "#EBE389"] },
        { name: "pastel paradise", colours: ["#FFDCDC", "#FFF2EB", "#FFE8CD", "#FFD6BA"] },
        { name: "sunrise vibes", colours: ["#FFE99A", "#FFD586", "#FFAAAA", "#FF9898"] }
    ],

    sad: [
        { name: "gloomy grey", colours: ["#455566", "#3E4954", "#35393D", "#282B2E"] },
        { name: "the blues", colours: ["#004B90", "#175981", "#016C8B", "#0071B6"] },
        { name: "stormy skies", colours: ["#5B5D68", "#7D7F7D", "#B3C1D6", "#B0C4DE"] },
        { name: "sombre shades", colours: ["#2F4F4F", "#6A5ACD", "#A9A9A9", "#000000"] }
    ],

    calm:[
        { name: "mint mojito", colours: ["#B8D8BA", "#D9DBBC", "#F4E8C1", "#FCDDBC"] },
        { name: "walk with nature", colours: ["#B2967D", "#E6BEAE", "#B3CBB9", "#ECF8F8"] },
        { name: "purple parade", colours: ["#270F36", "#632B6C", "#C76B98", "#F09F9C"] },
        { name: "sandy shores", colours: ["#779BA1", "#F6E2BA", "#897A74", "#D6A780"] }
    ],

    angry:[
        { name: "red hot", colours: ["#E72222", "#C93030", "#AB3232", "#963232"] },
        { name: "flame burst", colours: ["#A70120", "#E26834FF", "#E9DA58FF", "#FFF3B4FF"] },
        { name: "fierce fire", colours: ["#581845", "#900C3F", "#C70039", "#FF5733"] },
        { name: "obsidian clash", colours: ["#000000", "#4D4444FF", "#A9A9A9", "#FF0000"] }
    ],

    disgusted:[
        { name: "moldy green", colours: ["#556B2FFF", "#6B8E23FF", "#808000FF", "#9ACD32FF"] },
        { name: "swamp lands", colours: ["#4A7023", "#6B8E23", "#8FBC8F", "#B0C4DE"] },
        { name: "wiltered forest", colours: ["#7B4B3A", "#AFA48D", "#4E3B31", "#5B4F44"] },
        { name: "toxic waste", colours: ["#B0A900", "#C8292F", "#800000", "#4A4A2D"] }
    ],

    fearful:[
        { name: "vampire blood", colours: ["#2f2323", "#332424", "#311212", "#3c0000"] },
        { name: "foggy skies", colours: ["#362c58", "#352942", "#381f3e", "#311f36"] },
        { name: "tv static", colours: ["#111111", "#2b2b2b", "#969696", "#aaaaaa"] },
        { name: "halloween thrill", colours: ["#B00000", "#FF5722", "#E84A3B", "#FFC107"] }
    ],

    surprised:[
        { name: "party confetti", colours: ["#ffe3e3", "#fcd2ff", "#b3ffee", "#e3ffe2"] },
        { name: "shocking pink", colours: ["#fc0fc0", "#fd57d3", "#fe8fe0", "#fec7ec"] },
        { name: "sunburst", colours: ["#fffbef", "#fff0bd", "#ffe384", "#ffd856"] },
        { name: "minty fresh", colours: ["#4cffbc", "#83ffd1", "#beffe7", "#ecfff8"] }
    ]
};

// remember last mood and overlay
function applyMood(mood){
    const colour = moodOverlayColours[mood] || "transparent";

    overlay.style.background = colour;
    overlay.style.opacity = (mood === "none")? "0" : "1";

    localStorage.setItem("lastMood", mood);
    // update the live badge to reflect the applied mood
    updateLiveBadge(null, null);

    // we only need to remember the mood so the palette page shows that mood's variants
    // don't persist entire palette objects here
} 

// manual mood buttons removed — auto-detection updates mood instead


// go to the palette page
// store the latest instantaneous mood detected (updated in the detection loop)
let currentInstantMood = 'none';

if(viewPalettesBtn){
    viewPalettesBtn.addEventListener("click", () =>{
        // When navigating to palettes, use the latest instantaneous mood if available
        const last = currentInstantMood && currentInstantMood !== 'none' ? currentInstantMood : (localStorage.getItem('lastMood') || 'none');
        localStorage.setItem('lastMood', last);
        setStatus(`Using ${capitalize(last)} for palettes`);
        window.location.href = "palette.html";
    });
}

// debug overlay: show while holding 'D' (no button required)
window.addEventListener('keydown', (e) => {
    if (e.code !== 'KeyD') return;
    if (e.repeat) return;
    const el = e.target;
    const tag = el && el.tagName;
    if(tag === 'INPUT' || tag === 'TEXTAREA' || el.isContentEditable) return;
    // create canvas on demand if models are loaded and canvas doesn't exist
    if(!debugCanvas && window.faceapi && faceModelsLoaded && video.readyState >= 2) createDebugCanvas();
    showDebugCanvas();
});

window.addEventListener('keyup', (e) => {
    if (e.code !== 'KeyD') return;
    hideDebugCanvas();
});

window.addEventListener('blur', () => hideDebugCanvas());

// start camera
document.addEventListener("DOMContentLoaded", async () => {
    await startCamera();
    // initialize label from last saved mood
    const last = localStorage.getItem('lastMood') || 'none';
    updateLiveBadge(null, null);
    // begin auto detection (best-effort; if models not present detection will fail quietly)
    startExpressionDetection(video);
});


// facial recognition setup
let faceModelsLoaded = false;
async function loadFaceModels(){
    if(faceModelsLoaded) return;
    if(!window.faceapi){
        console.warn("face-api.js not loaded - facial detection disabled");
        return;
    }
    try{
        setStatus('loading models...');
        await Promise.all([
            faceapi.nets.tinyFaceDetector.loadFromUri('/models'),
            faceapi.nets.faceExpressionNet.loadFromUri('/models'),
            faceapi.nets.faceLandmark68Net.loadFromUri('/models') // landmarks for mouth/eye/brow cues
        ]);
        faceModelsLoaded = true;
        setStatus('models loaded');
    }catch(e){
        console.error("Error loading face-api models:", e);
        setStatus('model load failed - see console');
    }
}

function getDebugEnabled(){
    return new URLSearchParams(window.location.search).get('debug') === '1' || localStorage.getItem('debug') === '1';
}

function createDebugCanvas(){
    if(debugCanvas || !window.faceapi) return;
    try{
        const c = faceapi.createCanvasFromMedia(video);
        c.id = 'debugCanvas';
        c.style.position = 'absolute';
        c.style.inset = '0';
        c.style.pointerEvents = 'none';
        c.style.zIndex = 60;
        video.parentNode.appendChild(c);
        debugCanvas = c;
        if(!getDebugEnabled()) debugCanvas.style.display = 'none';
    }catch(e){
        console.warn('Could not create debug canvas', e);
    }
}

function showDebugCanvas(){
    if(!debugCanvas) createDebugCanvas();
    if(debugCanvas) debugCanvas.style.display = '';
}

function hideDebugCanvas(){
    if(debugCanvas) debugCanvas.style.display = 'none';
}

// Detection tuning - tweak these to change responsiveness/smoothing
const expressionHistory = [];
const DETECTION_INTERVAL_MS = 700; // run detection every ~700ms (lower frequency = more stable)
const HISTORY_LEN = 10;            // number of recent frames to keep for smoothing
const CONF_THRESH = 0.65;         // minimum expression probability to consider
const SMOOTH_REQUIRED = 6;        // require this many occurrences within history to change mood
let detectionRunning = false;
let lastMoodChange = 0;           // timestamp to enforce cooldown between mood changes
const MIN_CHANGE_INTERVAL_MS = 3000; // minimum ms between mood changes (hysteresis)

function expressionToMood(expression){
    switch(expression){
        case 'happy': return 'happy';
        case 'sad': return 'sad';
        case 'angry': return 'angry';
        case 'neutral': return 'calm';
        case 'disgusted': return 'disgusted';
        case 'fearful': return 'fearful';
        case 'surprised': return 'surprised';
        default: return 'none';
    }
}



// set a small visible status for debugging and log to console
const statusEl = document.getElementById('status');
function setStatus(text){
    try{ if(statusEl) statusEl.textContent = 'Status: ' + text; }catch(e){}
    console.log('[status]', text);
}

async function startExpressionDetection(videoEl){
    if(detectionRunning) return;
    detectionRunning = true;

    if(!window.faceapi){
        console.warn("face-api.js not available - skipping detection");
        return;
    }

    await loadFaceModels();
    if(!faceModelsLoaded){
        return;
    }

    // create debug canvas if requested
    if(getDebugEnabled()) createDebugCanvas();

    async function step(){
        if(videoEl.readyState < 2){
            setTimeout(step, 250);
            return;
        }

        let chosenMood = 'none';
        let detection = null;

        try{
            // detect face + landmarks + expressions so we can analyze cues
            detection = await faceapi.detectSingleFace(videoEl, new faceapi.TinyFaceDetectorOptions()).withFaceLandmarks().withFaceExpressions();
            if(detection && detection.expressions){
                const exps = detection.expressions;
                const top = Object.keys(exps).reduce((a,b)=> exps[a] > exps[b] ? a : b);
                const topProb = exps[top];
                if(topProb >= CONF_THRESH){
                    chosenMood = expressionToMood(top);
                    // update the latest instantaneous mood so it can be used when the user navigates to palettes
                    currentInstantMood = expressionToMood(top);
                } else {
                    // if confidence is low, clear instantaneous mood
                    currentInstantMood = 'none';
                }
            } else {
                currentInstantMood = 'none';
            }
        }catch(e){
            console.error("Error during face detection:", e);
            currentInstantMood = 'none';
        }

        // smoothing
        expressionHistory.push(chosenMood);
        if(expressionHistory.length > HISTORY_LEN) expressionHistory.shift();

        const counts = expressionHistory.reduce((acc, m) => (acc[m] = (acc[m]||0)+1, acc), {});
        const [majorMood, majorCount] = Object.entries(counts).sort((a,b)=> b[1] - a[1])[0] || ['none', 0];

        // update the live badge (shows instantaneous top expression) — the applied mood (used for palettes) is the smoothed 'majorMood' which is stored as lastMood
        if(detection && detection.expressions){
            const topExp = Object.keys(detection.expressions).reduce((a,b)=> detection.expressions[a] > detection.expressions[b] ? a : b);
            const p = Math.round(detection.expressions[topExp]*100);
            setStatus(`${topExp} ${p}%`);
            updateLiveBadge(topExp, p);
            // analyze landmarks and expressions to show feature cues
            if(detection.landmarks){
                const cues = analyzeFaceCues(detection.landmarks, detection.expressions, detection.detection.box);
                updateFeaturePanel(cues);
            } else {
                updateFeaturePanel(null);
            }

            // update overlay color to reflect the instantaneous mood being displayed (falls back to applied mood)
            const overlayMood = currentInstantMood && currentInstantMood !== 'none' ? currentInstantMood : (localStorage.getItem('lastMood') || 'none');
            const overlayColour = moodOverlayColours[overlayMood] || 'transparent';
            overlay.style.background = overlayColour;
            overlay.style.opacity = (overlayMood === 'none') ? '0' : '1';
        } else {
            setStatus('no face detected');
            updateLiveBadge(null, null);
            updateFeaturePanel(null);
            // remove overlay when no face
            overlay.style.background = 'transparent';
            overlay.style.opacity = '0';
        }
        // draw debug boxes & expressions if canvas present
        if(debugCanvas){
            const displaySize = { width: videoEl.videoWidth, height: videoEl.videoHeight };
            faceapi.matchDimensions(debugCanvas, displaySize);
            let resized = [];
            if(detection){
                const r = faceapi.resizeResults(detection, displaySize);
                resized = Array.isArray(r) ? r : [r];
            }
            const ctx = debugCanvas.getContext('2d');
            ctx.clearRect(0,0,debugCanvas.width, debugCanvas.height);
            if(resized.length){
                faceapi.draw.drawDetections(debugCanvas, resized);
                faceapi.draw.drawFaceExpressions(debugCanvas, resized);
                // top expression label
                const topExp = detection && detection.expressions ? Object.keys(detection.expressions).reduce((a,b)=> detection.expressions[a] > detection.expressions[b] ? a : b) : null;
                if(topExp){
                    ctx.font = '14px system-ui';
                    ctx.fillStyle = 'rgba(255,255,255,0.95)';
                    ctx.strokeStyle = 'rgba(0,0,0,0.65)';
                    ctx.lineWidth = 3;
                    const text = `${topExp} ${(detection.expressions[topExp]*100).toFixed(0)}%`;
                    ctx.strokeText(text, 8, 20);
                    ctx.fillText(text, 8, 20);
                }
            }
        }

        if(majorCount >= SMOOTH_REQUIRED){
            const curr = localStorage.getItem('lastMood') || 'none';
            const now = Date.now();
            if(curr !== majorMood && (now - lastMoodChange) >= MIN_CHANGE_INTERVAL_MS){
                applyMood(majorMood);
                lastMoodChange = now;
            }
        }

        // schedule next detection
        setTimeout(step, DETECTION_INTERVAL_MS);
    }

    step();
}

// small helpers for feature detection + UI
function dist(a,b){
    const dx = a.x - b.x; const dy = a.y - b.y; return Math.hypot(dx,dy);
}

function analyzeFaceCues(landmarks, expressions, box){
    // use expression probabilities and lightweight landmark heuristics to infer cues
    const ex = expressions || {};

    // mouth: smile vs frown - prefer expression probability but fallback to landmark curvature
    const happy = ex.happy || 0; const sad = ex.sad || 0; const angry = ex.angry || 0; const surprised = ex.surprised || 0;
    let mouthCue = { label: 'neutral', score: 0 };
    if(happy > 0.35){ mouthCue = { label: 'smile', score: Math.round(happy*100) } }
    else if(angry > 0.35 || sad > 0.35){ mouthCue = { label: 'frown', score: Math.round(Math.max(angry,sad)*100) } }
    else if(surprised > 0.35){ mouthCue = { label: 'open', score: Math.round(surprised*100) } }
    else {
        // fallback to mouth curvature using landmarks
        try{
            const mouth = landmarks.getMouth();
            const left = mouth[0], right = mouth[6];
            const top = mouth[13], bottom = mouth[19];
            const width = dist(left,right);
            const height = dist(top,bottom);
            const ratio = height/width;
            if(ratio > 0.4) mouthCue = { label: 'open', score: Math.round(ratio*100) };
            else mouthCue = { label: 'neutral', score: Math.round((1-ratio)*100) };
        }catch(e){ mouthCue = { label:'unknown', score:0 } }
    }

    // brows: raised / furrow
    let browsCue = { label: 'neutral', score: 0 };
    try{
        const leftBrow = landmarks.getLeftEyeBrow();
        const rightBrow = landmarks.getRightEyeBrow();
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        // compute eyebrow-to-eye distance normalized by box height
        const browY = (leftBrow.concat(rightBrow).reduce((s,p)=>s+p.y,0) / (leftBrow.length+rightBrow.length));
        const eyeY = (leftEye.concat(rightEye).reduce((s,p)=>s+p.y,0) / (leftEye.length+rightEye.length));
        const norm = (eyeY - browY) / box.height; // positive when brows above eyes
        if(norm > 0.06) { browsCue = { label: 'raised', score: Math.round(norm*1000)/10 } }
        else if(norm < 0.0) { browsCue = { label: 'lowered', score: Math.round(-norm*1000)/10 } }
    }catch(e){ }

    // eyes: open/wide/closed
    let eyesCue = { label: 'normal', score: 0 };
    try{
        const leftEye = landmarks.getLeftEye();
        const rightEye = landmarks.getRightEye();
        const leftOpen = (Math.abs(leftEye[1].y - leftEye[5].y) + Math.abs(leftEye[2].y - leftEye[4].y)) / 2;
        const rightOpen = (Math.abs(rightEye[1].y - rightEye[5].y) + Math.abs(rightEye[2].y - rightEye[4].y)) / 2;
        const eyeAvg = (leftOpen + rightOpen) / 2;
        const eyeNorm = eyeAvg / box.height;
        if(eyeNorm > 0.045) eyesCue = { label: 'wide', score: Math.round(eyeNorm*1000)/10 }
        else if(eyeNorm < 0.02) eyesCue = { label: 'narrow', score: Math.round(eyeNorm*1000)/10 }
    }catch(e){ }

    return { mouth: mouthCue, brows: browsCue, eyes: eyesCue, expressions: ex };
}

function capitalize(s){ return s ? s.charAt(0).toUpperCase() + s.slice(1) : s; }

function updateLiveBadge(exp, prob){
    const badge = document.getElementById('liveExpBadge');
    if(!badge) return;
    const applied = localStorage.getItem('lastMood');
    if(!exp){
        if(applied && applied !== 'none'){
            badge.textContent = `${capitalize(applied)} (applied)`;
            badge.style.opacity = 0.85;
        } else {
            badge.textContent = '—'; badge.style.opacity = 0.6;
        }
        return;
    }
    const appliedText = (applied && applied !== 'none') ? ` • ${capitalize(applied)}` : '';
    badge.textContent = `${capitalize(exp)} ${prob}%${appliedText}`;
    badge.style.opacity = 1;
}

function updateFeaturePanel(cues){
    const c = document.getElementById('fpContent');
    if(!c) return;
    if(!cues){ c.innerHTML = 'No face detected'; return; }
    const lines = [];
    lines.push(`<div class="fp-row ${cues.mouth.label === 'neutral' ? 'inactive' : ''}"><div class="fp-label">Mouth</div><div class="fp-score">${cues.mouth.label} ${cues.mouth.score ? cues.mouth.score + '%' : ''}</div></div>`);
    lines.push(`<div class="fp-row ${cues.brows.label === 'neutral' ? 'inactive' : ''}"><div class="fp-label">Brows</div><div class="fp-score">${cues.brows.label} ${cues.brows.score ? cues.brows.score : ''}</div></div>`);
    lines.push(`<div class="fp-row ${cues.eyes.label === 'normal' ? 'inactive' : ''}"><div class="fp-label">Eyes</div><div class="fp-score">${cues.eyes.label} ${cues.eyes.score ? cues.eyes.score : ''}</div></div>`);
    c.innerHTML = lines.join('');
}