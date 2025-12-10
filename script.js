const video = document.getElementById("video");
const overlay = document.getElementById("overlay");
const moodButtons = document.querySelectorAll("[data-mood]");

// 1. Start the camera
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

// 2. Define colours for each mood
const moodOverlayColors = {
    none: "transparent",
    happy: "rgba(255, 217, 114, 0.6)",   // yellow
    calm: "rgba(117, 230, 218, 0.6)",    // teal
    sad: "rgba(88, 111, 179, 0.6)",      // blue
    angry: "rgba(255, 106, 136, 0.6)"    // red
};

// 3. Apply mood overlay
function applyMood(mood){
    const color = moodOverlayColors[mood] || "transparent";

    overlay.style.background = color;
    overlay.style.opacity = (mood === "none")? "0" : "1";
}

// 4. Hook up buttons
moodButtons.forEach(btn => {
    btn.addEventListener("click", () => {
        const mood = btn.dataset.mood;
        applyMood(mood);
    });
});

// 5. Start camera
document.addEventListener("DOMContentLoaded", () => {
    startCamera();
});
