// Global
const body = document.body;

// Header
const fontSelectorContainer = document.querySelector(".font-selector-container");
const fontPopup = document.querySelector(".popup")
const themeLogo = document.querySelector("#theme-logo");

function applyThemeStyles() {
    body.classList.toggle("light-theme")
}

themeLogo.addEventListener("change", applyThemeStyles)

fontSelectorContainer.addEventListener("click", () => {
    fontPopup.classList.toggle("active")

    const isOpen = fontPopup.classList.contains("active")

    fontSelectorContainer.setAttribute("aria-expanded", String(isOpen))
    fontPopup.setAttribute("aria-hidden", String(!isOpen));
})

document.addEventListener("keydown", (e) => {
    if(e.key === "Escape") {
        fontPopup.classList.remove("active")

        fontSelectorContainer.setAttribute("aria-expanded", "false")
        fontPopup.setAttribute("aria-hidden", "true");
    }
})
