// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
require = (function (modules, cache, entry) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof require === "function" && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof require === "function" && require;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  // Override the current require with this new one
  return newRequire;
})({6:[function(require,module,exports) {

},{}],7:[function(require,module,exports) {

},{}],8:[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = {
  renderedGif: function renderedGif(gifInfos) {
    var imageDiv = document.createElement("div");
    var image = document.createElement("img");
    var imageModal = document.createElement("div");
    var favButton = document.createElement("button");
    var linkButton = document.createElement("a");
    var linkText = document.createTextNode("Link");
    linkButton.setAttribute("href", gifInfos.url);
    imageDiv.setAttribute("class", "imageContainer");
    imageDiv.setAttribute("id", gifInfos.id);
    imageModal.setAttribute("class", "imgModal");
    favButton.setAttribute("class", gifInfos.id + " favBtn");
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
},{}],3:[function(require,module,exports) {
"use strict";

var _controllers = require("./controllers");

var _controllers2 = _interopRequireDefault(_controllers);

var _models = require("./models");

var _models2 = _interopRequireDefault(_models);

var _views = require("./views");

var _views2 = _interopRequireDefault(_views);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var giphyUrl = "http://api.giphy.com/v1/gifs/search?q";
var apikey = "vw4usscjAkDQiPbUvnGdRJfpEUWqZsuY";

var urlParams = new URLSearchParams(window.location.search);
var searchedQuery = urlParams.get("q");

var formElement = document.querySelector("#form");
var gifDisplay = document.querySelector(".results");
var favoritedBtn = document.querySelector(".favoris");
var gifInfos = [];
var gifResults = [];
var favoritedGifs = [];

//Loading
window.onload = function (e) {
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
formElement.addEventListener("submit", function (e) {
  var inputText = e.target[1].value;

  searching(inputText, e);
  history.pushState(null, "", "/");
  if (searchedQuery != null) {
    urlParams.set("q", inputText);
    history.pushState(null, "", "?q=" + inputText);
  } else {
    history.pushState(null, "", "?q=" + inputText);
  }
});

var searching = function searching(searchedText, e) {
  var url = giphyUrl + "=" + searchedText + "&api_key=" + apikey;
  fetch(url).then(function (response) {
    return response.json();
  }).then(function (data) {
    while (gifDisplay.firstChild) {
      gifDisplay.removeChild(gifDisplay.firstChild);
    }
    var recievedData = data.data;
    gifResults = recievedData;
    if (recievedData.length) {
      gifResults = recievedData;
      var fragment = document.createDocumentFragment();
      recievedData.forEach(function (gifInfos) {
        fragment.appendChild(_views2.default.renderedGif(gifInfos));
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
  }).catch(function (error) {
    return console.log(error);
  });
  e.preventDefault();
};

//Add to favorite
gifDisplay.addEventListener("click", function (e) {
  var favId = e.target.classList.item(0);
  var favImg = document.getElementsByClassName(favId)[1];
  var allGifsFav = JSON.parse(localStorage.getItem("gifs"));

  if (allGifsFav !== null) {
    var alreadyFav = false;
    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = allGifsFav[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var gifs = _step.value;

        if (gifs.id === favId) {
          alreadyFav = true;
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator.return) {
          _iterator.return();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
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
  var gif = gifResults.find(function (gif) {
    return gif.id === favId;
  });
  favoritedGifs.push(gif);
  favImg.classList.add("favorited");
  saveFavorite(favoritedGifs);
}

function deleteFavorite(favId, favImg, allGifsFav) {
  if (window.location.pathname === "/favorited") {
    var rmvGif = document.getElementById(favId);
    gifDisplay.removeChild(rmvGif);
  }
  var gif = allGifsFav.find(function (gif) {
    return gif.id === favId;
  });
  var gifIndex = allGifsFav.indexOf(gif);
  favoritedGifs = allGifsFav.slice(gifIndex, 1);
  favImg.classList.remove("favorited");
}

function saveFavorite(favoritedGifs) {
  localStorage.setItem("gifs", JSON.stringify(favoritedGifs));
}

favoritedBtn.addEventListener("click", function (e) {
  history.pushState(null, "", "/favorited");
  while (gifDisplay.firstChild) {
    gifDisplay.removeChild(gifDisplay.firstChild);
  }
  var allGifsFav = JSON.parse(localStorage.getItem("gifs"));
  var fragment = document.createDocumentFragment();
  allGifsFav.forEach(function (gifInfos) {
    fragment.appendChild(_views2.default.renderedGif(gifInfos));
  });
  gifDisplay.appendChild(fragment);
});
},{"./controllers":6,"./models":7,"./views":8}],19:[function(require,module,exports) {

var global = (1, eval)('this');
var OldModule = module.bundle.Module;
function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    accept: function (fn) {
      this._acceptCallback = fn || function () {};
    },
    dispose: function (fn) {
      this._disposeCallback = fn;
    }
  };
}

module.bundle.Module = Module;

var parent = module.bundle.parent;
if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = '' || location.hostname;
  var protocol = window.location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '49589' + '/');
  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      data.assets.forEach(function (asset) {
        hmrApply(global.require, asset);
      });

      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.require, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();
      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + 'data.error.stack');
    }
  };
}

function getParents(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];
      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(+k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;
  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  if (cached && cached.hot._disposeCallback) {
    cached.hot._disposeCallback();
  }

  delete bundle.cache[id];
  bundle(id);

  cached = bundle.cache[id];
  if (cached && cached.hot && cached.hot._acceptCallback) {
    cached.hot._acceptCallback();
    return true;
  }

  return getParents(global.require, id).some(function (id) {
    return hmrAccept(global.require, id);
  });
}
},{}]},{},[19,3])
//# sourceMappingURL=/dist/giphyapp.map