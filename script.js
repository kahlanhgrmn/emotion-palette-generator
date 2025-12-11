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
    happy: ["#FFF7AE", "#FFD972", "#FFB347", "#FF9A76"],
    calm: ["#D4F1F4", "#75E6DA", "#189AB4", "#05445E"],
    sad: ["#C3D0FF", "#8896D7", "#4C5B9B", "#22223B"],
    angry: ["#FF9A8B", "#FF6A88", "#FF4E50", "#C81D25"]
};

// remember last mood and overlay
function moodApply(mood){
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
