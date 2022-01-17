import '../scss/custom.scss'
import './css/styles.css';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from "notiflix/build/notiflix-notify-aio";
import { fetchPhoto } from './fetchPhoto'
import { options } from './fetchPhoto'
import { preventOverflow } from '@popperjs/core';
import { Button } from 'bootstrap';


const refs = {
    form: document.querySelector('#search-form'),
    gallery: document.querySelector('.gallery'),
    btnLoadMore: document.querySelector('.load-more'),
}
const formInput = refs.form.elements.searchQuery;

refs.form.addEventListener('submit', onFormSubmit)
refs.btnLoadMore.addEventListener('click', onClickLoadMoreBtn)

let lightbox 
  
//=========== асинк фн. при отправке формы =======
async function onFormSubmit(event) {
  event.preventDefault();
  refs.gallery.innerHTML = ''
  options.pageNumber = 1;
  refs.btnLoadMore.classList.add('is-hidden')

  if (formInput.value.trim() === '') {
    Notify.info("You seen random photo")
  }
  try {
    const response = await fetchPhoto(formInput.value)
    if (response.hits.length === 0) {
        return Notify.failure("Sorry, there are no images matching your search query. Please try again.")
    }
    Notify.info(`Hooray! We found ${response.totalHits} images.`)
    countryArrayMarkup(response)

    lightbox = new SimpleLightbox('.gallery a', {
    captions: true, captionSelector: 'img', captionType: 'attr', captionsData: `alt`, captionPosition: 'bottom', captionDelay: 250
    });
    if (response.totalHits < options.pageItemCount) {          
          return
    }
        console.log('current page:',options.pageNumber)
        options.pageNumber += 1;
        console.log('next page :',options.pageNumber)
    setTimeout(() => refs.btnLoadMore.classList.remove('is-hidden'), 1000)
  } catch (error) {
    console.log('Это тот же эрор что и выше',error)
  } 
}

//=========== асинк фн. при подгрузке изображений =======
async function onClickLoadMoreBtn() {
  try {
    buttonDisabledTrue()
    const response = await fetchPhoto(formInput.value)
    console.log('current page:',options.pageNumber)
    options.pageNumber += 1
    console.log('next page :', options.pageNumber)
    countryArrayMarkup(response)
    lightbox.refresh()
    
    if (response.totalHits / options.pageItemCount < options.pageNumber) {
      refs.btnLoadMore.classList.add('is-hidden')
      return Notify.info("We're sorry, but you've reached the end of search results.");
    }
    buttonDisabledFalse()
  } catch (error) {
    console.log(error)
  }
}
function buttonDisabledTrue() {
  refs.btnLoadMore.setAttribute('disabled', true)
}
function buttonDisabledFalse() {
  refs.btnLoadMore.removeAttribute('disabled')
}

//=========== разметкa =======
function countryArrayMarkup(array) {
    const arrayMarkup = array.hits.map(({ webformatURL,largeImageURL,tags,likes ,views ,comments ,downloads , }) =>
    {
      // console.log(largeImageURL)
      return `
  <div class="photo-card">
    <a href="${largeImageURL}">
      <img src="${webformatURL}" alt="${tags}" loading="lazy" />
    </a>
    <div class="info">
      <p class="info-item">
        <b>likes ${likes}</b>
      </p>
      <p class="info-item">
        <b>views ${views}</b>
      </p>
      <p class="info-item">
        <b>comments ${comments}</b>
      </p>
      <p class="info-item">
        <b>downloads ${downloads}</b>
      </p>
    </div>
  </div>
`
    }).join("")
  refs.gallery.insertAdjacentHTML('beforeend', arrayMarkup)
}

//============ old variant onFormSubmit ============
// function onFormSubmit(event) {
//   event.preventDefault();
//   refs.gallery.innerHTML = ''
//   options.pageNumber = 1;
//   refs.btnLoadMore.classList.add('is-hidden')

//   if (formInput.value.trim() === '') {
//     Notify.info("You seen random photo")
//   }


//   fetchPhoto(formInput.value).then((response) => {
//         countryArrayMarkup(response)
//         console.log(response)
//         options.pageNumber += 1;
//         console.log(options.pageNumber)
//         setTimeout(()=>refs.btnLoadMore.classList.remove('is-hidden'),1000)
//   }).catch((error) => {
//            console.log(error)
//   });
  
  
// }

//============== old variant onClickLoadMoreBtn ==========
// function onClickLoadMoreBtn () {
//   fetchPhoto(formInput.value)
//     .then((response) => {
//       options.pageNumber += 1
//       console.log(options.pageNumber)
//       countryArrayMarkup(response)
//       console.log(response)
//     })
//     .catch((error) => {
//            console.log(error)
//     });
// }

//============== old vatiant markup =========
// function countryArrayMarkup(array) {
//     const arrayMarkup = array.hits.map(({ webformatURL,largeImageURL,tags,likes ,views ,comments ,downloads , }) =>
//     {
//         return `<div class="photo-card">
//   <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//   <div class="info">
//     <p class="info-item">
//       <b>likes ${likes}</b>
//     </p>
//     <p class="info-item">
//       <b>views ${views}</b>
//     </p>
//     <p class="info-item">
//       <b>comments ${comments}</b>
//     </p>
//     <p class="info-item">
//       <b>downloads ${downloads}</b>
//     </p>
//   </div>
// </div>`
//     }).join("")
//   refs.gallery.insertAdjacentHTML('beforeend', arrayMarkup)
// }