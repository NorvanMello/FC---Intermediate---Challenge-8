// Global
const body = document.body;

//Main
const mainContainer = document.querySelector(".main-container")

//Error
const errorContainer = document.querySelector(".error-container")

// Header
const fontSelectorContainer = document.querySelector(".font-selector-container");
const fontPopup = document.querySelector(".popup")
const themeLogo = document.querySelector("#theme-logo");

const btnSansSerif = document.querySelector(".sans-serif")
const btnSerif = document.querySelector(".serif")
const btnMono = document.querySelector(".mono")

const fontText = document.querySelector(".font-text")

//Search Container
const form = document.querySelector(".search-container")
const searchInput = document.querySelector("#search-input")
const textError = document.querySelector(".error-text")

// Pronunciation Container
const pronunciationContainer = document.querySelector(".pronunciation-container")
const wordText = document.querySelector(".word")
const pronunciation = document.querySelector(".pronunciation")
const pronunciationPlay = document.querySelector(".pronunciation-button")

//part Of Speech
const partOfSpeech = document.querySelector(".partOfSpeech-section")

// Functions
function applyThemeStyles() {
    body.classList.toggle("light-theme")
}

function updatePopupState(isOpen) {
    fontSelectorContainer.setAttribute("aria-expanded", String(isOpen))
    fontPopup.setAttribute("aria-hidden", String(!isOpen));
}

function closePopup() {
    fontSelectorContainer.focus();
    fontPopup.classList.remove("active");
    updatePopupState(false);
}

function changeFont({text, textElement, classToAdd, classToRemove, element}) {
    classToRemove.forEach(c => {
        element.classList.remove(c);
    });

    textElement.textContent = text;
    element.classList.add(classToAdd);

    closePopup()
}

// Code
if(themeLogo) {
    themeLogo.addEventListener("change", applyThemeStyles)
}


// Button - Select Font
fontSelectorContainer.addEventListener("click", () => {
    fontPopup.classList.toggle("active");

    const isOpen = fontPopup.classList.contains("active")

    updatePopupState(isOpen)
})

document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") {
        closePopup();
    }
})

// Button Popup - Select Font
btnSansSerif.addEventListener("click", () => {
    changeFont({
        text: "Sans Serif", 
        textElement: fontText,
        classToAdd: "sans-serif", 
        classToRemove: ["serif", "mono"], 
        element: body
    })
})

btnSerif.addEventListener("click", () => {
    changeFont({
        text: "Serif", 
        textElement: fontText,
        classToAdd: "serif", 
        classToRemove: ["sans-serif", "mono"], 
        element: body
    })
})

btnMono.addEventListener("click", () => {
    changeFont({
        text: "Mono",
        textElement: fontText,
        classToAdd: "mono", 
        classToRemove: ["serif", "sans-serif"], 
        element: body
    })
})

// API
async function getWord(word) {
    const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
    if(!response.ok) {
        throw new Error("");
    }

    const data = await response.json();

    return data;
}

//Functions
function renderPronunciationSection(wordArray) {
    pronunciationPlay.classList.add("hidden")

    wordText.textContent = `${wordArray.word}`
    pronunciation.textContent = `${wordArray.phonetic ? wordArray.phonetic : ""}`
    if(pronunciationPlay.dataset.audio){
        pronunciationPlay.classList.remove("hidden")    
    }
}

function playAudio() {
    const audioUrl = pronunciationPlay.dataset.audio;

    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.play()
}

function getAudioUrl(phonetics) {
    for(const phonetic of phonetics) {
        if(phonetic.audio) {
            return phonetic.audio
        }
    }

    return "";
}

