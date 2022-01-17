import axios from "axios";

export const options = {pageNumber: 1, pageItemCount:40};

// async function fetchPhoto(namePhoto) {
//     const SEARCH_URL = 'https://pixabay.com/api/'
//     const KEY = '25247734-434310231cfff4911c33dadc4'
//     try {
//         const response = await fetch(`${SEARCH_URL}?key=${KEY}&q=${namePhoto}&image_type=photo&orientation=horizontal&safesearch=false&page=${options.pageNumber}&per_page=${options.pageItemCount}`)
//         return response.json()
//     } catch (error) {
//         console.log('Это Error в фетче: ',error)
//     }
// }


async function fetchPhoto(namePhoto) {
    const SEARCH_URL = 'https://pixabay.com/api/'
    const params = {
    params: {
      key: '25247734-434310231cfff4911c33dadc4',
      q: namePhoto,
      image_type: "photo",
      orientation: "horizontal",
      safesearch: "true",
      page: options.pageNumber,
      per_page: options.pageItemCount,
    },
  };

    const {data} = await axios.get(SEARCH_URL,params);
    return data
}
export { fetchPhoto }