import axios from 'axios';
import Notiflix from 'notiflix';

import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { onScroll, onToTopBtn } from './js/scroll';

let page = 1;
const perPage = 40;
let searchedImage = '';

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchButton: document.querySelector('.load'),
  gallery: document.querySelector('.gallery'),
  loadMoreButton: document.querySelector('.load-more'),
};

refs.loadMoreButton.style.display = 'none';

refs.searchForm.addEventListener('submit', onSearchFormSubmit);
refs.loadMoreButton.addEventListener('click', loadMoreImages);

let lightbox = new SimpleLightbox('.photo-card a', {
  captions: true,
  captionsData: 'alt',
  captionDelay: 250,
});

axios.defaults.baseURL = 'https://pixabay.com/api/';
const API_KEY = '34754697-0d2595d46a3257cdf22f20f5a';

async function fetchImages(searchedImage, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${searchedImage}&per_page=${perPage}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true`
  );
  return response;
}

function onSearchFormSubmit(e) {
  e.preventDefault();
  page = 1;
  refs.gallery.innerHTML = '';
  refs.loadMoreButton.style.display = 'none';
  searchedImage = e.currentTarget.elements.searchQuery.value.trim();

  if (!searchedImage) {
    return Notiflix.Notify.failure('Please enter something.');
  }
  fetchImages(searchedImage, page, perPage).then(({ data }) => {
    if (!data.hits.length) {
      return Notiflix.Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    } else {
      createPhotoCardGallery(data);
      Notiflix.Notify.info(`We found ${data.totalHits} images.`);
      if (data.total <= perPage) {
        refs.loadMoreButton.style.display = 'none';
      } else refs.loadMoreButton.style.display = 'block';
      page += 1;
      const { height: cardHeight } = document
        .querySelector('.gallery')
        .firstElementChild.getBoundingClientRect();
      window.scrollBy({
        top: cardHeight * 0,
        behavior: 'smooth',
      });
    }
  });
}

function createPhotoCardMarkup({
  webformatURL,
  largeImageURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
        <a class="photo__image" href="${largeImageURL}">
        <img class="gallery__image"
          src="${webformatURL}"
          alt="${tags}"
          loading="lazy"
        /></a>
        <div class="info">
          <p class="info__item"><b>Likes</b><br />${likes}</p>
          <p class="info__item"><b>Views</b><br />${views}</p>
          <p class="info__item"><b>Comments</b><br />${comments}</p>
          <p class="info__item"><b>Downloads</b><br />${downloads}</p>
        </div>
      </div>`;
}

function addToGallery(template) {
  refs.gallery.insertAdjacentHTML('beforeend', template);
}

function createPhotoCardGallery(photos) {
  const template = photos.hits
    .map(photo => createPhotoCardMarkup(photo))
    .join('');

  addToGallery(template);
  lightbox.refresh();
}

function loadMoreImages() {
  fetchImages(searchedImage, page, perPage).then(({ data }) => {
    if (data.hits.length < perPage) {
      if (!data.hits.length) {
        refs.loadMoreButton.style.display = 'none';
        return;
      }
      createPhotoCardGallery(data);
      Notiflix.Notify.info(
        'We are sorry, but you have reached the end of search results.'
      );
      refs.loadMoreButton.style.display = 'none';
      return;
    }
    createPhotoCardGallery(data);
  });
  page += 1;
}
