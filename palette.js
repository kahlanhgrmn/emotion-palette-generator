const paletteList = document.getElementById("paletteList");
const backToCameraBtn = document.getElementById("backToCameraBtn");

let paletteHeader = document.getElementById("paletteHeader");
if(!paletteHeader){
    paletteHeader = document.createElement("div");
    paletteHeader.id = "paletteHeader";
    paletteHeader.className = "note";
    paletteList.parentNode.insertBefore(paletteHeader, paletteList);
}

// read the last mood (used to filter which mood's palettes are shown)
const lastMood = localStorage.getItem("lastMood");

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

// render palettes: show all variants for the mood(s)
function renderPalettes(){
    paletteList.innerHTML = "";

    const moodsToShow = (lastMood && lastMood !== 'none') ? [lastMood] : Object.keys(moodPalettes);

    if(lastMood && lastMood !== 'none'){
        const friendly = lastMood.charAt(0).toUpperCase() + lastMood.slice(1);
        paletteHeader.textContent = `Showing ${friendly} palettes`;
    } else {
        paletteHeader.textContent = "";
    }

    moodsToShow.forEach(mood => {
        const variants = moodPalettes[mood] || [];

        const card = document.createElement("div");
        card.className = "mood-card";

        // only highlight the mood card if multiple moods are shown
        if(lastMood && moodsToShow.length > 1 && lastMood === mood){
            card.classList.add("highlight");
        }

        // mood header
        const header = document.createElement("div");
        header.className = "mood-card-header";

        const title = document.createElement("div");
        title.className = "mood-name";
        title.textContent = mood.charAt(0).toUpperCase() + mood.slice(1);

        const tag = document.createElement("div");
        tag.className = "mood-tag";
        // only show a tag when this mood is the last selected one among multiple moods
        tag.textContent = (lastMood === mood && moodsToShow.length > 1) ? "Last selected mood" : "";

        header.appendChild(title);
        header.appendChild(tag);
        card.appendChild(header);

        // render each named variant
        variants.forEach(variant => {
            // wrapper so we can add a separator between variants
            const variantWrap = document.createElement("div");
            variantWrap.className = "mood-variant";

            const variantTitle = document.createElement("div");
            variantTitle.className = "note";
            variantTitle.textContent = variant.name.charAt(0).toUpperCase() + variant.name.slice(1);

            const paletteRow = document.createElement("div");
            paletteRow.className = "mood-palette";

            variant.colours.forEach(hex => {
                const swatch = document.createElement("div");
                swatch.className = "mood-swatch";
                swatch.style.background = hex;

                const label = document.createElement("span");
                label.textContent = hex;

                swatch.appendChild(label);
                paletteRow.appendChild(swatch);
            });

            variantWrap.appendChild(variantTitle);
            variantWrap.appendChild(paletteRow);
            card.appendChild(variantWrap);
        });

        paletteList.appendChild(card);
    });
}

// make the mood cards (render now)

// back button to camera page
backToCameraBtn.addEventListener("click", () => {
    window.location.href = "index.html";
});

renderPalettes();
