import API_KEY from './API_KEY';
const BASE_URL = 'https://pixabay.com/api/';
const FILTER = `image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
export default class GalleryApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  getPictures() {
    const url = `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${FILTER}&page=${this.page}`;
    return fetch(url)
      .then(result => result.json())
      .then(pictures => {
        return pictures;
      });
  }
  get query() {
    return this.searchQuery;
  }
  set query(newQuery) {
    this.searchQuery = newQuery;
  }
  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }
}
