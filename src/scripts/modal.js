export function openPopup(popup) {
    popup.classList.add("popup_is-opened");
    setTimeout(() => {
      popup.classList.add("popup_visible");
    }, 10); 
    document.addEventListener("keydown", handleEscClose);
  }
  
  export function closePopup(popup) {
    popup.classList.remove("popup_visible");
    document.removeEventListener("keydown", handleEscClose);
    popup.addEventListener("transitionend", function handler() {
      popup.classList.remove("popup_is-opened");
      popup.removeEventListener("transitionend", handler);
    });
  }
  
  export function handleEscClose(evt) {
    if (evt.key === "Escape") {
      const openedPopup = document.querySelector(".popup_is-opened");
      if (openedPopup) closePopup(openedPopup);
    }
  }