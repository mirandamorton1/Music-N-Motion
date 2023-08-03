 // populating the your-workout-container  
  const instructions = localStorage.getItem("instructions");
  const instructionDiv = document.querySelector(".workoutDiscr");
  instructionDiv.innerText += instructions;
  const workoutName = document.getElementById("workout-name");
  const typeOfWorkout = localStorage.getItem("name");
  const equipment = document.getElementById("equipment");
  const typeOfEquipment = localStorage.getItem("equipment");

  // changing the underscores to spaces and making sure the first letter of every word is capitalized
  function noUnderScore(name, type){
    let noUnderScoreString = " ";
    noUnderScoreString += type.replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toLocaleUpperCase())
    name.innerText += noUnderScoreString;
  }
noUnderScore(workoutName, typeOfWorkout)
noUnderScore(equipment, typeOfEquipment)

  // gettiing the category from the workoutSelect page to choose the genre for thew platlist late
  const category = localStorage.getItem("category");

  const iframe = document.querySelector("iframe");

  // token to allow fetching from the spotify api
  const token =
    "BQB4Ht1W36bkD3WkSVk3WNycPS9_LHHAOcWrvxFp7Bufoy4SMqsJQnedlHwO0l7g7hYixUjGaoOBFKRYYpDOb_jTnPRa5dUw67Osjps0kheLhhBkwg7nxk_TcFpzUaWzj-DBYfqQoQNg-BhipZNDwMO1rXgr-HRW53qvBjpvcso2p5lEr-EhYTz58rh8PYA5qmq4IqINonqbQ5jbPp_ft0rc6OrqE6ioyb0F-jiKW5opiMi68p1y8hbIR1jkR_123ASlel5NlS45yN3rsE9gxkDv";
  
    async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      method,
      body: JSON.stringify(body),
    });

    return await res.json();
  }

  // picks songs for the playlist depending on category
  async function getTracksByGenre(genre) {
    const response = await fetchWebApi(
      `v1/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=10`,
      "GET"
    );

    return response.tracks.items.map((item) => item.uri);
  }

  async function createPlaylist(tracksUri) {
    const { id: user_id } = await fetchWebApi("v1/me", "GET");

    const playlist = await fetchWebApi(
      `v1/users/${user_id}/playlists`,
      "POST",
      {
        name: "Your recommendation workout playlist ",
        description:
          "Playlist created by the tutorial on developer.spotify.com",
        public: false,
      }
    );
    await fetchWebApi(
      `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(",")}`,
      "POST"
    );

    return playlist;
  }

  // setting genre and actually making the playlist
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
  async function populateIframe() {
    const tracksUri = await getTracksByGenre(genre);
    const createdPlaylist = await createPlaylist(tracksUri);
    iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}?utm_source=generator&theme=0`;

  }
  populateIframe()

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
