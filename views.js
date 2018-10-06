export default {
    renderedGif(gifInfos) {
      const imageDiv = document.createElement("div");
      const image = document.createElement("img");
      const imageModal = document.createElement("div");
      const favButton = document.createElement("button");
      const linkButton = document.createElement("a");
      const linkText = document.createTextNode("Link");
      linkButton.setAttribute("href", gifInfos.url);
      imageDiv.setAttribute("class", "imageContainer");
      imageDiv.setAttribute("id", gifInfos.id);
      imageModal.setAttribute("class", "imgModal");
      favButton.setAttribute("class", `${gifInfos.id} favBtn`);
      image.setAttribute("src", gifInfos.images.fixed_width.url);
      image.setAttribute("class", gifInfos.id);
      image.setAttribute("alt", gifInfos.slug);
      linkButton.appendChild(linkText);
      imageModal.appendChild(favButton);
      imageModal.appendChild(linkButton);
      imageDiv.appendChild(imageModal);
      imageDiv.appendChild(image);
      return imageDiv;
    }
  };
  