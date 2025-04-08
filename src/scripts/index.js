import "../pages/index.css";
import { initialCards } from "./cards.js";

import { createCard } from "./card.js";
import { openPopup, closePopup } from "./modal.js";

function deleteCard(cardElement) {
  cardElement.remove();
}

function toggleLike(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

const popupImage = document.querySelector(".popup_type_image");
const popupImageElement = popupImage.querySelector(".popup__image");
const popupCaption = popupImage.querySelector(".popup__caption");

function openImagePopup(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupCaption.textContent = cardData.name;
  openPopup(popupImage);
}

const placesList = document.querySelector(".places__list");

initialCards.forEach((cardData) => {
  const card = createCard(cardData, deleteCard, toggleLike, openImagePopup);
  placesList.appendChild(card);
});

const editButton = document.querySelector(".profile__edit-button");
const addButton = document.querySelector(".profile__add-button");

const popupEdit = document.querySelector(".popup_type_edit");
const popupAdd = document.querySelector(".popup_type_new-card");

editButton.addEventListener("click", () => {
  nameInput.value = profileName.textContent;
  jobInput.value = profileDescription.textContent;
  openPopup(popupEdit);
});

addButton.addEventListener("click", () => openPopup(popupAdd));

document.querySelectorAll(".popup__close").forEach((button) => {
  button.addEventListener("click", () => {
    const popup = button.closest(".popup");
    closePopup(popup);
  });
});

document.querySelectorAll(".popup").forEach((popup) => {
  popup.addEventListener("mousedown", (evt) => {
    if (evt.target === popup) {
      closePopup(popup);
    }
  });
});

const profileName = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");

const formElement = popupEdit.querySelector(".popup__form");
const nameInput = formElement.querySelector(".popup__input_type_name");
const jobInput = formElement.querySelector(".popup__input_type_description");

function handleFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(popupEdit);
}

formElement.addEventListener("submit", handleFormSubmit);

const formAddCard = popupAdd.querySelector(".popup__form");
const placeNameInput = formAddCard.querySelector(
  ".popup__input_type_card-name"
);
const placeLinkInput = formAddCard.querySelector(".popup__input_type_url");

function handleAddCardSubmit(evt) {
  evt.preventDefault();

  const newCardData = {
    name: placeNameInput.value,
    link: placeLinkInput.value,
  };

  const newCard = createCard(
    newCardData,
    deleteCard,
    toggleLike,
    openImagePopup
  );
  placesList.prepend(newCard);

  closePopup(popupAdd);
  formAddCard.reset();
}

formAddCard.addEventListener("submit", handleAddCardSubmit);
