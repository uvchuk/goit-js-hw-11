import './css/styles.css';
import photoCardTpl from './templates/photo-card';
import GalleryApi from './js/gallery_api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';

const galleryApi = new GalleryApi();
const refs = {
  formRef: document.getElementById('search-form'),
  inputRef: document.querySelector('#search-form > input'),
  searchBtnRef: document.querySelector('button[type="submit]'),
  loadMoreBtnRef: document.querySelector('.load-more'),
  galleryContainerRef: document.querySelector('.gallery'),
};
refs.formRef.addEventListener('submit', onSearch);
refs.loadMoreBtnRef.addEventListener('click', fetchPictures);
refs.loadMoreBtnRef.classList.add('is-hidden');

function onSearch(evt) {
  evt.preventDefault();
  clearInterface();
  galleryApi.resetPage();
  galleryApi.query = evt.currentTarget.firstElementChild.value.trim();
  if (galleryApi.query === '') {
    refs.loadMoreBtnRef.classList.add('is-hidden');
    return;
  }
  fetchPictures();
  refs.formRef.reset();
}

function renderPictures(pictures) {
  refs.loadMoreBtnRef.classList.add('is-hidden');

  if (pictures.totalHits === 0)
    onError(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  else if (pictures.totalHits > 0 && pictures.hits.length === 0)
    onError("We're sorry, but you've reached the end of search results.");
  else {
    const markup = [];
    markup.push(
      pictures.hits
        .map(picture => {
          return photoCardTpl(picture);
        })
        .join('')
    );
    refs.galleryContainerRef.insertAdjacentHTML('beforeend', markup);
    refs.loadMoreBtnRef.classList.remove('is-hidden');
    galleryApi.incrementPage();
  }
}

function fetchPictures() {
  galleryApi.getPictures().then(renderPictures).catch(onError);
}

function onError(err) {
  Notify.failure(err);
}

function clearInterface() {
  refs.galleryContainerRef.innerHTML = '';
}
