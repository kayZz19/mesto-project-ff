import { toggleLike } from "./api.js";

export function createCard(titleCard, imageLink, popupImage, createPopupImage, deleteCardDOM, result, currentUserId, cardLike) {
  const cardTemplate = document.querySelector('#card-template').content;
  const cardElement = cardTemplate.querySelector('.card').cloneNode(true);
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeButton = cardElement.querySelector('.card__like-button');
  const likeScore = cardElement.querySelector('.card-like-score');

  cardElement.querySelector('.card__title').textContent = titleCard;
  cardElement.querySelector('.card__image').setAttribute('src', imageLink);
  cardElement.querySelector('.card__image').setAttribute('alt', titleCard);

  if (result) {
    likeScore.textContent = result.likes.length;
    likeButton.dataset.cardId = result._id;
  }

  if (result) {
    const isLikedByUser = result.likes.some(like => like._id === currentUserId);
    likeButton.classList.toggle('card__like-button_is-active', isLikedByUser);
  }

  if (result.owner._id !== currentUserId) {
    deleteButton.style.display = 'none';
  } else {
    deleteButton.dataset.cardId = result._id;
  }

  likeButton.addEventListener('click', () => cardLike(likeButton, likeScore));
  deleteButton.addEventListener('click', () => deleteCardDOM(cardElement, result));
  cardElement.querySelector('.card__image').addEventListener('click', () => createPopupImage(popupImage, titleCard, imageLink));

  return cardElement;
}


export function cardLike(likeBtn, likeScore) {
  const likeButton = likeBtn;
  const cardId = likeButton.getAttribute('data-card-id');

  if (!cardId) return;

  const isLiked = likeButton.classList.contains('card__like-button_is-active');
  const method = isLiked ? 'DELETE' : 'PUT';

  toggleLike(cardId, method)
    .then(data => {
      likeScore.textContent = data.likes.length;
      likeButton.classList.toggle('card__like-button_is-active');
    })
    .catch(err => {
      console.error("Ошибка при загрузке данных:", err);
    });
}