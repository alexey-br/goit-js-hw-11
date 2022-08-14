import PixabayApiService from './pixabay-service';
import createGalleryMarkup from './gallery-markup';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';

const refs = {
  searchForm: document.forms['search-form'],
  loadMoreBtn: document.querySelector('.load-more'),
  gallery: document.querySelector('.gallery'),
};

const pixabayApiService = new PixabayApiService();
const gallery = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMore);

async function onSearch(e) {
  e.preventDefault();

  pixabayApiService.resetPage();
  pixabayApiService.query = e.currentTarget.searchQuery.value;

  try {
    const { hits, totalHits } = await pixabayApiService.fetchImages();

    clearGallery();
    if (totalHits > 0) {
      notifySearchResult(totalHits);
      renderGallery(hits);
    } else notifyNoSearchResult();
  } catch (error) {
    console.log(error);
  }
}

async function onLoadMore() {
  try {
    const { hits } = await pixabayApiService.fetchImages();
    if (hits.length > 0) {
      renderGallery(hits);
      autoScroll();
    } else notifyNoMoreSearchResult();
  } catch (error) {
    console.log(error);
  }
}

function autoScroll() {
  const { height: cardHeight } = document
    .querySelector('.gallery')
    .firstElementChild.getBoundingClientRect();

  window.scrollBy({
    top: cardHeight * 2,
    behavior: 'smooth',
  });
}

function renderGallery(imagesArray) {
  refs.gallery.insertAdjacentHTML(
    'beforeend',
    createGalleryMarkup(imagesArray)
  );
  gallery.refresh();
}

function clearGallery() {
  refs.gallery.innerHTML = '';
}

function notifySearchResult(totalHits) {
  Notify.success(`Hooray! We found ${totalHits} images.`);
}

function notifyNoSearchResult() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function notifyNoMoreSearchResult() {
  Notify.warning("We're sorry, but you've reached the end of search results.");
}
