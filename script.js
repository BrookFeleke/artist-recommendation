const body = document.querySelector("#body");
const login = document.querySelector("#login");
const form = document.querySelector("#form");
const checkCode = () => {
  // form.style.display = 'block'
  console.log("loaded");
  const url_string = window.location.href;
  const url = new URL(url_string);
  const code = url.searchParams.get("code");
  console.log(code);
//   fetch("http://localhost:3000/login", {
//     method: "POST",
//     mode: 'cors', 
//     body: code,
//     headers: {
//         'Content-Type': 'application/json'
//       },
//   })
//     .then((res) => {
//       console.log(res);
//     })
//     .catch((err) => {
//       console.log(err.message);
//     });


};

body.onLoad = checkCode();
