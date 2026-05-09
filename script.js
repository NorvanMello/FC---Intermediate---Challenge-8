// Global
const body = document.querySelector("body")

// Header
const fontSelectorContainer = document.querySelector(".font-selector-container");
const themeLogo = document.querySelector("#theme-logo");

// fontSelectorContainer.addEventListener("click", buttonPressed)

function applyThemeStyles() {
    body.classList.toggle("light-theme")
}

themeLogo.addEventListener("change", applyThemeStyles)
