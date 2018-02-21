import './toto';

const giphyUrl = "http://api.giphy.com/v1/gifs/search?q";
const apikey = "vw4usscjAkDQiPbUvnGdRJfpEUWqZsuY";

let urlParams = new URLSearchParams(window.location.search);
let urlParam = urlParams.get("q");

let formElement = document.querySelector("#form");
let gifDisplay = document.querySelector(".results");
let favoritedBtn = document.querySelector(".favoris");
let gifInfos = [];

//Loading
window.onload = e => {
  if (window.location.pathname === "/favorited") {
    favorited();
  } else {
    if (urlParam) {
      searching(urlParam, e);
      formElement
        .querySelector("input")
        .setAttribute("value", urlParam);
    }
  }
};

//search
formElement.addEventListener("submit", e => {
  let inputText = e.target[1].value;
  history.pushState(null, "", "/");
  searching(inputText, e);
  if (urlParam != null) {
    urlParams.set("q", inputText);
    window.location.search = `?q=${inputText}`;
  } else {
    window.location.href += `?q=${inputText}`;
  }
});

searching = (searchedText, e) => {
  let url = `${giphyUrl}=${searchedText}&api_key=${apikey}`;
  fetch(url)
    .then(response => {
      return response.json()
    })
    .then(data => {
      if (data.data.length) {
        while (gifDisplay.firstChild) {
          gifDisplay.removeChild(gifDisplay.firstChild);
        }
        for (let i = 0; i < data.data.length; i++) {
          let imageDiv = document.createElement("div");
          let image = document.createElement("img");
          let imageModal = document.createElement("div");
          let favButton = document.createElement("p");
          let favText = document.createTextNode("");
          let linkButton = document.createElement("a");
          let linkText = document.createTextNode("Link");
          linkButton.setAttribute("href", data.data[i].url);
          imageDiv.setAttribute("class", "imageContainer");
          imageDiv.setAttribute("id", data.data[i].id);
          imageModal.setAttribute("class", "imgModal");
          favButton.setAttribute("class", `${data.data[i].id} favBtn`);
          image.setAttribute("src", data.data[i].images.fixed_width.url);
          image.setAttribute("class", data.data[i].id);
          image.setAttribute("alt", data.data[i].slug);
          favButton.appendChild(favText);
          linkButton.appendChild(linkText);
          imageModal.appendChild(favButton);
          imageModal.appendChild(linkButton);
          imageDiv.appendChild(imageModal);
          imageDiv.appendChild(image);
          gifDisplay.appendChild(imageDiv);
          gifInfos.push({
            id: data.data[i].id,
            href: data.data[i].url,
            src: data.data[i].images.fixed_width.url,
            alt: data.data[i].slug
          });
        }
      } else {
        return Promise.reject("Aucun resultat");
      }
      let nbrResults = document.createElement("p");
      let nbrResultsText = document.createTextNode(
        `${data.data.length} results`
      );
      nbrResults.appendChild(nbrResultsText);
      let nbrResultElement = document.querySelector(".nbrResults");
      nbrResultElement.appendChild(nbrResults);
      if (localStorage.length > 0) {
        for (let i = 0; i < localStorage.length; i++) {
          let favoritedGifId = localStorage.key(i);
          let favoritedGif = document.getElementById(favoritedGifId);
          favoritedGif.querySelector('img').classList.add("favorited");
        }
      }
        
    })
    .catch(error => console.log(error));
  e.preventDefault();
};

//Add to favorite
gifDisplay.addEventListener("click", e => {
  let favId = e.target.getAttribute("class").split(" ")[0];
  let favImg = document.getElementsByClassName(favId)[1];
  let favs = localStorage.getItem(favId);
  if (favId !== undefined) {
    if (favs !== null) {
      if (window.location.pathname === "/favorited") {
        let rmvGif = document.getElementById(favId);
        gifDisplay.removeChild(rmvGif);
      }
      localStorage.removeItem(favId);
      favImg.classList.remove("favorited");
    } else {
      for (let i = 0; i < gifInfos.length; i++) {
        if (favId == gifInfos[i].id) {
          localStorage.setItem(favId, JSON.stringify(gifInfos[i]));
          favImg.classList.add("favorited");
        }
      }
    }
  }
});

favoritedBtn.addEventListener("click", e => {
  history.pushState(null, "", "/favorited");
  while (gifDisplay.firstChild) {
    gifDisplay.removeChild(gifDisplay.firstChild);
  }
  favorited();
});

function favorited() {
  for (let i = 0; i < localStorage.length; i++) {
    let favItemId = localStorage.key(i);
    let objectGif = localStorage.getItem(favItemId);
    let imageDiv = document.createElement("div");
    let image = document.createElement("img");
    let imageModal = document.createElement("div");
    let favButton = document.createElement("p");
    let favText = document.createTextNode("");
    let linkButton = document.createElement("a");
    let linkText = document.createTextNode("Link");
    let FavGifInfos = JSON.parse(objectGif);
    linkButton.setAttribute("href", FavGifInfos.href);
    imageDiv.setAttribute("id", FavGifInfos.id);
    imageDiv.setAttribute("class", "imageContainer");
    imageModal.setAttribute("class", "imgModal");
    favButton.setAttribute("class", `${favItemId} favBtn`);
    image.setAttribute("src", FavGifInfos.src);
    image.setAttribute("class", `${favItemId} favorited`);
    image.setAttribute("alt", FavGifInfos.alt);
    favButton.appendChild(favText);
    linkButton.appendChild(linkText);
    imageModal.appendChild(favButton);
    imageModal.appendChild(linkButton);
    imageDiv.appendChild(imageModal);
    imageDiv.appendChild(image);
    gifDisplay.appendChild(imageDiv);
  }
}

function favoritedGifBorder() {}
