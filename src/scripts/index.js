import "../pages/index.css";
import { initialCards } from "./cards.js";

import { createCard } from "./card.js";
import { openPopup, closePopup } from "./modal.js";

import { deleteCard } from "./card.js";

function toggleLike(likeButton) {
  likeButton.classList.toggle("card__like-button_is-active");
}

const popupImage = document.querySelector(".popup_type_image");
const popupImageElement = popupImage.querySelector(".popup__image");
const popupImageCaption = popupImage.querySelector(".popup__caption");

function openImagePopup(cardData) {
  popupImageElement.src = cardData.link;
  popupImageElement.alt = cardData.name;
  popupImageCaption.textContent = cardData.name;
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

const formEditProfile = popupEdit.querySelector(".popup__form");

const nameInput = formEditProfile.querySelector(".popup__input_type_name");
const jobInput = formEditProfile.querySelector(
  ".popup__input_type_description"
);

function handleProfileFormSubmit(evt) {
  evt.preventDefault();
  profileName.textContent = nameInput.value;
  profileDescription.textContent = jobInput.value;
  closePopup(popupEdit);
}

formEditProfile.addEventListener("submit", handleProfileFormSubmit);

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
