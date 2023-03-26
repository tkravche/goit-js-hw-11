const BASE_URL = 'https://pixabay.com/api/';
const API_KEY = '34754697-0d2595d46a3257cdf22f20f5a';

const refs = {
  searchForm: document.querySelector('.search-form'),
  inputSearchForm: document.querySelector('input'),
  searchButton: document.querySelector('button'),
};

refs.inputSearchForm.addEventListener('input', onInputSearchForm);
refs.searchButton.addEventListener('submit', onSearchButtonClick);

let searchedImage = '';
function onInputSearchForm(e) {
    searchedImage = e.currentTarget.value.trim();
    if (!searchedImage) {
        return;
  }
 };
function onSearchButtonClick(e) { 
    e.preventDefault();
    fetch(
  `${BASE_URL}?key=${API_KEY}&q=yellow+flowers&image_type=photo&orientation=horizontal&safesearch=true`
)
  .then(results => results.json())
  .then(data => console.log(data));
};
