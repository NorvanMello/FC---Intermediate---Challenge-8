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

function applyThemeStyles() {
    body.classList.toggle("light-theme")
}

function updatePopupState(isOpen) {
    fontSelectorContainer.setAttribute("aria-expanded", String(isOpen))
    fontPopup.setAttribute("aria-hidden", String(!isOpen));
}

function closePopup() {
    fontPopup.classList.remove("active")
}

themeLogo.addEventListener("change", applyThemeStyles)

// Button - Select Font
fontSelectorContainer.addEventListener("click", () => {
    fontPopup.classList.toggle("active");

    const isOpen = fontPopup.classList.contains("active")

    updatePopupState(isOpen)
})

document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") {
        fontPopup.classList.remove("active")

        updatePopupState(false);
    }
})

// Button Popup - Select Font
btnSansSerif.addEventListener("click", () => {
    body.classList.remove("serif")
    body.classList.remove("mono")

    fontText.textContent = "Sans Serif"
    body.classList.add("sans-serif")

    closePopup()
    
})

btnSerif.addEventListener("click", () => {
    body.classList.remove("sans-serif")
    body.classList.remove("mono")

    fontText.textContent = "Serif"
    body.classList.add("serif")

    closePopup()
})

btnMono.addEventListener("click", () => {
    body.classList.remove("sans-serif")
    body.classList.remove("serif")

    fontText.textContent = "Mono"
    body.classList.add("mono")

    closePopup()
})