//Meaning, Synonyms & Source
function renderMeaningSection(wordData) {

    const partContainer = document.createElement("div");
    partContainer.classList.add("partOfSpeech-container", "after-style");

    const partTitle = document.createElement("h2");
    partTitle.classList.add("partOfSpeech");
    partTitle.textContent = wordData.partOfSpeech;

    partContainer.appendChild(partTitle);

    const meaningContainer = document.createElement("div");
    meaningContainer.classList.add("meaning-synonyms-container");

    const meaningTitle = document.createElement("h3");
    meaningTitle.classList.add("meaning-text");
    meaningTitle.textContent = "Meaning";

    const ul = document.createElement("ul");
    ul.classList.add("meaning");

    wordData.definitions.forEach(def => {
        const li = document.createElement("li");
        li.textContent = def.definition;

        if(def.example) {
            const example = document.createElement("p");
            example.classList.add("example-container");
            example.textContent = def.example;

            li.appendChild(example);
        }

        ul.appendChild(li);
    });

    meaningContainer.appendChild(meaningTitle);
    meaningContainer.appendChild(ul);

    partOfSpeech.appendChild(partContainer);
    partOfSpeech.appendChild(meaningContainer);
}

function renderSynonyms(wordData) {

    const partContainer = document.createElement("div")
    partContainer.classList.add("synonyms-container")

    if(wordData.synonyms?.length > 0) {
        const synonymsTitle = document.createElement("h3")
        synonymsTitle.classList.add("synonyms-text")
        synonymsTitle.textContent = "Synonyms";

        partContainer.appendChild(synonymsTitle)

        const spanSynonyms = document.createElement("span")
        spanSynonyms.classList.add("synonyms")
        
        spanSynonyms.textContent = wordData.synonyms.join(" ")
        partContainer.appendChild(spanSynonyms);
    }
    
    partOfSpeech.appendChild(partContainer);

    // wordData.synonyms.forEach(syn => {
    //     spanSynonyms.appendChild(syn).join(" ")
    // })
}

function renderSource(wordData) {
    const sourceContainer = document.createElement("div");
    sourceContainer.classList.add("source-container");

    const sourceTitle = document.createElement("h3");
    sourceTitle.classList.add("source-text");
    sourceTitle.textContent = "Source";

    sourceContainer.appendChild(sourceTitle);

    const sourceLink = document.createElement("a");
    sourceLink.href = wordData.sourceUrls[0];
    sourceLink.target = "_blank";
    sourceLink.rel = "noopener noreferrer";
    sourceLink.setAttribute("aria-label", "View source on Wiktionary");
    sourceLink.classList.add("source-link");

    sourceLink.textContent = wordData.sourceUrls[0];

    partOfSpeech.appendChild(sourceLink);
}

function renderPartOfSpeech(wordData) {
    partOfSpeech.innerHTML = "";

    for(let i = 0; i < wordData.meanings.length; i++) {
        if(wordData.meanings[i]) {
        
            renderMeaningSection(wordData.meanings[i]);
            
            renderSynonyms(wordData.meanings[i]);
        }
    }
    
    renderSource(wordData);
}

function error(add) {
    if(add) {
        textError.classList.remove("hidden")
        pronunciationContainer.classList.add("hidden")
        partOfSpeech.classList.add("hidden")
    } else {
        textError.classList.add("hidden")
        pronunciationContainer.classList.remove("hidden")
        partOfSpeech.classList.remove("hidden")
    }
    
}

function wordNotFound(isTrue) {
    if(isTrue) {
        pronunciationContainer.classList.add("hidden")
        partOfSpeech.classList.add("hidden")
        errorContainer.classList.remove("hidden")
    } else {
        pronunciationContainer.classList.remove("hidden")
        partOfSpeech.classList.remove("hidden")
        errorContainer.classList.add("hidden")
    }
}

// Logic
form.addEventListener("submit", async (event) => {
    event.preventDefault();
    error(false)
    wordNotFound(false)

    if(!searchInput.value) {
        error(true)
        return;
    }
    try {
        const wordArray = await getWord(searchInput.value)
         const wordData = wordArray[0]

        const audioUrl = getAudioUrl(wordData.phonetics)

        pronunciationPlay.dataset.audio = audioUrl;
        //Pronunciation
        renderPronunciationSection(wordData);

        //Part Of Speech
        renderPartOfSpeech(wordData);
    } catch (error) {
        wordNotFound(true)
    }
    
})

pronunciationPlay.addEventListener("click", playAudio);

