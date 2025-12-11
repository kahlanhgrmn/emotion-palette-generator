const paletteList = document.getElementById("paletteList");
const backToCameraBtn = document.getElementById("backToCameraBtn");

// same palettes that are in script.js
const moodPalettes = {
    happy: ["#FFF7AE", "#FFD972", "#FFB347", "#FF9A76"],
    calm: ["#D4F1F4", "#75E6DA", "#189AB4", "#05445E"],
    sad: ["#C3D0FF", "#8896D7", "#4C5B9B", "#22223B"],
    angry: ["#FF9A8B", "#FF6A88", "#FF4E50", "#C81D25"]
};

// read the last mood
const lastMood = localStorage.getItem("lastMood");

// make the mood cards
function renderPalettes(){
    paletteList.innerHTML = "";

    Object.keys(moodPalettes).forEach(mood =>{
        const colours = moodPalettes[mood];

        const card = document.createElement("div");
        card.className = "mood-card";

        if(lastMood && lastMood === mood){
            card.classList.add("highlight");
        }

        const header = document.createElement("div");
        header.className = "mood-card-header";

        const title = document.createElement("div");
        title.className = "mood-name";
        title.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);

        const tag = document.createElement("div");
        tag.className = "mood-tag";

        tag.textContent = (lastMood === mood)? "Last selected mood" : "Preset palette";

        header.appendChild(title);
        header.appendChild(tag);

        const paletteRow = document.createElement("div");
        paletteRow.className = "mood-palette";

        colours.forEach(hex =>{
            const swatch = document.createElement("div");
            swatch.className = "mood-swatch";
            swatch.style.background = hex;

            const label = document.createElement("span");
            label.textContent = hex;

            swatch.appendChild(label);
            paletteRow.appendChild(swatch);
        });

        card.appendChild(header);
        card.appendChild(paletteRow);

        paletteList.appendChild(card);
    });
}

// back button to camera page
backToCameraBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

renderPalettes();
