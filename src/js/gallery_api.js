import { API_KEY } from './API_KEY';
import axios from 'axios';

const BASE_URL = 'https://pixabay.com/api/';
const FILTER = `image_type=photo&orientation=horizontal&safesearch=true&per_page=40`;
export default class GalleryApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  async getPictures() {
    const response = await axios.get(
      `${BASE_URL}?key=${API_KEY}&q=${this.searchQuery}&${FILTER}&page=${this.page}`
    );
    return response.data;
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
