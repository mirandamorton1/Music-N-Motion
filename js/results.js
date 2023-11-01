// populating the your-workout-container
const instructions = localStorage.getItem("instructions");
const instructionDiv = document.querySelector(".workoutDiscr");
instructionDiv.innerText += instructions;
const workoutName = document.getElementById("workout-name");
const typeOfWorkout = localStorage.getItem("name");
const equipment = document.getElementById("equipment");
const typeOfEquipment = localStorage.getItem("equipment");

// changing the underscores to spaces and making sure the first letter of every word is capitalized
function noUnderScore(name, type) {
  let noUnderScoreString = " ";
  noUnderScoreString += type
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
  name.innerText += noUnderScoreString;
}
noUnderScore(workoutName, typeOfWorkout);
noUnderScore(equipment, typeOfEquipment);

// gettiing the category from the workoutSelect page to choose the genre for thew platlist late
const category = localStorage.getItem("category");
console.log(category);
const clientId = "057858eb5b834042854d8d57d5e03028";
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
const iframe = document.querySelector("iframe");

async function main() {
  if (!code) {
    redirectToAuthCodeFlow(clientId);
  } else {
    const accessToken = await getAccessToken(clientId, code);
    populateIframe(accessToken, category);
  }

  async function redirectToAuthCodeFlow(clientId) {
    const verifier = generateCodeVerifier(128);

    const challenge = await generateCodeChallenge(verifier);

    localStorage.setItem("verifier", verifier);
    console.log("local storage", localStorage);
    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append(
      "redirect_uri",
      "https://musicinmotion.netlify.app/results.html"
    );
    params.append(
      "scope",
      "user-read-private user-read-email playlist-modify-private"
    );
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    console.log("params", params.toString());

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  }

  function generateCodeVerifier(length) {
    let text = "";
    let possible =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  }

  async function generateCodeChallenge(codeVerifier) {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest("SHA-256", data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  }

  async function getAccessToken(clientId, code) {
    const verifier = localStorage.getItem("verifier");

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("grant_type", "authorization_code");
    params.append("code", code);
    params.append(
      "redirect_uri",
      "https://musicinmotion.netlify.app/results.html"
    );
    params.append("code_verifier", verifier);

    const result = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params,
    });

    const { access_token } = await result.json();
    return access_token;
  }

  async function fetchWebApi(endpoint, token, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body),
    });

    return await res.json();
  }

  async function getTracksByGenre(genre, token) {
    const response = await fetchWebApi(
      `v1/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=10`,
      token,
      "GET"
    );
    return response.tracks.items.map((item) => item.uri);
  }

  async function createPlaylist(tracksUri, token) {
    const { id: user_id } = await fetchWebApi("v1/me", token, "GET");

    const playlist = await fetchWebApi(
      `v1/users/${user_id}/playlists`,
      token,
      "POST",
      {
        name: "Your recommendation workout playlist ",
        description:
          "Playlist created by the tutorial on developer.spotify.com",
        public: false,
      }
    );
    console.log(playlist);

    await fetchWebApi(
      `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
      token,
      "POST"
    );

    return playlist;
  }

  // setting genre and actually making the playlist
  async function populateIframe(token, category) {
    let genre = "";

    if (category == "olympic_weightlifting") {
      genre = "metalcore";
    } else if (category == "cardio") {
      genre = "power";
    } else if (category == "ploymetrics") {
      genre = "workout";
    } else if (category == "powerlifting") {
      genre = "heavy-metal";
    } else if (category == "strength") {
      genre = "punk-rock";
    } else if (category == "stretching") {
      genre = "dance";
    } else if (category == "strongman") {
      genre = "death-metal";
    } else {
      genre = "power-pop";
    }

    // actually shows the playlist on screen

    const tracksUri = await getTracksByGenre(genre, token);

    const createdPlaylist = await createPlaylist(tracksUri, token);

    iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}?utm_source=generator&theme=0`;
  }
}
main();

// JS for making the timer function
class StopWatch {
  constructor() {
    this.startTime = 0;
    this.elapsedTime = 0;
    this.intervalId = null;
    this.mins = 0;
    this.secs = 0;

    this.paused = true;
  }

  start() {
    if (this.paused) {
      this.paused = false;
      this.startTime = Date.now() - this.elapsedTime;
      this.intervalId = setInterval(() => this.updateTime(), 75);
    }
  }

  pause() {
    if (!this.paused) {
      this.paused = true;
      this.elapsedTime = Date.now() - this.startTime;
      clearInterval(this.intervalId);
    }
  }

  reset() {
    clearInterval(this.intervalId);
    this.paused = true;
    this.elapsedTime = 0;
    this.startTime = 0;
    this.mins = 0;
    this.secs = 0;
    this.updateDisplay();
  }

  updateTime() {
    this.elapsedTime = Date.now() - this.startTime;
    this.secs = Math.floor((this.elapsedTime / 1000) % 60);
    this.mins = Math.floor((this.elapsedTime / (1000 * 60)) % 60);
    this.updateDisplay();
  }

  updateDisplay() {
    this.elapsedTime = (this.elapsedTime % 1000)
      .toString()
      .padStart(3, "0")
      .slice(0, 2);
    this.secs = this.pad(this.secs);
    this.mins = this.pad(this.mins);
    const timeDisplay = document.querySelector(".time-display");
    timeDisplay.innerHTML = `${this.mins}:${this.secs}.${this.elapsedTime}`;
  }

  pad(unit) {
    return unit.toString().padStart(2, "0");
  }
}

const stopWatch = new StopWatch();
const startBtn = document.querySelector("#startBtn");
const pauseBtn = document.querySelector("#pauseBtn");
const resetBtn = document.querySelector("#resetBtn");

startBtn.addEventListener("click", () => stopWatch.start());
pauseBtn.addEventListener("click", () => stopWatch.pause());
resetBtn.addEventListener("click", () => stopWatch.reset());
