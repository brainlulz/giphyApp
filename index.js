const giphyUrl = "http://api.giphy.com/v1/gifs/search?q";
const apikey = "vw4usscjAkDQiPbUvnGdRJfpEUWqZsuY";

let urlParams = new URLSearchParams(window.location.search);
let urlParam = urlParams.get("q");

let formElement = document.querySelector("#form");
let gifDisplay = document.querySelector(".results");
let favorites = [];
let gifIds = [];

//Loading
window.onload = e => {
  if (urlParam) {
    searching(urlParam, e);
  }
};

//search
formElement.addEventListener("submit", e => {
  let inputText = e.target[0].value;
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
      response.json().then(data => {
        if (data.data.length) {
          while (gifDisplay.firstChild) {
            gifDisplay.removeChild(gifDisplay.firstChild);
          }
          for (let i = 0; i < data.data.length; i++) {
            let imageDiv = document.createElement("div");
            let image = document.createElement("img");
            let imageModal = document.createElement("div");
            let favButton = document.createElement("p");
            let favText = document.createTextNode("fav");
            let linkButton = document.createElement("a");
            let linkText = document.createTextNode("Link");
            linkButton.setAttribute("href", data.data[i].url);
            imageDiv.setAttribute("class", "imageContainer");
            imageModal.setAttribute("class", "imgModal");
            favButton.setAttribute("id", data.data[i].id);
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
            gifIds.push(data.data[i].id);
          }
        } else {
          console.log("Aucun resultat");
        }
      });
    })
    .catch(error => console.log(error));
  e.preventDefault();
};

//Add to favorite
gifDisplay.addEventListener("click", e => {
  let favId = e.target.getAttribute("id");
  for (ids of gifIds) {
    if (favId == ids) {
      for (favs of favorites) {
        if (favs === favId) {
          //unfavorite the id
        } else {
          favorites.push(favId);
        }
      }
    }
  }
});
