export function openModal(popup) {
  popup.classList.add('popup_is-opened');
  document.addEventListener("keydown", handleEscPress);
}

export function closeModal(popup) {
  popup.classList.remove('popup_is-opened');
  document.removeEventListener("keydown", handleEscPress);
}

export function handleOutsideClick(evt) {
  if (!evt.target.closest('.popup__content')) {
    const popup = document.querySelector('.popup_is-opened');
    closeModal(popup);
  }
}

function handleEscPress(evt) {
  if (evt.key === "Escape") {
      const popup = document.querySelector('.popup_is-opened');
      if (!popup) return;
      closeModal(popup);
  }
}