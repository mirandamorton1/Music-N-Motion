(async () => {
  const workoutName = document.getElementById("workout-name");
  const typeOfWorkout = localStorage.getItem("name");
  let workoutTypeToPage = " ";
  workoutTypeToPage += typeOfWorkout.replace(/_/g, " ");
  workoutName.innerText += workoutTypeToPage;
  const equipment = document.getElementById("equipment");
  const typeOfEquipment = localStorage.getItem("equipment");
  let equipmentToPage = " ";
  equipmentToPage += typeOfEquipment
    .replace(/_/g, " ")
    .replace(/\b\w/g, (match) => match.toLocaleUpperCase());
  equipment.innerText += equipmentToPage;

  const category = localStorage.getItem("category");
  const iframe = document.querySelector("iframe");

  const token = "BQD6NHojGY0MQ20ELcHGt-WkjnGmsSP6fittif3yWkCunRt4UJgK7GBDt0uDaSY3RqOncAPLBYRiUbC6bG--w2Zm2lqm958y1DvPC_Cw8DMLbblO7PuUsJGpXkmOWrPaOhx7qd5Igoy9NCuNb6-FqrV1V4_c5dIf36-lRkxEz3Ew_Woy4IvZplXvqkh-pCVEsdA5ufp0nK_l_emnGwMjHCPX4tZ2lnWeHtqqnggX6tC-zRnax3zCMzWGfGjjCUsmwMLYvCCEwQnsiwt1HsRJyvHG";
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

  const tracksUri = await getTracksByGenre(genre);
  const createdPlaylist = await createPlaylist(tracksUri);
  iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}?utm_source=generator&theme=0`;
})();
