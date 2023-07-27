document.getElementById("workout-name").innerText += localStorage.getItem("name");
document.getElementById("equipment").innerText += localStorage.getItem("equipment");

(async () => {
    const category = localStorage.getItem("category")
    console.log(category)
    console.log(localStorage,"local storage")

    const iframe = document.querySelector("iframe")


    const token = 'BQBrhjUpDFkva2sMSc_e1HaBdP7K_mMXkjaJbop5v6sdRQps0LpUxnhTUn8imW8tpEHynTly1TXf06fZtyWsjAoZnZFre5x4UUK0OzXyrycOfTadJAMWUTmY2ozv-g-LV0RHPZdZQ530VQMj8J6rHf5RVKObnwtY6PvCmZ56nhtq3WwoZJIylnxPxLqdZBRXy9Sp6Kb2T5l8mdQ9KPBM2Vy5TzVrnp1s2oQ8hX4emiNd5F5pp4VXkqRYFsrneIBtp5ifgN9yk89TZnLI1gEMJa0Y';
    async function fetchWebApi(endpoint, method, body) {
    const res = await fetch(`https://api.spotify.com/${endpoint}`, {
        headers: {
        Authorization: `Bearer ${token}`,
        },
        method,
        body:JSON.stringify(body)
    });

    return await res.json();
    }


    async function getTracksByGenre(genre) {
        const response = await fetchWebApi(`v1/search?q=genre:${encodeURIComponent(genre)}&type=track&limit=10`, 'GET');

        return response.tracks.items.map(item => item.uri);
        
      }


    async function createPlaylist(tracksUri){
    const { id: user_id } = await fetchWebApi('v1/me', 'GET')

    const playlist = await fetchWebApi(
        `v1/users/${user_id}/playlists`, 'POST', {
        "name": "Your recommendation workout playlist ",
        "description": "Playlist created by the tutorial on developer.spotify.com",
        "public": false
        
    })
    await fetchWebApi(
        `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
        'POST'
    );

    return playlist;
    }

    let genre = ""
    console.log(category)

    if(category == "olympic_weightlifting"){
        genre = "metalcore";
    } else if(category == "cardio"){
        genre = "power";
    } else if(category == "ploymetrics"){
        genre = "workout";
    } else if(category == "powerlifting"){
        genre = "heavy-metal";
    } else if(category == "strength"){
        genre = "punk-rock";
    } else if(category == "stretching"){
        genre = "dance";
    } else if(category == "strongman"){
        genre = "death-metal";
    }


    const tracksUri = await getTracksByGenre(genre);
    const createdPlaylist = await createPlaylist(tracksUri);
    iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}?utm_source=generator&theme=0`;
})()


// cardio -- power
// olympic weightlifting -- metalcore
// ploymetrics --  workout
// powerlifting -- heavy-metal
// strength -- punk-rock
// stretching -- dance
// strongman -- death-metal

