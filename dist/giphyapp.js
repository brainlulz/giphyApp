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
})({3:[function(require,module,exports) {
var giphyUrl = "http://api.giphy.com/v1/gifs/search?q";
var apikey = "vw4usscjAkDQiPbUvnGdRJfpEUWqZsuY";

var urlParams = new URLSearchParams(window.location.search);
var urlParam = urlParams.get("q");

var formElement = document.querySelector("#form");
var gifDisplay = document.querySelector(".results");

//Loading
window.onload = function (e) {
  if (urlParam) {
    searching(urlParam, e);
  }
};

//search
formElement.addEventListener("submit", function (e) {
  var inputText = e.target[0].value;
  searching(inputText, e);
  if (urlParam != null) {
    urlParams.set("q", inputText);
    window.location.search = "?q=" + inputText;
  } else {
    window.location.href += "?q=" + inputText;
  }
});

searching = function searching(searchedText, e) {
  var url = giphyUrl + "=" + searchedText + "&api_key=" + apikey;
  fetch(url).then(function (response) {
    response.json().then(function (data) {
      if (data.data.length) {
        while (gifDisplay.firstChild) {
          gifDisplay.removeChild(gifDisplay.firstChild);
        }
        for (var i = 0; i < data.data.length; i++) {
          var imageDiv = document.createElement("div");
          var image = document.createElement("img");
          var imageModal = document.createElement("div");
          var favButton = document.createElement("p");
          var favText = document.createTextNode("fav");
          var linkButton = document.createElement("a");
          var linkText = document.createTextNode("Link");
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
        }
      } else {
        console.log("Aucun resultat");
      }
    });
  }).catch(function (error) {
    return console.log(error);
  });
  e.preventDefault();
};

//Add to favorite
gifDisplay.addEventListener("click", function (e) {
  var favId = e.target.getAttribute("id");
  var favUrl = document.getElementsByClassName(favId)[0].currentSrc;
  var favs = localStorage.getItem(favId);
  if (favId !== undefined) {
    if (favs !== null) {
      localStorage.removeItem(favId);
    } else {
      localStorage.setItem(favId, favUrl);
    }
  }
});
},{}],14:[function(require,module,exports) {

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
  var ws = new WebSocket(protocol + '://' + hostname + ':' + '49413' + '/');
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
},{}]},{},[14,3])
//# sourceMappingURL=/dist/giphyapp.map