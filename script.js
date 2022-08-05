
// DOM elements
const body = document.querySelector("#body");
const login = document.querySelector("#login");
const form = document.querySelector("#form");
const search = document.querySelector("#search");
const input = document.querySelector("#input");
const artistsContainer = document.querySelector("#artists-container");
const errorContainer = document.querySelector("#error-container");
const errorMessage = document.querySelector("#error-message");

// Global Variables
var accessToken;
var refreshToken;
var expiresIn;
var relatedArtists = [];

// Displays message when there are no artists available
const displayMessage = (msg) => {
  const message = ` <div id="error-container" class="container w-full h-full mx-auto p-36 bg-gray-700 rounded-lg flex align-center justify-center items-center" >
  <p class="text-gray-300 md:whitespace-nowrap font-semibold" id="error-message">${msg}</p>
  </div>`;

  if (relatedArtists.length <= 0) {
    artistsContainer.innerHTML = "";
    artistsContainer.innerHTML += message;
    // errorContainer.style.display = "flex";
  }
};

// Displays artists after they have been fetched
const insertRelatedArtists = (artists) => {
  artistsContainer.innerHTML = "";
  artists.forEach((artist) => {
    const content = `<div class="m-2 flex min-w-max flex-col space-y-2 bg-gray-600 bg-clip-padding backdrop-filter backdrop-blur-md bg-opacity-20 p-4 rounded-md hover:bg-gray-500 hover:bg-clip-padding hover:backdrop-filter hover:backdrop-blur-md hover:bg-opacity-20" >
    <img src= ${artist.image} class="h-48 w-48 rounded-md"></img>
    <h2 class=" text-gray-300 font-bold">${artist.name}</h2>
    <p class="text-gray-500">${artist.followers}</p>
  </div>`;
    artistsContainer.innerHTML += content;
  });
};

// searches for artists and populates @relatedArtists array
const searchArtist = (artist) => {
  var artistId;
  axios({
    method: "get", //you can set what request you want to be
    url: "https://api.spotify.com/v1/search?",
    headers: {
      Accept: " application/json",
      "Content-Type": "application/json",
      Authorization: "Bearer " + accessToken,
    },
    params: {
      q: artist,
      type: "artist",
    },
  })
    .then((response) => {
      if (response.data.artists.items.length <= 0) {
        relatedArtists = [];

        displayMessage("no artists found with that name");
        return;
      }
      artistId = response.data.artists.items[0].id;

      axios({
        method: "get", //you can set what request you want to be
        url:
          "https://api.spotify.com/v1/artists/" + artistId + "/related-artists",
        headers: {
          Accept: " application/json",
          "Content-Type": "application/json",
          Authorization: "Bearer " + accessToken,
        },
      })
        .then((response) => {
          var responseArray = response.data.artists;

          responseArray.forEach((artist, index) => {
            if (artist.images[1]) return;
            else responseArray.splice(index, 1);
          });

          relatedArtists = [];
          relatedArtists = responseArray.map((artist) => {
            if (artist.images[1].url) {
              const newArtist = {
                name: artist.name,
                image: artist.images[1].url,
                followers: artist.followers.total,
              };
              return newArtist;
            } else return;
          });

          insertRelatedArtists(relatedArtists);
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err.message);
    });
};

// run on load of webstie to get access Tokens
const checkCode = () => {
  // form.style.display = 'block'
  console.log("loaded");
  const url_string = window.location.href;
  const url = new URL(url_string);
  const code = url.searchParams.get("code");
  console.log(code);
  if (!code) {
    window.location.href =
      "https://accounts.spotify.com/authorize?client_id=1296a2ee006f4ca5bff6fe8a3cc31b1d&response_type=code&redirect_uri=http://localhost:5500/client/index.html";
  }

  axios
    .post("http://localhost:3000/login", {
      code,
    })
    .then((res) => {
      console.log(res.data);
      console.log(typeof res.data);
      accessToken = res.data.accessToken;
      refreshToken = res.data.refreshToken;
      expiresIn = res.data.expiresIn;
    })
    .catch((err) => {
      console.log(err.message);
      window.location.href =
        "https://accounts.spotify.com/authorize?client_id=1296a2ee006f4ca5bff6fe8a3cc31b1d&response_type=code&redirect_uri=http://localhost:5500/client/index.html";
    });
  window.history.pushState({}, null, "/");
};

// Event listeners
search.addEventListener("click", (event) => {
  event.preventDefault();
  if (input.value) {
    const artist = input.value;
    artist.replace(" ", "");
    searchArtist(artist);
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();
  if (input.value) {
    const artist = input.value;
    artist.replace(" ", "");
    searchArtist(artist);
  }
});


displayMessage("Discover new artitsts");
body.onLoad = checkCode();
