const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const moodButtons = document.querySelectorAll("[data-mood]");
const viewPalettesBtn = document.getElementById("viewPalettesBtn");

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
    } 
    catch(err){
        console.error("Error accessing camera:", err);
        alert("Could not access camera. Please check permissions and try again.");
    }
}

// colours for each mood
const moodOverlayColours = {
    none: "transparent",
    happy: "rgba(255, 217, 114, 0.6)",   // yellow
    calm: "rgba(117, 230, 218, 0.6)",    // teal
    sad: "rgba(88, 111, 179, 0.6)",      // blue
    angry: "rgba(255, 106, 136, 0.6)"    // red
};

// mood palettes
const moodPalettes = {
    happy: [
        ["#E2852E", "#F5C857", "#FFEE91", "#ABE0F0"], //summer beach
        ["#FF9B00", "#FFE100", "#FFC900", "#EBE389"], //cool lemonade
        ["#FFDCDC", "#FFF2EB", "#FFE8CD", "#FFD6BA"], //pastel paradise
        ["#FFE99A", "#FFD586", "#FFAAAA", "#FF9898"] //sunrise vibes
    ],

    sad: [
        ["#455566", "#3e4954", "#35393d", "#282b2e"], //gloomy grey
        ["#004b90", "#175981", "#016c8b", "#0071b6"], //the blues
        ["#5b5d68", "#7d7f7d", "#b3c1d6", "#b0c4de"], //stormy skies
        ["#2f4f4f", "#6a5acd", "#a9a9a9", "#000000"] //sombre shades
    ],

    calm:[
        ["#b8d8ba", "#d9dbbc", "#f4e8c1", "#fcddbc"], //mint mojito
        ["#b2967d", "#e6beae", "#b3cbb9", "#ecf8f8"], //walk with nature
        ["#270f36", "#632b6c", "#c76b98", "#f09f9c"], //purple parade
        ["#779ba1", "#f6e2ba", "#897a74", "#d6a780"] //sandy shores
    ],

    angry:[
        ["#e72222", "#c93030", "#ab3232", "#963232"], //red hot
        ["#a70120", "#e26834ff", "#e9da58ff", "#fff3b4ff"], //flame burst
        ["#581845", "#900c3f", "#c70039", "#ff5733"], //fierce fire
        ["#000000", "#4d4444ff", "#a9a9a9", "#ff0000"] //obsidian clash
    ]
}

// remember last mood and overlay
function applyMood(mood){
    const colour = moodOverlayColours[mood] || "transparent";

    overlay.style.background = colour;
    overlay.style.opacity = (mood === "none")? "0" : "1";

    localStorage.setItem("lastMood", mood);

    if(moodPalettes[mood]){
        localStorage.setItem("lastPalette", JSON.stringify(moodPalettes[mood]));
    }
}

// buttons hooked up
moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const mood = btn.dataset.mood;
        applyMood(mood);
    });
});

// go to the palette page
if(viewPalettesBtn){
    viewPalettesBtn.addEventListener("click", () =>{
        window.location.href = "palette.html";
    });
}

// start camera
document.addEventListener("DOMContentLoaded", () => {
    startCamera();
});
