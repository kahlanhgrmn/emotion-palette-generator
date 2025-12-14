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

// mood palettes (each mood has multiple named variants)
const moodPalettes = {
    happy: [
        { name: "summer beach", colours: ["#E2852E", "#F5C857", "#FFEE91", "#ABE0F0"] },
        { name: "cool lemonade", colours: ["#FF9B00", "#FFE100", "#FFC900", "#EBE389"] },
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
    ]
};

// remember last mood and overlay
function applyMood(mood){
    const colour = moodOverlayColours[mood] || "transparent";

    overlay.style.background = colour;
    overlay.style.opacity = (mood === "none")? "0" : "1";

    localStorage.setItem("lastMood", mood);

    // we only need to remember the mood so the palette page shows that mood's variants
    // don't persist entire palette objects here
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
