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

// Logic
form.addEventListener("submit", async (event) => {
    event.preventDefault();

    const wordArray = await getWord(searchInput.value)
    const wordData = wordArray[0]

    const audioUrl = getAudioUrl(wordData.phonetics)

    pronunciationPlay.dataset.audio = audioUrl;

    renderPronunciationSection(wordData)
})

pronunciationPlay.addEventListener("click", playAudio)

