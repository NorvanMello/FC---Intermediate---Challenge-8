// Global
const body = document.body;

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

// Pronunciation Container
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
    fontPopup.classList.remove("active")
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
themeLogo.addEventListener("change", applyThemeStyles)

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
    wordText.textContent = `${wordArray.word}`
    pronunciation.textContent = `${wordArray.phonetic}`
}

function playAudio() {
    const audioUrl = pronunciationPlay.dataset.audio;

    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.play()
}

function getAudioUrl(phonetics) {
    for(phonetic of phonetics) {
        if(phonetic.audio) {
            return phonetic.audio
        }
    }

    return "";
}

function renderPartOfSpeech(wordData) {
    partOfSpeech.innerHTML = "";

    for(let i = 0; i < wordData.meanings.length; i++) {
        if(wordData.meanings[i]) {
            const meaningItems = wordData.meanings[i].definitions
            .map(def => `<li>${def.definition} <p  class="example-container">${def.example ? def.example : ""}</p></li>`)
            .join("");

            const synonyms = wordData.meanings[i].synonyms
            .map(synonym => `${synonym ? synonym : ""}`)
            .join(" ")

            partOfSpeech.innerHTML += `
                <div class="partOfSpeech-container after-style">
                    <h2 class="partOfSpeech">
                        ${wordData.meanings[i].partOfSpeech}
                    </h2>
                </div>

                <div class="meaning-synonyms-container">
                    <h3 class="meaning-text">
                    Meaning
                    </h3>
                        <ul class="meaning">
                            ${meaningItems}
                        </ul>
                </div>

                <div class="synonyms-container">
                    <h3 class="synonyms-text">
                    Synonyms
                    </h3>

                    <span class="synonyms">
                        ${synonyms}
                    </span>
                </div>
            `
        }
    }

    partOfSpeech.innerHTML += `
        <div class="source-container">
            <h3 class="source-text">
                Source
            </h3>

            <a href="${wordData.sourceUrls[0]}"  
                target="_blank"
                rel="noopener noreferrer"
                aria-label="View source on Wiktionary"
                class="source-link">
                ${wordData.sourceUrls[0]}
            </a>
        </div>
    ` 
    
}

// Logic
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const wordArray = await getWord(searchInput.value)
    const wordData = wordArray[0]

    const audioUrl = getAudioUrl(wordData.phonetics)

    pronunciationPlay.dataset.audio = audioUrl;

    renderPronunciationSection(wordData);

    renderPartOfSpeech(wordData);
})

pronunciationPlay.addEventListener("click", playAudio);

//Part of speech

