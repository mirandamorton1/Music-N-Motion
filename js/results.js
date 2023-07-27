//get item
// document.getElementById("workout-name").innerHTML += localStorage.getItem("name");
// document.getElementById("how-to").innerHTML += localStorage.getItem("instructions");

(async () => {
    const iframe = document.querySelector("iframe")


    const token = 'BQCf6dgdwr28_UjlC7TFNM7qgQfygmBAZ0tpaRBeUSaAv4iPeLOorirZ4tS80sBFEI0UM8beYtZFPtOWRMp8AyOlf-ai3qz6C52TFgI75sMLC0FtmKinh5rwFX-x2_Dbdq5SLH4D_4eJegwPeEYWfwcJ0lJcBYkQmgz7feGW0f6lQ3L2XrJaMu_uWtpYQn5h4YkxM32MazpH1HS4szKB1Dq7nC8tctNacaBW1frgbkbbQqJURNYAzsSbqS9N74BWTO9iMn-iZyy6sH5gOwY3oI4T';
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
    console.log(playlist)
    await fetchWebApi(
        `v1/playlists/${playlist.id}/tracks?uris=${tracksUri.join(',')}`,
        'POST'
    );

    return playlist;
    }

    const genre = "heavy-metal";
    const tracksUri = await getTracksByGenre(genre);
    const createdPlaylist = await createPlaylist(tracksUri);
    console.log(createdPlaylist.name, createdPlaylist.id);
    iframe.src = `https://open.spotify.com/embed/playlist/${createdPlaylist.id}?utm_source=generator&theme=0`;
})()