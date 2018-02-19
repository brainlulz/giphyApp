const giphyUrl = "http://api.giphy.com/v1/gifs/search?q";
const apikey = "vw4usscjAkDQiPbUvnGdRJfpEUWqZsuY";

let formElement = document.querySelector("#form");
let gifDisplay = document.querySelector(".results");
let urlParams = new URLSearchParams(window.location.search);

//Loading
window.onload = e => {
  let urlParam = urlParams.get('q')
  if (urlParam) {
    searching(urlParam, e);
  }
};

//search
formElement.addEventListener("submit", e => {
  let inputText = e.target[0].value;
  searching(inputText, e);
  urlParams == undefined ? urlParams.set('q', inputText) : window.location.href += `?q=${inputText}`;
});

searching = (searchedText, e) => {
  let url = `${giphyUrl}=${searchedText}&api_key=${apikey}`;
  fetch(url)
    .then(response => {
      response.json().then(data => {
        while (gifDisplay.firstChild) {
          gifDisplay.removeChild(gifDisplay.firstChild);
        }
        for (let i = 0; i < data.data.length; i++) {
          let image = document.createElement('img')
          image.setAttribute('src', data.data[i].images.fixed_width.url);
          image.setAttribute('alt', data.data[i].slug);
          gifDisplay.appendChild(image);
        }
      });
    })
    .catch(error => console.log(error));
  e.preventDefault();
};
