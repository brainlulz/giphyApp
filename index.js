import views from "./views";

const giphyUrl = "http://api.giphy.com/v1/gifs/search?q";
const apikey = "vw4usscjAkDQiPbUvnGdRJfpEUWqZsuY";

const urlParams = new URLSearchParams(window.location.search);
const searchedQuery = urlParams.get("q");

const formElement = document.querySelector("#form");
const gifDisplay = document.querySelector(".results");
const favoritedBtn = document.querySelector(".favoris");
let gifInfos = [];
let gifResults = [];
let favoritedGifs = [];

//Loading
window.onload = e => {
  if (window.location.pathname === "/favorited") {
    /* favorited(); */
  } else {
    if (searchedQuery) {
      searching(searchedQuery, e);
      formElement.querySelector("input").setAttribute("value", searchedQuery);
    }
  }
};

//search
formElement.addEventListener("submit", e => {
  let inputText = e.target[1].value;

  searching(inputText, e);
  history.pushState(null, "", "/");
  if (searchedQuery != null) {
    urlParams.set("q", inputText);
    history.pushState(null, "", `?q=${inputText}`);
  } else {
    history.pushState(null, "", `?q=${inputText}`);
  }
});

let searching = (searchedText, e) => {
  let url = `${giphyUrl}=${searchedText}&api_key=${apikey}`;
  fetch(url)
    .then(response => {
      return response.json();
    })
    .then(data => {
      while (gifDisplay.firstChild) {
        gifDisplay.removeChild(gifDisplay.firstChild);
      }
      let recievedData = data.data;
      gifResults = recievedData;
      if (recievedData.length) {
        gifResults = recievedData;
        const fragment = document.createDocumentFragment();
        recievedData.forEach(gifInfos => {
          fragment.appendChild(views.renderedGif(gifInfos));
        });
        gifDisplay.appendChild(fragment);
      } else {
        return Promise.reject("Aucun resultat");
      }
      /* let nbrResults = document.createElement("p");
      let nbrResultsText = document.createTextNode(
        `${recievedData.length} results`
      );
      nbrResults.appendChild(nbrResultsText);
      let nbrResultElement = document.querySelector(".nbrResults");
      nbrResultElement.appendChild(nbrResults); */

      /* if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
          let favoritedGifId = localStorage.key(i);
          let favoritedGif = document.getElementById(favoritedGifId);
          favoritedGif.querySelector('img').classList.add("favorited");
        }
      } */
    })
    .catch(error => console.log(error));
  e.preventDefault();
};

//Add to favorite
gifDisplay.addEventListener("click", e => {
  let favId = e.target.classList.item(0);
  let favImg = document.getElementsByClassName(favId)[1];
  let allGifsFav = JSON.parse(localStorage.getItem("gifs"));

  if (allGifsFav !== null) {
    let alreadyFav = false;
    for (let gifs of allGifsFav) {
      if (gifs.id === favId) {
        alreadyFav = true;
      }
    }
    if (alreadyFav === false) {
      addFavorite(favId, favImg);
    } else {
      deleteFavorite(favId, favImg, allGifsFav);
    }
  } else {
    addFavorite(favId, favImg);
  }
});

function addFavorite(favId, favImg) {
  const gif = gifResults.find(gif => gif.id === favId);
  favoritedGifs.push(gif);
  favImg.classList.add("favorited");
  saveFavorite(favoritedGifs);
}

function deleteFavorite(favId, favImg, allGifsFav) {
  if (window.location.pathname === "/favorited") {
    let rmvGif = document.getElementById(favId);
    gifDisplay.removeChild(rmvGif);
  }
  const gif = allGifsFav.find(gif => gif.id === favId);
  const gifIndex = allGifsFav.indexOf(gif);
  favoritedGifs = allGifsFav.slice(gifIndex, 1);
  favImg.classList.remove("favorited");
}

function saveFavorite(favoritedGifs) {
  localStorage.setItem("gifs", JSON.stringify(favoritedGifs));
}

favoritedBtn.addEventListener("click", e => {
  history.pushState(null, "", "/favorited");
  while (gifDisplay.firstChild) {
    gifDisplay.removeChild(gifDisplay.firstChild);
  }
  let allGifsFav = JSON.parse(localStorage.getItem("gifs"));
  const fragment = document.createDocumentFragment();
  allGifsFav.forEach(gifInfos => {
    fragment.appendChild(views.renderedGif(gifInfos));
  });
  gifDisplay.appendChild(fragment);
});
