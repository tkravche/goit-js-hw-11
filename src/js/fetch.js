const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34754697-0d2595d46a3257cdf22f20f5a';

let page = 1;
const perPage = 5;

const refs = {
  searchForm: document.querySelector('.search-form'),
  inputSearchForm: document.querySelector('input'),
  searchButton: document.querySelector('button'),
  gallery: document.querySelector('.gallery'),
  pagination: document.querySelector('.pagination'),

};

refs.searchForm.addEventListener('submit', onSearchFormSubmit);

let searchedImage = '';
function onSearchFormSubmit(e) {
  e.preventDefault();
  searchedImage = e.currentTarget.elements.searchQuery.value;
   if (!searchedImage) {
    return alert('Enter the valid query, please.');
  }
  fetch(
    `${BASE_URL}?key=${API_KEY}&q=${searchedImage}&per_page=${perPage}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(foundImages => foundImages.json())
    .then(photos => { createPhotoCardGallery(photos); const totalHits = photos.totalHits; createPagination(totalHits); })
    .catch((error) => console.log('error :>> ', error));
}

function createPhotoCardMarkup({
  webformatURL,
  tags,
  likes,
  views,
  comments,
  downloads,
}) {
  return `<div class="photo-card">
  <img src="${webformatURL}" alt="${tags}" loading="lazy" />
  <div class="info">
    <p class="info-item">
      <b>Likes: ${likes}</b>
    </p>
    <p class="info-item">
      <b>Views: ${views}</b>
    </p>
    <p class="info-item">
      <b>Comments: ${comments}</b>
    </p>
    <p class="info-item">
      <b>Downloads: ${downloads}</b>
    </p>
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
 

}

function getPhotosPage({ target: { textContent: page = 1 } }) {
  fetch(
    `${BASE_URL}?key=${API_KEY}&q=${searchedImage}&per_page=${perPage}&page=${page}&image_type=photo&orientation=horizontal&safesearch=true`
  )
    .then(foundImages => foundImages.json())
    .then(photos => { refs.gallery.innerHTML = ''; createPhotoCardGallery(photos)})
    .catch((error) => console.log('error :>> ', error));
}

function createPagination(totalHits) {
    const pagesNumber = Math.ceil(totalHits / perPage);
  
  for (let i = 1; i <= pagesNumber; i++){
    const pagesList = document.createElement('li');
    pagesList.textContent = i;
    refs.pagination.append(pagesList);
    pagesList.addEventListener('click', getPhotosPage)
  }
}