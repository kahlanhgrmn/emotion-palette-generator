const paletteList = document.getElementById("paletteList");
const backToCameraBtn = document.getElementById("backToCameraBtn");

let paletteHeader = document.getElementById("paletteHeader");
if(!paletteHeader){
    paletteHeader = document.createElement("div");
    paletteHeader.id = "paletteHeader";
    paletteHeader.className = "note";
    paletteList.parentNode.insertBefore(paletteHeader, paletteList);
}

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

function renderMoodPalettes(){
    const moodsToShow = (lastMood && lastMood !== 'none') ? [lastMood] : Object.keys(moodPalettes);

    if(lastMood && lastMood !== 'none'){
        const friendly = lastMood.charAt(0).toUpperCase() + lastMood.slice(1);
        paletteHeader.textContent = `Showing ${friendly} palette`;
    }
    else{
        paletteHeader.textContent = "";
    }

    moodsToShow.forEach(mood =>{
        const colours = moodPalettes[mood];

        const card = document.createElement("div");
        card.className = "mood-card";

        if(lastMood && lastMood === mood){
            card.classList.add("highlight");
        }

        const header = document.createElement("div");
        title.className = "mood-name";
        title.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);

        const tag = document.createElement("div");
        tag.className = "mood-tag";
        tag.textContent = (lastMood === mood)? "Last mood selected" : "Preset palette";

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
