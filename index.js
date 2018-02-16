let formElement = document.querySelector("#form");
const giphyUrl = "http://api.giphy.com/v1/gifs/search?q";
const apikey = "";

formElement.addEventListener("submit", e => {
  console.log(e.target[0].value);
  let inputText = e.target[0].value;
  let url = `${giphyUrl}=${inputText}&api_key=${apikey}`;

  let datas = fetch(url)
    .then(response => {
      response.json().then(data => console.log(data));
    })
    .catch(error => console.log(error));

  console.log(datas);

  e.preventDefault();
});
