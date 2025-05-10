import {createCard, cardLike} from './card.js'
import {openModal, closeModal, handleOutsideClick} from './modal.js'
import {enableValidation, clearValidation} from './validation.js'
import {updateAvatar, addCardFetch, profileFetch, profileInfoFetch, cardsGetFetch, deleteCard} from './api.js';
import '../pages/index.css'

const container = document.querySelector('.content');
const addCardButton = container.querySelector('.profile__add-button');
const editProfileButton = container.querySelector('.profile__edit-button');
const popupCardAdd = document.querySelector('.popup_type_new-card');
const popupImage = document.querySelector('.popup_type_image');
const cardContainer = container.querySelector('.places__list');
const popupEditProfile = document.querySelector('.popup_type_edit');
const titleProfile = popupEditProfile.querySelector('.popup__input_type_name');
const aboutProfile = popupEditProfile.querySelector('.popup__input_type_description');
const titleCard = popupCardAdd.querySelector('.popup__input_type_card-name'); 
const imageLink = popupCardAdd.querySelector('.popup__input_type_url');
const profileName = container.querySelector('.profile__title');
const profileDescrip = container.querySelector('.profile__description');
const profileImage = document.querySelector('.profile__image');
const cardDelete = document.querySelector('.popup_type_delete-card');
const uploadAvatar = document.querySelector('.popup_type_upload-avatar');
const uploadInput = uploadAvatar.querySelector('.popup__input_type_upload-avatar');
const deleteForm = document.querySelector("#delete-card-form");

let currentUser = null;
let currentCardId = null;
let currentCardElement = null;

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inputErrorClass: 'form__input_type_error',
  errorClass: 'form__input-error_active',
  btnDisable: 'button_disabled'
};


popupImage.querySelector('.popup__close').addEventListener('click', closeModal(popupImage))

popupCardAdd.querySelector('.popup__form').addEventListener('submit', submitAddCardForm);

editProfileButton.addEventListener('click', () => {
  titleProfile.value = profileName.textContent;
  aboutProfile.value = profileDescrip.textContent;
  clearValidation(popupEditProfile, validationConfig)
  openModal(popupEditProfile)
});

addCardButton.addEventListener('click', () => {
  clearValidation(popupCardAdd, validationConfig)
  openModal(popupCardAdd)
});
popupCardAdd.querySelector('.popup__close').addEventListener('click', () => {closeModal(popupCardAdd)});
popupCardAdd.addEventListener('click', (evt) => handleOutsideClick(evt, popupCardAdd));

popupEditProfile.querySelector('.popup__close').addEventListener('click', () => closeModal(popupEditProfile));
popupEditProfile.querySelector('.popup__form').addEventListener('submit', editInfoProfile);
popupEditProfile.addEventListener('click', (evt) => handleOutsideClick(evt, popupEditProfile));

popupImage.querySelector('.popup__close').addEventListener('click', () => closeModal(popupImage));
popupImage.addEventListener('click', (evt) => handleOutsideClick(evt, popupImage));
cardDelete.querySelector('.popup__close').addEventListener('click', () => closeModal(cardDelete));
cardDelete.addEventListener('click', (evt) => handleOutsideClick(evt, cardDelete));

document.querySelector('.profile__image').addEventListener('click', () => openModal(uploadAvatar));
uploadAvatar.querySelector('.popup__close').addEventListener('click', () => closeModal(uploadAvatar));
uploadAvatar.addEventListener('click', (evt) => handleOutsideClick(evt, uploadAvatar));
uploadAvatar.addEventListener('submit', () => {
  updateAvatar(uploadAvatar, profileImage, uploadInput)
  .then(() => {
    profileImage.style.backgroundImage = `url('${uploadInput.value}')`;
    closeModal(uploadAvatar);
  })
  .catch(err => {
    console.error(err);
  });
})
deleteForm.addEventListener("submit", handleDelete);


function editInfoProfile(evt) {
  evt.preventDefault();

  const titleProfile = popupEditProfile.querySelector('.popup__input_type_name');
  const aboutProfile = popupEditProfile.querySelector('.popup__input_type_description');

  editProfile(titleProfile.value, aboutProfile.value);
}

function submitAddCardForm(evt) { 
  evt.preventDefault();
  const saveButton = popupCardAdd.querySelector('.popup__button');
  saveButton.textContent = 'Сохранение...';
  addCardFetch(titleCard, imageLink)
  .then(result => {
    const newCard = createCard(
      result.name,
      result.link,
      popupImage,
      createPopupImage,
      deleteCardDOM,
      result,
      currentUser,
      cardLike
    );

    cardContainer.prepend(newCard);

    titleCard.value = '';
    imageLink.value = '';
    closeModal(popupCardAdd);
  })
  .catch(err => {
    console.error(err);
  })
  .finally(() => {
    saveButton.textContent = 'Сохранить';
  });
}

function deleteCardDOM(cardElement, result) {
  currentCardId = result._id;
  currentCardElement = cardElement;

  openModal(cardDelete);
}


function handleDelete(evt) {
  evt.preventDefault();

  if (!currentCardId || !currentCardElement) {
    console.error("Ошибка: отсутствует карточка для удаления.");
    return;
  }

  deleteCard(currentCardId, currentCardElement)
    .then(() => {
      currentCardElement.remove();
      closeModal(cardDelete);
      currentCardId = null;
      currentCardElement = null;
    })
    .catch(err => {
      console.error("Ошибка при удалении карточки:", err);
    });
}

function editProfile(titleProfile, aboutProfile) {
  const saveButton = popupEditProfile.querySelector('.popup__button');
  saveButton.textContent = 'Сохранение...';

  profileFetch(titleProfile, aboutProfile)
  .then(data => {
    profileName.textContent = data.name;
    profileDescrip.textContent = data.about;
    closeModal(popupEditProfile);
  })
  .catch(err => {
    console.error(err);
    alert('Произошла ошибка при сохранении данных. Попробуйте снова.');
  })
  .finally(() => {
    saveButton.textContent = 'Сохранить';
  });
}

function createPopupImage(popupImage, titleCard, imageLink) {
  popupImage.querySelector('.popup__caption').textContent = titleCard;
  popupImage.querySelector('.popup__image').setAttribute('src', imageLink);
  popupImage.querySelector('.popup__image').setAttribute('alt', titleCard);
  openModal(popupImage);
}

enableValidation(validationConfig);

addEventListener('DOMContentLoaded', () => {
  Promise.all([profileInfoFetch(), cardsGetFetch()])
    .then(([profileData, cardsData]) => {
      currentUser = profileData._id;
      profileName.textContent = profileData.name;
      profileDescrip.textContent = profileData.about;
      profileImage.style.backgroundImage = `url('${profileData.avatar}')`;
      
      cardsData.forEach(card => {
        const newCard = createCard(
          card.name, 
          card.link, 
          popupImage, 
          createPopupImage, 
          deleteCardDOM,
          card,
          profileData._id,
          cardLike
        );
        cardContainer.append(newCard);
      });
    })
    .catch(err => {
      console.error("Ошибка при загрузке данных:", err);
    });
});
