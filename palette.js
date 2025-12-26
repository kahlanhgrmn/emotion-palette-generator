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

// saved message timer for brief UI feedback
let _savedMsgTimer = null;
// selection timer to auto-clear the visual selection
let _selectionTimer = null;

function clearSavedMessage(){
    if(_savedMsgTimer) clearTimeout(_savedMsgTimer);
    _savedMsgTimer = null;
}

function showSavedMessage(text){
    paletteHeader.textContent = text;
    clearSavedMessage();
    _savedMsgTimer = setTimeout(() => {
        // restore header (either showing mood or "all palettes")
        if(lastMood && lastMood !== 'none'){
            const friendly = lastMood.charAt(0).toUpperCase() + lastMood.slice(1);
            paletteHeader.textContent = `Showing ${friendly} palettes`;
        } else {
            paletteHeader.textContent = "Showing all palettes";
        }
        _savedMsgTimer = null;
    }, 2500);
}

function clearSelection(){
    document.querySelectorAll('.mood-swatch.selected').forEach(el => el.classList.remove('selected'));
    if(_selectionTimer){
        clearTimeout(_selectionTimer);
        _selectionTimer = null;
    }
}

function saveColor(hex, swatch){
    try {
        localStorage.setItem('lastColor', hex);
    } catch(e) {
        // ignore storage errors
    }

    clearSelection();
    if(swatch) swatch.classList.add('selected');

    // clear any previous auto-clear timer and set a new one to remove the highlight
    if(_selectionTimer) clearTimeout(_selectionTimer);
    _selectionTimer = setTimeout(() => {
        if(swatch) swatch.classList.remove('selected');
        _selectionTimer = null;
    }, 2500);

    // try to copy to clipboard (best-effort)
    if(navigator.clipboard && navigator.clipboard.writeText){
        navigator.clipboard.writeText(hex).then(() => {
            showSavedMessage(`Copied ${hex}`);
        }).catch(() => {
            showSavedMessage(`Saved ${hex}`);
        });
    } 
    else{
        showSavedMessage(`Saved ${hex}`);
    }
}

// render palettes
function renderPalettes(){
    paletteList.innerHTML = "";

    // check if a colour was previously saved so we can mark it
    const lastSaved = localStorage.getItem('lastColor');

    const moodsToShow = (lastMood && lastMood !== 'none') ? [lastMood] : Object.keys(moodPalettes);

    if(lastMood && lastMood !== 'none'){
        const friendly = lastMood.charAt(0).toUpperCase() + lastMood.slice(1);
        paletteHeader.textContent = `Showing ${friendly} palettes`;
    } else {
        paletteHeader.textContent = "Showing all palettes";
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

                // clicking a swatch saves the hex and provides feedback
                swatch.title = "Click to save & copy";
                swatch.tabIndex = 0; // make keyboard-focusable
                swatch.addEventListener('click', () => saveColor(hex, swatch));
                swatch.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); saveColor(hex, swatch); } });

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
