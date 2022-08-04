// const { get } = require("http");

const body = document.querySelector("#body");
const login = document.querySelector("#login");
const form = document.querySelector("#form");
const search = document.querySelector("#search");
const input = document.querySelector("#input");

var accessToken;
var refreshToken;
var expiresIn;

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
      console.log(response);
      artistId = response.data.artists.items[0].id;
    })
    .catch((err) => {
      console.log(err.message);
    });
};
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
};

search.addEventListener("click", (evt) => {
  evt.preventDefault();
  if (input.value) {
    const artist = input.value;
    artist.replace(" ", "");
    searchArtist(artist);
  }
});
search.addEventListener("enter", (evt) => {
  evt.preventDefault();
  if (input.value) {
    const artist = input.value;
    artist.replace(" ", "");
    searchArtist(artist);
  }
});

body.onLoad = checkCode();
