import './css/styles.css';
import photoCardTpl from './templates/photo-card';
import GalleryApi from './js/gallery_api';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.6.min.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import debounce from 'lodash.debounce';

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
}

async function fetchPictures() {
  try {
    const pictures = await galleryApi.getPictures();
    renderPictures(pictures);
  } catch (err) {
    if (err.response.status === 400)
      onError("We're sorry, but you've reached requests limit!");
    onError(err.message);
  } finally {
    refs.formRef.reset();
  }
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
    if (galleryApi.currentPage === 1)
      Notify.success(`Hooray! We found ${pictures.totalHits} images.`);
    else scrollOnLoadMore();
    window.onscroll = debounce(infiniteScroll, 500);
    galleryApi.incrementPage();
    new SimpleLightbox('.gallery a', {
      captionDelay: 250,
    });
  }
}

function infiniteScroll() {
  let isExecuted = false;
  if (
    window.scrollY > document.body.offsetHeight - window.outerHeight &&
    !isExecuted
  ) {
    isExecuted = true;
    fetchPictures();
    setTimeout(() => {
      isExecuted = false;
    }, 500);
  }
}

function scrollOnLoadMore() {
  const { height: cardHeight } =
    refs.galleryContainerRef.firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 4,
    behavior: 'smooth',
  });
}

function onError(err) {
  Notify.failure(err);
}

function clearInterface() {
  refs.galleryContainerRef.innerHTML = '';
}
